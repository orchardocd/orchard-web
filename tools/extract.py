"""Extract every piece of orchardocd.org content from the local mirror.

Reads the wget mirror plus the wp-json dumps under mirror/api and writes
web/src/seed/content.json, the single source the Payload seed consumes.
"""

import html
import json
import re
from pathlib import Path

from bs4 import BeautifulSoup, Comment, Doctype, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
MIRROR = ROOT / 'mirror'
SITE = MIRROR / 'www.orchardocd.org'
API = MIRROR / 'api'
OUT = ROOT / 'web' / 'src' / 'seed' / 'content.json'

PARSER = 'lxml'

UTILITY_SLUGS = {
    'account-details', 'checkout', 'dashboard', 'edit-account', 'files', 'logout',
    'my-account', 'my-files', 'my-pages', 'pages', 'payment-accepted',
    'payment-rejected', 'payments', 'ocd-survey',
}

CHROME_SELECTORS = [
    'script', 'style', 'noscript', 'form',
    '#respond', '#comments', '.comments-area', '.comment-respond', '.comment-form',
    '#share', '.socialshare-and-readmore', '.share-buttons',
    '.pagination', '.nav-links', '.wp-pagenavi', '.page-numbers',
    '.screen-reader-text', '.elementor-screen-only', '.orchard-meta', '.meta',
    '.post-tags', '.tags-links', '.entry-footer',
    '.home-recent-blogs', '.ocd-blogg', '.all-blogs', '.recent-blog-section',
    '.ocd-research-listing', '.participate-research-listing',
    '.about-orchard-team', '.about-orchard-scientificadvisory',
    '.about-orchardsupporters', '.about-orchardvolunteers',
]

JUNK_TEXT = re.compile(
    r'^(share on:?|#respond|#comments|leave a reply|cancel reply|page \d+ of \d+|'
    r'[\d\s.,»«\-–—_]+|last »|» last|facebook|twitter|linkedin|read more|home|'
    r'add your heading text here|your email address will not be published.*|'
    r'tags?:.*|posted on:?.*)$',
    re.I,
)

JUNK_SUBSTRINGS = re.compile(
    r'window\.mc4wp|mailchimp for wordpress|window\.option_df_|function\s*\(\s*\)\s*\{|'
    r'save my name, email, and website|required fields are marked',
    re.I,
)

DOC_EXT = re.compile(r'\.(pdf|docx?|pptx?|xlsx?)($|\?)', re.I)
IMAGE_EXT = re.compile(r'\.(png|jpe?g|gif|svg|webp)($|\?)', re.I)
VIDEO_EXT = re.compile(r'\.(mov|mp4|m4v|webm)($|\?)', re.I)
VALID_HREF = re.compile(r'^(https?://|mailto:|tel:|/|#)', re.I)
TEASER_END = re.compile(r'(\.\.|…|\.\.\.)\s*$')

images_seen = {}
documents_seen = {}
videos_seen = {}


def read_text(path):
    with open(path, encoding='utf-8', errors='replace') as handle:
        return handle.read()


def read_soup(path):
    return BeautifulSoup(read_text(path), PARSER)


def soup_of(markup):
    return BeautifulSoup(markup, PARSER)


def load_api(name):
    items = {}
    for f in sorted(API.glob(f'{name}*.json')):
        try:
            with open(f, encoding='utf-8') as handle:
                data = json.load(handle)
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            for item in data:
                items[item['id']] = item
    return sorted(items.values(), key=lambda x: x['id'])


def clean_text(value):
    return re.sub(r'\s+', ' ', value).strip()


def strip_tags(markup):
    text = markup if '<' not in markup else soup_of(markup).get_text(' ', strip=True)
    return clean_text(html.unescape(text))


def sanitize_href(href):
    href = html.unescape(href or '').strip()
    if href.lower().startswith(('http://', 'https://', 'mailto:', 'tel:')):
        return re.sub(r'\s+', '', href)
    return re.sub(r'\s+', ' ', href).strip()


def is_junk(markup):
    plain = strip_tags(markup)
    if not plain:
        return True
    if JUNK_SUBSTRINGS.search(plain):
        return True
    return bool(JUNK_TEXT.match(plain))


def strip_size_suffix(url):
    return re.sub(r'(?:-\d+x\d+|-scaled)(?=\.\w+$)', '', url)


def local_upload_path(url):
    match = re.search(r'wp-content/uploads/(.+)$', url)
    return 'uploads/' + match.group(1).split('?')[0] if match else None


def mirror_file(url):
    rel = re.sub(r'^https?://(?:www\.)?orchardocd\.org/', '', url).split('?')[0]
    path = SITE / rel
    return path if path.exists() and path.stat().st_size > 0 else None


def find_by_basename(name):
    """The mirror sometimes holds an asset under a different date folder."""
    for match in sorted((SITE / 'wp-content' / 'uploads').rglob(name)):
        if match.stat().st_size > 0:
            return match
    return None


def find_largest_variant(url):
    """wget sometimes captured only WordPress's resized copies of an image."""
    key = local_upload_path(url)
    if not key:
        return None
    target = SITE / 'wp-content' / key
    folder = target.parent
    if not folder.is_dir():
        return None
    stem, _, suffix = target.name.rpartition('.')
    pattern = re.compile(rf'{re.escape(stem)}-\d+x\d+\.{re.escape(suffix)}$')
    candidates = [
        match
        for match in folder.iterdir()
        if pattern.fullmatch(match.name) and match.is_file() and match.stat().st_size > 0
    ]
    return max(candidates, key=lambda match: match.stat().st_size) if candidates else None


