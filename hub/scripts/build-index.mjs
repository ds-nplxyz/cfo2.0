import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, relative, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const hubDir = fileURLToPath(new URL('..', import.meta.url));
const projectRoot = join(hubDir, '..');
const outputFile = join(hubDir, 'public', 'content', 'index.json');
const excluded = new Set(['node_modules', '.git', '.wrangler', 'dist']);

async function walk(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(fullPath));
    else if (extname(entry.name).toLowerCase() === '.md') result.push(fullPath);
  }
  return result;
}

function titleOf(content, path) {
  const heading = content.split(/\r?\n/).find((line) => /^#\s+/.test(line));
  return heading ? heading.replace(/^#\s+/, '').trim() : basename(path, '.md');
}

function excerptOf(content) {
  return content.split(/\r?\n/).map((line) => line.trim()).find((line) => line && !line.startsWith('#') && line !== 'Riepilogo istruzioni')?.slice(0, 220) || 'Documento senza descrizione.';
}

const documents = [];
for (const file of (await walk(projectRoot)).sort()) {
  const content = await readFile(file, 'utf8');
  const relativePath = relative(projectRoot, file).replaceAll('\\', '/');
  const area = relativePath.includes('/') ? relativePath.split('/')[0] : 'root';
  documents.push({ path: relativePath, relativePath, area, title: titleOf(content, file), excerpt: excerptOf(content), content, updatedAt: new Date().toISOString() });
}

await mkdir(join(hubDir, 'public', 'content'), { recursive: true });
await writeFile(outputFile, JSON.stringify({ generatedAt: new Date().toISOString(), documents }, null, 2), 'utf8');
console.log(`Indicizzati ${documents.length} Markdown in ${outputFile}`);
