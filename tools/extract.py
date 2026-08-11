import json
import re
from pathlib import Path

from bs4 import BeautifulSoup, Comment, Doctype, NavigableString, Tag

ROOT = Path(__file__).resolve().parent.parent
MIRROR = ROOT / 'mirror'
SITE = MIRROR / 'www.orchardocd.org'
API = MIRROR / 'api'
OUT = ROOT / 'web' / 'src' / 'seed' / 'content.json'

UTILITY_SLUGS = {
    'account-details', 'checkout', 'dashboard', 'edit-account', 'files', 'logout',
    'my-account', 'my-files', 'my-pages', 'pages', 'payment-accepted',
    'payment-rejected', 'payments', 'ocd-survey', 'orchard-ocd-college',
}

CHROME_SELECTORS = [
    'script', 'style', 'noscript', 'form',
    '#respond', '#comments', '.comments-area', '.comment-respond', '.comment-form',
    '#share', '.socialshare-and-readmore', '.share-buttons',
    '.pagination', '.nav-links', '.wp-pagenavi', '.page-numbers',
    '.screen-reader-text', '.elementor-screen-only',
]

JUNK_TEXT = re.compile(
    r'^(share on:?|#respond|#comments|leave a reply|cancel reply|page \d+ of \d+|'
    r'[\d\s.,»«]+|last »|» last|facebook|twitter|linkedin|read more|'
    r'your email address will not be published.*)$',
    re.I,
)

JUNK_SUBSTRINGS = re.compile(
    r'window\.mc4wp|mailchimp for wordpress|window\.option_df_|function\s*\(\s*\)\s*\{|'
    r'save my name, email, and website|required fields are marked',
    re.I,
)

SENTENCE_END = re.compile(r'[.!?:;”"\')\]]\s*$|<\/(?:strong|em|a)>\s*$')

DOC_EXT = re.compile(r'\.(pdf|docx?|pptx?|xlsx?)($|\?)', re.I)

VALID_HREF = re.compile(r'^(https?://|mailto:|tel:|/|#)', re.I)

images_seen = {}
documents_seen = {}
alt_index = {}


def read_text(path):
    with open(path, encoding='utf-8', errors='replace') as handle:
        return handle.read()


def read_soup(path):
    return BeautifulSoup(read_text(path), 'html.parser')


def load_api(name):
    items = {}
    for f in sorted(API.glob(f'{name}*.json')):
        try:
            with open(f, encoding='utf-8') as handle:
                data = json.load(handle)
        except json.JSONDecodeError:
            continue
        if isinstance(data, list):
            for it in data:
                items[it['id']] = it
    return sorted(items.values(), key=lambda x: x['id'])


def strip_size_suffix(url):
    return re.sub(r'-\d+x\d+(?=\.\w+$)', '', url)


def local_upload_path(url):
    m = re.search(r'wp-content/uploads/(.+)$', url)
    if not m:
        return None
    return 'uploads/' + m.group(1).split('?')[0]


def mirror_file(url):
    rel = re.sub(r'^https?://(?:www\.)?orchardocd\.org/', '', url).split('?')[0]
    p = SITE / rel
    return p if p.exists() and p.stat().st_size > 0 else None


def register_image(url, alt=''):
    if not url:
        return None
    url = strip_size_suffix(url.split('?')[0].replace('\\/', '/'))
    key = local_upload_path(url)
    if not key:
        return None
    f = mirror_file(url)
    if f is None:
        return None
    entry = images_seen.setdefault(
        key, {'id': key, 'url': url, 'file': str(f.relative_to(MIRROR)), 'alt': ''}
    )
    alt = (alt or '').strip()
    if alt and not entry['alt']:
        entry['alt'] = alt
    return key


def register_document(url):
    url = url.split('?')[0].replace('\\/', '/')
    key = local_upload_path(url)
    if not key:
        return None
    f = mirror_file(url)
    if f is None:
        return None
    documents_seen.setdefault(key, {'id': key, 'url': url, 'file': str(f.relative_to(MIRROR))})
    return key


def clean_text(s):
    return re.sub(r'\s+', ' ', s).strip()


def strip_tags(html_str):
    if '<' not in html_str:
        return clean_text(html_str)
    return clean_text(BeautifulSoup(html_str, 'html.parser').get_text(' ', strip=True))