def register_image(url, alt=''):
    if not url:
        return None
    original = sanitize_href(url).split('?')[0].replace('\\/', '/')
    url = strip_size_suffix(original)
    key = local_upload_path(url)
    if not key:
        return None
    path = (
        mirror_file(url)
        or (mirror_file(original) if original != url else None)
        or find_by_basename(Path(key).name)
        or find_largest_variant(url)
    )
    if path is None:
        return None
    entry = images_seen.setdefault(
        key, {'id': key, 'url': url, 'file': str(path.relative_to(MIRROR)), 'alt': ''}
    )
    alt = clean_text(html.unescape(alt or ''))
    if alt and not entry['alt']:
        entry['alt'] = alt
    return key


def register_document(url):
    url = sanitize_href(url).split('?')[0].replace('\\/', '/')
    key = local_upload_path(url)
    if not key:
        return None
    path = mirror_file(url)
    if path is None:
        return None
    documents_seen.setdefault(key, {'id': key, 'url': url, 'file': str(path.relative_to(MIRROR))})
    return key


def register_video(url):
    url = sanitize_href(url).split('?')[0].replace('\\/', '/')
    key = local_upload_path(url)
    if not key:
        return None
    path = mirror_file(url)
    if path is None:
        return None
    videos_seen.setdefault(key, {'id': key, 'url': url, 'file': str(path.relative_to(MIRROR))})
    return key


def strip_chrome(element):
    for node in element.find_all(string=lambda s: isinstance(s, (Comment, Doctype))):
        node.extract()
    for selector in CHROME_SELECTORS:
        for match in element.select(selector):
            match.decompose()
    for anchor in element.select('a[href*="wp-admin"]'):
        anchor.decompose()
    return element


INLINE_TAGS = ('a', 'strong', 'b', 'em', 'i', 'span', 'small', 'sub', 'sup', 'u', 'br', 'code')
BLOCK_TAGS = ('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'blockquote', 'table',
              'figure', 'div', 'section', 'article', 'iframe', 'video')


def has_block_child(element):
    return element.find(BLOCK_TAGS) is not None


def inline_parts(element):
    """Serialize inline content without trimming, so boundary spaces survive nesting."""
    parts = []
    for node in element.children:
        if isinstance(node, (Comment, Doctype)):
            continue
        if isinstance(node, NavigableString):
            parts.append(html.escape(str(node), quote=False))
        elif isinstance(node, Tag):
            if node.name in ('script', 'style', 'noscript', 'img'):
                continue
            if node.name == 'br':
                parts.append('<br>')
            elif node.name == 'a' and node.get('href'):
                href = sanitize_href(node['href'])
                inner = inline_parts(node)
                if not inner.strip():
                    continue
                dead_document = (
                    DOC_EXT.search(href) and local_upload_path(href) and not register_document(href)
                )
                if DOC_EXT.search(href):
                    register_document(href)
                elif IMAGE_EXT.search(href):
                    register_image(href)
                if dead_document or not VALID_HREF.match(href) or '"' in href:
                    parts.append(inner)
                else:
                    parts.append(f'<a href="{html.escape(href, quote=True)}">{inner}</a>')
            elif node.name in ('strong', 'b'):
                inner = inline_parts(node)
                parts.append(f'<strong>{inner}</strong>' if inner.strip() else inner)
            elif node.name in ('em', 'i'):
                inner = inline_parts(node)
                parts.append(f'<em>{inner}</em>' if inner.strip() else inner)
            elif node.name in ('sub', 'sup', 'u'):
                inner = inline_parts(node)
                parts.append(f'<{node.name}>{inner}</{node.name}>' if inner.strip() else inner)
            else:
                parts.append(inline_parts(node))
    return ''.join(parts)


def inline_html(element):
    out = inline_parts(element).replace('\xa0', ' ')
    out = re.sub(r'[ \t\r\n]+', ' ', out)
    out = re.sub(r'(<br>\s*){3,}', '<br><br>', out)
    return out.strip()


def split_paragraphs(markup):
    """Split only on blank lines; single <br> stays a line break inside the paragraph."""
    if not markup:
        return []
    paragraphs = [chunk.strip() for chunk in re.split(r'(?:<br>\s*){2,}', markup)]
    trimmed = [re.sub(r'^(?:\s*<br>)+|(?:<br>\s*)+$', '', p).strip() for p in paragraphs]
    return [p for p in trimmed if p and not is_junk(p)]


def list_items(node):
    items = []
    for li in node.find_all('li', recursive=False):
        markup = inline_html(li)
        if markup and not is_junk(markup):
            items.append(markup)
    return items


def table_rows(node):
    rows = []
    for tr in node.find_all('tr'):
        cells = [clean_text(td.get_text(' ', strip=True)) for td in tr.find_all(['td', 'th'])]
        if any(cells):
            rows.append(cells)
    return rows


