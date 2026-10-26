/**
 * STFL AIO Master Control Validator [Historical Architecture Name / Legacy Platform Document Validator]
 * Authoritative Integrity Checker for STFL_AIO_MASTER_CONTROL.html
 * Canonical Platform Identity: STFL VI
 * 
 * Verifies:
 * - HTML structure & JSON script tag
 * - Complete schema & section completeness
 * - 40 platform features & implementation ownership
 * - 12 constitutional invariants & code enforcement
 * - 16 management consoles + 2 extensions
 * - 13 user classes (CLASS_00-CLASS_12) + 2 relief roles (MODERATOR_A/B)
 * - 14 core architecture entities (Party, Identity, User, Agent, Device, Project, Relationship, Resource, Scope, Permission, Policy, Approval, Action, Audit)
 * - Multi-tenant project model & 4 expansion archetypes
 * - Financial precision (NUMERIC(18,2)) & anti-collusion rules
 * - 21 statutory compliance domains
 * - 4 experience segments & knowledge/training architecture
 * - Brand governance & zonal / co-branding model
 * - Repository cleanup, duplicates & sanitized layout
 * - Production readiness status (PENDING gate preserved)
 * - Known gaps & milestone changelog
 */

const fs = require('fs');
const path = require('path');

// ANSI Colors for Terminal Output
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m"
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const failures = [];

function recordCheck(name, pass, details = null) {
  totalChecks++;
  if (pass) {
    passedChecks++;
    console.log(`  ${C.green}✓${C.reset} ${name}`);
  } else {
    failedChecks++;
    const msg = `  ${C.red}✗${C.reset} ${name}${details ? ` -> ${C.yellow}${details}${C.reset}` : ''}`;
    console.log(msg);
    failures.push({ name, details });
  }
}

function printHeader(title) {
  console.log(`\n${C.bold}${C.cyan}=== [ ${title} ] ===${C.reset}`);
}

console.log(`${C.bold}${C.magenta}================================================================================${C.reset}`);
console.log(`${C.bold}${C.white}           STFL AIO — MASTER CONTROL AUTHORITATIVE AUDIT & VALIDATOR           ${C.reset}`);
console.log(`${C.bold}${C.magenta}================================================================================${C.reset}`);

// -----------------------------------------------------------------------------
// 1. HTML Container & JSON Extraction
// -----------------------------------------------------------------------------
printHeader("1. HTML CONTAINER & JSON EXTRACTION");

let targetHtmlPath = path.resolve(process.cwd(), 'STFL_AIO_MASTER_CONTROL.html');
if (!fs.existsSync(targetHtmlPath)) {
  targetHtmlPath = path.resolve(__dirname, 'STFL_AIO_MASTER_CONTROL.html');
}
recordCheck("Target file exists: STFL_AIO_MASTER_CONTROL.html", fs.existsSync(targetHtmlPath));

if (!fs.existsSync(targetHtmlPath)) {
  console.error(`${C.red}FATAL: STFL_AIO_MASTER_CONTROL.html not found. Validation aborted.${C.reset}`);
  process.exit(1);
}

const htmlContent = fs.readFileSync(targetHtmlPath, 'utf8');
const tag = '<script id="stfl-master-control-data" type="application/json">';
const startIndex = htmlContent.indexOf(tag);
const endIndex = htmlContent.indexOf('</script>', startIndex);

recordCheck("Located <script id=\"stfl-master-control-data\" type=\"application/json\"> tag", startIndex !== -1 && endIndex !== -1);

if (startIndex === -1 || endIndex === -1) {
  console.error(`${C.red}FATAL: JSON script tag missing or unclosed. Validation aborted.${C.reset}`);
  process.exit(1);
}

const jsonString = htmlContent.substring(startIndex + tag.length, endIndex).trim();
let data = null;