def is_junk(text):
    plain = strip_tags(text)
    if not plain:
        return True
    if JUNK_SUBSTRINGS.search(plain):
        return True
    return bool(JUNK_TEXT.match(plain))


def strip_chrome(el):
    for node in el.find_all(string=lambda s: isinstance(s, (Comment, Doctype))):
        node.extract()
    for selector in CHROME_SELECTORS:
        for match in el.select(selector):
            match.decompose()
    return el


def inline_html(el):
    parts = []
    for node in el.children:
        if isinstance(node, (Comment, Doctype)):
            continue
        if isinstance(node, NavigableString):
            parts.append(str(node))
        elif isinstance(node, Tag):
            if node.name in ('script', 'style', 'noscript'):
                continue
            if node.name == 'br':
                parts.append('<br>')
            elif node.name == 'a' and node.get('href'):
                href = re.sub(r'\s+', '', node['href'])
                inner = inline_html(node)
                if not inner:
                    continue
                dead_document = (
                    DOC_EXT.search(href) and local_upload_path(href) and not register_document(href)
                )
                if dead_document or not VALID_HREF.match(href) or '"' in href:
                    parts.append(inner)
                else:
                    parts.append(f'<a href="{href}">{inner}</a>')
            elif node.name in ('strong', 'b'):
                parts.append(f'<strong>{inline_html(node)}</strong>')
            elif node.name in ('em', 'i'):
                parts.append(f'<em>{inline_html(node)}</em>')
            elif node.name in ('sub', 'sup', 'u'):
                parts.append(f'<{node.name}>{inline_html(node)}</{node.name}>')
            elif node.name == 'img':
                continue
            else:
                parts.append(inline_html(node))
    out = re.sub(r'\s+', ' ', ''.join(parts))
    out = re.sub(r'(<br>\s*){3,}', '<br><br>', out)
    return out.strip()


def split_paragraphs(html_str):
    """Split on <br> only where the preceding run reads as a finished sentence."""
    if not html_str:
        return []
    chunks = re.split(r'(?:<br>\s*)+', html_str)
    paragraphs = []
    current = ''
    breaks = re.findall(r'(?:<br>\s*)+', html_str)
    for index, chunk in enumerate(chunks):
        chunk = chunk.strip()
        if not chunk:
            continue
        joiner = breaks[index - 1] if 0 < index <= len(breaks) else ''
        double_break = joiner.count('<br>') > 1
        if not current:
            current = chunk
        elif double_break or SENTENCE_END.search(current):
            paragraphs.append(current)
            current = chunk
        else:
            current = f'{current} {chunk}'
    if current:
        paragraphs.append(current)
    return [p for p in paragraphs if not is_junk(p)]


def para_blocks(container):
    blocks = []
    pending = []

    def flush():
        if pending:
            for para in split_paragraphs(' '.join(pending)):
                blocks.append({'type': 'paragraph', 'html': para})
            pending.clear()

    for node in container.children:
        if isinstance(node, (Comment, Doctype)):
            continue
        if isinstance(node, NavigableString):
            text = clean_text(str(node))
            if text:
                pending.append(text)
            continue
        if not isinstance(node, Tag):
            continue
        if node.name in ('script', 'style', 'noscript'):
            continue
        if node.name == 'br':
            pending.append('<br>')
            continue
        if node.name in ('a', 'strong', 'em', 'b', 'i', 'span', 'small', 'sub', 'sup', 'u'):
            wrapper = BeautifulSoup(f'<x>{node}</x>', 'html.parser').x
            html = inline_html(wrapper)
            if html:
                pending.append(html)
            continue
        if node.name == 'p':
            flush()
            for para in split_paragraphs(inline_html(node)):
                blocks.append({'type': 'paragraph', 'html': para})
            for img in node.find_all('img'):
                key = register_image(img.get('src'), img.get('alt'))
                if key:
                    blocks.append({'type': 'image', 'image': key})
        elif node.name in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            flush()
            blocks.extend(heading_blocks(node))
        elif node.name in ('ul', 'ol'):
            flush()
            items = [inline_html(li) for li in node.find_all('li', recursive=False)]
            items = [i for i in items if i and not is_junk(i)]
            if items:
                blocks.append({'type': 'list', 'ordered': node.name == 'ol', 'items': items})
        elif node.name == 'blockquote':
            flush()
            html = inline_html(node)
            if html and not is_junk(html):
                blocks.append({'type': 'quote', 'html': html})
        elif node.name == 'table':
            flush()
            rows = [
                [clean_text(td.get_text(' ', strip=True)) for td in tr.find_all(['td', 'th'])]
                for tr in node.find_all('tr')
            ]
            rows = [r for r in rows if any(c for c in r)]
            if rows:
                blocks.append({'type': 'table', 'rows': rows})
        elif node.name == 'img':
            flush()
            key = register_image(node.get('src'), node.get('alt'))
            if key:
                blocks.append({'type': 'image', 'image': key})
        elif node.name == 'iframe':
            flush()
            src = node.get('src') or node.get('data-src')
            if src:
                blocks.append({'type': 'embed', 'url': src})
        else:
            flush()
            blocks.extend(para_blocks(node))
    flush()
    return blocks