def para_blocks(container):
    blocks = []
    pending = []

    def flush():
        if pending:
            for markup in split_paragraphs(' '.join(pending).strip()):
                blocks.append({'type': 'paragraph', 'html': markup})
            pending.clear()

    for node in container.children:
        if isinstance(node, (Comment, Doctype)):
            continue
        if isinstance(node, NavigableString):
            text = str(node).replace('\xa0', ' ')
            if text.strip():
                pending.append(clean_text(html.escape(text, quote=False)))
            continue
        if not isinstance(node, Tag):
            continue
        if node.name in ('script', 'style', 'noscript'):
            continue
        classes = node.get('class') or []
        if 'elementor-widget' in classes:
            wtype = widget_type(node)
            if wtype:
                result = widget_blocks(node, wtype)
                if result is not None:
                    flush()
                    blocks.extend(result)
                    continue
        if node.name == 'br':
            pending.append('<br>')
            continue
        if node.name in INLINE_TAGS:
            markup = inline_html(soup_of(f'<x>{node}</x>').x)
            if markup:
                pending.append(markup)
            if node.find('img'):
                flush()
                blocks.extend(image_blocks(node))
            continue
        if node.name == 'p':
            flush()
            if has_block_child(node):
                blocks.extend(para_blocks(node))
            else:
                for markup in split_paragraphs(inline_html(node)):
                    blocks.append({'type': 'paragraph', 'html': markup})
                blocks.extend(image_blocks(node))
        elif re.match(r'^h[1-6]$', node.name):
            flush()
            blocks.extend(heading_blocks(node))
        elif node.name in ('ul', 'ol'):
            flush()
            items = list_items(node)
            if items:
                blocks.append({'type': 'list', 'ordered': node.name == 'ol', 'items': items})
        elif node.name == 'blockquote':
            flush()
            markup = inline_html(node)
            if markup and not is_junk(markup):
                blocks.append({'type': 'quote', 'html': markup})
        elif node.name == 'table':
            flush()
            rows = table_rows(node)
            if len(rows) <= 1 or max(len(r) for r in rows) <= 1:
                blocks.extend(para_blocks(node))
            else:
                blocks.append({'type': 'table', 'rows': rows})
        elif node.name == 'img':
            flush()
            blocks.extend(image_blocks(soup_of(f'<x>{node}</x>').x))
        elif node.name == 'video':
            flush()
            blocks.extend(video_blocks(node))
        elif node.name == 'iframe':
            flush()
            src = node.get('src') or node.get('data-src')
            if src:
                blocks.append({'type': 'embed', 'url': sanitize_href(src)})
        else:
            flush()
            blocks.extend(para_blocks(node))
    flush()
    return blocks


def image_blocks(container):
    blocks = []
    for img in container.find_all('img'):
        key = register_image(img.get('src') or img.get('data-src'), img.get('alt'))
        if not key:
            continue
        block = {'type': 'image', 'image': key}
        caption = img.find_parent('figure')
        if caption is not None:
            figcaption = caption.find('figcaption')
            if figcaption:
                block['caption'] = clean_text(figcaption.get_text(' ', strip=True))
        link = img.find_parent('a')
        if link and link.get('href'):
            href = sanitize_href(link['href'])
            if VALID_HREF.match(href) and not IMAGE_EXT.search(href):
                block['href'] = href
        blocks.append(block)
    return blocks


def video_blocks(node):
    src = node.get('src')
    if not src:
        source = node.find('source')
        src = source.get('src') if source else None
    key = register_video(src) if src else None
    return [{'type': 'video', 'file': key}] if key else []


def heading_blocks(node):
    if has_block_child(node):
        return para_blocks(node)
    markup = inline_html(node)
    if not markup or is_junk(markup):
        return []
    text = strip_tags(markup)
    level = int(node.name[1]) if re.match(r'^h[1-6]$', node.name or '') else 2
    if len(text) > 140 or '<a href' in markup:
        return [{'type': 'paragraph', 'html': m} for m in split_paragraphs(markup)]
    return [{'type': 'heading', 'level': level, 'text': text}]


def widget_type(widget):
    declared = widget.get('data-widget_type')
    if declared:
        return declared.split('.')[0]
    for name in widget.get('class', []):
        match = re.match(r'elementor-widget-([a-z0-9_-]+)$', name)
        if match and match.group(1) != 'container' and '__' not in match.group(1):
            return match.group(1)
    return None


SOCIAL_LABELS = {
    'facebook.com': 'Facebook',
    'instagram.com': 'Instagram',
    'twitter.com': 'X / Twitter',
    'x.com': 'X / Twitter',
    'linkedin.com': 'LinkedIn',
    'youtube.com': 'YouTube',
}


def link_label_from_url(href):
    host = re.sub(r'^https?://(?:www\.)?', '', href).split('/')[0]
    for domain, label in SOCIAL_LABELS.items():
        if host.endswith(domain):
            return label
    return host


def widget_link(widget):
    raw = widget.get('data-exad-element-link') or widget.get('data-elementor-element-link')
    if not raw:
        return None
    try:
        return sanitize_href(json.loads(html.unescape(raw)).get('url', ''))
    except (json.JSONDecodeError, AttributeError):
        return None


def video_url(widget):
    settings = widget.get('data-settings', '')
    overlay = re.search(r'"image_overlay":\{[^}]*?"url":"([^"]+)"', settings)
    if overlay:
        register_image(overlay.group(1).replace('\\/', '/'))
    match = re.search(r'"(?:youtube_url|vimeo_url|url)":"([^"]+)"', settings)
    if match:
        return sanitize_href(match.group(1).replace('\\/', '/'))
    iframe = widget.find('iframe')
    return sanitize_href(iframe['src']) if iframe and iframe.get('src') else None


def flipbook_documents(markup):
    blocks = []
    for source in re.findall(r'"source"\s*:\s*"([^"]+\.pdf)"', markup.replace('\\/', '/')):
        key = register_document(source)
        if key:
            blocks.append({'type': 'document', 'document': key})
    return blocks


def modal_blocks(container):
    body = container.find(class_=re.compile('modal-element-body'))
    if body is None:
        return None
    blocks = []
    title = container.find(class_=re.compile('modal-element-title|modal-title'))
    if title:
        text = strip_tags(title.get_text(' ', strip=True))
        if text:
            blocks.append({'type': 'heading', 'level': 3, 'text': text})
    blocks.extend(para_blocks(body))
    return blocks


