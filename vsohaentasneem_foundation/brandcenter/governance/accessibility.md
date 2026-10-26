# Accessibility

**Authority:** CANONICAL
**Version:** 1.0 · 2026-10-18

---

## 1. Target

**WCAG 2.2 Level AA** across every STFL surface.

---

## 2. Contrast

| Requirement | Minimum |
|---|---|
| Body text | 4.5:1 |
| Large text (≥18.66px bold or ≥24px regular) | 3:1 |
| UI components and graphical objects | 3:1 |
| Focus indicator | 3:1 against adjacent colours |

See [`color-system.md`](./color-system.md) §4 for the verified palette pairs.

---

## 3. Focus

| Requirement | Detail |
|---|---|
| Visible focus | Always — never `outline: none` without a replacement |
| Focus ring | `#00D4FF` (neon signal) or `#081F2D`, 2px, 2px offset |
| Focus order | Follows visual order |
| Skip link | Required on every page with navigation |

---

## 4. Motion

| Requirement | Detail |
|---|---|
| `prefers-reduced-motion` | Must be honoured |
| Auto-playing video | Must not autoplay with sound |
| Flashing | Never more than 3 flashes per second |
| Parallax | Disabled under reduced motion |

---

## 5. Text and language

| Requirement | Detail |
|---|---|
| `lang` attribute | `lang="bn"` for Bangla, `lang="en"` for English |
| Mixed-language content | Mark inline language changes |
| Zoom | Usable at 200% without loss of content |
| Reflow | No horizontal scroll at 320 px width |
| Line height | BN body ≥1.7, EN body ≥1.5 |

---

## 6. Images and media

| Requirement | Detail |
|---|---|
| Alt text | Required on every meaningful image |
| Decorative images | `alt=""` and `aria-hidden="true"` |
| Video | Captions required |
| Audio | Transcript required |
| Icons | `aria-hidden="true"` when decorative, `aria-label` when meaningful |

---

## 7. Forms

| Requirement | Detail |
|---|---|
| Labels | Every input has a visible label |
| Errors | Announced, described in text, not colour alone |
| Required fields | Marked in text, not only with an asterisk |
| Autocomplete | Correct `autocomplete` tokens |

---

## 8. Enterprise Workspace

The `/admin/*` consoles are **desktop-first** by constitutional rule. This does not exempt them from accessibility:

| Requirement | Detail |
|---|---|
| Keyboard operable | Every console function reachable by keyboard |
| Data tables | Proper `<th>` scope, caption, and summary |
| Density | High density is permitted; contrast is not |

---

## 9. Verification

| Check | Method |
|---|---|
| Contrast | Computed ratio against the palette |
| Keyboard | Tab through every route |
| Screen reader | NVDA (Windows) / TalkBack (Android) |
| Zoom | 200% browser zoom |
| Reduced motion | OS setting enabled |

---

## 10. Related

- [`color-system.md`](./color-system.md)
- [`typography.md`](./typography.md)
- [`localization.md`](./localization.md)