def heading_blocks(node):
    """Elementor uses heading widgets for body copy; keep only true headings as headings."""
    html = inline_html(node)
    if not html or is_junk(html):
        return []
    text = clean_text(BeautifulSoup(html, 'html.parser').get_text(' ', strip=True))
    level = int(node.name[1]) if re.match(r'^h[1-6]$', node.name or '') else 2
    if len(text) > 110 or '<a href' in html or '<br>' in html:
        return [{'type': 'paragraph', 'html': para} for para in split_paragraphs(html)]
    return [{'type': 'heading', 'level': level, 'text': text}]


def widget_type(widget):
    for c in widget.get('class', []):
        m = re.match(r'elementor-widget-([a-z0-9-]+)$', c)
        if m and m.group(1) != 'container':
            return m.group(1)
    return None


def video_url(widget):
    ds = widget.get('data-settings', '')
    m = re.search(r'"(?:youtube_url|vimeo_url|url)":"([^"]+)"', ds)
    if m:
        return m.group(1).replace('\\/', '/')
    iframe = widget.find('iframe')
    if iframe and iframe.get('src'):
        return iframe['src']
    return None


def modal_blocks(container):
    body = container.find(class_=re.compile('modal-element-body'))
    if body is None:
        return None
    blocks = []
    title = container.find(class_=re.compile('modal-element-title|modal-title'))
    if title:
        text = clean_text(title.get_text(' ', strip=True))
        if text:
            blocks.append({'type': 'heading', 'level': 3, 'text': text})
    for img in container.find_all('img'):
        key = register_image(img.get('src'), img.get('alt'))
        if key:
            blocks.append({'type': 'image', 'image': key})
    blocks.extend(para_blocks(body))
    return blocks


def widget_blocks(widget, wtype):
    container = widget.find(class_='elementor-widget-container') or widget
    strip_chrome(container)

    modal = modal_blocks(container)
    if modal is not None:
        return modal

    if wtype == 'heading':
        h = container.find(re.compile('^h[1-6]$')) or container.find(class_='elementor-heading-title')
        return heading_blocks(h) if h else []
    if wtype == 'text-editor':
        return para_blocks(container)
    if wtype in ('image', 'theme-post-featured-image'):
        img = container.find('img')
        if not img:
            return []
        key = register_image(img.get('src'), img.get('alt'))
        if not key:
            return []
        block = {'type': 'image', 'image': key}
        cap = container.find('figcaption')
        if cap:
            block['caption'] = clean_text(cap.get_text(' ', strip=True))
        link = img.find_parent('a')
        if link and link.get('href'):
            href = link['href']
            if DOC_EXT.search(href):
                register_document(href)
            block['href'] = href
        return [block]
    if wtype == 'video':
        url = video_url(widget)
        return [{'type': 'video', 'url': url}] if url else []
    if wtype == 'button':
        a = container.find('a')
        if not a:
            return []
        label = clean_text(a.get_text(' ', strip=True))
        href = a.get('href', '')
        if DOC_EXT.search(href):
            register_document(href)
        return [{'type': 'button', 'label': label, 'href': href}] if label else []
    if wtype == 'icon-list':
        items = []
        for li in container.find_all('li'):
            html = inline_html(li)
            if html and not is_junk(html):
                items.append(html)
        return [{'type': 'list', 'ordered': False, 'items': items}] if items else []
    if wtype in ('icon-box', 'image-box'):
        blocks = []
        title = container.find(class_=re.compile('(icon|image)-box-title'))
        desc = container.find(class_=re.compile('(icon|image)-box-description'))
        if title:
            blocks.extend(heading_blocks(title))
        if desc:
            blocks.extend(para_blocks(desc))
        return blocks
    if wtype in ('toggle', 'accordion'):
        blocks = []
        titles = container.find_all(class_=re.compile('(toggle|accordion)-title'))
        bodies = container.find_all(class_=re.compile('(toggle|accordion)-content'))
        for t, b in zip(titles, bodies):
            blocks.append({
                'type': 'accordion-item',
                'title': clean_text(t.get_text(' ', strip=True)),
                'blocks': para_blocks(b),
            })
        return blocks
    if wtype == 'testimonial':
        quote = container.find(class_=re.compile('testimonial-content'))
        if not quote:
            return []
        block = {'type': 'quote', 'html': inline_html(quote)}
        cite = container.find(class_=re.compile('testimonial-name'))
        if cite:
            block['cite'] = clean_text(cite.get_text(' ', strip=True))
        return [block]
    if wtype in ('image-carousel', 'image-gallery', 'gallery', 'media-carousel'):
        blocks = []
        for img in container.find_all('img'):
            key = register_image(img.get('src'), img.get('alt'))
            if key:
                blocks.append({'type': 'image', 'image': key})
        return blocks
    if wtype in ('html', 'shortcode'):
        blocks = []
        for iframe in container.find_all('iframe'):
            src = iframe.get('src') or iframe.get('data-src')
            if src:
                blocks.append({'type': 'embed', 'url': src})
        for v in container.find_all(class_='elementor-widget-video'):
            url = video_url(v)
            if url:
                blocks.append({'type': 'video', 'url': url})
        return blocks or para_blocks(container)
    return None


