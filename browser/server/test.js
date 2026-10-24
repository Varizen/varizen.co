// Gateway self-tests. No network required for the policy/keypool assertions.
// Run: node server/test.js
const assert = require('assert');
const { KeyPool, STATES } = require('./keypool');
const policy = require('./policy');

let pass = 0, fail = 0;
function t(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

console.log('\nkeypool');

t('two keys start ACTIVE', () => {
  const p = new KeyPool(['a', 'b']);
  assert.deepStrictEqual(p.status().map((k) => k.state), [STATES.ACTIVE, STATES.ACTIVE]);
});

t('missing key is DISABLED, never used', () => {
  const p = new KeyPool(['a', undefined]);
  assert.strictEqual(p.status()[1].state, STATES.DISABLED);
  assert.strictEqual(p.pick().id, 'KEY-A');
});

t('load balances across healthy keys', () => {
  const p = new KeyPool(['a', 'b']);
  const first = p.pick(); first.inflight++;
  assert.strictEqual(p.pick().id, 'KEY-B');
});

t('429 cools the key down and fails over', () => {
  const p = new KeyPool(['a', 'b']);
  const b = p.keys[1];
  p.markRateLimited(b, 30);
  assert.strictEqual(b.state, STATES.RATE_LIMITED);
  assert.strictEqual(p.pick().id, 'KEY-A');
});

t('cooldown expires and the key returns to the pool', () => {
  const p = new KeyPool(['a', 'b']);
  const b = p.keys[1];
  p.markRateLimited(b, 30);
  b.cooldownUntil = Date.now() - 1;
  assert.strictEqual(p.healthy().length, 2);
});

t('repeated errors mark a key FAILED', () => {
  const p = new KeyPool(['a', 'b']);
  const a = p.keys[0];
  p.markError(a); p.markError(a); p.markError(a);
  assert.strictEqual(a.state, STATES.FAILED);
});

t('success resets failures', () => {
  const p = new KeyPool(['a', 'b']);
  const a = p.keys[0];
  p.markError(a); p.markError(a);
  p.markSuccess(a);
  assert.strictEqual(a.state, STATES.ACTIVE);
  assert.strictEqual(a.failures, 0);
});

t('status never exposes the secret', () => {
  const p = new KeyPool(['sk-or-v1-SECRETVALUE1234', 'sk-or-v1-OTHER5678']);
  const s = JSON.stringify(p.status());
  assert.ok(!s.includes('SECRETVALUE'), 'secret leaked in status()');
  assert.ok(s.includes('1234'), 'masked tail missing');
});

t('disable wipes the secret', () => {
  const p = new KeyPool(['sk-or-v1-SECRETVALUE1234', 'b']);
  p.disable('KEY-A');
  assert.strictEqual(p.keys[0].secret, '');
  assert.strictEqual(p.keys[0].state, STATES.DISABLED);
});

console.log('\npolicy');

t('zero pricing is free', () => {
  assert.ok(policy.isFree({ pricing: { prompt: '0', completion: '0' } }));
});

t('missing pricing is NOT free', () => {
  assert.ok(!policy.isFree({ pricing: {} }));
  assert.ok(!policy.isFree({}));
});

t('any nonzero price is NOT free', () => {
  assert.ok(!policy.isFree({ pricing: { prompt: '0', completion: '0.000001' } }));
  assert.ok(!policy.isFree({ pricing: { prompt: '0.5', completion: '0' } }));
});

t('null/empty pricing is NOT free', () => {
  assert.ok(!policy.isFree({ pricing: { prompt: null, completion: '0' } }));
  assert.ok(!policy.isFree({ pricing: { prompt: '', completion: '0' } }));
});

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