def widget_blocks(widget, wtype):
    container = widget.find(class_='elementor-widget-container') or widget
    strip_chrome(container)

    modal = modal_blocks(container)
    if modal is not None:
        return modal

    if wtype == 'heading':
        heading = container.find(re.compile('^h[1-6]$')) or container.find(
            class_='elementor-heading-title'
        )
        blocks = heading_blocks(heading) if heading else []
        link = widget_link(widget)
        if link and blocks:
            blocks.append({'type': 'button', 'label': strip_tags(str(blocks[0].get('text', ''))) or 'Read more', 'href': link})
        return blocks
    if wtype == 'text-editor':
        return para_blocks(container)
    if wtype in ('image', 'theme-post-featured-image'):
        blocks = image_blocks(container)
        link = widget_link(widget)
        if link and blocks:
            blocks[0]['href'] = link
        return blocks
    if wtype == 'video':
        url = video_url(widget)
        if not url:
            return []
        overlay = re.search(
            r'"image_overlay":\{[^}]*?"url":"([^"]+)"', widget.get('data-settings', '')
        )
        block = {'type': 'video', 'url': url}
        if overlay:
            poster = register_image(overlay.group(1).replace('\\/', '/'))
            if poster:
                block['poster'] = poster
        return [block]
    if wtype in ('button', 'exad-link-anything'):
        anchor = container.find('a')
        label = clean_text(anchor.get_text(' ', strip=True)) if anchor else ''
        href = sanitize_href(anchor.get('href', '')) if anchor else ''
        link = widget_link(widget)
        if link and (not href or href == '#'):
            href = link
        if DOC_EXT.search(href):
            register_document(href)
        return [{'type': 'button', 'label': label, 'href': href}] if label and href else []
    if wtype == 'icon-list':
        items = [markup for markup in (inline_html(li) for li in container.find_all('li')) if markup and not is_junk(markup)]
        return [{'type': 'list', 'ordered': False, 'items': items}] if items else []
    if wtype in ('icon-box', 'image-box'):
        blocks = []
        title = container.find(class_=re.compile('(icon|image)-box-title'))
        description = container.find(class_=re.compile('(icon|image)-box-description'))
        if title:
            blocks.extend(heading_blocks(title))
        if description:
            blocks.extend(para_blocks(description))
        return blocks
    if wtype in ('toggle', 'accordion'):
        blocks = []
        titles = container.find_all(class_=re.compile('(toggle|accordion)-title'))
        bodies = container.find_all(class_=re.compile('(toggle|accordion)-content'))
        for title, body in zip(titles, bodies):
            blocks.append({
                'type': 'accordion-item',
                'title': strip_tags(title.get_text(' ', strip=True)),
                'blocks': para_blocks(body),
            })
        return blocks
    if wtype == 'testimonial':
        quote = container.find(class_=re.compile('testimonial-content'))
        if not quote:
            return []
        block = {'type': 'quote', 'html': inline_html(quote)}
        cite = container.find(class_=re.compile('testimonial-name'))
        if cite:
            block['cite'] = strip_tags(cite.get_text(' ', strip=True))
        return [block]
    if wtype in ('image-carousel', 'image-gallery', 'gallery', 'media-carousel'):
        return image_blocks(container)
    if wtype == 'google_maps':
        iframe = container.find('iframe')
        return [{'type': 'embed', 'url': sanitize_href(iframe['src'])}] if iframe and iframe.get('src') else []
    if wtype and wtype.startswith('wp-widget-nav_menu'):
        items = []
        for anchor in container.find_all('a', href=True):
            href = sanitize_href(anchor['href'])
            if not VALID_HREF.match(href):
                continue
            label = (
                clean_text(anchor.get_text(' ', strip=True))
                or clean_text(anchor.get('aria-label') or anchor.get('title') or '')
                or link_label_from_url(href)
            )
            if label:
                items.append(f'<a href="{html.escape(href, quote=True)}">{label}</a>')
        return [{'type': 'list', 'ordered': False, 'items': items}] if items else []
    if wtype in ('html', 'shortcode'):
        blocks = flipbook_documents(str(container))
        for iframe in container.find_all('iframe'):
            src = iframe.get('src') or iframe.get('data-src')
            if src:
                blocks.append({'type': 'embed', 'url': sanitize_href(src)})
        for nested in container.find_all(class_='elementor-widget-video'):
            url = video_url(nested)
            if url:
                blocks.append({'type': 'video', 'url': url})
        return blocks or para_blocks(container)
    return None


def register_embedded_assets(markup):
    normalized = markup.replace('\\/', '/')
    for href in re.findall(r'https?:[^"\'\\ ]*?\.(?:pdf|docx?|pptx?|xlsx?)', normalized, re.I):
        register_document(href)
    for url in re.findall(
        r'url\((?:&quot;|"|\')?(https?://www\.orchardocd\.org/wp-content/uploads/[^)"\'&]+)',
        normalized,
    ):
        register_image(url)


HEADING_TAGS = ('h1', 'h2', 'h3', 'h4', 'h5', 'h6')


def is_heading_tag(element):
    return element.name in HEADING_TAGS or (element.get('role') or '').lower() == 'heading'


def headings_below_image(root):
    """Images whose own title follows them, the way an Elementor card is built."""
    order = list(root.find_all(True))
    positions = {id(element): index for index, element in enumerate(order)}
    below = set()
    seen = set()
    for element in order:
        if element.name != 'img':
            continue
        key = local_upload_path(strip_size_suffix((element.get('src') or '').split('?')[0]))
        if not key or key in seen:
            continue
        seen.add(key)
        here = positions[id(element)]
        ancestor = element.parent
        while ancestor is not None:
            headings = [
                positions[id(node)]
                for node in ancestor.find_all(True)
                if id(node) in positions
                and is_heading_tag(node)
                and node.get_text(' ', strip=True)
            ]
            if headings:
                if not any(position < here for position in headings):
                    below.add(key)
                break
            ancestor = ancestor.parent if ancestor is not root else None
    return below