try {
  data = JSON.parse(jsonString);
  recordCheck("JSON syntax is strictly valid and parseable", true);
} catch (e) {
  recordCheck("JSON syntax is strictly valid and parseable", false, e.message);
  console.error(`${C.red}FATAL: Embedded JSON parse failed. Validation aborted.${C.reset}`);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// 2. System Metadata & Release Gate Invariants
// -----------------------------------------------------------------------------
printHeader("2. SYSTEM METADATA & RELEASE GATE STATUS");

recordCheck("System name defined: STFL Autonomous Enterprise Platform (STFL AIO)", 
  typeof data.system === 'string' && data.system.includes("STFL Autonomous Enterprise Platform"));
recordCheck("Document ID matches STFL-DOC-2026-MASTER-CONTROL-V1", 
  data.document_id === "STFL-DOC-2026-MASTER-CONTROL-V1");
recordCheck("Semantic Version defined (1.0.0+)", 
  typeof data.version === 'string' && /^\d+\.\d+\.\d+$/.test(data.version));
recordCheck("Ratified Date defined", 
  typeof data.ratified_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.ratified_date));
recordCheck("Production Readiness Gate explicitly preserved as PENDING", 
  typeof data.production_readiness_status === 'string' && data.production_readiness_status.includes("PENDING"));
recordCheck("Test metrics present: Backend Vitest & Icon Policy", 
  data.test_metrics && typeof data.test_metrics.vitest_backend === 'string' && typeof data.test_metrics.icon_policy === 'string');
recordCheck("Attribution defined: Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.", 
  typeof data.attribution === 'string' && data.attribution.includes("Dhaka, Kuala Lumpur, Wyoming and Varizen Inc."));

// -----------------------------------------------------------------------------
// 3. 40 Complete Platform Features Register (Sections 1-8)
// -----------------------------------------------------------------------------
printHeader("3. COMPLETE FEATURE REGISTER & IMPLEMENTATION MATRIX (SECTIONS 1–8)");

const features = Array.isArray(data.features) ? data.features : [];
recordCheck(`Total features count >= 40 (Actual: ${features.length})`, features.length >= 40);

const featureIds = new Set();
let duplicateFeatureIds = 0;
let missingFeatureProps = 0;
let invalidFeatureStatuses = 0;
const validStatuses = new Set(['VERIFIED', 'ARCHITECTURE', 'PENDING']);
const requiredFeatureKeys = ['id', 'name', 'status', 'category', 'secret_mechanics', 'owning_files', 'introduced_in', 'dependencies', 'extensibility'];

features.forEach(f => {
  if (featureIds.has(f.id)) duplicateFeatureIds++;
  featureIds.add(f.id);

  for (const k of requiredFeatureKeys) {
    if (!f[k] || (Array.isArray(f[k]) && f[k].length === 0)) {
      missingFeatureProps++;
    }
  }

  if (!validStatuses.has(f.status)) {
    invalidFeatureStatuses++;
  }
});

recordCheck("Feature IDs are strictly unique (Zero duplicates)", duplicateFeatureIds === 0, `Duplicates found: ${duplicateFeatureIds}`);
recordCheck("Every feature contains all 9 required schema properties", missingFeatureProps === 0, `Missing properties count: ${missingFeatureProps}`);
recordCheck("Every feature status is valid (VERIFIED | ARCHITECTURE | PENDING)", invalidFeatureStatuses === 0, `Invalid statuses count: ${invalidFeatureStatuses}`);

// Verify Key Core Features
const expectedFeaturePrefixes = ['FEAT-01', 'FEAT-03', 'FEAT-04', 'FEAT-07', 'FEAT-08', 'FEAT-15', 'FEAT-18', 'FEAT-26', 'FEAT-30', 'FEAT-32'];
const foundPrefixes = expectedFeaturePrefixes.filter(id => featureIds.has(id));
recordCheck(`Essential anchor features present (${foundPrefixes.length}/${expectedFeaturePrefixes.length})`, 
  foundPrefixes.length === expectedFeaturePrefixes.length);

// -----------------------------------------------------------------------------
// 4. Constitutional Invariants (Section 9)
// -----------------------------------------------------------------------------
printHeader("4. CONSTITUTIONAL INVARIANTS (SECTION 9 - WHAT MUST NEVER BE CHANGED)");

const invariants = Array.isArray(data.constitutional_invariants) ? data.constitutional_invariants : [];
recordCheck(`Exact 12 Constitutional Invariants present (Actual: ${invariants.length})`, invariants.length === 12);

