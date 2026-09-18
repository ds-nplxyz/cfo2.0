import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseEditorMode, encodeDocumentPath } from './markdown.js';

test('sceglie raw mode per Markdown avanzato', () => {
  assert.equal(chooseEditorMode('docs/diagram.md', '# Titolo\n\n```mermaid\ngraph TD\n```'), 'raw');
  assert.equal(chooseEditorMode('docs/basic.md', '# Titolo\n\n- voce'), 'visual');
});

test('codifica il percorso nel link API', () => {
  assert.equal(encodeDocumentPath('docs/cartella con spazi.md'), 'docs%2Fcartella%20con%20spazi.md');
});
