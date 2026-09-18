CREATE TABLE IF NOT EXISTS document_drafts (
  document_path TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  base_updated_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'discarded')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_document_drafts_status ON document_drafts(status);
CREATE INDEX IF NOT EXISTS idx_document_drafts_updated ON document_drafts(updated_at);
