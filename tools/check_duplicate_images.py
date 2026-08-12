"""Report any page that shows the same illustration twice.

The rule matches the text check: read every picture a page draws, and no two of them may be
the same picture. Sameness is judged on the file a reader is served, not on its name, because
the old site uploaded the same artwork several times under different names and the rebuild
carries every one of those uploads.

Usage: python3 tools/check_duplicate_images.py [--base http://localhost:3000] [--only /about]
"""

import argparse
import hashlib
import re
import sys
import urllib.parse
import urllib.request
from collections import defaultdict

from bs4 import BeautifulSoup

from check_parity import fetch, site_routes, strip_chrome

# A stand-in drawn wherever a picture is missing is meant to appear as often as it is needed.
# Everything else inside the page, supporter wordmarks and spot drawings included, is artwork.
PLACEHOLDER = re.compile(r'no-image|placeholder|blank|spacer|shape-image', re.I)


def source(element) -> str | None:
    """The file behind an <img>, seen through Next's resizing endpoint."""
    src = element.get('src') or ''
    if not src:
        return None
    if '/_next/image' in src:
        wrapped = urllib.parse.parse_qs(urllib.parse.urlparse(src).query).get('url')
        if not wrapped:
            return None
        src = wrapped[0]
    return src if not PLACEHOLDER.search(urllib.parse.unquote(src)) else None


_marks: dict[str, str] = {}


def mark(base: str, src: str) -> str:
    if src not in _marks:
        url = src if src.startswith('http') else base + src
        request = urllib.request.Request(url, headers={'User-Agent': 'orchard-image-check'})
        with urllib.request.urlopen(request, timeout=90) as response:
            _marks[src] = hashlib.sha256(response.read()).hexdigest()
    return _marks[src]


def repeats(base: str, html: str) -> list[list[str]]:
    soup = BeautifulSoup(html, 'html.parser')
    strip_chrome(soup)
    scope = soup.select_one('main') or soup.body or soup

    drawn: dict[str, list[str]] = defaultdict(list)
    for element in scope.find_all('img'):
        src = source(element)
        if src:
            drawn[mark(base, src)].append(src)

    return sorted((shown for shown in drawn.values() if len(shown) > 1), key=len, reverse=True)


def name(src: str) -> str:
    return urllib.parse.unquote(src).rsplit('/', 1)[-1].split('?')[0]


def self_test() -> int:
    """The rules this check rests on, asserted without a server."""
    _marks.update({
        '/api/media/file/one.svg': 'a',
        '/api/media/file/copy.svg': 'a',
        '/api/media/file/two.png': 'b',
        '/api/media/file/no-image.png': 'c',
    })
    cases = [
        ('an svg drawn twice is caught', '<main><img src="/api/media/file/one.svg">'
         '<img src="/api/media/file/one.svg"></main>', 1),
        ('the same picture under two names is caught', '<main><img src="/api/media/file/one.svg">'
         '<img src="/api/media/file/copy.svg"></main>', 1),
        ('a resized copy is the same picture', '<main><img src="/api/media/file/one.svg">'
         '<img src="/_next/image?url=%2Fapi%2Fmedia%2Ffile%2Fcopy.svg&w=640&q=75"></main>', 1),
        ('two different pictures are fine', '<main><img src="/api/media/file/one.svg">'
         '<img src="/api/media/file/two.png"></main>', 0),
        ('a stand-in may be drawn as often as needed',
         '<main><img src="/api/media/file/no-image.png">'
         '<img src="/api/media/file/no-image.png"></main>', 0),
        ('chrome outside the page is not artwork', '<body><header>'
         '<img src="/api/media/file/one.svg"><img src="/api/media/file/one.svg">'
         '</header><main><img src="/api/media/file/two.png"></main></body>', 0),
    ]
    failures = [name for name, html, want in cases if len(repeats('', html)) != want]
    for failure in failures:
        print(f'self test failed: {failure}')
    print('self test: ' + ('failed' if failures else 'passed'))
    return 1 if failures else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://localhost:3000')
    parser.add_argument('--only', action='append', help='Check just these routes')
    parser.add_argument('--quiet', action='store_true', help='Only print routes that repeat art')
    parser.add_argument('--self-test', action='store_true', help='Check the rules, without a server')
    args = parser.parse_args()

    if args.self_test:
        return self_test()

    routes = site_routes()
    if args.only:
        wanted = set(args.only)
        routes = [route for route in routes if route in wanted]

    total = 0
    for route in routes:
        found = repeats(args.base, fetch(args.base + route))
        if not found:
            if not args.quiet:
                print(f'{route}  ok')
            continue
        total += len(found)
        print(route)
        for shown in found:
            print(f'   x{len(shown)}  {", ".join(sorted({name(src) for src in shown}))}')

    summary = f'{len(routes)} routes checked | {total} illustration(s) drawn more than once'
    print(f'\n{summary}', file=sys.stderr if total else sys.stdout)
    return 1 if total else 0


if __name__ == '__main__':
    raise SystemExit(main())