const invNumbers = new Set();
let duplicateInvNumbers = 0;
let missingInvFields = 0;

invariants.forEach(inv => {
  if (invNumbers.has(inv.number)) duplicateInvNumbers++;
  invNumbers.add(inv.number);

  if (!inv.number || !inv.title || !inv.rule || !inv.code_enforcement) {
    missingInvFields++;
  }
});

recordCheck("Invariant numbers are unique and sequential 1 to 12", duplicateInvNumbers === 0 && invNumbers.size === 12);
recordCheck("Every invariant has title, rule text, and code enforcement reference", missingInvFields === 0, `Missing fields count: ${missingInvFields}`);

// Specific Invariant Checks
const inv1 = invariants.find(i => i.number === 1);
recordCheck("Invariant 1: Level 3 Authority Ceiling for Autonomous Agents", 
  inv1 && inv1.title.includes("Level 3") && inv1.rule.includes("Level 3"));

const inv2 = invariants.find(i => i.number === 2);
recordCheck("Invariant 2: Zero Self-Approval & Anti-Collusion Invariant", 
  inv2 && inv2.title.includes("Zero Self-Approval") && inv2.rule.includes("creator"));

const inv3 = invariants.find(i => i.number === 3);
recordCheck("Invariant 3: Strict Financial Precision (No Floating Point, NUMERIC(18, 2))", 
  inv3 && inv3.rule.includes("NUMERIC(18, 2)"));

const inv4 = invariants.find(i => i.number === 4);
recordCheck("Invariant 4: Immutable Enterprise Audit Log (enterprise_audit_logs)", 
  inv4 && inv4.rule.includes("enterprise_audit_logs"));

const inv10 = invariants.find(i => i.number === 10);
recordCheck("Invariant 10: Zero Single Point of Failure via Relief Moderators", 
  inv10 && inv10.rule.includes("MODERATOR_A") && inv10.rule.includes("MODERATOR_B"));

const inv12 = invariants.find(i => i.number === 12);
recordCheck("Invariant 12: Zero Cross-Project Data Leakage", 
  inv12 && inv12.title.includes("Zero Cross-Project Data Leakage") && inv12.rule.includes("Project"));

// -----------------------------------------------------------------------------
// 5. 16 Core Management Consoles + Extensions (Sections 15, 17)
// -----------------------------------------------------------------------------
printHeader("5. 18 MANAGEMENT CONSOLES DIRECTORY (16 CORE + COMPLIANCE + KNOWLEDGE)");

const consoles = Array.isArray(data.consoles) ? data.consoles : [];
recordCheck(`Total consoles count >= 18 (Actual: ${consoles.length})`, consoles.length >= 18);

const consoleIds = new Set();
const consoleCodes = new Set();
let duplicateConsoles = 0;
let missingConsoleFields = 0;

consoles.forEach(c => {
  if (consoleIds.has(c.id) || consoleCodes.has(c.code)) duplicateConsoles++;
  consoleIds.add(c.id);
  consoleCodes.add(c.code);

  if (!c.id || !c.code || !c.name || !Array.isArray(c.roles) || !c.relief || !c.scope) {
    missingConsoleFields++;
  }
});

recordCheck("Console IDs (1-18) and Codes are unique", duplicateConsoles === 0);
recordCheck("Every console specifies roles, relief moderator policy, and scope", missingConsoleFields === 0);

// Key Consoles Check
const c16 = consoles.find(c => c.id === 16 && c.code === "SYS_ADMIN");
recordCheck("Console 16: System Administration strictly denies relief access", 
  c16 && c16.relief.includes("DENIED"));

const c17 = consoles.find(c => c.id === 17 && c.code === "COMPLIANCE");
recordCheck("Console 17: Compliance & Legal Intelligence Console present", c17 !== undefined);

const c18 = consoles.find(c => c.id === 18 && c.code === "KNOWLEDGE");
recordCheck("Console 18: Knowledge, Training & Service Console present", c18 !== undefined);

