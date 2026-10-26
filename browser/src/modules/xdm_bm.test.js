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
  assert.equal(list.length, 5);
  assert.deepEqual(list.map((item) => item.title), ['Varizen Trust', 'GitHub', 'DuckDuckGo', 'Hacker News', 'Ko-fi']);

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

test('bookmarks: default list includes Hacker News and Ko-fi', () => {
  const list = bookmarks.list();
  const titles = list.map((item) => item.title);
  assert.ok(titles.includes('Hacker News'), 'Hacker News must be in default bookmarks');
  assert.ok(titles.includes('Ko-fi'), 'Ko-fi must be in default bookmarks');
  const hn = list.find((item) => item.title === 'Hacker News');
  assert.equal(hn.url, 'https://news.ycombinator.com');
  const kofi = list.find((item) => item.title === 'Ko-fi');
  assert.equal(kofi.url, 'https://ko-fi.com/varizen');
});

test('bookmarks: saved data is loaded without stripping defaults', () => {
  const migrationDir = path.join(testDir, 'migration');
  fs.mkdirSync(migrationDir, { recursive: true });
  fs.writeFileSync(path.join(migrationDir, 'bookmarks.json'), JSON.stringify([
    { id: 'legacy', title: 'Hacker News', url: 'https://news.ycombinator.com', bar: true },
    { id: 'keep', title: 'GitHub', url: 'https://github.com', bar: true }
  ]));
  bookmarks.init(migrationDir);
  assert.deepEqual(bookmarks.list().map((item) => item.title), ['Hacker News', 'GitHub']);
  bookmarks.init(testDir);
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
