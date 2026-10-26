# Localization

**Authority:** CANONICAL
**Version:** 1.0 · 2026-10-18

---

## 1. Language policy

| Language | Role | Code |
|---|---|---|
| Bangla (বাংলা) | Primary institutional language | `bn` |
| English | Secondary, operational and international | `en` |

Both are first-class. Neither is a translation afterthought.

---

## 2. Bilingual rules

| Rule | Detail |
|---|---|
| Bangla first | In public institutional content, Bangla leads |
| English parallel | English is a full parallel version, not a summary |
| No machine translation in production | Human review required |
| No mixed-script sentences | Do not interleave Bangla and Latin script mid-sentence |
| Proper nouns | Keep the registered Latin form for domains, code and legal names |

---

## 3. Typography per language

| Language | Heading | Body |
|---|---|---|
| Bangla | Hind Siliguri | Noto Sans Bengali |
| English | Inter | Inter |

Never render Bangla in Inter. Never render English headings in Hind Siliguri.

See [`typography.md`](./typography.md).

---

## 4. Numerals

| Context | Numeral system |
|---|---|
| Bangla prose | Bangla numerals (০১২৩৪৫৬৭৮৯) preferred |
| Data tables | Latin numerals for alignment, unless the column is prose |
| Code, IDs, domains, dates in metadata | Latin numerals |
| Currency | Latin numerals with the correct symbol |

---

## 5. Dates and times

| Context | Format |
|---|---|
| Bangla prose | Bangla month names |
| Metadata, registry, code | ISO 8601 (`2026-10-18`) |
| Time zone | Asia/Dhaka (UTC+6) |

---

## 6. Institutional names

| Form | Value |
|---|---|
| Bangla | সোহেল তাসনীম ফাউন্ডেশন |
| Latin canonical | SohaelTasneem Foundation |
| Abbreviation | STFL |

---

## 7. Layout

| Requirement | Detail |
|---|---|
| Bangla line height | 1.7–1.8 for body (taller than Latin) |
| Bangla text expansion | Allow 15–25% more vertical space |
| Conjunct rendering | OpenType `liga` and `clig` must stay enabled |
| Truncation | Never truncate Bangla mid-conjunct |

---

## 8. Prohibited

| Prohibited | Reason |
|---|---|
| All-caps Bangla | Bangla has no case; breaks shaping |
| Letter-spacing on Bangla | Breaks conjunct joining |
| Italic Bangla | Not part of the type system |
| Machine translation shipped unreviewed | Quality and dignity risk |
| English-only public institutional pages | Violates the bilingual policy |

---

## 9. Related

- [`typography.md`](./typography.md)
- [`accessibility.md`](./accessibility.md)
- [`brand-governance.md`](./brand-governance.md)