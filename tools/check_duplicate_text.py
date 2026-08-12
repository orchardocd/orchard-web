"""Report copy the new site renders more often on a page than the old site did.

Saying the same sentence twice is a redesign defect: the reader meets the words again and
neither instance earns its place. Some repetition is inherited, though, because the old
pages listed a point and then expanded on it, so the count on the old page is the budget.
Anything above it was introduced by the rebuild and has to go.

Usage: python3 tools/check_duplicate_text.py [--base http://localhost:3000] [--only /about]
"""

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

from check_parity import build_routes, fetch, old_html, read_text, text_leaves, text_units

# Cards in a listing carry the same kind of line by design: two studies opening on the same
# date, or two posts the old site published twice under one title.
CARDS = ('li', 'article')

HEADINGS = ('h1', 'h2', 'h3', 'h4', 'h5', 'h6')
LINKS = ('a', 'button')

# Repeats the rebuild makes on purpose, each because the old page titled a section whose
# content it rendered from a widget that the mirror never captured.
ACCEPTED = {
    # The old page titled the volunteer roster, then closed with an NIHR note under that
    # same title. The roster the rebuild renders needs the title too.
    ('/about-orchard', 'our volunteers'),
}


def inside(element, names: tuple[str, ...]) -> bool:
    node = element
    while node is not None:
        if node.name in names:
            return True
        node = node.parent
    return False


def card_of(element) -> int | None:
    node = element
    while node is not None:
        if node.name in CARDS:
            return id(node)
        node = node.parent
    return None


def added_repeats(before: Counter, route: str, new: str) -> list[tuple[str, int, int]]:
    after: dict[str, list] = defaultdict(list)
    for element, unit in text_leaves(new, 'main'):
        after[unit].append(element)

    grown = []
    for unit, elements in after.items():
        if len(elements) < 2 or len(elements) <= before.get(unit, 0):
            continue
        if (route, unit) in ACCEPTED:
            continue
        # A button carrying the words of a heading on the same page is a way to reach it.
        if any(inside(element, HEADINGS) for element in elements):
            elements = [
                element
                for element in elements
                if inside(element, HEADINGS) or not inside(element, LINKS)
            ]
            if len(elements) < 2:
                continue
        cards = [card_of(element) for element in elements]
        # One line per card is a listing, not a page saying the same thing twice.
        if all(card is not None for card in cards) and len(set(cards)) == len(cards):
            continue
        grown.append((unit, before.get(unit, 0), len(elements)))
    return sorted(grown, key=lambda entry: (-entry[2], entry[0]))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://localhost:3000')
    parser.add_argument('--only', action='append', help='Check just these routes')
    parser.add_argument('--quiet', action='store_true', help='Only print routes that repeat copy')
    parser.add_argument(
        '--expectations',
        type=Path,
        help='Take the old counts from a parity expectations file instead of the mirror',
    )
    args = parser.parse_args()

    if args.expectations:
        stored = json.loads(read_text(args.expectations))['routes']
        # The old banner sat outside the article, so the whole page is the fair baseline.
        routes = [{'route': e['route'], 'before': Counter(e['textAll'])} for e in stored]
    else:
        routes = [
            {'route': r['route'], 'before': Counter(text_units(old_html(r), None))}
            for r in build_routes()
        ]
    if args.only:
        wanted = set(args.only)
        routes = [route for route in routes if route['route'] in wanted]

    total = 0
    for route in routes:
        grown = added_repeats(
            route['before'], route['route'], fetch(args.base + route['route'])
        )
        if not grown:
            if not args.quiet:
                print(f"{route['route']}  ok")
            continue
        total += len(grown)
        print(f"{route['route']}")
        for unit, before, after in grown:
            shown = unit if len(unit) <= 84 else unit[:81] + '...'
            print(f'   {before} -> {after}  {shown}')

    summary = f'{len(routes)} routes checked | {total} passage(s) repeated more than before'
    print(f'\n{summary}', file=sys.stderr if total else sys.stdout)
    return 1 if total else 0


if __name__ == '__main__':
    raise SystemExit(main())
