# Brand Assets

Derived from the source logo at the repository root,
`stfl-original-logo.png` (960×768, already transparent). Split into layers so the
film's post-production can composite the mark and the wordmark independently.

| File | Size | Use |
|------|------|-----|
| `stfl-logo-transparent.png` | 941×756 | Full lockup — mark + wordmark. Use for title cards and static end frames. |
| `stfl-mark-transparent.png` | 924×553 | Icon cluster only. **This is the file to cross-dissolve onto the golden loop.** |
| `stfl-wordmark-transparent.png` | 907×144 | Wordmark only, original dark navy. Use on light backgrounds. |
| `stfl-wordmark-cream.png` | 907×144 | Wordmark recoloured cream `#F5F0E6`. Use on dark or saturated backgrounds. |
| `stfl-wordmark-white.png` | 907×144 | Wordmark recoloured pure white. Use on the darkest backgrounds. |

All files are PNG with an alpha channel. No background removal was needed — the
source logo was already transparent.

---

## How the split was made

The source logo has three vertical bands of ink, found by scanning the alpha
channel row by row:

| Band | Rows | Content |
|------|------|---------|
| 1 | 13–565 | Icon cluster |
| 2 | 606–681 | "SOHAELTASNEEM" |
| 3 | 706–749 | "FOUNDATION" |

Bands 2 and 3 together form the wordmark. Each layer was then trimmed to its own
content bounding box.

To regenerate after a logo change, re-run the band scan and re-crop. Do not
hand-crop — the gap between the cluster and the wordmark is only 40 px and easy
to get wrong.

---

## Compositing notes for the film

**Cross-dissolving the mark onto the golden loop (Option C):**

1. Place `stfl-mark-transparent.png` on a layer above the generated footage.
2. Scale it so the cluster's outer diameter matches the golden loop's diameter.
3. Centre it on the loop's centre point.
4. Dissolve from 0:08.0 to 0:08.6.

The loop is circular and centred; the cluster is circular and centred. Matching
both makes the dissolve read as a transformation rather than a cut.

**Wordmark:**

Place `stfl-wordmark-cream.png` or `stfl-wordmark-white.png` beneath the mark,
matching the proportions of the full lockup — in the source, the wordmark's
width is 98.2% of the cluster's width and it sits 40 px below it.

If you prefer live text over the PNG (for sharper scaling), the source wordmark
is a bold geometric sans-serif. `Montserrat` or `Poppins` at heavy weight are
close matches. The brief asks for an elegant serif instead — that is a
deliberate departure, so confirm before committing.

---

## Colour reference

The mark's palette, for matching the film's grade at the reveal:

| Icon | Colour |
|------|--------|
| Magenta (book, star) | `#E6007E` |
| Red (heart, cross, book) | `#E8232A` |
| Orange (spiral, figure) | `#F58220` |
| Lime (hand, leaf) | `#8CC63F` |
| Green (circle, leaf) | `#39B54A` |
| Teal (hand) | `#00A99D` |
| Blue (spiral, star, drop) | `#1B75BC` |
| Purple (hand, cross) | `#7B2D8E` |
| Wordmark navy | `#2B3A4A` |

These are sampled approximations, not official brand values. If the foundation
has a brand guide, use those instead.