def register_embedded_documents(html_str):
    for href in re.findall(r'https?:[^"\'\\ ]*?\.(?:pdf|docx?|pptx?|xlsx?)', html_str.replace('\\/', '/'), re.I):
        register_document(href)


def elementor_blocks(html_str):
    register_embedded_documents(html_str)
    for url in re.findall(
        r'url\((?:&quot;|"|\')?(https?://www\.orchardocd\.org/wp-content/uploads/[^)"\'&]+)', html_str
    ):
        register_image(url)
    soup = BeautifulSoup(html_str, 'html.parser')
    root = soup.find(attrs={'data-elementor-type': True}) or soup
    strip_chrome(root)
    blocks = []
    handled = set()
    for widget in root.find_all(class_='elementor-widget'):
        if any(id(a) in handled for a in widget.parents):
            continue
        wtype = widget_type(widget)
        if wtype is None:
            continue
        result = widget_blocks(widget, wtype)
        if result is None:
            continue
        handled.add(id(widget))
        blocks.extend(result)
    if not blocks:
        blocks = para_blocks(root)
    merged = []
    for b in blocks:
        if merged and b == merged[-1]:
            continue
        merged.append(b)
    return merged


def media_index():
    index = {}
    for m in load_api('media'):
        src = m.get('source_url')
        if src:
            index[m['id']] = (src, strip_tags(m.get('alt_text') or ''))
    return index


MEDIA = {}


def featured_image(item):
    fid = item.get('featured_media')
    if fid and fid in MEDIA:
        src, alt = MEDIA[fid]
        key = register_image(src, alt)
        if key:
            return key
    y = item.get('yoast_head_json') or {}
    for og in y.get('og_image') or []:
        if og.get('url'):
            key = register_image(og['url'])
            if key:
                return key
    return None


def yoast_description(item):
    y = item.get('yoast_head_json') or {}
    return y.get('og_description') or y.get('description') or ''


def extract_hero(slug):
    f = SITE / 'index.html' if slug == 'home' else SITE / slug / 'index.html'
    if not f.exists():
        return []
    soup = read_soup(f)
    banner = soup.find(class_=re.compile(r'banner-section'))
    if not banner:
        return []
    slides = []
    for details in banner.find_all(class_='banner-content-details'):
        strip_chrome(details)
        heading = details.find(['h1', 'h2', 'h3'])
        title = clean_text(heading.get_text(' ', strip=True)) if heading else ''
        if not title:
            continue
        if heading:
            heading.extract()
        links = []
        for a in details.find_all('a'):
            label = clean_text(a.get_text(' ', strip=True))
            if label:
                links.append({'label': label, 'href': a.get('href', '')})
            a.extract()
        body = [b['html'] for b in para_blocks(details) if b['type'] == 'paragraph']
        scope = details.parent
        image = None
        if scope:
            img = scope.select_one('img.desk-bnr') or scope.find('img')
            if img:
                image = register_image(img.get('src'), img.get('alt'))
        slide = {'title': title, 'body': body, 'links': links}
        if image:
            slide['image'] = image
        slides.append(slide)
    return slides


