"""Build the faculty draft and standalone IT-onboarding HTML from the public archive.
Run from this folder: python build.py. Requires beautifulsoup4 and Pillow.
Public web data is not an HR appointment record; verify before provisioning.
"""
from pathlib import Path
from urllib.parse import urlparse, unquote
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
from PIL import Image
from datetime import datetime, timezone
import base64, csv, io, json, re, unicodedata

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
OUT = HERE / "source"
DOMAIN = "samcbbd.email"
GENERATED = datetime.now(timezone.utc).isoformat(timespec="seconds")
SOURCE_RETRIEVED = "2026-10-24"
# Add only HR-verified personal numbers here, keyed by exact source name.
PHONE_OVERRIDES = {}
NAME_PREFIXES = {"prof", "professor", "dr"}
CONVENTIONAL_PREFIXES = {"md", "mohammad", "mohammed", "muhammad", "muhammed"}


def normalized_url(url):
    p = urlparse(url or "")
    return unquote(p.path).lower()


def words(name):
    clean = re.sub(r"^(?:(?:Prof|Professor|Dr)\.?\s+)+", "", name.strip(), flags=re.I)
    return [p for p in re.split(r"[\s\-]+", clean) if p and p.lower().rstrip(".") not in NAME_PREFIXES]


def naming(name):
    parts = words(name)
    given = [p for p in parts if p.lower().rstrip(".") not in CONVENTIONAL_PREFIXES] or parts
    first, last = given[0], given[-1]
    def letters(value):
        return "".join(c for c in unicodedata.normalize("NFKD", value) if c.isascii() and c.isalpha())
    a, b = letters(first).upper(), letters(last).upper()
    return first, last, (a[:1] + b[:1] or "XX"), letters(first).lower(), letters(last).lower()


def media_records():
    result = []
    try:
        for page in (1, 2, 3):
            url = f"https://www.samcb.edu.bd/wp-json/wp/v2/media?per_page=100&page={page}&_fields=id,date,modified,source_url,link,alt_text,caption"
            req = Request(url, headers={"User-Agent": "Mozilla/5.0 (SAMCB directory research)"})
            with urlopen(req, timeout=45) as response:
                batch = json.load(response)
            result.extend(batch)
            if len(batch) < 100:
                break
    except Exception as error:
        print("Using archived media metadata; live media refresh failed:", error)
        result = json.loads((ROOT / "website/metadata/media.json").read_text(encoding="utf-8"))
    OUT.mkdir(exist_ok=True)
    (OUT / "media-metadata.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result


def thumbnail(path):
    if not path:
        return ""
    try:
        image = Image.open(ROOT / path).convert("RGB")
        image.thumbnail((144, 144))
        buffer = io.BytesIO()
        image.save(buffer, "JPEG", quality=78, optimize=True)
        return "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")
    except Exception as error:
        print("Thumbnail unavailable:", path, error)
        return ""


