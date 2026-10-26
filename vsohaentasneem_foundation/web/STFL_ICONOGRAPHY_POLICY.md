# STFL ICONOGRAPHY POLICY

## Authority

The sole authoritative source for STFL interface icons is:

https://iconoir.com/

Implementation for the STFL Next.js web application:

`iconoir-react`

Version is controlled by `package.json` and the lockfile.

---

# 01 — GLOBAL RULE

Every interface icon must originate from Iconoir.

This applies to:

- navigation
- menus
- arrows
- chevrons
- search
- account
- login
- logout
- settings
- notifications
- status indicators
- actions
- forms
- buttons
- cards
- dashboards
- breadcrumbs
- pagination
- dialogs
- tables
- filters
- sorting
- sharing
- downloads
- uploads
- contact
- location
- social/interface controls

---

# 02 — PROHIBITED ICON SOURCES

Do not introduce:

- Lucide
- Lucide React
- Heroicons
- @heroicons/react
- Font Awesome
- @fortawesome/*
- Material Icons
- @mui/icons-material
- Bootstrap Icons
- React Icons
- react-icons/*
- Phosphor
- phosphor-react
- Tabler Icons
- @tabler/icons*
- Remix Icon
- remixicon
- Radix icon packages
- Feather Icons
- Feather React
- Ionicons
- Ant Design icons
- Chakra icon packages
- random SVG icon packs
- Flaticon UI icons
- Noun Project UI icons
- manually drawn interface SVGs

---

# 03 — BRAND ASSETS ARE DIFFERENT

The rule does NOT prohibit:

- STFL logo
- STFL emblem
- official partner logos
- official organization logos
- photographs
- illustrations
- approved campaign artwork

Brand artwork must never be treated as an interface icon.

---

# 04 — NO RANDOM SVG ICONS

Do not create:

```tsx
<svg>...</svg>
```

for ordinary interface icons.

Do not paste SVG code copied from another icon library.

Do not download random SVG icons.

Use the matching Iconoir icon instead.

---

# 05 — ICON STYLE

Default STFL icon treatment:

- Iconoir
- 24 × 24 optical grid
- currentColor
- stroke-based
- stroke width approximately 1.5
- no unnecessary fill
- no arbitrary gradients
- no decorative shadows
- no random colors

Iconoir itself is designed on a 24×24 grid and provides regular and solid variants.

---

# 06 — SIZE

Preferred UI sizes:

16px
18px
20px
24px

Large illustrative UI icons:

32px
40px
48px

Do not scale icons merely to fill empty space.

---

# 07 — COLOR

Icons inherit current text color by default.

Use:

currentColor

Do not hard-code icon colors unless the semantic state requires it.

Examples:

primary
secondary
muted
success
warning
danger

---

# 08 — ICON + TEXT

For buttons containing text:

Icon + text must have deliberate spacing.

Example:

[Icon] Contact

not:

[Icon]    Contact

Use a consistent spacing token.

---

# 09 — ICON SEMANTICS

Choose icons according to their actual meaning.

Do not use an aesthetically similar icon when a semantically correct
Iconoir icon exists.

Search Iconoir first.

---

# 10 — REGULAR VS SOLID

Regular icons are the default.

Solid icons may be used when:

- active state requires stronger emphasis
- selected navigation state requires it
- a semantic filled state is appropriate

Do not mix regular and solid arbitrarily.

Iconoir uses the `-solid` naming convention for solid variants.

---

# 11 — ACCESSIBILITY

Decorative icons:

`aria-hidden="true"`

Meaningful standalone icons:

must have an accessible label.

Do not rely solely on an icon to communicate critical information
when text can be provided.

---

# 12 — CONSISTENCY

A single interface should not contain:

Iconoir + another icon family.

Even if the icons individually look good, mixing families creates
visual inconsistency.

---

# 13 — FUTURE DEVELOPMENT RULE

Before adding an icon:

1. Search Iconoir.
2. Select the closest semantic icon.
3. Import it from `iconoir-react`.
4. Use the existing STFL icon provider.
5. Do not install another icon package.

---

# 14 — GOVERNANCE

This file is the authoritative STFL web iconography rule.

Any future coding agent must read this rule before modifying interface
icons.

Build verification should fail if prohibited icon libraries are
introduced.

---

# FINAL RULE

If an interface needs an icon:

**Iconoir first.**

If Iconoir contains the appropriate icon:

**Iconoir only.**

Do not create a new icon system.