def extract_pages():
    pages = []
    for p in load_api('pages'):
        slug = p['slug']
        if slug in UTILITY_SLUGS or p.get('status') != 'publish':
            continue
        pages.append({
            'slug': slug,
            'title': strip_tags(p['title']['rendered']),
            'description': yoast_description(p),
            'featuredImage': featured_image(p),
            'hero': extract_hero(slug),
            'blocks': elementor_blocks(p['content']['rendered']),
        })
    return pages


def post_byline(soup):
    banner = soup.find(class_=re.compile('single-post-banner'))
    if banner:
        m = re.search(r'[Bb]y\s+([A-Z][\w.\'-]+(?:\s+[A-Z][\w.\'-]+){0,3})', banner.get_text(' ', strip=True))
        if m:
            return m.group(1)
    return None


def extract_posts(categories):
    posts = []
    for p in load_api('posts'):
        if p.get('status') != 'publish':
            continue
        slug = p['slug']
        page_file = SITE / slug / 'index.html'
        byline = None
        if page_file.exists():
            soup = read_soup(page_file)
            byline = post_byline(soup)
            scope = soup.find(class_='ocd-single-post')
            blocks = elementor_blocks(str(scope)) if scope else elementor_blocks(p['content']['rendered'])
        else:
            blocks = elementor_blocks(p['content']['rendered'])
        posts.append({
            'slug': slug,
            'title': strip_tags(p['title']['rendered']),
            'date': p['date'],
            'categories': [categories[c] for c in p.get('categories', []) if c in categories],
            'description': yoast_description(p),
            'featuredImage': featured_image(p),
            'byline': byline,
            'blocks': blocks,
        })
    return posts


def extract_studies():
    return [
        {
            'slug': s['slug'],
            'title': strip_tags(s['title']['rendered']),
            'date': s['date'],
            'description': yoast_description(s),
            'featuredImage': featured_image(s),
            'blocks': elementor_blocks(s['content']['rendered']),
        }
        for s in load_api('p_in_research')
        if s.get('status') == 'publish'
    ]


def extract_research_slides():
    return [
        {
            'slug': s['slug'],
            'title': strip_tags(s['title']['rendered']),
            'image': featured_image(s),
            'blocks': elementor_blocks(s['content']['rendered']),
        }
        for s in load_api('research-slider')
        if s.get('status') == 'publish'
    ]


def extract_speakers():
    speakers = []
    for s in load_api('speakers'):
        if s.get('status') != 'publish':
            continue
        soup = BeautifulSoup(s['content']['rendered'], 'html.parser')
        speakers.append({
            'slug': s['slug'],
            'name': strip_tags(s['title']['rendered']),
            'role': clean_text(soup.get_text(' ', strip=True)),
            'photo': featured_image(s),
        })
    return speakers


def carousel_heading(card):
    carousel = card.find_parent(class_=re.compile('owl-carousel'))
    if carousel is None:
        return None
    for prev in carousel.find_all_previous(class_='elementor-widget-heading'):
        text = clean_text(prev.get_text(' ', strip=True))
        if text:
            return text
    return None


CARD_CLASS = re.compile(
    r'aboutorchardteam-details|scientificadvisory-details|supporters-details|'
    r'volunteers-details|team-details'
)


