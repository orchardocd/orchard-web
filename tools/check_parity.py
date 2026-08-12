"""Enforce that every old orchardocd.org page's content survives into the new site.

For each mapped route it compares the mirrored WordPress page against the rendered
page served by the new site: body text must be present, and the illustrations the
old page used must still appear.

Usage: python3 tools/check_parity.py [--base http://localhost:3000] [--json report.json]
"""

import argparse
import json
import re
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup, Comment, Doctype

ROOT = Path(__file__).resolve().parent.parent
MIRROR = ROOT / 'mirror'
SITE = MIRROR / 'www.orchardocd.org'
API = MIRROR / 'api'
CONTENT = ROOT / 'web' / 'src' / 'seed' / 'content.json'

CHROME_SELECTORS = [
    'script', 'style', 'noscript', 'header', 'footer', 'nav', 'form',
    '#respond', '#comments', '.comments-area', '.comment-respond', '.comment-form',
    '#share', '.socialshare-and-readmore', '.share-buttons',
    '.pagination', '.nav-links', '.wp-pagenavi', '.page-numbers',
    '.screen-reader-text', '.elementor-screen-only', '.cookie-notice',
    '.menu', '.navbar', '.sub-menu', '.breadcrumb', '.elementor-location-header',
    '.elementor-location-footer', '#cookie-law-info-bar', '.cli-modal',
    '.home-recent-blogs', '.ocd-blogg', '.all-blogs', '.recent-blog-section',
    '.ocd-research-listing', '.participate-research-listing',
]

# Text the old site rendered as chrome, boilerplate, or dead UI. Not content.
IGNORED_TEXT = re.compile(
    r'leave a reply|cancel reply|your email address will not be published|'
    r'save my name, email|required fields are marked|share on|read more|'
    r'page \d+ of \d+|posted on|window\.|function\s*\(|jquery|mc4wp|'
    r'this site uses akismet|skip to content|search for:|'
    r'we use cookies|cookie settings|accept all|privacy overview|'
    r'^tags?\b|^categor(y|ies)\b',
    re.I,
)

# Images that are chrome rather than page illustrations.
IGNORED_IMAGE = re.compile(
    r'logo|favicon|icon|emoji|placeholder|no-image|shape-image|'
    r'loader|spinner|avatar|blank|spacer|arrow',
    re.I,
)

MIN_UNIT_CHARS = 45

# Copy that exists only on the new site. Every entry is UI wording with no
# equivalent on the old site; anything not listed here must come from the old site.
ALLOWED_NEW_TEXT = [
    'skip to main content',
    'advancing global ocd research',
    'find filter fund',
    'registered charity number',
    'follow us on social media',
    'all studies',
    'all webinars',
    'view all posts',
    'studies you can take part in',
    'join our mailing list',
    'learn about orchard ocd',
    'overview',
    'our latest webinar',
    'find filter fund',
]

QUOTES = {
    0x2018: "'", 0x2019: "'", 0x201a: "'", 0x201b: "'",
    0x201c: '"', 0x201d: '"', 0x201e: '"', 0x201f: '"',
    0x2013: '-', 0x2014: '-', 0x2012: '-', 0x2212: '-',
    0x00a0: ' ', 0x2026: '...', 0x2022: ' ', 0x00ad: '',
}


def normalize(text: str) -> str:
    text = unicodedata.normalize('NFKC', text).translate(QUOTES)
    text = re.sub(r'[^\w\s]', ' ', text.lower())
    text = re.sub(r'\s+', ' ', text).strip()
    # "1<sup>st</sup>" renders as "1st" but reads as "1 st" once tags are separated
    return re.sub(r'\b(\d+) (st|nd|rd|th)\b', r'\1\2', text)


def read_text(path: Path) -> str:
    return path.read_text(encoding='utf-8', errors='replace')


def load_api(name: str):
    items = {}
    for f in sorted(API.glob(f'{name}*.json')):
        try:
            data = json.loads(read_text(f))
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            for item in data:
                items[item['id']] = item
    return list(items.values())


def strip_chrome(soup: BeautifulSoup) -> BeautifulSoup:
    for node in soup.find_all(string=lambda s: isinstance(s, (Comment, Doctype))):
        node.extract()
    for selector in CHROME_SELECTORS:
        for match in soup.select(selector):
            match.decompose()
    return soup


