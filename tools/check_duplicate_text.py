"""Report any page that renders the same words twice.

The rule is flat: read the text of every element on the page, and no two elements may carry
the same text. A wrapper repeating its only child is nesting rather than repetition, so an
element that contains another element of the same text is not counted against it.

Usage: python3 tools/check_duplicate_text.py [--base http://localhost:3000] [--only /about]
       add --headings to check only elements with a heading role.
"""

import argparse
import sys
from collections import defaultdict

from bs4 import BeautifulSoup

from check_parity import HEADINGS, fetch, heading_text, normalize, site_routes, strip_chrome

SKIP = ('script', 'style', 'noscript', 'br', 'img', 'svg', 'iframe', 'main', 'body', 'html')


def contains(outer, inner) -> bool:
    node = inner.parent
    while node is not None:
        if node is outer:
            return True
        node = node.parent
    return False


def repeats(html: str, headings_only: bool) -> list[tuple[str, int]]:
    soup = BeautifulSoup(html, 'html.parser')
    strip_chrome(soup)
    scope = soup.select_one('main') or soup.body or soup

    seen: dict[str, list] = defaultdict(list)
    for element in scope.find_all(True):
        if element.name in SKIP:
            continue
        if headings_only and not heading_text(element):
            continue
        written = normalize(element.get_text(' ', strip=True))
        if written:
            seen[written].append(element)

    found = []
    for written, elements in seen.items():
        if len(elements) < 2:
            continue
        # A wrapper around one copy of the words says them once, not twice.
        innermost = [
            element
            for element in elements
            if not any(other is not element and contains(element, other) for other in elements)
        ]
        if len(innermost) > 1:
            found.append((written, len(innermost)))
    return sorted(found, key=lambda entry: (-entry[1], entry[0]))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://localhost:3000')
    parser.add_argument('--only', action='append', help='Check just these routes')
    parser.add_argument('--quiet', action='store_true', help='Only print routes that repeat text')
    parser.add_argument(
        '--headings',
        action='store_true',
        help=f'Check only headings ({", ".join(HEADINGS)} and role="heading")',
    )
    args = parser.parse_args()

    routes = site_routes()
    if args.only:
        wanted = set(args.only)
        routes = [route for route in routes if route in wanted]

    total = 0
    for route in routes:
        found = repeats(fetch(args.base + route), args.headings)
        if not found:
            if not args.quiet:
                print(f'{route}  ok')
            continue
        total += len(found)
        print(route)
        for written, count in found:
            shown = written if len(written) <= 84 else written[:81] + '...'
            print(f'   x{count}  {shown}')

    summary = f'{len(routes)} routes checked | {total} passage(s) rendered more than once'
    print(f'\n{summary}', file=sys.stderr if total else sys.stdout)
    return 1 if total else 0


if __name__ == '__main__':
    raise SystemExit(main())
