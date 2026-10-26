# Faculty directory & IT onboarding

Open **index.html** in a browser. It is self-contained, searchable, printable, and works offline. Portraits are embedded thumbnails; original sources remain linked.

## Records

- **71 named faculty** in **20 departments**, extracted from the archived official faculty pages retrieved 2026-10-24.
- Designation is the latest designation in the archived official faculty table, not a verified current HR appointment.
- `designation_reference_date`: actual WordPress upload date of the current individual portrait when available. It is a user-requested proxy, **not** proof of designation-effective date or joining date.
- 64 records have dated individual portraits. Seven have generic/no portraits and use ID date `00000000`; HR must supply the reference date before issue.
- Portrait association uses the exact image URL, with WordPress attachment ID fallback. No social photo was used for identity or date inference because the available public social data did not support reliable person-level matching.
- `joining_date` is deliberately blank until HR verifies it.

## ID and email convention

- ID: first letter of meaningful first name + first letter of last name + `YYYYMMDD` + `-0`.
- Common prefixes/titles (`Prof.`, `Dr.`, `Md.`, `Mohammad`, `Muhammad`, etc.) are skipped when another meaningful given name exists.
- Three collisions received `-1`: two RR records, two AS records, and two NM records sharing initials/date.
- Email proposal: `dr.lastname.firstname@samcbbd.email`; a numeric suffix would resolve an alias collision.
- Example: Abdur Rahman, joining 2023-12-02 → `AR20231202-0`, `dr.rahman.abdur@samcbbd.email`.
- IDs and aliases are **proposals**, not existing accounts. IT must check the authoritative directory and confirm ownership/configuration of `samcbbd.email`.
- No individual public phone numbers were found. Phone fields are blank rather than filled with the general office number.

## New joiner workflow

1. Open **index.html** → **New joiner / IT request**.
2. Enter HR-approved details and verified joining date.
3. Download the JSON request or copy its summary.
4. Send it through an approved HR/IT channel.
5. IT verifies identity/appointment, approves or edits the ID/email, creates the account, and securely delivers credentials.

The HTML does **not** submit anything to a server, send email, or create an account. To offer a public/internal link, host it on an approved web server. For actual online submission, integrate an authenticated IT ticket/form backend with access control, encryption, validation, audit logging, and retention rules. Browser local storage is not an authoritative HR database.

## Credential policy

Requested temporary default: `NoPass3!`, with mandatory change after first login. It is documented in the IT handover but **not included in exported faculty records or joiner requests**. A shared default is insecure; IT should issue a unique temporary credential through a secure channel and enforce reset/MFA.

## Directory use

- Search or filter by department.
- Open **Evidence** for designation/photo provenance and source links.
- **Review** stores corrections and local HR verification in the current browser. Review again after changing an ID; original record keys remain stable.
- Export filtered or complete CSV/JSON after making changes. Keep controlled backups.
- Clearing site data can remove local edits. Rebuilding replaces the generated baseline, not any separately exported HR database.

## Files

- `index.html`: generated application; distribute this file.
- `faculty.csv`: Excel-compatible, source-linked baseline records without embedded images.
- `faculty.json`: complete baseline, policies, dates, and source provenance.
- `build.py`: reproducible extractor/generator.
- `source/template.html`: HTML/CSS/JavaScript template.
- `source/media-metadata.json`: dated portrait metadata used by the builder.

Rebuild from this folder with `python build.py` (BeautifulSoup and Pillow required). The builder refreshes public media metadata when available and falls back to the archived metadata. It does not automatically refresh the faculty-page archive or social history.
