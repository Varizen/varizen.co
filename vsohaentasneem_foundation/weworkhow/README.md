# STFL letterhead templates

This folder contains editable A4 letterhead templates in Bangla and English,
with a matching PDF for each language.

- `STFL_Letterhead_Bangla_Reference_Inspired.docx` / `.pdf`
- `STFL_Letterhead_English_Reference_Inspired.docx` / `.pdf`

The reference-inspired edition adapts the supplied corner-ribbon composition
to STFL's approved navy, gold, and tangerine palette. It uses the canonical
dark mark on a light page, preserves generous writing space, and separates the
Bangla and English typography. Bangla uses Hind Siliguri for headings and Noto
Sans Bengali for body text; English uses Inter.

Official contact details shown in the footer are published at
[`stflbd.org/contact`](https://stflbd.org/contact):

- STFL House, 173 E Ullan Road, W Rampura, Dhaka 1217, Bangladesh
- Phone: +88018410506411
- Email: hi@stflbd.email
- Web: stflbd.org

To regenerate the DOCX files, run `build_letterheads.py` with Python and
`python-docx` installed. To embed the fonts in the Word files and export PDFs,
run `embed_letterheads.ps1` on Windows with Microsoft Word installed. Word
registers the approved fonts for the current Windows user.