def image_stem(src: str, side: str) -> str | None:
    """Old pages are keyed by upload path (basenames collide); new pages by media filename."""
    src = urllib.parse.unquote(src)
    if side == 'old':
        match = re.search(r'wp-content/uploads/([^"\')\s?]+)', src)
        if not match:
            return None
        path = re.sub(r'-\d+x\d+(?=\.\w+$)', '', match.group(1))
        if IGNORED_IMAGE.search(Path(path).name):
            return None
        return media_stem('uploads/' + path)
    match = re.search(r'/api/media/file/([^/"\')\s?&]+?)\.\w+(?:$|[?&])', src)
    if not match:
        return None
    stem = match.group(1)
    return stem.lower() if not IGNORED_IMAGE.search(stem) else None


def collect(html: str, scope_selector: str | None, side: str = 'old') -> tuple[str, set[str]]:
    soup = BeautifulSoup(html, 'html.parser')
    strip_chrome(soup)
    scope = soup.select_one(scope_selector) if scope_selector else None
    scope = scope or soup.body or soup

    images = set()
    for img in scope.find_all('img'):
        # mob-bnr is the old site's mobile copy of a banner it also renders for desktop
        if 'mob-bnr' in (img.get('class') or []):
            continue
        for attr in ('src', 'data-src', 'srcset', 'data-srcset'):
            value = img.get(attr)
            if not value:
                continue
            for candidate in re.split(r'[\s,]+', value):
                stem = image_stem(candidate, side)
                if not stem:
                    continue
                images.add(stem.lower())
                if side == 'new':
                    images.add(re.sub(r'-\d+x\d+$', '', stem).lower())
    for match in re.findall(r'url\((?:&quot;|["\'])?([^)"\'&]+)', str(scope)):
        stem = image_stem(match, side)
        if stem:
            images.add(stem.lower())

    return normalize(scope.get_text(' ', strip=True)), images


