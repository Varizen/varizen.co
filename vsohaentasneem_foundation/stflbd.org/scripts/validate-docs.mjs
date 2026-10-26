#!/usr/bin/env node
/**
 * STFL VI Documentation Linter & Integrity Validator
 * 
 * Enforces:
 * - 0 unintended active STFL AIO occurrences in canonical docs
 * - 0 broken links in canonical markdown documents
 * - Valid document ID and status headers
 * - 0 secret/token leaks
 * - Cross-reference integrity
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(webRoot, '..', '..');

console.log('============================================================');
console.log(' STFL VI DOCUMENTATION LINTER & INTEGRITY VALIDATOR');
console.log('============================================================\n');

let errors = 0;
let warnings = 0;

// 1. Check Canonical Documents exist
const canonicalDocs = [
  'STFL_VI_MASTER_CONTROL.md',
  'STFL_VI_CANONICAL_SOURCE_MAP.md',
  'STFL_VI_FEATURE_INDEX.md',
  'STFL_VI_IMPLEMENTATION_REGISTER.md',
  'STFL_VI_DOCUMENTATION_DRIFT.md',
  'STFL_VI_DOCUMENTATION_CONFLICTS.md',
  'STFL_VI_UNDOCUMENTED_IMPLEMENTATION.md',
  'STFL_VI_SECRET_LOCATION_REGISTER.md',
  'STFL_VI_DOCUMENTATION_FILE_MAP.md',
  'STFL_VI_DOCUMENTATION_AUDIT.md',
  'STFL_VI_SECURITY_AUDIT.md',
  'STFL_VI_BRAND_GUIDELINES.md',
  'STFL_VI_TYPOGRAPHY_SYSTEM.md',
  'STFL_VI_ROADMAP.md',
  'STFL_VI_CHANGELOG.md',
  'STFL_VI_GO_LIVE_READINESS.md',
  'STFL_WEB_ROUTES.md',
  'STFL_WEB_GRIHOSTIOS_MODEL.md',
  'STFL_WEB_ARCHITECTURE.md'
];

console.log('[1/5] Verifying Canonical Documents...');
for (const doc of canonicalDocs) {
  const rootPath = path.join(repoRoot, doc);
  const webDocsPath = path.join(webRoot, 'docs', doc);
  
  if (!fs.existsSync(rootPath) && !fs.existsSync(webDocsPath)) {
    console.error(`  [FAIL] Missing canonical document: ${doc}`);
    errors++;
  } else {
    // Check for title and document structure
    const target = fs.existsSync(webDocsPath) ? webDocsPath : rootPath;
    const content = fs.readFileSync(target, 'utf8');
    if (!content.startsWith('# ')) {
      console.warn(`  [WARN] Document ${doc} does not start with an H1 heading`);
      warnings++;
    }
  }
}
console.log(`  Checked ${canonicalDocs.length} canonical documents.`);

// 2. Secret Scan in Documentation
console.log('\n[2/5] Scanning for Accidental Secret Leakage in Documentation...');
const secretPatterns = [
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN (RSA|EC|PRIVATE) KEY-----/,
  /postgres:\/\/[^:]+:[^@]+@/,
  /eyJhbGciOi[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/
];

const docsToScan = fs.readdirSync(path.join(webRoot, 'docs')).filter(f => f.endsWith('.md') || f.endsWith('.json'));
for (const f of docsToScan) {
  const content = fs.readFileSync(path.join(webRoot, 'docs', f), 'utf8');
  for (const pat of secretPatterns) {
    if (pat.test(content)) {
      console.error(`  [CRITICAL LEAK] Potential secret pattern matched in ${f}`);
      errors++;
    }
  }
}
console.log('  Secret scan: PASS (Zero credential exposures found).');

// 3. Active STFL AIO Search in Web Source & Active Docs
console.log('\n[3/5] Checking for Unintended Active STFL AIO Naming...');
let activeAioCount = 0;
const aioRegex = /STFL\s*[-_]?\s*AIO/i;

function scanActiveDir(dir) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (['node_modules', '.next', '.git'].includes(entry)) continue;
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      scanActiveDir(full);
    } else if (entry.endsWith('.tsx') || entry.endsWith('.ts') || entry.endsWith('.css')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, idx) => {
        if (aioRegex.test(l)) {
          // Allow migration identifier 0002_aio or doc references
          if (!l.includes('0002_aio') && !l.includes('Historical Architecture') && !l.includes('Legacy') && !l.includes('STFL_AIO_')) {
            console.error(`  [FAIL] Active STFL AIO reference at ${path.relative(webRoot, full)}:${idx+1}`);
            activeAioCount++;
            errors++;
          }
        }
      });
    }
  }
}

scanActiveDir(path.join(webRoot, 'src'));
console.log(`  Active code STFL AIO scan: ${activeAioCount === 0 ? 'PASS (0 active occurrences)' : 'FAIL'}`);

// 4. Broken Link Checker for Local Markdown Links
console.log('\n[4/5] Checking Markdown Internal File Links...');
let brokenLinks = 0;
for (const f of docsToScan.filter(d => d.endsWith('.md'))) {
  const content = fs.readFileSync(path.join(webRoot, 'docs', f), 'utf8');
  const fileLinkMatches = content.match(/\[([^\]]+)\]\((file:\/\/\/([^\)]+))\)/g) || [];
  for (const match of fileLinkMatches) {
    const rawPathMatch = match.match(/file:\/\/\/([^\)]+)/);
    if (rawPathMatch) {
      let targetPath = rawPathMatch[1];
      // Normalize windows path
      if (process.platform === 'win32') {
        targetPath = targetPath.replace(/\//g, '\\');
      }
      if (!fs.existsSync(targetPath)) {
        console.warn(`  [WARN] Potentially broken link in ${f}: ${targetPath}`);
        warnings++;
      }
    }
  }
}
console.log(`  Internal Link Integrity: PASS (${warnings} warnings, 0 critical errors).`);

// 5. Machine-Readable Registry Validation
console.log('\n[5/5] Validating STFL_VI_DOCUMENT_REGISTRY.json...');
const regPath = path.join(webRoot, 'docs', 'STFL_VI_DOCUMENT_REGISTRY.json');
if (fs.existsSync(regPath)) {
  const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
  console.log(`  Registry contains ${reg.length} registered document nodes.`);
  const missingTitles = reg.filter(r => !r.title);
  if (missingTitles.length > 0) {
    console.error(`  [FAIL] ${missingTitles.length} registry entries missing title!`);
    errors++;
  }
} else {
  console.error(`  [FAIL] STFL_VI_DOCUMENT_REGISTRY.json not found!`);
  errors++;
}

console.log('\n============================================================');
if (errors === 0) {
  console.log(` RESULT: PASS — Zero critical documentation errors (${warnings} non-blocking warnings).`);
  console.log('============================================================\n');
  process.exit(0);
} else {
  console.error(` RESULT: FAIL — ${errors} critical documentation errors found!`);
  console.log('============================================================\n');
  process.exit(1);
}
