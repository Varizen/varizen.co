const themeScript = `try{if(localStorage.getItem('vz-theme')==='dark'||(!localStorage.getItem('vz-theme')&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.dataset.theme='dark'}}catch(e){}`;
const organization = { "@context": "https://schema.org", "@type": "Organization", name: "Varizen Inc.", url: "https://varizen.co", email: "hi@varizen.co", address: [{ "@type": "PostalAddress", streetAddress: "1712 Pioneer Ave", addressLocality: "Cheyenne", addressRegion: "WY", addressCountry: "US" }] };
// No nonce: pages are prerendered and served from cache, so a per-request nonce
// would never match the cached markup. CSP allows same-origin inline scripts.
export function RootScripts() { return <><script dangerouslySetInnerHTML={{ __html: themeScript }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} /></>; }
