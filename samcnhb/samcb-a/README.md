# South Apollo Medical College — public information archive

Collected on **2026-10-24** from the college website and the official social accounts it links to. Original English and Bangla text is retained. No login, private data, or access-control bypass was used.

## Sources

1. [College website](https://www.samcb.edu.bd/)
2. [Official Facebook page](https://www.facebook.com/samcbsl/) — linked in the website footer and office contact page.
3. [Official YouTube channel](https://www.youtube.com/@samcbslbd) — linked by the Facebook page; channel metadata links back to the Facebook page.

No additional social account was explicitly linked by these official sources. This does not prove that no other account exists.

## Contents

- [faculty-directory/index.html](faculty-directory/index.html): searchable department-wise faculty directory, proposed IDs/email aliases, and downloadable new-joiner IT requests. Draft only; HR/IT verification is required.
- [faculty-directory/faculty.csv](faculty-directory/faculty.csv): 71 faculty records with designations, photo-date provenance, IDs, email proposals, phone fields, and source URLs.
- [INDEX.html](INDEX.html): local clickable index of all website pages, files, and source URLs.
- [manifest.json](manifest.json): machine-readable inventory and original source URLs.
- `website/posts/`: all **39** public WordPress posts as readable Markdown, including institution overview, admission information, faculty lists, notices, and results.
- `website/pages/`: both **2** public WordPress pages.
- `website/index.csv`: page/post titles, dates, URLs, and local paths.
- `website/metadata/`: public WordPress source metadata and **173** media records, including available alt text/captions.
- `website/html/`: homepage and complete office-contact page, in HTML and Markdown. These preserve global footer information omitted from individual WordPress post content.
- `website/assets/pdf/`: **27** linked PDF documents; matching `.pdf.txt` files contain extractable text. Some scanned documents may require visual reading or OCR.
- `website/assets/`: downloaded website images, documents, and other public media.
- [social/facebook.md](social/facebook.md): verified profile, contact, transparency, and collection details.
- [social/posts.json](social/posts.json): the single current feed post available without login, with its full text and source links.
- [social/reels.json](social/reels.json): the nine publicly displayed reel thumbnails, URLs, and displayed counts.
- [social/youtube.md](social/youtube.md): channel metadata; no public videos or playlists were available on the collection date.
- `collect_website.py`: repeatable website collection script.

## Important context from the sources

- The website identifies the institution as South Apollo Medical College in Barishal and describes it as the first and only private medical college in the Barishal division.
- Website address: Jagua, Kalijira, Barishal-8206, Barishal, Bangladesh.
- Office hours shown: Saturday to Thursday, 8:30 AM–2:30 PM.
- Office contact: MD. AL AMIN, PA–Principal; +8801324165611 (WhatsApp); samcbsl18@gmail.com.
- Website leadership: Professor Dr. Md. Zahurul Haq (Manik), Chairman, Board of Directors; Professor Dr. Md. Faizul Bashar, Principal.
- The website states approval by the Ministry of Health and Family Welfare and affiliation with the University of Dhaka. These are source claims, not independent verification.
- The website describes a 13-acre campus, separate male/female accommodation, a 250-bed hospital, and a five-year MBBS course followed by a one-year internship. Consult the archived source for full details and current status.

## Coverage and limitations

- This is a dated public-source snapshot, not a guarantee of future completeness or current accuracy.
- Website text and linked downloadable resources were collected through its public WordPress API and public HTML. WordPress theme assets, videos, and externally hosted files were not bulk-downloaded; externally linked resources remain listed by URL.
- Facebook's unauthenticated interface exposed one current feed post and limited profile/reel/photo previews. Its complete historical posts, comments, captions, photos, and reels were unavailable without login and are therefore not included.
- Social follower, play, reaction, comment, share, and review counts are displayed snapshots and can change.
- No social media videos were downloaded. The official YouTube channel reported no public content.
- Content remains attributed to its original publishers. Check with the college before operational, admissions, medical, or financial use.

## Refresh the website archive

From the workspace root, after installing `beautifulsoup4`, `markdownify`, and `pypdf`:

`python samcb-a/collect_website.py`

The social files are manually verified snapshots rather than automated scrapes.
