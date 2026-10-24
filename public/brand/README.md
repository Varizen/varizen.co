# Verified brand assets

These files are generated from the supplied native assets in `brandsystem/01_RECOMMENDED_USE`. The source files are never overwritten. `npm run brand:optimize` removes excess background and generates PNG/WebP derivatives without redrawing, stretching or changing logo geometry.

- Horizontal color for light navigation.
- Horizontal white for dark navigation and footer.
- Stacked variants reserved for compact/centered contexts.
- The favicon is cropped from the native symbol within the supplied horizontal artwork.

The color source contains visible white shapes within its letter counters; those are preserved. An SVG master would improve small-size rendering if supplied by the brand owner. Retain at least half a logo-height of clear space. Use the alt text `Varizen logo`.
