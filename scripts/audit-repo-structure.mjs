#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const repoRoot = process.cwd();
const outArgIndex = process.argv.indexOf('--out');
const outPath = outArgIndex > -1 ? process.argv[outArgIndex + 1] : null;

const ignoredDirs = new Set([
  '.git',
  '.vercel',
  '.vscode',
  'dist',
  'node_modules',
]);

const rootFilenameWhitelist = new Set([
  'README.md',
  'ATTRIBUTIONS.md',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vercel.json',
  'postcss.config.mjs',
  'playwright.config.ts',
  'index.html',
  '.gitignore',
  '.env.local',
  '.env.local.example',
  '.env.vercel',
]);

const runtimeEntryFiles = new Set(['src/main.tsx']);

const isKebabFilename = (filename) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:\.[a-z0-9]+)*)?$/u.test(filename);

function walkFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(abs));
      continue;
    }
    files.push(abs);
  }
  return files;
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function resolveImport(fromAbs, spec, tsFileSet) {
  let base = null;
  if (spec.startsWith('@/')) {
    base = path.join(repoRoot, 'src', spec.slice(2));
  } else if (spec.startsWith('./') || spec.startsWith('../')) {
    base = path.resolve(path.dirname(fromAbs), spec);
  }
  if (!base) return null;

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.jsx'),
  ];

  for (const candidate of candidates) {
    const resolved = path.resolve(candidate);
    if (tsFileSet.has(resolved)) return resolved;
  }
  return null;
}

const allFilesAbs = walkFiles(repoRoot);
const allFilesRel = allFilesAbs.map((file) => path.relative(repoRoot, file)).sort();

const tsFilesAbs = allFilesAbs.filter((file) => /\.(ts|tsx)$/.test(file));
const tsFileSet = new Set(tsFilesAbs.map((file) => path.resolve(file)));
const incomingRefs = new Map(tsFilesAbs.map((file) => [path.resolve(file), new Set()]));

const importRe = /import\s+(?:[^'"()]*?from\s*)?["']([^"']+)["']/g;
const dynImportRe = /import\(\s*["']([^"']+)["']\s*\)/g;

for (const fromAbs of tsFilesAbs) {
  const text = readText(fromAbs);
  for (const re of [importRe, dynImportRe]) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      const spec = match[1];
      const target = resolveImport(fromAbs, spec, tsFileSet);
      if (target && incomingRefs.has(target)) {
        incomingRefs.get(target).add(fromAbs);
      }
    }
  }
}

const deadTsFiles = [];
for (const abs of tsFilesAbs) {
  const rel = path.relative(repoRoot, abs);
  if (runtimeEntryFiles.has(rel)) continue;
  const incoming = incomingRefs.get(path.resolve(abs));
  if (!incoming || incoming.size === 0) {
    deadTsFiles.push(rel);
  }
}

const nonKebabFiles = [];
for (const rel of allFilesRel) {
  const segments = rel.split(path.sep);
  const filename = segments[segments.length - 1];
  const isRoot = segments.length === 1;

  if (isRoot && rootFilenameWhitelist.has(filename)) {
    continue;
  }

  if (!isKebabFilename(filename)) {
    nonKebabFiles.push(rel);
  }
}

const importedAssets = new Set();
const assetImportRe = /["']@\/assets\/([^"']+)["']/g;
for (const tsAbs of tsFilesAbs) {
  const text = readText(tsAbs);
  assetImportRe.lastIndex = 0;
  let m;
  while ((m = assetImportRe.exec(text)) !== null) {
    importedAssets.add(path.join('src', 'assets', m[1]));
  }
}

const assetFiles = allFilesRel.filter((file) => file.startsWith('src/assets/'));
const unusedAssets = assetFiles.filter((file) => !importedAssets.has(file));

const hashGroups = new Map();
for (const assetRel of assetFiles) {
  const assetAbs = path.join(repoRoot, assetRel);
  const hash = crypto.createHash('sha1').update(fs.readFileSync(assetAbs)).digest('hex');
  if (!hashGroups.has(hash)) hashGroups.set(hash, []);
  hashGroups.get(hash).push(assetRel);
}

const duplicateGroups = [];
for (const [hash, group] of hashGroups.entries()) {
  if (group.length > 1) {
    duplicateGroups.push({ hash, files: group.sort() });
  }
}
duplicateGroups.sort((a, b) => b.files.length - a.files.length);

const unusedDuplicateGroups = duplicateGroups
  .map((group) => ({ ...group, files: group.files.filter((file) => unusedAssets.includes(file)) }))
  .filter((group) => group.files.length > 1)
  .sort((a, b) => b.files.length - a.files.length);

const now = new Date().toISOString();

const lines = [];
lines.push('# Repo Structure Audit Baseline');
lines.push('');
lines.push(`Generated: ${now}`);
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Total files (excluding ignored dirs): ${allFilesRel.length}`);
lines.push(`- TypeScript files: ${tsFilesAbs.length}`);
lines.push(`- Non-kebab filenames (outside root whitelist): ${nonKebabFiles.length}`);
lines.push(`- Unreferenced TS/TSX files (excluding runtime entries): ${deadTsFiles.length}`);
lines.push(`- Asset files in src/assets: ${assetFiles.length}`);
lines.push(`- Unused assets in src/assets: ${unusedAssets.length}`);
lines.push(`- Duplicate asset hash groups: ${duplicateGroups.length}`);
lines.push(`- Unused duplicate asset groups: ${unusedDuplicateGroups.length}`);
lines.push('');

lines.push('## API Contract Snapshot');
lines.push('');
const apiFiles = allFilesRel.filter((file) => file.startsWith('api/')).sort();
if (apiFiles.length === 0) {
  lines.push('- _None_');
} else {
  for (const file of apiFiles) lines.push(`- \`${file}\``);
}
lines.push('');