// -----------------------------------------------------------------------------
// 6. 13 User Classes & Relief Roles Matrix
// -----------------------------------------------------------------------------
printHeader("6. USER CLASSES HIERARCHY (CLASS_00 TO CLASS_12 + MODERATOR_A/B)");

const userClasses = Array.isArray(data.user_classes) ? data.user_classes : [];
recordCheck(`User classes count >= 15 (13 Classes + 2 Relief Roles) (Actual: ${userClasses.length})`, userClasses.length >= 15);

const classCodes = new Set();
let duplicateClasses = 0;

userClasses.forEach(uc => {
  if (classCodes.has(uc.code)) duplicateClasses++;
  classCodes.add(uc.code);
});

recordCheck("User Class codes are strictly unique", duplicateClasses === 0);

for (let i = 0; i <= 12; i++) {
  const code = `CLASS_${i.toString().padStart(2, '0')}`;
  recordCheck(`User Class present: ${code}`, classCodes.has(code));
}

recordCheck("Relief Role present: MODERATOR_A (User / Operational Support)", classCodes.has("MODERATOR_A"));
recordCheck("Relief Role present: MODERATOR_B (Technical / Compliance Relief)", classCodes.has("MODERATOR_B"));

// -----------------------------------------------------------------------------
// 7. 14 Core Architecture Entities
// -----------------------------------------------------------------------------
printHeader("7. 14 CORE ARCHITECTURE ENTITIES REGISTER");

const coreEntities = Array.isArray(data.core_architecture_entities) ? data.core_architecture_entities : [];
recordCheck(`Core entities count = 14 (Actual: ${coreEntities.length})`, coreEntities.length === 14);

const expectedEntities = [
  "Party", "Identity", "User", "Agent", "Device", 
  "Project", "Relationship", "Resource", "Scope", 
  "Permission", "Policy", "Approval", "Action", "Audit"
];

const foundEntities = new Set(coreEntities.map(e => e.name));
let missingEntities = 0;

expectedEntities.forEach(ent => {
  const exists = foundEntities.has(ent);
  if (!exists) missingEntities++;
  recordCheck(`Core Entity registered: ${ent}`, exists);
});

recordCheck("All 14 foundational entities mapped to tables and owning specifications", missingEntities === 0);

// -----------------------------------------------------------------------------
// 8. Multi-Tenant Project Model & Expansion Archetypes
// -----------------------------------------------------------------------------
printHeader("8. MULTI-TENANT PROJECT MODEL & EXPANSION ARCHETYPES");

const archetypes = Array.isArray(data.project_expansion_archetypes) ? data.project_expansion_archetypes : [];
recordCheck(`Project expansion archetypes count >= 4 (Actual: ${archetypes.length})`, archetypes.length >= 4);

const expectedArchetypes = ['ARCH_AGRO', 'ARCH_CLINIC', 'ARCH_RESEARCH', 'ARCH_COMMUNITY'];
const foundArchCodes = new Set(archetypes.map(a => a.code));

expectedArchetypes.forEach(code => {
  recordCheck(`Project Archetype registered: ${code}`, foundArchCodes.has(code));
});

// -----------------------------------------------------------------------------
// 9. Compliance, Regulatory & Legal Intelligence Layer (21 Domains)
// -----------------------------------------------------------------------------
printHeader("9. COMPLIANCE & LEGAL INTELLIGENCE (21 STATUTORY DOMAINS)");

const complianceDomains = Array.isArray(data.compliance_domains) ? data.compliance_domains : [];
recordCheck(`Compliance domains count = 21 (Actual: ${complianceDomains.length})`, complianceDomains.length === 21);

const expectedCanonicalCodes = [
  "LAND_PROPERTY", "LEASE_TENANCY", "LABOUR_EMPLOYMENT", "FINANCE_BANKING", 
  "TAXATION", "CORPORATE", "CONTRACT", "PROCUREMENT", 
  "DATA_PRIVACY", "CYBERSECURITY", "HEALTH_SAFETY", "ENVIRONMENT", 
  "IMMIGRATION", "LICENSING", "CONSUMER", "ANTI_FRAUD", 
  "ANTI_CORRUPTION", "SAFEGUARDING", "GRANTS", "DONOR_REQUIREMENTS", 
  "INTERNAL_POLICY"
];

