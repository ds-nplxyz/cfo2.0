import test from 'node:test';
import assert from 'node:assert/strict';
import { draftFromRow, buildDraftUpsert } from './document-store.js';

test('converte una riga D1 in una bozza pubblicabile', () => {
  const draft = draftFromRow({
    document_path: 'docs/test.md',
    content: '# Bozza',
    base_updated_at: '2026-09-19T10:00:00.000Z',
    status: 'draft',
    created_at: '2026-09-19T10:01:00.000Z',
    updated_at: '2026-09-19T10:01:00.000Z',
    published_at: null
  });
  assert.deepEqual(draft, {
    path: 'docs/test.md',
    content: '# Bozza',
    baseUpdatedAt: '2026-09-19T10:00:00.000Z',
    status: 'draft',
    createdAt: '2026-09-19T10:01:00.000Z',
    updatedAt: '2026-09-19T10:01:00.000Z',
    publishedAt: null
  });
});

test('crea i parametri per l’upsert della bozza', () => {
  const statement = buildDraftUpsert('docs/test.md', '# Bozza', '2026-09-19T10:00:00.000Z', '2026-09-19T10:02:00.000Z');
  assert.match(statement.sql, /INSERT INTO document_drafts/);
  assert.deepEqual(statement.bindings, [
    'docs/test.md',
    '# Bozza',
    '2026-09-19T10:00:00.000Z',
    '2026-09-19T10:02:00.000Z',
    '2026-09-19T10:02:00.000Z'
  ]);
});
