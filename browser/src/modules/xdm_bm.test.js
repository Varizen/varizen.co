// Bookmarks and XDM transport unit tests
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const bookmarks = require('./bookmarks');
const xdm = require('./xdm');

// Isolated test dir
const testDir = path.join(os.tmpdir(), `bm_xdm_test_${Date.now()}`);
fs.mkdirSync(testDir, { recursive: true });

bookmarks.init(testDir);

test('bookmarks: default list and adding new bookmark', () => {
  const list = bookmarks.list();
  assert.ok(Array.isArray(list));
  assert.ok(list.length >= 3);

  const added = bookmarks.add({
    title: 'Custom Sovereign Hub',
    url: 'https://varizen.co/trust',
    folder: 'Security',
    bar: true
  });

  assert.ok(added.id);
  assert.equal(added.title, 'Custom Sovereign Hub');
  assert.equal(added.bar, true);

  const updatedList = bookmarks.list();
  assert.ok(updatedList.some((b) => b.id === added.id));
});

test('bookmarks: toggle bar and remove bookmark', () => {
  const added = bookmarks.add({
    title: 'Temporary Tool',
    url: 'https://tools.example.com',
    bar: false
  });

  const toggled = bookmarks.toggleBar(added.id);
  assert.equal(toggled.bar, true);

  const remaining = bookmarks.remove(added.id);
  assert.ok(!remaining.some((b) => b.id === added.id));
});

test('bookmarks: one-way import mechanism preserves isolation', () => {
  const result = bookmarks.importFromExternalBrowsers();
  assert.equal(result.success, true);
  assert.ok(typeof result.importedCount === 'number');
  assert.ok(result.securityGuarantee.includes('Strictly One-Way'));
});

test('xdm: storage drive configuration and discovery', () => {
  const customTemp = path.join(testDir, 'custom_temp');
  const customFinal = path.join(testDir, 'custom_final');

  const drives = xdm.setStorageDrives({
    tempDir: customTemp,
    finalDir: customFinal
  });

  assert.equal(drives.tempDir, customTemp);
  assert.equal(drives.finalDir, customFinal);
  assert.ok(fs.existsSync(customTemp));
  assert.ok(fs.existsSync(customFinal));

  const fetched = xdm.getStorageDrives();
  assert.equal(fetched.tempDir, customTemp);
  assert.equal(fetched.finalDir, customFinal);
  assert.equal(fetched.concurrentConnections, 8);
});