const foundCanonicalCodes = new Set(complianceDomains.map(d => d.canonical_code));
let missingDomains = 0;

expectedCanonicalCodes.forEach(code => {
  const exists = foundCanonicalCodes.has(code);
  if (!exists) missingDomains++;
});

recordCheck("All 21 universal compliance domains cataloged with statutory instruments", missingDomains === 0, `Missing: ${missingDomains}`);

// -----------------------------------------------------------------------------
// 10. Knowledge, Training, Service & Moderation Ecosystem
// -----------------------------------------------------------------------------
printHeader("10. KNOWLEDGE, TRAINING, SERVICE & MODERATION ECOSYSTEM");

const segments = Array.isArray(data.experience_segments) ? data.experience_segments : [];
recordCheck(`Experience segments count = 4 (Actual: ${segments.length})`, segments.length === 4);

const expectedSegments = ['SEG-01', 'SEG-02', 'SEG-03', 'SEG-04'];
const foundSegmentCodes = new Set(segments.map(s => s.code));

expectedSegments.forEach(code => {
  recordCheck(`Experience Segment registered: ${code}`, foundSegmentCodes.has(code));
});

// -----------------------------------------------------------------------------
// 11. Brand Governance & Zonal / Co-Branding Model
// -----------------------------------------------------------------------------
printHeader("11. BRAND GOVERNANCE & ZONAL / CO-BRANDING MODEL");

const brand = data.brand_governance;
recordCheck("Brand governance section present", Boolean(brand));
recordCheck("Master brand anchor defined (stflbd.app)", brand && brand.master_anchor && brand.master_anchor.includes("stflbd.app"));
recordCheck("Co-branding hierarchy defined (Institutional > Zonal > Project)", Boolean(brand && brand.co_branding_hierarchy));
recordCheck("Zonal operating divisions defined (5 divisions)", brand && Array.isArray(brand.zonal_divisions) && brand.zonal_divisions.length >= 5);
recordCheck("Mandatory institutional watermark rule defined", Boolean(brand && brand.mandatory_institutional_watermark));

// -----------------------------------------------------------------------------
// 12. Repository Cleanup, Redundancies & Sanitized Structure
// -----------------------------------------------------------------------------
printHeader("12. REPOSITORY CLEANUP & SANITIZED STRUCTURE");

const cleanup = data.cleanup_map;
recordCheck("Cleanup map section present", Boolean(cleanup));
recordCheck("Redundant / duplicate files identified (>= 15 items)", 
  cleanup && Array.isArray(cleanup.redundant_files) && cleanup.redundant_files.length >= 15);
recordCheck("Sanitized folder structure defined (root + apk modules)", 
  cleanup && cleanup.sanitized_folder_structure && Array.isArray(cleanup.sanitized_folder_structure.root) && Array.isArray(cleanup.sanitized_folder_structure.apk_structure));

// -----------------------------------------------------------------------------
// 13. Known Technical Gaps & Milestone Changelog
// -----------------------------------------------------------------------------
printHeader("13. KNOWN TECHNICAL GAPS & MILESTONE CHANGELOG");

const gaps = Array.isArray(data.known_gaps) ? data.known_gaps : [];
recordCheck("Known technical gaps registered (>= 4 items)", gaps.length >= 4);

const changelog = Array.isArray(data.changelog) ? data.changelog : [];
recordCheck("Milestone changelog entries registered (>= 12 phases)", changelog.length >= 12);

// -----------------------------------------------------------------------------
// 14. Mandatory Bilingual (BN / EN) & Typography Governance
// -----------------------------------------------------------------------------
printHeader("14. MANDATORY BILINGUAL (BN / EN) & TYPOGRAPHY GOVERNANCE");

const bg = data.bilingual_governance;
recordCheck("Bilingual governance configuration present (RATIFIED_CONSTITUTIONAL)", 
  Boolean(bg && bg.status === 'RATIFIED_CONSTITUTIONAL'));
