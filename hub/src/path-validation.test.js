import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDocumentPath, isAllowedDocumentPath } from './path-validation.js';

test('normalizza un percorso Markdown valido', () => {
  assert.equal(normalizeDocumentPath('/docs/01-architettura-dati.md'), 'docs/01-architettura-dati.md');
});

test('rifiuta traversal e backslash', () => {
  assert.throws(() => normalizeDocumentPath('../.env'));
  assert.throws(() => normalizeDocumentPath('docs\\secret.md'));
});

test('consente solo percorsi presenti nell’indice', () => {
  const allowed = new Set(['index.md', 'docs/01-architettura-dati.md']);
  assert.equal(isAllowedDocumentPath('docs/01-architettura-dati.md', allowed), true);
  assert.equal(isAllowedDocumentPath('docs/missing.md', allowed), false);
});
