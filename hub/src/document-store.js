export function draftFromRow(row) {
  return {
    path: row.document_path,
    content: row.content,
    baseUpdatedAt: row.base_updated_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at
  };
}

export function buildDraftUpsert(path, content, baseUpdatedAt, timestamp) {
  return {
    sql: `INSERT INTO document_drafts
      (document_path, content, base_updated_at, status, created_at, updated_at)
      VALUES (?, ?, ?, 'draft', ?, ?)
      ON CONFLICT(document_path) DO UPDATE SET
        content = excluded.content,
        base_updated_at = excluded.base_updated_at,
        status = 'draft',
        updated_at = excluded.updated_at`,
    bindings: [path, content, baseUpdatedAt || null, timestamp, timestamp]
  };
}

export async function getDraft(db, path) {
  if (!db) return null;
  const row = await db.prepare('SELECT * FROM document_drafts WHERE document_path = ?').bind(path).first();
  return row ? draftFromRow(row) : null;
}

export async function upsertDraft(db, path, content, baseUpdatedAt, timestamp) {
  const statement = buildDraftUpsert(path, content, baseUpdatedAt, timestamp);
  await db.prepare(statement.sql).bind(...statement.bindings).run();
  return getDraft(db, path);
}

export async function deleteDraft(db, path) {
  await db.prepare('DELETE FROM document_drafts WHERE document_path = ?').bind(path).run();
}
