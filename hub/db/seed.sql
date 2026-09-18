INSERT OR IGNORE INTO tasks (id, title, description, area, status, priority, created_at, updated_at)
VALUES ('local-example-task', 'Sostituire con il primo task reale', 'Record dimostrativo locale.', 'hub', 'todo', 'medium', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO annotations (id, document_path, heading_anchor, body, status, created_at, updated_at)
VALUES ('local-example-annotation', 'index.md', NULL, 'Annotazione dimostrativa locale.', 'open', datetime('now'), datetime('now'));
