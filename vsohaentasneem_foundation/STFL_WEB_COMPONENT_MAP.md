# STFL Web Component & Primitive Architecture Map
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Component Root:** `main/web/components/stfl/index.tsx` & `main/web/components/`  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Design System Primitives (`components/stfl/index.tsx`)

| Component Primitive | Category | Responsibilities & Variants |
|---|---|---|
| `STFLContainer` | Layout | Enforces `max-w-[1440px]`, responsive horizontal padding (`px-4 sm:px-6 lg:px-8`). |
| `STFLSection` | Layout | Section container with variant backgrounds (`white`, `snow`, `dark`, `stone`) and responsive vertical padding. |
| `STFLCard` | Surface | Surface container with variant borders, elevations, and hover treatments (`default`, `elevated`, `outlined`). |
| `STFLButton` | Interaction | Button primitive supporting `primary` (Dark `#081F2D`), `action` (Orange `#FF6B35`), `secondary` (Outlined), and `ghost`. Supports Iconoir slots. |
| `STFLLink` | Interaction | Accessible Next.js `Link` wrapper with hover micro-animations and external URL handling. |
| `STFLTabs` | Interaction | Horizontal segment tablist, keyboard arrow navigation, active indicator. |
| `STFLBadge` | Feedback | Small status chip (`default`, `success`, `warning`, `danger`, `info`). |
| `STFLStatus` | Feedback | Dot + label status indicator for operational nodes (`active`, `pending`, `held`, `revoked`). |
| `STFLMetric` | Data Display | Large tabular numerical callout with label, unit, and source attribution note. |
| `STFLDataTable` | Data Display | Dense, responsive tabular data table with sticky headers and zebra striping. |
| `STFLFormField` | Input | Form field container with label, helper text, error state, and accessible `aria-invalid` bindings. |
| `STFLDialog` | Overlay | Accessible modal dialog with focus trapping and backdrop dismissal. |
| `STFLDrawer` | Overlay | Slide-out mobile or contextual panel for navigation and side-inspections. |
| `STFLToast` | Feedback | Floating ephemeral notification for system feedback (success, error, copy actions). |
| `STFLBreadcrumb` | Navigation | Hierarchical route trail with schema.org breadcrumb markup. |
| `STFLLanguageSwitcher` | Internationalization | Interactive EN/বাংলা toggle button with local storage persistence. |
| `STFLProjectSwitcher` | Multi-Tenant | Contextual dropdown to switch active project scopes in management consoles. |
| `STFLDocumentPreview` | Document | Formal institutional document layout with metadata rail, signature block, and hash seal. |
| `STFLVerificationPanel` | Verification | Interactive cryptographic lookup card with status badges and field-level disclosures. |
| `STFLIcon` | Iconography | Standardized Iconoir wrapper ensuring consistent sizing and stroke scales. |

---

## 2. Global Layout Components

### `components/Navigation.tsx`
- **Sticky Header:** `sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E7E7E2]`.
- **Approved Logo Lockup:** Official transparent mark with responsive institutional title and platform subtitle.
- **Bilingual Dropdowns:**
  - **About:** About Us, Mission & Vision, Leadership & Team, Annual Reports.
  - **Programs:** Education, Healthcare, Community Development, Emergency Relief.
  - **Get Involved:** Donate, Volunteer, Partner, Careers.
- **Top-Level Direct Links:** Impact (`/impact`), Projects (`/projects`), News (`/news`), Verify (`/verify`), Brand (`/brand`), Contact (`/contact`).
- **Interactive Language Switcher:** Instant, zero-reload switching between English and Bengali.
- **Accessible Mobile Drawer:** Complete menu structure with slide-out drawer, touch targets >= 44px, and keyboard trap.

### `components/Footer.tsx`
- **Institutional Identity:** Full legal name "SohaelTasneem Foundation" with Bengali equivalent.
- **6-Column Structured Sitemap:**
  1. About STFL
  2. Programs
  3. Get Involved
  4. Resources & Media
  5. Governance & Legal
  6. Verified Contact (STFL House, 173 E Ullan Road, Rampura, Dhaka 1217 | `hi@stflbd.email` | `+88018410506411`).
- **Canonical Domain Badge:** Verified lockup indicating `https://stflbd.app`.
- **Creative Attribution:** "Made with love from Dhaka, Kuala Lumpur, Wyoming & Varizen Inc." (contextually placed in footer bottom).
