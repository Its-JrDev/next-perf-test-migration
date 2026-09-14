#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const TARGET_DIRS = [join(ROOT, 'src', 'components')];
const TARGET_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const IMPORT_RE =
  /(from\s+['"]|import\s+['"]|import\(\s*['"])([^'"]+)(['"]\s*)/g;

function toPosix(p) {
  return p.split('\\').join('/');
}

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf('.');
      const ext = dot >= 0 ? entry.name.slice(dot) : '';
      if (TARGET_EXT.has(ext)) out.push(full);
    }
  }
  return out;
}

function rewrite(spec) {
  if (!spec.startsWith('src/')) return spec;
  return '@/' + spec.slice('src/'.length);
}

async function processFile(file) {
  const src = await readFile(file, 'utf8');
  let changed = false;
  const next = src.replace(IMPORT_RE, (match, prefix, spec, suffix) => {
    const updated = rewrite(spec);
    if (updated !== spec) {
      changed = true;
      return `${prefix}${updated}${suffix}`;
    }
    return match;
  });
  if (changed) {
    await writeFile(file, next, 'utf8');
    return { file: toPosix(file.slice(ROOT.length + 1)), changed: true };
  }
  return { file: toPosix(file.slice(ROOT.length + 1)), changed: false };
}

async function main() {
  const files = (await Promise.all(TARGET_DIRS.map(walk))).flat();

  if (files.length === 0) {
    console.log('No files to process.');
    return;
  }

  const results = await Promise.all(files.map(processFile));
  const updated = results.filter((r) => r.changed);

  if (updated.length === 0) {
    console.log('No imports needed normalization.');
    return;
  }

  console.log(`Normalized imports in ${updated.length} file(s):`);
  for (const r of updated) console.log(`  - ${r.file}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