def extract_people():
    people = {}
    order_counter = {}

    for d in sorted((SITE / 'employees').iterdir()):
        f = d / 'index.html'
        if not f.exists():
            continue
        soup = read_soup(f)
        entry = strip_chrome(soup.find(class_='entry') or soup)
        name_el = entry.find('h2') or soup.find('h2')
        name = clean_text(name_el.get_text(' ', strip=True)) if name_el else d.name
        if name_el:
            name_el.extract()
        people[d.name] = {
            'slug': d.name, 'name': name, 'bio': para_blocks(entry),
            'photo': None, 'excerpt': '', 'website': None, 'group': None, 'order': 0,
        }

    for page_file in SITE.rglob('index.html'):
        text = read_text(page_file)
        if '/employees/' not in text:
            continue
        soup = BeautifulSoup(text, 'html.parser')
        for card in soup.find_all(class_=CARD_CLASS):
            link = card.find('a', class_='modal-link') or card.find('a', href=re.compile('/employees/'))
            if not link:
                continue
            m = re.search(r'/employees/([^/]+)/?', link.get('href', ''))
            if not m:
                continue
            slug = m.group(1)
            person = people.get(slug)
            if person is None:
                h = card.find(['h3', 'h4'])
                person = {
                    'slug': slug, 'name': clean_text(h.get_text(' ', strip=True)) if h else slug,
                    'bio': [], 'photo': None, 'excerpt': '', 'website': None, 'group': None, 'order': 0,
                }
                people[slug] = person
            img = card.find('img')
            if img and not person['photo']:
                person['photo'] = register_image(img.get('src'), img.get('alt') or person['name'])
            p = card.find('p')
            if p and not person['excerpt']:
                person['excerpt'] = clean_text(p.get_text(' ', strip=True))
            for a in card.find_all('a', href=True):
                href = a['href']
                if '/employees/' not in href and href.startswith('http') and not person['website']:
                    person['website'] = href
            group = carousel_heading(card)
            if group and not person['group']:
                person['group'] = group
                person['order'] = order_counter.setdefault(group, 0)
                order_counter[group] += 1
    return sorted(people.values(), key=lambda p: (p['group'] or 'zz', p['order']))


def widget_title_near(widget):
    column = widget.find_parent(class_=re.compile('elementor-column|elementor-top-section'))
    if column is not None:
        for sibling in column.find_all(class_=re.compile('elementor-widget-(heading|text-editor)')):
            text = clean_text(sibling.get_text(' ', strip=True))
            if text and text.lower() != 'webinars':
                return text
    for prev in widget.find_all_previous(class_='elementor-widget-heading'):
        text = clean_text(prev.get_text(' ', strip=True))
        if text and text.lower() != 'webinars':
            return text
    return None


def extract_webinars():
    soup = read_soup(SITE / 'webinars' / 'index.html')
    webinars = []
    for widget in soup.find_all(class_='elementor-widget-video'):
        url = video_url(widget)
        if not url:
            continue
        webinars.append({'title': widget_title_near(widget) or 'Webinar', 'url': url})
    return webinars


def extract_conference_speakers():
    names = []
    seen = set()
    for slug in ('conference', 'conference-2'):
        f = SITE / slug / 'index.html'
        if not f.exists():
            continue
        soup = read_soup(f)
        for el in soup.find_all(class_=re.compile('speakers-title')):
            text = clean_text(el.get_text(' ', strip=True))
            if text and text not in seen:
                seen.add(text)
                names.append({'name': text, 'page': slug})
    return names


def harvest_alt_text():
    for page_file in SITE.rglob('*.html'):
        soup = read_soup(page_file)
        for img in soup.find_all('img'):
            alt = (img.get('alt') or '').strip()
            if not alt:
                continue
            src = img.get('src') or ''
            key = local_upload_path(strip_size_suffix(src.split('?')[0]))
            if key and key in images_seen and not images_seen[key]['alt']:
                images_seen[key]['alt'] = clean_text(alt)


def main():
    global MEDIA
    MEDIA = media_index()
    categories = {
        c['id']: strip_tags(c['name'])
        for c in load_api('categories')
    }
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
    harvest_alt_text()
    data['images'] = sorted(images_seen.values(), key=lambda x: x['id'])
    data['documents'] = sorted(documents_seen.values(), key=lambda x: x['id'])

    bad = sorted({
        href
        for href in re.findall(r'href="([^"]*)"', json.dumps(data))
        if not VALID_HREF.match(href) or re.search(r'\s', href)
    })
    if bad:
        raise SystemExit('Invalid hrefs produced:\n  ' + '\n  '.join(bad))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as handle:
        json.dump(data, handle, indent=1, ensure_ascii=False)
    for k, v in data.items():
        print(f'{k}: {len(v)}')
    with_alt = sum(1 for i in data['images'] if i['alt'])
    print(f'images with alt: {with_alt}/{len(data["images"])}')


if __name__ == '__main__':
    main()
