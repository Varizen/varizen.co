#!/usr/bin/env node
/**
 * STFL Portfolio Validator
 *
 * Read-only. Never mutates production. Never deploys.
 *
 * Usage:
 *   node tools/validate-portfolio.mjs
 *   node tools/validate-portfolio.mjs --hashes
 *   node tools/validate-portfolio.mjs --workspaces
 *   node tools/validate-portfolio.mjs --all
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TOOL_DIR, "..");

const args = new Set(process.argv.slice(2));
const runAll = args.has("--all") || args.size === 0;
const checkHashes = runAll || args.has("--hashes");
const checkWorkspaces = runAll || args.has("--workspaces");

let errors = 0;
let warnings = 0;

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const blue = (s) => `\x1b[34m${s}\x1b[0m`;

function fail(msg) {
  console.error(red(`[FAIL] ${msg}`));
  errors++;
}

function warn(msg) {
  console.warn(yellow(`[WARN] ${msg}`));
  warnings++;
}

function ok(msg) {
  console.log(green(`[PASS] ${msg}`));
}

function info(msg) {
  console.log(blue(`[INFO] ${msg}`));
}

function readJson(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    fail(`missing file: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (e) {
    fail(`invalid JSON in ${relPath}: ${e.message}`);
    return null;
  }
}

function sha256(absPath) {
  return crypto.createHash("sha256").update(fs.readFileSync(absPath)).digest("hex");
}

// Registry hashes were produced by PowerShell Get-FileHash (uppercase hex).
// Compare case-insensitively so either producer is accepted.
const sameHash = (a, b) => String(a).toLowerCase() === String(b).toLowerCase();

// ---------------------------------------------------------------------------
// 1. Registry JSON validity
// ---------------------------------------------------------------------------
function validateRegistries() {
  info("Validating registry JSON...");

  const registries = [
    "portfolio/registry/projects.json",
    "portfolio/registry/assets.json",
    "portfolio/registry/domains.json",
    "portfolio/registry/deployments.json",
    "portfolio/registry/technologies.json",
    "portfolio/.control/pre-reorganization-baseline.json",
    "portfolio/.control/production-dependency-map.json",
    "brandcenter/registry/assets.json",
  ];

  for (const rel of registries) {
    const data = readJson(rel);
    if (data) ok(`${rel} parses`);
  }

  const projects = readJson("portfolio/registry/projects.json");
  if (projects) {
    if (!Array.isArray(projects.projects) || projects.projects.length === 0) {
      fail("projects.json has no projects array");
    } else {
      ok(`projects.json contains ${projects.projects.length} projects`);
      const slugs = new Set();
      for (const p of projects.projects) {
        if (!p.project_slug) fail(`project missing project_slug: ${JSON.stringify(p).slice(0, 80)}`);
        if (slugs.has(p.project_slug)) fail(`duplicate project_slug: ${p.project_slug}`);
        slugs.add(p.project_slug);
        if (!p.project_id) fail(`project ${p.project_slug} missing project_id`);
      }
    }
  }

  const assets = readJson("brandcenter/registry/assets.json");
  if (assets) {
    if (!Array.isArray(assets.assets) || assets.assets.length === 0) {
      fail("assets.json has no assets array");
    } else {
      ok(`assets.json contains ${assets.assets.length} assets`);
      const ids = new Set();
      for (const a of assets.assets) {
        if (!a.asset_id) fail(`asset missing asset_id: ${a.canonical_location}`);
        if (ids.has(a.asset_id)) fail(`duplicate asset_id: ${a.asset_id}`);
        ids.add(a.asset_id);
        if (!a.sha256) fail(`asset ${a.asset_id} missing sha256`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Asset hash verification
// ---------------------------------------------------------------------------
function validateHashes() {
  info("Verifying asset hashes against production originals...");

  const assets = readJson("brandcenter/registry/assets.json");
  if (!assets || !Array.isArray(assets.assets)) return;

  let verified = 0;
  let missing = 0;

  for (const a of assets.assets) {
    const canonicalAbs = path.join(ROOT, a.canonical_location);
    if (!fs.existsSync(canonicalAbs)) {
      fail(`canonical copy missing: ${a.canonical_location}`);
      missing++;
      continue;
    }

    const canonicalHash = sha256(canonicalAbs);
    if (!sameHash(canonicalHash, a.sha256)) {
      fail(`canonical hash mismatch: ${a.canonical_location}`);
      continue;
    }

    if (a.production_source) {
      const sourceAbs = path.join(ROOT, a.production_source);
      if (!fs.existsSync(sourceAbs)) {
        warn(`production source missing (may be intentional): ${a.production_source}`);
        continue;
      }
      const sourceHash = sha256(sourceAbs);
      if (!sameHash(sourceHash, a.sha256)) {
        fail(`production source hash mismatch: ${a.production_source}`);
        continue;
      }
    }

    verified++;
  }

  if (missing === 0) {
    ok(`${verified} assets verified byte-identical to their production originals`);
  }
}

// ---------------------------------------------------------------------------
// 3. Project workspace completeness
// ---------------------------------------------------------------------------
function validateWorkspaces() {
  info("Validating project workspaces...");

  const projects = readJson("portfolio/registry/projects.json");
  if (!projects || !Array.isArray(projects.projects)) return;

  const requiredFiles = ["README.md", "PROJECT_PROFILE.md", "STATUS.md", "ARCHITECTURE.md"];
  const requiredDirs = ["ASSETS", "DOCS", "DESIGN", "INTEGRATIONS", "ARCHIVE"];

  for (const p of projects.projects) {
    const dir = path.join(ROOT, "projects", p.project_slug);
    if (!fs.existsSync(dir)) {
      fail(`workspace missing: projects/${p.project_slug}/`);
      continue;
    }
    for (const f of requiredFiles) {
      if (!fs.existsSync(path.join(dir, f))) {
        fail(`projects/${p.project_slug}/${f} missing`);
      }
    }
    for (const d of requiredDirs) {
      if (!fs.existsSync(path.join(dir, d))) {
        fail(`projects/${p.project_slug}/${d}/ missing`);
      }
    }
  }

  ok(`${projects.projects.length} project workspaces checked`);
}

// ---------------------------------------------------------------------------
// 4. Production invariants
// ---------------------------------------------------------------------------
function validateInvariants() {
  info("Validating production invariants...");

  const checks = [
    {
      file: "main/core/src/main/kotlin/foundation/sohaeltasneem/core/brand/Brand.kt",
      patterns: [
        'FOUNDATION_URL = "https://stflbd.org"',
        'APP_URL = "https://stflbd.app"',
        'API_BASE_URL = "https://stflbd.app/api/v1"',
      ],
    },
    {
      file: "main/api/wrangler.toml",
      patterns: [
        'name = "stfl-api"',
        'id = "a2f247fbc4914040adc3c78befb6bb7a"',
        'bucket_name = "stfl-media"',
        'binding = "HYPERDRIVE"',
      ],
    },
    {
      file: "main/web/wrangler.toml",
      patterns: ['name = "stfl-web"', 'pattern = "stflbd.app/*"'],
    },
    {
      file: "stflbd.org/wrangler.toml",
      patterns: ['name = "stfl-foundation-web"', 'pattern = "stflbd.org"'],
    },
    {
      file: "main/app/build.gradle.kts",
      patterns: ['applicationId = "foundation.sohaeltasneem.app"'],
    },
  ];

  for (const check of checks) {
    const abs = path.join(ROOT, check.file);
    if (!fs.existsSync(abs)) {
      fail(`invariant file missing: ${check.file}`);
      continue;
    }
    const content = fs.readFileSync(abs, "utf8");
    for (const pattern of check.patterns) {
      if (!content.includes(pattern)) {
        fail(`${check.file} no longer contains: ${pattern}`);
      }
    }
  }

  ok("production invariants intact");
}

// ---------------------------------------------------------------------------
// 5. Secret leakage
// ---------------------------------------------------------------------------
function validateNoSecrets() {
  info("Checking for secret leakage in portfolio files...");

  const secretPatterns = [
    /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /sk_live_[A-Za-z0-9]{16,}/,
    /AKIA[0-9A-Z]{16}/,
    /postgres:\/\/[^\s"']*:[^\s"'@]+@/,
  ];

  const scanRoots = ["portfolio", "brandcenter", "projects", "docs", "tools", "stfl-main"];
  let scanned = 0;

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(md|json|mjs|js|txt|yml|yaml)$/.test(entry.name)) {
        scanned++;
        const content = fs.readFileSync(full, "utf8");
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            fail(`possible secret in ${path.relative(ROOT, full)}`);
          }
        }
      }
    }
  }

  for (const r of scanRoots) walk(path.join(ROOT, r));
  ok(`${scanned} portfolio files scanned, no secrets found`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------
console.log(blue("\n=== STFL PORTFOLIO VALIDATION ===\n"));

validateRegistries();
if (checkHashes) validateHashes();
if (checkWorkspaces) validateWorkspaces();
validateInvariants();
validateNoSecrets();

console.log("");
if (errors > 0) {
  console.error(red(`[FAILED] ${errors} error(s), ${warnings} warning(s)`));
  process.exit(1);
}
console.log(green(`[PASSED] 0 errors, ${warnings} warning(s)`));
process.exit(0);
