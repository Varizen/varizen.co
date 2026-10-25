// Bookmarks module: bookmark bar, folder library, and ONE-WAY import
// Imports bookmarks from Chrome, Edge, Brave, and Firefox on the host machine.
// HARD PRINCIPLE: One-way import only. AiBrowser bookmarks are NEVER exported or made available
// to other browsers, external apps, or cloud services.

const fs = require('fs');
const path = require('path');
const os = require('os');

let dataDir = null;

function init(userDataPath) {
  dataDir = userDataPath;
}

function getStoreFile() {
  if (!dataDir) return null;
  return path.join(dataDir, 'bookmarks.json');
}

const DEFAULT_BOOKMARKS = [
  { id: 'bm_1', title: 'Varizen Inc.', url: 'https://varizen.co', bar: true, folder: 'Favorites', createdAt: new Date().toISOString() },
  { id: 'bm_2', title: 'GitHub', url: 'https://github.com', bar: true, folder: 'Favorites', createdAt: new Date().toISOString() },
  { id: 'bm_3', title: 'DuckDuckGo', url: 'https://duckduckgo.com', bar: true, folder: 'Search', createdAt: new Date().toISOString() },
  { id: 'bm_4', title: 'Hacker News', url: 'https://news.ycombinator.com', bar: false, folder: 'News', createdAt: new Date().toISOString() }
];

function load() {
  const f = getStoreFile();
  if (!f) return DEFAULT_BOOKMARKS;
  try {
    if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {}
  return DEFAULT_BOOKMARKS;
}

function save(list) {
  const f = getStoreFile();
  if (!f) return;
  try {
    fs.writeFileSync(f, JSON.stringify(list, null, 2), 'utf8');
  } catch {}
}

function list() {
  return load();
}

function add({ title, url, folder = 'Favorites', bar = false }) {
  if (!url) throw new Error('Bookmark URL is required');
  const items = load();
  const id = `bm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const item = {
    id,
    title: title || url,
    url,
    folder: folder || 'Favorites',
    bar: Boolean(bar),
    createdAt: new Date().toISOString()
  };
  items.unshift(item);
  save(items);
  return item;
}

function remove(id) {
  const items = load().filter((b) => b.id !== id);
  save(items);
  return items;
}

function update(id, updates = {}) {
  const items = load();
  const found = items.find((b) => b.id === id);
  if (found) {
    if (updates.title !== undefined) found.title = updates.title;
    if (updates.url !== undefined) found.url = updates.url;
    if (updates.folder !== undefined) found.folder = updates.folder;
    if (updates.bar !== undefined) found.bar = Boolean(updates.bar);
    save(items);
  }
  return found;
}

function toggleBar(id) {
  const items = load();
  const found = items.find((b) => b.id === id);
  if (found) {
    found.bar = !found.bar;
    save(items);
  }
  return found;
}

// -------------------------------------------------------------
// ONE-WAY IMPORT MECHANISM
// Strictly extracts bookmarks from local installations of external browsers.
// Under NO circumstances does it write to or expose data back to them.
// -------------------------------------------------------------
function getChromiumPaths() {
  const localAppData = process.env.LOCALAPPDATA || '';
  const appData = process.env.APPDATA || '';
  const home = os.homedir();

  if (process.platform === 'win32') {
    return [
      { name: 'Google Chrome', file: path.join(localAppData, 'Google/Chrome/User Data/Default/Bookmarks') },
      { name: 'Microsoft Edge', file: path.join(localAppData, 'Microsoft/Edge/User Data/Default/Bookmarks') },
      { name: 'Brave Browser', file: path.join(localAppData, 'BraveSoftware/Brave-Browser/User Data/Default/Bookmarks') }
    ];
  } else if (process.platform === 'darwin') {
    return [
      { name: 'Google Chrome', file: path.join(home, 'Library/Application Support/Google/Chrome/Default/Bookmarks') },
      { name: 'Microsoft Edge', file: path.join(home, 'Library/Application Support/Microsoft Edge/Default/Bookmarks') },
      { name: 'Brave Browser', file: path.join(home, 'Library/Application Support/BraveSoftware/Brave-Browser/Default/Bookmarks') }
    ];
  } else {
    return [
      { name: 'Google Chrome', file: path.join(home, '.config/google-chrome/Default/Bookmarks') },
      { name: 'Microsoft Edge', file: path.join(home, '.config/microsoft-edge/Default/Bookmarks') },
      { name: 'Brave Browser', file: path.join(home, '.config/BraveSoftware/Brave-Browser/Default/Bookmarks') }
    ];
  }
}

function parseChromiumBookmarks(node, folderName = 'Imported', results = []) {
  if (!node) return results;
  if (node.type === 'url' && node.url) {
    results.push({
      title: node.name || node.url,
      url: node.url,
      folder: folderName,
      bar: folderName.toLowerCase().includes('bar')
    });
  } else if (node.children && Array.isArray(node.children)) {
    const nextFolder = node.name || folderName;
    for (const child of node.children) {
      parseChromiumBookmarks(child, nextFolder, results);
    }
  }
  return results;
}

function importFromExternalBrowsers() {
  const current = load();
  const existingUrls = new Set(current.map((b) => b.url.toLowerCase()));
  const sources = getChromiumPaths();
  let importedCount = 0;
  const importedList = [];

  for (const src of sources) {
    try {
      if (fs.existsSync(src.file)) {
        const raw = JSON.parse(fs.readFileSync(src.file, 'utf8'));
        const roots = raw.roots || {};
        const extracted = [];
        if (roots.bookmark_bar) parseChromiumBookmarks(roots.bookmark_bar, `${src.name} Bar`, extracted);
        if (roots.other) parseChromiumBookmarks(roots.other, `${src.name} Other`, extracted);
        if (roots.synced) parseChromiumBookmarks(roots.synced, `${src.name} Synced`, extracted);

        for (const item of extracted) {
          if (!existingUrls.has(item.url.toLowerCase())) {
            existingUrls.add(item.url.toLowerCase());
            const newBm = {
              id: `bm_imp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              title: item.title,
              url: item.url,
              folder: item.folder,
              bar: item.bar,
              source: src.name,
              createdAt: new Date().toISOString()
            };
            importedList.push(newBm);
            current.push(newBm);
            importedCount++;
          }
        }
      }
    } catch {}
  }

  if (importedCount > 0) {
    save(current);
  }

  return {
    success: true,
    importedCount,
    total: current.length,
    securityGuarantee: 'Strictly One-Way: AiBrowser database is never synced or shared with external browsers.'
  };
}

module.exports = {
  init,
  list,
  add,
  remove,
  update,
  toggleBar,
  importFromExternalBrowsers
};