def attach_images_to_their_heading(blocks, titled_below):
    """A card names its picture with the title underneath it, so emit that title first."""
    result = list(blocks)
    index = 0
    while index < len(result) - 1:
        current, following = result[index], result[index + 1]
        if (
            current['type'] == 'image'
            and following['type'] == 'heading'
            and current['image'] in titled_below
        ):
            result[index], result[index + 1] = following, current
            index += 2
            continue
        index += 1
    return result


def dedupe(blocks):
    """Drop the collapsed teaser Elementor renders directly before each modal body."""
    result = []
    for block in blocks:
        if result and block == result[-1]:
            continue
        if (
            block['type'] == 'paragraph'
            and result
            and result[-1]['type'] == 'paragraph'
            and TEASER_END.search(strip_tags(result[-1]['html']))
        ):
            teaser = strip_tags(result[-1]['html'])
            stem = TEASER_END.sub('', teaser).strip()
            if stem and strip_tags(block['html']).startswith(stem[: max(30, len(stem) - 10)]):
                result[-1] = block
                continue
        result.append(block)
    return result


def elementor_blocks(markup, titled_below=None):
    register_embedded_assets(markup)
    soup = soup_of(markup)
    root = soup.find(attrs={'data-elementor-type': True}) or soup
    strip_chrome(root)
    blocks = flipbook_documents(markup)
    blocks.extend(para_blocks(root))
    if titled_below is None:
        titled_below = headings_below_image(root)
    return attach_images_to_their_heading(dedupe(blocks), titled_below)


MEDIA = {}


def media_index():
    index = {}
    for item in load_api('media'):
        source = item.get('source_url')
        if source:
            index[item['id']] = (source, strip_tags(item.get('alt_text') or ''))
    return index


def featured_image(item):
    media_id = item.get('featured_media')
    if media_id and media_id in MEDIA:
        source, alt = MEDIA[media_id]
        key = register_image(source, alt)
        if key:
            return key
    yoast = item.get('yoast_head_json') or {}
    for image in yoast.get('og_image') or []:
        if image.get('url'):
            key = register_image(image['url'])
            if key:
                return key
    return None


def yoast_description(item):
    yoast = item.get('yoast_head_json') or {}
    return strip_tags(yoast.get('og_description') or yoast.get('description') or '')


BANNER_IMAGE_WRAPPER = re.compile(r'bnr-img-wrp|banner-inner-img|banner-img')


def slide_scope(details):
    scope = details
    while scope is not None and scope.find(class_=BANNER_IMAGE_WRAPPER) is None:
        scope = scope.parent
        if scope is not None and scope.get('class') and any(
            'banner-section' in name for name in scope.get('class')
        ):
            break
    return scope or details.parent


def extract_hero(slug):
    path = SITE / 'index.html' if slug == 'home' else SITE / slug / 'index.html'
    if not path.exists():
        return []
    banner = read_soup(path).find(class_=re.compile(r'banner-section'))
    if not banner:
        return []
    slides = []
    for details in banner.find_all(class_='banner-content-details'):
        strip_chrome(details)
        heading = details.find(['h1', 'h2', 'h3'])
        title = strip_tags(heading.get_text(' ', strip=True)) if heading else ''
        if not title:
            continue
        heading.extract()
        links = []
        for anchor in details.find_all('a', href=True):
            label = clean_text(anchor.get_text(' ', strip=True))
            if not label:
                continue
            parent = anchor.parent
            standalone = clean_text(parent.get_text(' ', strip=True)) == label
            if standalone:
                links.append({'label': label, 'href': sanitize_href(anchor['href'])})
                anchor.extract()
        body = [block['html'] for block in para_blocks(details) if block['type'] == 'paragraph']
        scope = slide_scope(details)
        image = None
        if scope is not None:
            img = scope.select_one('img.desk-bnr') or scope.find(class_=BANNER_IMAGE_WRAPPER)
            if img is not None and img.name != 'img':
                img = img.find('img')
            if img:
                image = register_image(img.get('src'), img.get('alt'))
        if not body and not links and not image:
            continue
        slide = {'title': title, 'body': body, 'links': links}
        if image:
            slide['image'] = image
        slides.append(slide)
    return slides


def drop_webinar_listing(blocks):
    """The webinars page is a listing: the rebuild renders it from the collection."""
    result = []
    for block in blocks:
        if block['type'] == 'video':
            if result and result[-1]['type'] == 'heading':
                result.pop()
            continue
        result.append(block)
    return result


LISTING_HEADINGS = {'about': 'our members'}


def page_blocks(slug, blocks):
    if slug == 'webinars':
        return drop_webinar_listing(blocks)
    heading = LISTING_HEADINGS.get(slug)
    if heading:
        # The listing below the heading is rendered from the people collection.
        return [
            block
            for block in blocks
            if not (block['type'] == 'heading' and block['text'].lower() == heading)
        ]
    return blocks


def extract_pages():
    pages = []
    for page in load_api('pages'):
        slug = page['slug']
        if slug in UTILITY_SLUGS or page.get('status') != 'publish':
            continue
        # The rendered page is the source of truth for how cards are laid out.
        rendered = SITE / 'index.html' if slug == 'home' else SITE / slug / 'index.html'
        titled_below = (
            headings_below_image(strip_chrome(read_soup(rendered))) if rendered.exists() else None
        )
        blocks = elementor_blocks(page['content']['rendered'], titled_below)
        pages.append({
            'slug': slug,
            'title': strip_tags(page['title']['rendered']),
            'description': yoast_description(page),
            'featuredImage': featured_image(page),
            'hero': extract_hero(slug),
            'blocks': page_blocks(slug, blocks),
        })
    return pages