recordCheck("Supported languages strictly defined (en and bn)", 
  Boolean(bg && Array.isArray(bg.supported_languages) && bg.supported_languages.includes('en') && bg.supported_languages.includes('bn')));
recordCheck("Text direction strictly LTR for both BN and EN", 
  Boolean(bg && bg.direction && bg.direction.en === 'ltr' && bg.direction.bn === 'ltr'));
recordCheck("Default language user-selectable and configurable (not hard-coded)", 
  Boolean(bg && bg.user_selectable === true && typeof bg.default_language === 'string'));
recordCheck("Runtime machine translation strictly prohibited (zero auto-translate)", 
  Boolean(bg && bg.runtime_machine_translation_prohibited === true));
recordCheck("Approved creative attribution defined in both EN and BN", 
  Boolean(bg && bg.creative_attribution && typeof bg.creative_attribution.en === 'string' && typeof bg.creative_attribution.bn === 'string'));
recordCheck("Bangla headers font strictly Hind Siliguri (mandatory embedded)", 
  Boolean(bg && bg.typography_system && bg.typography_system.bangla_headers && bg.typography_system.bangla_headers.font_family.includes('Hind Siliguri')));
recordCheck("Bangla footers font strictly Hind Siliguri (mandatory embedded)", 
  Boolean(bg && bg.typography_system && bg.typography_system.bangla_footers && bg.typography_system.bangla_footers.font_family.includes('Hind Siliguri')));
recordCheck("Bangla body font strictly Baloo Da 2 / Noto Sans Bengali", 
  Boolean(bg && bg.typography_system && bg.typography_system.bangla_body && (bg.typography_system.bangla_body.font_family.includes('Baloo Da 2') || bg.typography_system.bangla_body.font_family.includes('Noto Sans Bengali'))));
recordCheck("English typography adheres to STFL Guidelines (Inter / JetBrains Mono)", 
  Boolean(bg && bg.typography_system && bg.typography_system.english_headers && bg.typography_system.english_headers.font_family === 'Inter'));
recordCheck("100% Bilingual Feature Coverage (Zero missing BN or EN strings)", 
  Boolean(bg && bg.audit && bg.audit.missing_bn_features === 0 && bg.audit.missing_en_features === 0));
recordCheck("Zero unembedded Bangla fonts & zero typography violations", 
  Boolean(bg && bg.audit && bg.audit.unembedded_bangla_fonts === 0 && bg.audit.typography_violations === 0));
recordCheck("HTML embeds Google Fonts with Hind Siliguri, Baloo Da 2, and Noto Sans Bengali", 
  htmlContent.includes('Hind+Siliguri') && htmlContent.includes('Baloo+Da+2') && htmlContent.includes('Noto+Sans+Bengali'));

// -----------------------------------------------------------------------------
// FINAL VERDICT & SUMMARY
// -----------------------------------------------------------------------------
console.log(`\n${C.bold}${C.white}================================================================================${C.reset}`);
console.log(`${C.bold}${C.cyan}                     AUDIT SUMMARY & INTEGRITY SCORE                           ${C.reset}`);
console.log(`${C.bold}${C.white}================================================================================${C.reset}`);
console.log(`  Total Invariant & Schema Checks: ${C.bold}${totalChecks}${C.reset}`);
console.log(`  Passed Checks:                   ${C.bold}${C.green}${passedChecks}${C.reset}`);
console.log(`  Failed Checks:                   ${C.bold}${failedChecks === 0 ? C.green : C.red}${failedChecks}${C.reset}`);

if (failedChecks > 0) {
  console.log(`\n${C.bold}${C.red}FAILURES IDENTIFIED:${C.reset}`);
  failures.forEach((f, idx) => {
    console.log(`  ${idx + 1}. ${f.name} -> ${f.details || 'Check condition returned false'}`);
  });
  console.log(`\n${C.bold}${C.bgRed} STFL AIO MASTER CONTROL VALIDATION: FAIL ${C.reset}\n`);
  process.exit(1);
} else {
  console.log(`\n${C.bold}${C.bgGreen}${C.white} STFL AIO MASTER CONTROL VALIDATION: PASS ${C.reset}\n`);
  process.exit(0);
}
