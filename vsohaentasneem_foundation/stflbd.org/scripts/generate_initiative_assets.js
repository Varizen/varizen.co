const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, '../public/media');
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

// 1. GrihostiOS Native Emblem SVG
const grihostiosSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#0D3B2E"/>
  <!-- Field Parcel Lines & Agriculture Geometry -->
  <path d="M40 140 L100 80 L160 140 Z" fill="#C85A32" opacity="0.9"/>
  <path d="M100 80 L140 120 L100 160 L60 120 Z" fill="#F6F4EE" opacity="0.95"/>
  <circle cx="100" cy="120" r="16" fill="#0D3B2E"/>
  <!-- Crop Share / Tenure Lines -->
  <path d="M40 140 L160 140" stroke="#F6F4EE" stroke-width="4" stroke-linecap="round"/>
  <path d="M70 120 L130 120" stroke="#0D3B2E" stroke-width="2" stroke-linecap="round"/>
  <path d="M100 60 L100 80" stroke="#C85A32" stroke-width="5" stroke-linecap="round"/>
  <circle cx="100" cy="52" r="6" fill="#F6F4EE"/>
</svg>
`;

// 2. SkillConnect Native Emblem SVG
const skillconnectSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#1E1B4B"/>
  <!-- Interlocking Skill Nexus & Mobility Loop -->
  <circle cx="75" cy="85" r="32" stroke="#3B82F6" stroke-width="8" fill="none"/>
  <circle cx="125" cy="115" r="32" stroke="#F59E0B" stroke-width="8" fill="none"/>
  <path d="M96 66 L144 114" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="10" fill="#38BDF8"/>
</svg>
`;

// 3. AEV Developments Native Emblem SVG
const aevSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#0F2942"/>
  <!-- Architectural Isometric Building Geometry -->
  <path d="M100 45 L155 75 L155 135 L100 165 L45 135 L45 75 Z" stroke="#E2E8F0" stroke-width="6" fill="#0B1F33"/>
  <path d="M100 45 L100 165" stroke="#B47A46" stroke-width="5"/>
  <path d="M45 75 L100 105 L155 75" stroke="#E2E8F0" stroke-width="5"/>
  <path d="M45 135 L100 105 L155 135" stroke="#B47A46" stroke-width="3" opacity="0.6"/>
</svg>
`;

// 4. MaxRemit Native Emblem SVG
const maxremitSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#064E3B"/>
  <!-- Cross-Border Flow Ribbon & Exchange Rail -->
  <path d="M50 115 C50 75, 95 65, 120 65 L145 65" stroke="#10B981" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M130 50 L150 65 L130 80" fill="#10B981"/>
  <path d="M150 85 C150 125, 105 135, 80 135 L55 135" stroke="#D97706" stroke-width="8" stroke-linecap="round" fill="none"/>
  <path d="M70 120 L50 135 L70 150" fill="#D97706"/>
</svg>
`;

// 5. Helpex Native Emblem SVG
const helpexSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#0B132B"/>
  <!-- Collateral Security Shield & Custody Vault -->
  <path d="M100 45 L150 68 V110 C150 142 128 162 100 170 C72 162 50 142 50 110 V68 Z" fill="#1C2541" stroke="#48CAE4" stroke-width="6"/>
  <circle cx="100" cy="105" r="18" fill="#FFD166"/>
  <path d="M100 95 V115" stroke="#0B132B" stroke-width="4" stroke-linecap="round"/>
</svg>
`;

// 6. Perlu Native Emblem SVG
const perluSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#065F46"/>
  <!-- Vernacular Commerce Basket & Circular Device Loop -->
  <circle cx="100" cy="100" r="50" stroke="#34D399" stroke-width="8" stroke-dasharray="16 8" fill="none"/>
  <path d="M75 100 L95 120 L135 78" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="100" cy="48" r="8" fill="#4C1D95"/>
  <circle cx="100" cy="152" r="8" fill="#4C1D95"/>
</svg>
`;

// 7. OIIX Native Emblem SVG
const oiixSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="32" fill="#190B38"/>
  <!-- Community Video Lens Knot -->
  <circle cx="78" cy="100" r="36" stroke="#FF4365" stroke-width="8" fill="none"/>
  <circle cx="122" cy="100" r="36" stroke="#7928CA" stroke-width="8" fill="none"/>
  <circle cx="100" cy="100" r="14" fill="#FFFFFF"/>
</svg>
`;

fs.writeFileSync(path.join(mediaDir, 'grihostios-logo.svg'), grihostiosSvg.trim());
fs.writeFileSync(path.join(mediaDir, 'skillconnect-logo.svg'), skillconnectSvg.trim());
fs.writeFileSync(path.join(mediaDir, 'aev-logo.svg'), aevSvg.trim());
fs.writeFileSync(path.join(mediaDir, 'maxremit-logo.svg'), maxremitSvg.trim());
fs.writeFileSync(path.join(mediaDir, 'helpex-logo.svg'), helpexSvg.trim());
fs.writeFileSync(path.join(mediaDir, 'perlu-logo.svg'), perluSvg.trim());
fs.writeFileSync(path.join(mediaDir, 'oiix-logo.svg'), oiixSvg.trim());

console.log('Successfully generated all initiative SVG assets in public/media!');