def post_byline(soup):
    banner = soup.find(class_=re.compile('single-post-banner'))
    if banner:
        match = re.search(
            r'[Bb]y\s+([A-Z][\w.\'-]+(?:\s+[A-Z][\w.\'-]+){0,3})',
            banner.get_text(' ', strip=True),
        )
        if match:
            return match.group(1)
    return None


def extract_posts(categories):
    posts = []
    for post in load_api('posts'):
        if post.get('status') != 'publish':
            continue
        slug = post['slug']
        path = SITE / slug / 'index.html'
        byline = None
        theme_image = None
        if path.exists():
            soup = read_soup(path)
            byline = post_byline(soup)
            scope = soup.find(class_='ocd-single-post')
            if scope is not None:
                for image in scope.select('img.wp-post-image'):
                    theme_image = register_image(image.get('src'), image.get('alt'))
                    image.decompose()
                blocks = elementor_blocks(str(scope))
            else:
                blocks = elementor_blocks(post['content']['rendered'])
        else:
            blocks = elementor_blocks(post['content']['rendered'])
        posts.append({
            'slug': slug,
            'title': strip_tags(post['title']['rendered']),
            'date': post['date'],
            'categories': [categories[c] for c in post.get('categories', []) if c in categories],
            'description': yoast_description(post),
            'featuredImage': theme_image or featured_image(post),
            'byline': byline,
            'blocks': blocks,
        })
    return posts


def extract_studies():
    return [
        {
            'slug': study['slug'],
            'title': strip_tags(study['title']['rendered']),
            'date': study['date'],
            'description': yoast_description(study),
            'featuredImage': featured_image(study),
            'blocks': elementor_blocks(study['content']['rendered']),
        }
        for study in load_api('p_in_research')
        if study.get('status') == 'publish'
    ]


def extract_research_slides():
    return [
        {
            'slug': slide['slug'],
            'title': strip_tags(slide['title']['rendered']),
            'image': featured_image(slide),
            'blocks': elementor_blocks(slide['content']['rendered']),
        }
        for slide in load_api('research-slider')
        if slide.get('status') == 'publish'
    ]


def extract_speakers():
    return [
        {
            'slug': speaker['slug'],
            'name': strip_tags(speaker['title']['rendered']),
            'role': strip_tags(speaker['content']['rendered']),
            'photo': featured_image(speaker),
        }
        for speaker in load_api('speakers')
        if speaker.get('status') == 'publish'
    ]


CARD_CLASS = re.compile(
    r'aboutorchardteam-details|scientificadvisory-details|supporters-details|'
    r'volunteers-details|team-details'
)


def carousel_heading(card):
    carousel = card.find_parent(class_=re.compile('owl-carousel'))
    if carousel is None:
        return None
    for previous in carousel.find_all_previous(class_='elementor-widget-heading'):
        text = strip_tags(previous.get_text(' ', strip=True))
        if text:
            return text
    return None


def extract_people():
    people = {}
    group_order = {}

    for directory in sorted((SITE / 'employees').iterdir()):
        path = directory / 'index.html'
        if not path.exists():
            continue
        soup = read_soup(path)
        entry = strip_chrome(soup.find(class_='entry') or soup)
        name_element = entry.find('h2') or soup.find('h2')
        name = strip_tags(name_element.get_text(' ', strip=True)) if name_element else directory.name
        if name_element:
            name_element.extract()
        people[directory.name] = {
            'slug': directory.name, 'name': name, 'bio': para_blocks(entry),
            'photo': None, 'excerpt': '', 'website': None, 'group': None, 'order': 0,
        }

    for path in SITE.rglob('index.html'):
        markup = read_text(path)
        if '/employees/' not in markup and '/members/' not in markup:
            continue
        soup = BeautifulSoup(markup, PARSER)
        for card in soup.find_all(class_=CARD_CLASS):
            link = card.find('a', class_='modal-link') or card.find(
                'a', href=re.compile('/(employees|members)/')
            )
            if not link:
                continue
            match = re.search(r'/(employees|members)/([^/]+)/?', link.get('href', ''))
            if not match:
                continue
            slug = match.group(2) if match.group(1) == 'employees' else f'member-{match.group(2)}'
            person = people.get(slug)
            if person is None:
                heading = card.find(['h3', 'h4'])
                person = {
                    'slug': slug,
                    'name': strip_tags(heading.get_text(' ', strip=True)) if heading else slug,
                    'bio': [], 'photo': None, 'excerpt': '', 'website': None,
                    'group': None, 'order': 0,
                }
                people[slug] = person
            image = card.find('img')
            if image and not person['photo']:
                person['photo'] = register_image(image.get('src'), image.get('alt') or person['name'])
            paragraph = card.find('p')
            if paragraph and not person['excerpt']:
                person['excerpt'] = strip_tags(paragraph.get_text(' ', strip=True))
            for anchor in card.find_all('a', href=True):
                href = sanitize_href(anchor['href'])
                if '/employees/' not in href and href.startswith('http') and not person['website']:
                    person['website'] = href
            group = carousel_heading(card)
            if group and not person['group']:
                person['group'] = group
                if group not in group_order:
                    group_order[group] = len(group_order)
                person['order'] = sum(1 for p in people.values() if p['group'] == group) - 1

    return sorted(
        people.values(),
        key=lambda person: (group_order.get(person['group'], len(group_order)), person['order']),
    )


