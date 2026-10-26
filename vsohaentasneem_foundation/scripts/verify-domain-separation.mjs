/**
 * CI Domain Separation Linter
 * Enforces STFL_DOMAIN_SEPARATION_ARCHITECTURE.md §6.1
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, '..');

let hasErrors = false;

function error(msg) {
  console.error(`\x1b[31m[DOMAIN-LINT ERROR]\x1b[0m ${msg}`);
  hasErrors = true;
}

function info(msg) {
  console.log(`\x1b[34m[DOMAIN-LINT]\x1b[0m ${msg}`);
}

function success(msg) {
  console.log(`\x1b[32m[DOMAIN-LINT PASS]\x1b[0m ${msg}`);
}

function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.open-next', 'build', '.git', '_old'].includes(entry.name)) {
        continue;
      }
      scanDir(fullPath, fileList);
    } else if (entry.isFile() && /\.(tsx?|jsx?|mjs|json|toml)$/.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function checkOrgProject() {
  const orgSrc = path.join(ROOT_DIR, 'stflbd.org', 'src');
  if (!fs.existsSync(orgSrc)) {
    if (fs.existsSync(path.join(ROOT_DIR, 'src', 'app')) && ROOT_DIR.includes('stflbd.org')) {
      checkOrgFiles(path.join(ROOT_DIR, 'src'));
      return;
    }
    return;
  }
  checkOrgFiles(orgSrc);
}

function checkOrgFiles(srcDir) {
  info(`Auditing stflbd.org at ${srcDir}...`);

  // Prohibited directories in stflbd.org
  const prohibitedPaths = [
    path.join(srcDir, 'app', 'download'),
    path.join(srcDir, 'app', 'demo'),
    path.join(srcDir, 'app', 'roadmap'),
    path.join(srcDir, 'app', 'v'),
    path.join(srcDir, 'app', 'verify'),
  ];

  for (const p of prohibitedPaths) {
    if (fs.existsSync(p)) {
      error(`stflbd.org must NOT contain app-only route: ${p}`);
    }
  }

  const files = scanDir(srcDir);
  for (const file of files) {
    const rel = path.relative(srcDir, file);
    if (rel === path.join('lib', 'domains.ts')) continue;
    if (rel === path.join('lib', 'initiativesRegistry.ts')) continue;
    if (rel === path.join('lib', 'api.ts')) continue;

    const content = fs.readFileSync(file, 'utf8');

    // Check for raw canonical or openGraph url resolving to stflbd.app
    if (/(canonical|url):\s*["']https:\/\/stflbd\.app/i.test(content)) {
      error(`stflbd.org file ${rel} declares canonical/openGraph url pointing to stflbd.app`);
    }

    // Check for organisation email using @stflbd.app
    if (/@stflbd\.app/i.test(content) && !/example\.com/.test(content)) {
      error(`stflbd.org file ${rel} uses @stflbd.app email instead of @stflbd.email`);
    }

    // Check for stflbd.org/api or api.stflbd.app
    if (/api\.stflbd\.app|stflbd\.org\/api/i.test(content)) {
      error(`stflbd.org file ${rel} references illegal API origin api.stflbd.app or stflbd.org/api`);
    }
  }

  checkOrgPublicAssets(path.join(srcDir, '..', 'public'));
}

function checkOrgPublicAssets(publicDir) {
  if (!fs.existsSync(publicDir)) return;

  // App-only static artifacts must not be published from the organisation domain.
  const appOnlyAssets = ['roadmap.html'];
  for (const name of appOnlyAssets) {
    if (fs.existsSync(path.join(publicDir, name))) {
      error(`stflbd.org/public must NOT contain app-only asset: ${name}`);
    }
  }

  for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const content = fs.readFileSync(path.join(publicDir, entry.name), 'utf8');
    if (/rel=["']canonical["'][^>]*https:\/\/stflbd\.app/i.test(content)) {
      error(`stflbd.org/public/${entry.name} declares a canonical URL on stflbd.app`);
    }
  }
}

function checkAppProject() {
  const appSrc = path.join(ROOT_DIR, 'main', 'web', 'src');
  if (!fs.existsSync(appSrc)) {
    if (fs.existsSync(path.join(ROOT_DIR, 'src', 'app')) && ROOT_DIR.includes('main')) {
      checkAppFiles(path.join(ROOT_DIR, 'src'));
      return;
    }
    return;
  }
  checkAppFiles(appSrc);
}

function checkAppFiles(srcDir) {
  info(`Auditing main/web (stflbd.app) at ${srcDir}...`);

  // Prohibited foundation & admin routes in app
  const prohibitedPaths = [
    path.join(srcDir, 'app', 'admin'),
    path.join(srcDir, 'app', 'foundation'),
    path.join(srcDir, 'app', 'about'),
    path.join(srcDir, 'app', 'programs'),
    path.join(srcDir, 'app', 'initiatives'),
    path.join(srcDir, 'app', 'donate'),
    path.join(srcDir, 'app', 'brand'),
    path.join(srcDir, 'app', 'brandcenter'),
    path.join(srcDir, 'app', 'login'),
    path.join(srcDir, 'app', 'signup'),
  ];

  for (const p of prohibitedPaths) {
    if (fs.existsSync(p)) {
      error(`main/web (stflbd.app) must NOT contain foundation/admin route: ${p}`);
    }
  }

  const files = scanDir(srcDir);
  for (const file of files) {
    const rel = path.relative(srcDir, file);
    if (rel === path.join('lib', 'domains.ts')) continue;

    const content = fs.readFileSync(file, 'utf8');

    // Check for stflbd.org/api or api.stflbd.app
    if (/api\.stflbd\.app|stflbd\.org\/api/i.test(content)) {
      error(`main/web file ${rel} references illegal API origin api.stflbd.app or stflbd.org/api`);
    }
  }
}

function checkGlobalInvariants() {
  info("Auditing global API and Wrangler route invariants...");
  const apiSrc = path.join(ROOT_DIR, 'main', 'api', 'src');
  if (fs.existsSync(apiSrc)) {
    const files = scanDir(apiSrc);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      if (/api\.stflbd\.app|stflbd\.org\/api/i.test(content)) {
        error(`main/api file ${path.relative(ROOT_DIR, file)} references illegal API origin`);
      }
    }
  }

  // Check wrangler.toml files
  const orgWrangler = path.join(ROOT_DIR, 'stflbd.org', 'wrangler.toml');
  if (fs.existsSync(orgWrangler)) {
    const content = fs.readFileSync(orgWrangler, 'utf8');
    if (/stflbd\.app/i.test(content)) {
      error(`stflbd.org/wrangler.toml must not target stflbd.app routes`);
    }
  }
}

info("Running STFL Domain Separation Linter...");
checkOrgProject();
checkAppProject();
checkGlobalInvariants();

if (hasErrors) {
  console.error("\n\x1b[31m[FAILED]\x1b[0m Domain separation check failed. See errors above.");
  process.exit(1);
} else {
  success("Domain separation verification PASSED cleanly across all workspaces.\n");
  process.exit(0);
}
