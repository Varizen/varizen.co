import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const SOURCE_DIRS = [
  "app",
  "src",
  "components",
  "pages",
  "lib",
  "hooks"
];

const EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs"
]);

const EXCLUDED = [
  "node_modules",
  ".next",
  ".git",
  "dist",
  "build",
  "coverage"
];

const FORBIDDEN_PACKAGES = [
  "lucide",
  "lucide-react",
  "@heroicons",
  "heroicons",
  "@fortawesome",
  "font-awesome",
  "@mui/icons-material",
  "react-icons",
  "phosphor-react",
  "@phosphor-icons",
  "@tabler/icons",
  "tabler-icons",
  "bootstrap-icons",
  "remixicon",
  "feather-icons",
  "react-feather",
  "ionicons",
  "@ant-design/icons",
  "@radix-ui/react-icons"
];

const forbiddenImportPattern = new RegExp(
  `(?:from\\s+["']|import\\s*\\(\\s*["'])(${FORBIDDEN_PACKAGES
    .map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "i"
);

const rawSvgPattern = /<svg(?:\s|>)/i;

const findings = [];

function shouldSkip(file) {
  return EXCLUDED.some((entry) =>
    file.split(path.sep).includes(entry)
  );
}

function walk(directory) {
  if (!fs.existsSync(directory)) return;

  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true
  })) {
    const full = path.join(directory, entry.name);

    if (shouldSkip(full)) continue;

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (!EXTENSIONS.has(path.extname(entry.name))) continue;

    inspect(full);
  }
}

function inspect(file) {
  const content = fs.readFileSync(file, "utf8");

  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {

    if (forbiddenImportPattern.test(line)) {
      findings.push({
        type: "FORBIDDEN_ICON_LIBRARY",
        file,
        line: index + 1,
        text: line.trim()
      });
    }

    /*
     * Raw SVG is flagged for review rather than automatically rejected.
     *
     * Why?
     * STFL may legitimately contain SVG brand artwork.
     *
     * The developer must confirm that an inline SVG is not being used
     * as an interface icon.
     */
    if (rawSvgPattern.test(line)) {
      findings.push({
        type: "RAW_SVG_REVIEW",
        file,
        line: index + 1,
        text: line.trim()
      });
    }
  });
}

for (const directory of SOURCE_DIRS) {
  walk(path.join(ROOT, directory));
}

console.log("");
console.log("============================================================");
console.log(" STFL ICONOGRAPHY POLICY CHECK");
console.log("============================================================");
console.log("");

if (findings.length === 0) {
  console.log("PASS — No prohibited icon-library imports found.");
  console.log("");
  process.exit(0);
}

const prohibited = findings.filter(
  (item) => item.type === "FORBIDDEN_ICON_LIBRARY"
);

const rawSvg = findings.filter(
  (item) => item.type === "RAW_SVG_REVIEW"
);

if (prohibited.length > 0) {
  console.error("FAIL — Prohibited icon library detected:");
  console.error("");

  for (const item of prohibited) {
    console.error(
      `${item.file}:${item.line} ${item.text}`
    );
  }

  console.error("");
}

if (rawSvg.length > 0) {
  console.warn(
    `REVIEW — ${rawSvg.length} raw SVG occurrence(s) detected.`
  );

  for (const item of rawSvg.slice(0, 30)) {
    console.warn(
      `${item.file}:${item.line} ${item.text}`
    );
  }

  console.warn("");
  console.warn(
    "Raw SVG is allowed only for approved brand/artwork assets."
  );
}

if (prohibited.length > 0) {
  process.exit(1);
}

process.exit(0);