def widget_title_near(widget):
    column = widget.find_parent(class_=re.compile('elementor-column|elementor-top-section'))
    if column is not None:
        for pattern in ('elementor-widget-heading', 'elementor-widget-text-editor'):
            for sibling in column.find_all(class_=pattern):
                text = strip_tags(sibling.get_text(' ', strip=True))
                if text and text.lower() != 'webinars':
                    return text
    for previous in widget.find_all_previous(class_='elementor-widget-heading'):
        text = strip_tags(previous.get_text(' ', strip=True))
        if text and text.lower() != 'webinars':
            return text
    return None


def banner_video_titles(soup):
    """The webinars banner slider carries the canonical title for each video."""
    titles = {}
    banner = soup.find(class_=re.compile('banner-section'))
    if banner is None:
        return titles
    for details in banner.find_all(class_='banner-content-details'):
        heading = details.find(['h1', 'h2', 'h3'])
        if not heading:
            continue
        title = strip_tags(heading.get_text(' ', strip=True))
        slide = details.find_parent(class_=re.compile(r'slide\d+')) or details.parent
        iframe = slide.find('iframe') if slide else None
        source = iframe.get('src') or iframe.get('data-src') if iframe else None
        if title and source:
            titles[video_id(source)] = title
    return titles


def video_id(url):
    match = re.search(r'(?:youtu\.be/|embed/|watch\?v=|vimeo\.com/(?:video/)?)([\w-]{6,})', url or '')
    return match.group(1) if match else (url or '')


def extract_webinars():
    soup = read_soup(SITE / 'webinars' / 'index.html')
    banner_titles = banner_video_titles(soup)
    webinars = []
    for widget in soup.find_all(class_='elementor-widget-video'):
        url = video_url(widget)
        if not url:
            continue
        overlay = re.search(
            r'"image_overlay":\{[^}]*?"url":"([^"]+)"', widget.get('data-settings', '')
        )
        listed = widget_title_near(widget)
        title = banner_titles.get(video_id(url)) or listed or 'Webinar'
        webinars.append({
            'title': title,
            # The old page sometimes worded a title differently in the list than in
            # the slider; keep the alternate wording so nothing is lost.
            'description': listed if listed and listed != title else None,
            'url': url,
            'image': register_image(overlay.group(1).replace('\\/', '/')) if overlay else None,
        })
    return webinars


def extract_conference_speakers():
    speakers = []
    seen = set()
    for slug in ('conference', 'conference-2'):
        path = SITE / slug / 'index.html'
        if not path.exists():
            continue
        soup = read_soup(path)
        for element in soup.find_all(class_=re.compile('speakers-title')):
            name = strip_tags(element.get_text(' ', strip=True))
            if not name or name in seen:
                continue
            seen.add(name)
            section = None
            for previous in element.find_all_previous(class_='elementor-widget-heading'):
                heading = strip_tags(previous.get_text(' ', strip=True))
                if heading:
                    section = heading
                    break
            speakers.append({'name': name, 'page': slug, 'section': section})
    return speakers


def harvest_alt_text():
    for path in SITE.rglob('*.html'):
        for image in read_soup(path).find_all('img'):
            alt = clean_text(html.unescape(image.get('alt') or ''))
            if not alt:
                continue
            key = local_upload_path(strip_size_suffix((image.get('src') or '').split('?')[0]))
            if key and key in images_seen and not images_seen[key]['alt']:
                images_seen[key]['alt'] = alt


def section_of(blocks, heading, stop_headings):
    """Take the blocks that follow a heading, up to the next section heading."""
    result = []
    collecting = False
    for block in blocks:
        if block['type'] == 'heading':
            text = block['text'].strip().lower()
            if text == heading.lower():
                collecting = True
                continue
            if collecting and text in stop_headings:
                break
        if collecting:
            result.append(block)
    return result


def first(blocks, kind, key, default=None):
    for block in blocks:
        if block['type'] == kind:
            return block.get(key, default)
    return default


def paragraphs(blocks):
    return [block['html'] for block in blocks if block['type'] == 'paragraph']


def images_in(blocks):
    return [block['image'] for block in blocks if block['type'] == 'image']


def image_headings(root):
    """Which heading each illustration sits under on the rendered old page."""
    order = list(root.find_all(True))
    positions = {id(element): index for index, element in enumerate(order)}
    associations = {}
    for element in order:
        if element.name != 'img':
            continue
        key = local_upload_path(strip_size_suffix((element.get('src') or '').split('?')[0]))
        if not key or key in associations:
            continue
        here = positions[id(element)]
        ancestor = element.parent
        while ancestor is not None:
            headings = [
                (positions[id(node)], clean_text(node.get_text(' ', strip=True)))
                for node in ancestor.find_all(True)
                if id(node) in positions and is_heading_tag(node) and node.get_text(strip=True)
            ]
            if headings:
                above = [entry for entry in headings if entry[0] < here]
                associations[key] = (max(above) if above else min(headings))[1]
                break
            ancestor = ancestor.parent if ancestor is not root else None
    return associations


