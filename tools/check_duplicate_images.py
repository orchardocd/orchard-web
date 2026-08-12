"""Report any page that shows the same illustration twice.

The rule matches the text check: read every picture a page draws, and no two of them may be
the same picture. Sameness is judged on the file a reader is served, not on its name, because
the old site uploaded the same artwork several times under different names and the rebuild
carries every one of those uploads.

Usage: python3 tools/check_duplicate_images.py [--base http://localhost:3000] [--only /about]
"""

import argparse
import hashlib
import sys
import urllib.parse
import urllib.request
from collections import defaultdict

from bs4 import BeautifulSoup

from check_parity import IGNORED_IMAGE, fetch, site_routes, strip_chrome


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
    return src if not IGNORED_IMAGE.search(urllib.parse.unquote(src)) else None


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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://localhost:3000')
    parser.add_argument('--only', action='append', help='Check just these routes')
    parser.add_argument('--quiet', action='store_true', help='Only print routes that repeat art')
    args = parser.parse_args()

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
