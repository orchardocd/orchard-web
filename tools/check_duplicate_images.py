"""Report any page that shows the same illustration twice.

The rule matches the text check: read every picture a page draws, and no two of them may be
the same picture. Sameness is judged on what a reader sees, not on the file name, because the
old site uploaded the same artwork under several names, and kept two cuts of most drawings,
one plain and one with the brand dashes scattered around it. Identical files are caught by
their contents; two cuts of one drawing are caught by their shape, through tools/fingerprint.mjs.

Usage: python3 tools/check_duplicate_images.py [--base http://localhost:3000] [--only /about]
"""

import argparse
import hashlib
import json
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path

from bs4 import BeautifulSoup

from check_parity import fetch, site_routes, strip_chrome

# A stand-in drawn wherever a picture is missing is meant to appear as often as it is needed.
# Everything else inside the page, supporter wordmarks and spot drawings included, is artwork.
PLACEHOLDER = re.compile(r'no-image|placeholder|blank|spacer|shape-image', re.I)

# Below this two pictures are different drawings; at or above it they are two cuts of one.
ALIKE = 0.87

FINGERPRINT = Path(__file__).resolve().parent / 'fingerprint.mjs'


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


_bytes: dict[str, bytes] = {}
_shapes: dict[str, list[float]] = {}


def content(base: str, src: str) -> bytes:
    if src not in _bytes:
        url = src if src.startswith('http') else base + src
        request = urllib.request.Request(url, headers={'User-Agent': 'orchard-image-check'})
        with urllib.request.urlopen(request, timeout=90) as response:
            _bytes[src] = response.read()
    return _bytes[src]


def read_shapes(sources: list[str]) -> None:
    """Ask the fingerprint helper what each drawing looks like, in one pass."""
    with tempfile.TemporaryDirectory() as folder:
        named = {}
        for index, src in enumerate(sources):
            suffix = Path(urllib.parse.unquote(src).split('?')[0]).suffix or '.png'
            stored = f'{index:04d}{suffix}'
            named[stored] = src
            Path(folder, stored).write_bytes(_bytes[src])
        printed = subprocess.run(
            ['node', str(FINGERPRINT), folder],
            capture_output=True,
            text=True,
            check=True,
        )
    for stored, mark in json.loads(printed.stdout).items():
        if mark:
            _shapes[named[stored]] = mark


def likeness(left: list[float], right: list[float]) -> float:
    return sum(x * y for x, y in zip(left, right)) / len(left)


def drawn(html: str) -> list[str]:
    soup = BeautifulSoup(html, 'html.parser')
    strip_chrome(soup)
    scope = soup.select_one('main') or soup.body or soup
    found = []
    for element in scope.find_all('img'):
        src = source(element)
        if src:
            found.append(src)
    return found


def repeats(base: str, sources: list[str]) -> list[list[str]]:
    """Groups of pictures on one page that a reader would see as the same illustration."""
    groups: list[list[str]] = []
    for src in sources:
        for group in groups:
            first = group[0]
            same_file = content(base, src) == content(base, first)
            alike = (
                src in _shapes
                and first in _shapes
                and likeness(_shapes[src], _shapes[first]) >= ALIKE
            )
            if same_file or alike:
                group.append(src)
                break
        else:
            groups.append([src])
    return sorted((group for group in groups if len(group) > 1), key=len, reverse=True)


def name(src: str) -> str:
    return urllib.parse.unquote(src).rsplit('/', 1)[-1].split('?')[0]


def self_test() -> int:
    """The rules this check rests on, asserted without a server."""
    one, copy, two = '/one.svg', '/copy.svg', '/two.png'
    stand_in = '/api/media/file/no-image.png'
    _bytes.update({one: b'A', copy: b'A', two: b'B', stand_in: b'C'})
    # A drawing and its confetti cut: alike in shape, different as files.
    plain, dashes, other = '/plain.svg', '/dashes.svg', '/other.svg'
    _bytes.update({plain: b'D', dashes: b'E', other: b'F'})
    _shapes.update({
        plain: [1.0, 1.0, -1.0, -1.0],
        dashes: [1.0, 0.8, -1.0, -1.0],
        other: [-1.0, 1.0, 1.0, -1.0],
    })
    cases = [
        ('an svg drawn twice is caught', [one, one], 1),
        ('the same picture under two names is caught', [one, copy], 1),
        ('two different pictures are fine', [one, two], 0),
        ('a plain drawing and its confetti cut are one illustration', [plain, dashes], 1),
        ('two different drawings stay apart', [plain, other], 0),
    ]
    failures = [name for name, sources, want in cases if len(repeats('', sources)) != want]
    markup = [
        ('a stand-in is not read as artwork', '<main><img src="/api/media/file/no-image.png">'
         '<img src="/api/media/file/no-image.png"></main>', 0),
        ('chrome outside the page is not artwork', '<body><header>'
         '<img src="/one.svg"><img src="/one.svg"></header>'
         '<main><img src="/two.png"></main></body>', 1),
        ('a resized copy points at the same file', '<main>'
         '<img src="/_next/image?url=%2Fone.svg&w=640&q=75"></main>', 1),
    ]
    failures += [name for name, html, want in markup if len(drawn(html)) != want]
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

    pages = {route: drawn(fetch(args.base + route)) for route in routes}
    for sources in pages.values():
        for src in sources:
            content(args.base, src)
    read_shapes(sorted(_bytes))

    total = 0
    for route, sources in pages.items():
        found = repeats(args.base, sources)
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
