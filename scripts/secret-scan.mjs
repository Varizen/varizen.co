import { execSync } from 'node:child_process';

const repos = [
  'K:/varizen.co',
  'K:/varizen.co/vsohaentasneem_foundation/main',
  'K:/varizen.co/vsohaentasneem_foundation/apk',
];

const patterns = {
  openrouter_key: /sk-or-[a-zA-Z0-9-]{20,}/,
  openai_key: /sk-[a-zA-Z0-9]{20,}/,
  github_token: /ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,}/,
  aws_key: /AKIA[0-9A-Z]{12,}/,
  private_key: /BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY/,
  hardcoded_assignment: /(apiKey|API_KEY|api_key|secret|SECRET|password|PASSWORD)\s*[:=]\s*["'][a-zA-Z0-9_\-./+]{16,}["']/,
};

let findings = 0;
for (const repo of repos) {
  console.log(`\n=== ${repo} ===`);
  let files;
  try {
    files = execSync('git ls-files', { cwd: repo, encoding: 'utf8' })
      .split('\n').filter(Boolean);
  } catch {
    console.log('  (not a git repo, skipping)');
    continue;
  }
  for (const file of files) {
    let content;
    try {
      content = execSync(`git show "HEAD:${file.replace(/"/g, '\\"')}"`, {
        cwd: repo, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
      });
    } catch { continue; }
    for (const [name, re] of Object.entries(patterns)) {
      const m = content.match(re);
      if (m) {
        const line = content.split('\n').findIndex((l) => re.test(l)) + 1;
        const snippet = content.split('\n')[line - 1]?.trim().slice(0, 100) ?? '';
        console.log(`  [${name}] ${file}:${line}`);
        console.log(`    > ${snippet}`);
        findings++;
      }
    }
  }
}
console.log(`\n=== TOTAL FINDINGS: ${findings} ===`);