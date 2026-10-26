async function check() {
  const res = await fetch('http://localhost:3000/demo');
  const html = await res.text();
  const cssMatch = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
  console.log('CSS URL:', cssMatch ? cssMatch[1] : 'NONE');
  if (cssMatch) {
    const cssRes = await fetch('http://localhost:3000' + cssMatch[1]);
    const css = await cssRes.text();
    console.log('CSS Status:', cssRes.status, 'Length:', css.length);
    console.log('First 500 chars of CSS:');
    console.log(css.substring(0, 500));
    console.log('Last 500 chars of CSS:');
    console.log(css.substring(css.length - 500));
    console.log('Does CSS have .bg-\\[\\#FAFAF8\\] or #fafaf8?', css.includes('fafaf8'));
    console.log('Does CSS have .bg-\\[\\#081F2D\\] or #081f2d?', css.includes('081f2d'));
    console.log('Does CSS have .border?', css.includes('.border'));
    console.log('Does CSS have .rounded?', css.includes('.rounded'));
    console.log('Does CSS have .grid?', css.includes('.grid'));
  }
}
check();
