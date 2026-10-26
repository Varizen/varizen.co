"""Archive public information from https://www.samcb.edu.bd/ (no login required).
Run: python collect_website.py
Requires: beautifulsoup4, markdownify, pypdf
"""
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote, quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError
import csv, hashlib, json, re, time
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "website"
BASE = "https://www.samcb.edu.bd/"
RETRIEVED = time.strftime("%Y-%m-%d")
UA = "Mozilla/5.0 (compatible; SAMCB-Public-Information-Archive/1.0)"
manifest = []


def get(url, binary=False):
    url = quote(url, safe=":/?#[]@!$&'()*+,;=%")
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=60) as response:
        data = response.read()
        return data if binary else data.decode("utf-8", "replace")


def save(url, data, destination, kind="text"):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, str):
        data = data.encode("utf-8")
    destination.write_bytes(data)
    manifest.append({"url": url, "type": kind, "path": str(destination.relative_to(ROOT)), "retrieved": RETRIEVED})


def clean_html(html):
    soup = BeautifulSoup(html or "", "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    return md(str(soup), heading_style="ATX").strip()


def endpoint_items(kind):
    items, page = [], 1
    while True:
        url = f"{BASE}wp-json/wp/v2/{kind}?per_page=100&page={page}"
        try:
            items.extend(json.loads(get(url)))
        except HTTPError as error:
            if error.code == 400 and page > 1:
                break
            raise
        if len(items) < page * 100:
            break
        page += 1
    return items


def asset(url):
    if not url or not url.startswith(("http://", "https://")):
        return
    parsed = urlparse(url)
    if parsed.hostname not in {"samcb.edu.bd", "www.samcb.edu.bd"}:
        manifest.append({"url": url, "type": "external-link", "retrieved": RETRIEVED})
        return
    name = unquote(Path(parsed.path).name) or "file"
    suffix = Path(name).suffix.lower()
    if suffix not in {".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".csv", ".txt"}:
        return
    digest = hashlib.sha1(url.encode()).hexdigest()[:8]
    target = OUT / "assets" / (suffix[1:] or "other") / f"{digest}-{name}"
    if target.exists():
        manifest.append({"url": url, "type": "document" if suffix == ".pdf" else "media", "path": str(target.relative_to(ROOT)), "retrieved": RETRIEVED, "status": "previously-downloaded"})
        return
    try:
        data = get(url, binary=True)
        save(url, data, target, "document" if suffix == ".pdf" else "media")
        if suffix == ".pdf":
            try:
                text = "\n\n".join(f"--- Page {i} ---\n{p.extract_text() or ''}" for i, p in enumerate(PdfReader(target).pages, 1))
                save(url, text, target.with_suffix(target.suffix + ".txt"), "extracted-pdf-text")
            except Exception as error:
                manifest.append({"url": url, "type": "pdf-text-error", "error": str(error)})
    except Exception as error:
        manifest.append({"url": url, "type": "download-error", "error": str(error)})


def main():
    counts, records, urls = {}, [], set()
    for kind in ("posts", "pages"):
        items = endpoint_items(kind)
        counts[kind] = len(items)
        save(f"{BASE}wp-json/wp/v2/{kind}", json.dumps(items, ensure_ascii=False, indent=2), OUT / "metadata" / f"{kind}.json", "api-metadata")
        for item in items:
            url = item.get("link", "")
            slug = urlparse(url).path.strip("/").replace("/", "--") or "home"
            title = clean_html(item.get("title", {}).get("rendered", ""))
            content = item.get("content", {}).get("rendered", "")
            soup = BeautifulSoup(content, "html.parser")
            links = [a.get("href") for a in soup.select("a[href]")]
            images = [{"url": i.get("src"), "alt": i.get("alt", ""), "caption": i.get("title", "")} for i in soup.select("img")]
            urls.update(links + [i["url"] for i in images])
            body = f"# {title}\n\n- Source: {url}\n- Published: {item.get('date', '')}\n- Modified: {item.get('modified', '')}\n- Retrieved: {RETRIEVED}\n\n{clean_html(content)}\n"
            save(url, body, OUT / kind / f"{slug}.md", kind[:-1])
            records.append({"type": kind[:-1], "title": title, "url": url, "published": item.get("date"), "modified": item.get("modified"), "path": f"website/{kind}/{slug}.md"})
    media = endpoint_items("media")
    counts["media"] = len(media)
    media_index = []
    for item in media:
        url = item.get("source_url", "")
        urls.add(url)
        text = clean_html(" ".join(item.get(k, {}).get("rendered", "") for k in ("title", "caption", "description") if isinstance(item.get(k), dict)))
        media_index.append({"url": url, "alt_text": item.get("alt_text", ""), "text": text, "published": item.get("date"), "modified": item.get("modified"), "mime_type": item.get("mime_type")})
    save(f"{BASE}wp-json/wp/v2/media", json.dumps(media_index, ensure_ascii=False, indent=2), OUT / "metadata" / "media.json", "media-metadata")
    for url in [BASE, urljoin(BASE, "office-contacts/")]:
        try:
            html = get(url)
            soup = BeautifulSoup(html, "html.parser")
            urls.update(a.get("href") for a in soup.select("a[href]"))
            name = "home" if url == BASE else "office-contacts-full"
            save(url, html, OUT / "html" / f"{name}.html", "html")
            save(url, clean_html(str(soup)), OUT / "html" / f"{name}.md", "full-page-text")
        except Exception as error:
            manifest.append({"url": url, "type": "fetch-error", "error": str(error)})
    with (OUT / "index.csv").open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)
    for i, url in enumerate(sorted(urls)):
        asset(url)
    from html import escape
    sections = ["<!doctype html><html lang='en'><head><meta charset='utf-8'><title>SAMCB public information archive</title><style>body{font:16px system-ui;max-width:1100px;margin:2rem auto;padding:0 1rem}table{border-collapse:collapse;width:100%}td,th{padding:.5rem;border-bottom:1px solid #ddd;text-align:left}a{word-break:break-word}small{color:#555}</style></head><body>", "<h1>South Apollo Medical College</h1>", f"<p>Public-source archive retrieved {RETRIEVED}. Counts: {counts}.</p><p><a href='website/index.csv'>Website CSV index</a> · <a href='social/facebook.md'>Facebook</a> · <a href='social/youtube.md'>YouTube</a></p>"]
    for title, items in (("Pages and posts", [x for x in manifest if x["type"] in {"post", "page"}]), ("Documents and media", [x for x in manifest if "path" in x and x["type"] in {"document", "media"}]), ("Extracted PDF text", [x for x in manifest if x["type"] == "extracted-pdf-text"]), ("Metadata and full HTML pages", [x for x in manifest if x["type"] in {"api-metadata", "media-metadata", "html", "full-page-text"}]), ("External links", [x for x in manifest if x["type"] == "external-link"])):
        sections.append(f"<h2>{title} ({len(items)})</h2><table><tr><th>Local file / type</th><th>Original source</th></tr>")
        for item in items:
            path = item.get("path")
            local = f"<a href='{quote(path)}'>{escape(Path(path).name)}</a><br><small>{escape(path)}</small>" if path else escape(item["type"])
            sections.append(f"<tr><td>{local}</td><td><a href='{escape(item['url'])}'>{escape(item['url'])}</a></td></tr>")
        sections.append("</table>")
    sections.append("</body></html>")
    save(BASE, "\n".join(sections), ROOT / "INDEX.html", "html-index")
    save(BASE, json.dumps({"source": BASE, "retrieved": RETRIEVED, "counts": counts, "records": records, "resources": manifest}, ensure_ascii=False, indent=2), ROOT / "manifest.json", "manifest")
    print(json.dumps({"counts": counts, "resources": len(manifest), "output": str(ROOT)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