lines.push('## Public URL-Critical Files Snapshot');
lines.push('');
const publicFiles = allFilesRel.filter((file) => file.startsWith('public/')).sort();
if (publicFiles.length === 0) {
  lines.push('- _None_');
} else {
  for (const file of publicFiles) lines.push(`- \`${file}\``);
}
lines.push('');

lines.push('## Non-Kebab Filenames');
lines.push('');
if (nonKebabFiles.length === 0) {
  lines.push('- _None_');
} else {
  for (const file of nonKebabFiles.sort()) lines.push(`- \`${file}\``);
}
lines.push('');

lines.push('## Unreferenced TS/TSX Files');
lines.push('');
if (deadTsFiles.length === 0) {
  lines.push('- _None_');
} else {
  for (const file of deadTsFiles.sort()) lines.push(`- \`${file}\``);
}
lines.push('');

lines.push('## Unused Duplicate Asset Groups');
lines.push('');
if (unusedDuplicateGroups.length === 0) {
  lines.push('- _None_');
} else {
  for (const group of unusedDuplicateGroups) {
    lines.push(`- SHA1 \`${group.hash}\` (${group.files.length} files)`);
    for (const file of group.files) {
      lines.push(`  - \`${file}\``);
    }
  }
}
lines.push('');

lines.push('## Unused Assets (Non-duplicate or singletons)');
lines.push('');
const unusedInDuplicateSet = new Set(unusedDuplicateGroups.flatMap((group) => group.files));
const unusedSingletons = unusedAssets.filter((file) => !unusedInDuplicateSet.has(file));
if (unusedSingletons.length === 0) {
  lines.push('- _None_');
} else {
  for (const file of unusedSingletons.sort()) lines.push(`- \`${file}\``);
}
lines.push('');

const output = `${lines.join('\n')}\n`;
if (outPath) {
  const outAbs = path.resolve(repoRoot, outPath);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  fs.writeFileSync(outAbs, output, 'utf8');
  console.log(`Audit report written to ${path.relative(repoRoot, outAbs)}`);
} else {
  process.stdout.write(output);
}
