async function check() {
  const res = await fetch('http://localhost:3000/demo');
  const html = await res.text();
  const cssMatch = html.match(/href="(\/_next\/static\/css\/[^"]+)"/);
  if (cssMatch) {
    const cssRes = await fetch('http://localhost:3000' + cssMatch[1]);
    const css = await cssRes.text();
    const tests = [
      '1600px',
      'grid-cols-6',
      'FF6B35',
      'ff6b35',
      '081f2d',
      '081F2D',
      '0B2B43',
      '0b2b43',
      'fafaf8',
      'FAFAF8',
      'amber-500',
      'stone-700',
      'max-w',
      'sticky'
    ];
    for (const t of tests) {
      console.log(`css includes "${t}":`, css.includes(t));
    }
  }
}
check();