def build():
    posts = json.loads((ROOT / "website/metadata/posts.json").read_text(encoding="utf-8"))
    media = media_records()
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    local = {normalized_url(x["url"]): x["path"] for x in manifest["resources"] if x.get("path") and x["type"] == "media"}
    by_id = {x.get("id"): x for x in media if x.get("id")}
    by_url = {}
    for item in media:
        by_url.setdefault(normalized_url(item.get("source_url", "")), []).append(item)
    records, departments, unresolved = [], set(), []
    used_ids, used_emails = {}, {}
    for post in posts:
        if post["link"].rstrip("/").endswith(("/home", "/about", "/faculties", "/office-contacts", "/notices", "/examinationresult", "/photo-gallery", "/campus", "/studentnotice")):
            continue
        soup = BeautifulSoup(post["content"]["rendered"], "html.parser")
        for row in soup.select("tr"):
            cells = row.select("td")
            strong = [x.get_text(" ", strip=True) for x in cells[-1].select("strong")] if cells else []
            if len(strong) < 3 or not strong[2].lower().startswith("dept"):
                continue
            name, designation = strong[0], strong[1]
            department = re.sub(r"^Dept\.?\s+of\s+", "", strong[2], flags=re.I).strip()
            departments.add(department)
            first, last, initials, first_ascii, last_ascii = naming(name)
            image = row.select_one("img")
            image_url = image.get("src", "") if image else ""
            generic = not image_url or bool(re.search(r"/(?:male|female)-icon\.", image_url, re.I))
            attachment = re.search(r"wp-image-(\d+)", " ".join(image.get("class", [])) if image else "")
            candidates = by_url.get(normalized_url(image_url), [])
            match_method = "portrait URL"
            if not candidates and attachment and int(attachment.group(1)) in by_id:
                candidates, match_method = [by_id[int(attachment.group(1))]], "WordPress attachment ID"
            item = max(candidates, key=lambda x: x.get("date") or x.get("published") or "") if candidates else {}
            photo_date = (item.get("date") or item.get("published") or "")[:10] or None
            if generic:
                item, photo_date, match_method = {}, None, "generic placeholder or no portrait"
            elif not photo_date:
                unresolved.append({"name": name, "image_url": image_url, "attachment": attachment.group(1) if attachment else None})
            date_id = photo_date.replace("-", "") if photo_date else "00000000"
            base_id = f"{initials}{date_id}"
            suffix = used_ids.get(base_id, 0)
            used_ids[base_id] = suffix + 1
            person_id = f"{base_id}-{suffix}"
            email_base = f"dr.{last_ascii}.{first_ascii}"
            email_suffix = used_emails.get(email_base, 0)
            used_emails[email_base] = email_suffix + 1
            email = email_base + (f".{email_suffix}" if email_suffix else "") + "@" + DOMAIN
            local_photo = None if generic else local.get(normalized_url(image_url))
            records.append({
                "person_id": person_id, "name": name, "first_name": first, "last_name": last,
                "department": department, "designation": designation,
                "designation_reference_date": photo_date,
                "designation_date_basis": "Current individual portrait upload date; requested proxy, NOT an appointment or designation-effective date" if photo_date else "No dated individual portrait found; HR must supply the reference date",
                "date_status": "photo-date proxy" if photo_date else "date pending",
                "joining_date": "", "proposed_email": email,
                "phone": PHONE_OVERRIDES.get(name, ""), "phone_status": "HR-verified override" if name in PHONE_OVERRIDES else "No individual public number found",
                "photo_url": None if generic else image_url,
                "photo_page": item.get("link") or (None if generic else image_url),
                "photo_modified": (item.get("modified") or "")[:10] or None,
                "photo_match": match_method, "photo_identity_verified": False,
                "thumbnail": thumbnail(local_photo), "local_photo": local_photo,
                "faculty_source": post["link"], "faculty_page_modified": post["modified"],
                "source_retrieved": SOURCE_RETRIEVED,
                "verification_status": "DRAFT: latest designation in archived official faculty table; HR verification required",
                "email_status": "Proposed only; IT must verify domain, uniqueness, and create the account",
                "account_created": False
            })
    records.sort(key=lambda x: (x["department"].lower(), x["name"].lower()))
    payload = {
        "schema": "samcb-faculty-directory-draft-1", "generated": GENERATED,
        "source_retrieved": SOURCE_RETRIEVED, "email_domain": DOMAIN,
        "date_policy": "Photo upload dates are reference proxies, not verified joining or designation-effective dates. 00000000 means the date is pending.",
        "email_policy": "dr.lastname.firstname@samcbbd.email; numerical suffix if needed. Addresses are proposed, not confirmed mailboxes.",
        "password_policy": {"default_included": False, "must_change_after_first_login": True, "note": "See the separately controlled IT handover for the requested default. IT should issue unique credentials securely and enforce reset. No account is created by this dataset."},
        "phone_policy": "Blank means no individual public number was found. The general office number is not assigned to faculty.",
        "social_photo_policy": "No social photo was used to infer identity or appointment dates; public social data was insufficient for reliable person-level matching.",
        "departments": sorted(departments), "records": [{k: v for k, v in x.items() if k != "thumbnail"} for x in records]
    }
    (HERE / "faculty.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    fields = ["person_id", "name", "first_name", "last_name", "department", "designation", "designation_reference_date", "designation_date_basis", "date_status", "joining_date", "proposed_email", "email_status", "phone", "phone_status", "photo_url", "photo_page", "photo_match", "photo_identity_verified", "faculty_source", "faculty_page_modified", "source_retrieved", "verification_status", "account_created"]
    with (HERE / "faculty.csv").open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(records)
    template = HERE / "source/template.html"
    if template.exists():
        html = template.read_text(encoding="utf-8").replace("__FACULTY_DATA__", json.dumps(records, ensure_ascii=False).replace("</", "<\\/")).replace("__DEPARTMENTS__", json.dumps(sorted(departments), ensure_ascii=False)).replace("__GENERATED__", GENERATED)
        (HERE / "index.html").write_text(html, encoding="utf-8")
    print(json.dumps({"faculty": len(records), "departments": len(departments), "dated_portraits": sum(bool(x["designation_reference_date"]) for x in records), "pending_dates": sum(not x["designation_reference_date"] for x in records), "unresolved_photo_metadata": unresolved, "duplicate_id_bases": {k: v for k, v in used_ids.items() if v > 1}, "duplicate_email_bases": {k: v for k, v in used_emails.items() if v > 1}}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    build()