def extract_home(page):
    """The landing page as semantic fields, so the rebuild owns its presentation."""
    blocks = page['blocks']
    associations = image_headings(strip_chrome(read_soup(SITE / 'index.html')))

    def artwork(heading):
        """The illustrations the old page showed under a heading."""
        wanted = heading.strip().lower()
        return [key for key, value in associations.items() if value.strip().lower() == wanted]
    headings = [b['text'].strip().lower() for b in blocks if b['type'] == 'heading']
    stops = set(headings)

    def section(name):
        return section_of(blocks, name, stops - {name.lower()})

    about = section('About Orchard OCD')
    pillars = []
    for title in ('Our Vision', 'Our Mission'):
        body = paragraphs(section(title))
        if body:
            pillars.append({
                'title': title,
                'body': body[0],
                'image': (artwork(title) or [None])[0],
            })

    goals_blocks = section('Our Goals')
    goals_text = paragraphs(goals_blocks)
    goals_intro, goal_items = '', []
    if goals_text:
        lines = [line.strip() for line in re.split(r'<br>', goals_text[0]) if line.strip()]
        goals_intro = lines[0] if lines else ''
        goal_items = [re.sub(r'^\d+[.)]\s*', '', line) for line in lines[1:]]

    learn = section('Learn About Orchard OCD')
    participate = section('Want To Participate In Brand New OCD Research?')
    social = section('Follow Us On Social Media')
    proposals = section('Call For Proposals 2022')
    proposals_body = paragraphs(proposals)
    proposals_quote = next((b['html'] for b in proposals if b['type'] == 'quote'), None)
    if proposals_quote and not proposals_body:
        # The old page ran the intro and the winning study title together in one block.
        emphasised = re.search(r'<em>(.*?)</em>\s*$', proposals_quote)
        if emphasised:
            proposals_body = [proposals_quote[: emphasised.start()].strip()]
            proposals_quote = emphasised.group(1)

    poster = first(blocks, 'video', 'poster')
    hero = next((s for s in page['hero'] if 'develop better treatments' in s['title']), page['hero'][0])
    highlights = [s for s in page['hero'] if s is not hero]
    webinar = next((s for s in page['hero'] if s['title'].lower().startswith('our latest webinar')), None)
    if webinar:
        highlights = [s for s in highlights if s is not webinar]

    return {
        'hero': {
            'title': hero['title'],
            'ctaLabel': hero['links'][0]['label'] if hero['links'] else None,
            'ctaHref': hero['links'][0]['href'] if hero['links'] else None,
            'image': hero.get('image'),
        },
        'highlights': [
            {
                'title': slide['title'],
                'ctaLabel': slide['links'][0]['label'] if slide['links'] else None,
                'ctaHref': slide['links'][0]['href'] if slide['links'] else None,
                'image': slide.get('image'),
            }
            for slide in highlights
        ],
        'about': {
            'heading': 'About Orchard OCD',
            'intro': (paragraphs(about) or [''])[0],
            'image': first(about, 'image', 'image'),
            # The video's own poster is shown with the video, not as section artwork.
            'ctaImages': [key for key in artwork('Learn About Orchard OCD') if key != poster],
            'pillars': pillars,
            'goalsTitle': 'Our Goals',
            'goalsIntro': goals_intro,
            'goals': goal_items,
            'goalsImage': (artwork('Our Goals') or [None])[0],
            'ctaLabel': first(learn, 'button', 'label'),
            'ctaHref': first(learn, 'button', 'href'),
            'ctaHeading': 'Learn About Orchard OCD',
        },
        'video': {
            'url': first(blocks, 'video', 'url'),
            'poster': first(blocks, 'video', 'poster'),
        },
        'participate': {
            'heading': 'Want To Participate In Brand New OCD Research?',
            'body': (paragraphs(participate) or [''])[0],
            'images': artwork('Want To Participate In Brand New OCD Research?'),
            'ctaLabel': first(participate, 'button', 'label'),
            'ctaHref': first(participate, 'button', 'href'),
        },
        'social': {
            'heading': 'Follow Us On Social Media',
            'body': (paragraphs(social) or [''])[0],
            'images': artwork('Follow Us On Social Media'),
        },
        'proposals': {
            'heading': 'Call For Proposals 2022',
            'body': proposals_body,
            'quote': proposals_quote,
            'ctaLabel': first(proposals, 'button', 'label'),
            'ctaHref': first(proposals, 'button', 'href'),
            'image': (artwork('Call For Proposals 2022') or [None])[0],
        },
        'blog': {
            'heading': 'From The Blog',
            'images': artwork('From The Blog'),
        },
        'newsletter': {'images': artwork('Subscribe to our Newsletter')},
        'webinar': {
            'title': webinar['title'] if webinar else None,
            'image': webinar.get('image') if webinar else None,
            'ctaLabel': webinar['links'][0]['label'] if webinar and webinar['links'] else None,
            'ctaHref': webinar['links'][0]['href'] if webinar and webinar['links'] else None,
        },
    }


def main():
    global MEDIA
    MEDIA = media_index()
    categories = {c['id']: strip_tags(c['name']) for c in load_api('categories')}
    data = {
        'pages': extract_pages(),
        'posts': extract_posts(categories),
        'studies': extract_studies(),
        'researchSlides': extract_research_slides(),
        'speakers': extract_speakers(),
        'people': extract_people(),
        'webinars': extract_webinars(),
        'conferenceSpeakers': extract_conference_speakers(),
    }
    home_page = next(page for page in data['pages'] if page['slug'] == 'home')
    data['home'] = extract_home(home_page)

    harvest_alt_text()
    data['images'] = sorted(images_seen.values(), key=lambda item: item['id'])
    data['documents'] = sorted(documents_seen.values(), key=lambda item: item['id'])
    data['videos'] = sorted(videos_seen.values(), key=lambda item: item['id'])

    serialized = json.dumps(data)
    bad = sorted({
        href
        for href in re.findall(r'href=\\"([^\\"]*)\\"|"href": "([^"]*)"', serialized)
        for href in href
        if href and (not VALID_HREF.match(href) or re.search(r'\s', href))
    })
    if bad:
        raise SystemExit('Invalid hrefs produced:\n  ' + '\n  '.join(bad))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as handle:
        json.dump(data, handle, indent=1, ensure_ascii=False)
    for key, value in data.items():
        print(f'{key}: {len(value)}')
    print(f'images with alt: {sum(1 for i in data["images"] if i["alt"])}/{len(data["images"])}')


if __name__ == '__main__':
    main()