def text_units(html: str, scope_selector: str | None) -> list[str]:
    soup = BeautifulSoup(html, 'html.parser')
    strip_chrome(soup)
    scope = soup.select_one(scope_selector) if scope_selector else None
    scope = scope or soup.body or soup

    units = []
    for element in scope.find_all(['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'blockquote']):
        if element.find(['p', 'li', 'div']):
            continue
        raw = element.get_text(' ', strip=True)
        if IGNORED_TEXT.search(raw):
            continue
        for sentence in re.split(r'(?<=[.!?])\s+(?=[A-Z"“])', raw):
            normalized = normalize(sentence)
            if len(normalized) >= MIN_UNIT_CHARS:
                units.append(normalized)
    return units


_corpus: str | None = None


def old_site_corpus() -> str:
    """Every word the old site rendered anywhere, for detecting invented copy."""
    global _corpus
    if _corpus is not None:
        return _corpus
    parts = []
    for path in sorted(SITE.rglob('index.html')):
        text, _ = collect(read_text(path), None)
        parts.append(text)
    for name in ('posts', 'pages', 'p_in_research', 'speakers', 'research-slider'):
        for item in load_api(name):
            rendered = item.get('content', {}).get('rendered', '')
            if rendered:
                text, _ = collect(rendered, None)
                parts.append(text)
    _corpus = ' \n '.join(parts)
    return _corpus


def is_allowed_new(unit: str) -> bool:
    return any(allowed in unit for allowed in ALLOWED_NEW_TEXT)


def fetch(url: str, attempts: int = 4) -> str:
    last: Exception | None = None
    for attempt in range(attempts):
        request = urllib.request.Request(url, headers={'User-Agent': 'orchard-parity-check'})
        try:
            with urllib.request.urlopen(request, timeout=90) as response:
                body = response.read().decode('utf-8', 'replace')
            if '<main' in body:
                return body
            last = RuntimeError('response had no <main> element')
        except urllib.error.HTTPError as error:
            if error.code < 500:
                raise
            last = error
        except urllib.error.URLError as error:
            last = error
        time.sleep(1 + attempt * 2)
    raise last if last else RuntimeError('fetch failed')


def mirror_path(slug: str) -> Path:
    return SITE / 'index.html' if slug == 'home' else SITE / slug / 'index.html'


_media_map: dict[str, str] | None = None


def media_stem(upload_path: str) -> str | None:
    """Translate an old upload path to the media filename the seed uploads."""
    global _media_map
    if _media_map is None:
        content = json.loads(read_text(CONTENT))
        _media_map = {
            image['id']: re.sub(r'\.\w+$', '', Path(image['asset']).name).lower()
            for image in content['images']
        }
    return _media_map.get(upload_path)


def build_routes() -> list[dict]:
    content = json.loads(read_text(CONTENT))
    routes = []
    for page in content['pages']:
        slug = page['slug']
        source = mirror_path(slug)
        if not source.exists():
            continue
        routes.append({
            'kind': 'page',
            'slug': slug,
            'source': source,
            'route': '/' if slug == 'home' else f'/{slug}',
        })
    for post in content['posts']:
        source = mirror_path(post['slug'])
        if source.exists():
            routes.append({
                'kind': 'post',
                'slug': post['slug'],
                'source': source,
                'route': f'/blog/{post["slug"]}',
            })
    studies = {s['slug']: s for s in load_api('p_in_research')}
    for slug, study in studies.items():
        routes.append({
            'kind': 'study',
            'slug': slug,
            'html': study['content']['rendered'],
            'route': f'/participate-research/{slug}',
        })
    return routes


def old_html(route: dict) -> str:
    if 'html' in route:
        return route['html']
    return read_text(route['source'])


def old_scope(route: dict) -> str | None:
    if route['kind'] == 'post':
        return '.ocd-single-post'
    return None


def check_route(route: dict, base: str) -> dict:
    source_html = old_html(route)
    expected_units = text_units(source_html, old_scope(route))
    _, expected_images = collect(source_html, old_scope(route))

    try:
        rendered = fetch(base.rstrip('/') + route['route'])
    except urllib.error.HTTPError as error:
        return {**route_id(route), 'status': f'HTTP {error.code}', 'missingText': expected_units,
                'missingImages': sorted(expected_images), 'checkedText': len(expected_units),
                'checkedImages': len(expected_images), 'addedText': []}

    actual_text, actual_images = collect(rendered, 'main', side='new')

    missing_text = [unit for unit in expected_units if unit not in actual_text]
    missing_images = sorted(stem for stem in expected_images if stem not in actual_images)

    corpus = old_site_corpus()
    added_text = [
        unit
        for unit in text_units(rendered, 'main')
        if unit not in corpus and not is_allowed_new(unit)
    ]

    return {
        **route_id(route),
        'status': 'ok',
        'checkedText': len(expected_units),
        'checkedImages': len(expected_images),
        'missingText': missing_text,
        'missingImages': missing_images,
        'addedText': added_text,
    }


def route_id(route: dict) -> dict:
    return {'kind': route['kind'], 'slug': route['slug'], 'route': route['route']}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://localhost:3000')
    parser.add_argument('--json', type=Path)
    parser.add_argument('--only', help='Substring filter on slug')
    parser.add_argument('--quiet', action='store_true')
    args = parser.parse_args()

    routes = build_routes()
    if args.only:
        routes = [r for r in routes if args.only in r['slug']]

    results = [check_route(route, args.base) for route in routes]
    failures = [
        r for r in results
        if r['missingText'] or r['missingImages'] or r['addedText'] or r['status'] != 'ok'
    ]

    total_text = sum(r['checkedText'] for r in results)
    total_images = sum(r['checkedImages'] for r in results)
    missing_text = sum(len(r['missingText']) for r in results)
    missing_images = sum(len(r['missingImages']) for r in results)
    added_text = sum(len(r['addedText']) for r in results)

    for result in failures:
        print(f"\n{result['route']}  ({result['kind']} {result['slug']}) status={result['status']}")
        for unit in result['missingText'][:8 if args.quiet else 40]:
            print(f'   missing text: {unit[:160]}')
        if len(result['missingText']) > 40 and not args.quiet:
            print(f"   ... {len(result['missingText']) - 40} more")
        for stem in result['missingImages']:
            print(f'   missing image: {stem}')
        for unit in result['addedText'][:8 if args.quiet else 40]:
            print(f'   ADDED text (not on old site): {unit[:160]}')

    print(
        f'\n{len(routes)} routes checked | '
        f'text {total_text - missing_text}/{total_text} present | '
        f'images {total_images - missing_images}/{total_images} present | '
        f'{added_text} invented text unit(s) | '
        f'{len(failures)} route(s) with gaps'
    )

    if args.json:
        args.json.write_text(json.dumps(results, indent=1), encoding='utf-8')

    return 1 if failures else 0


if __name__ == '__main__':
    sys.exit(main())
