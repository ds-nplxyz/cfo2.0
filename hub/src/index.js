import { normalizeDocumentPath, isAllowedDocumentPath } from './path-validation.js';
import { getDraft, upsertDraft, deleteDraft } from './document-store.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

function now() { return new Date().toISOString(); }
function id() { return crypto.randomUUID(); }

async function documentIndex(env) {
  const response = await env.ASSETS.fetch(new Request(new URL('/content/index.json', 'http://cfo2-hub.local')));
  if (!response.ok) throw new Error('Indice documenti non disponibile');
  return response.json();
}

async function resolveDocument(env, rawPath) {
  let path;
  try { path = normalizeDocumentPath(rawPath); } catch { return { error: json({ error: 'document path non valido' }, 400) }; }
  const index = await documentIndex(env);
  const allowed = new Set(index.documents.map((document) => document.path));
  if (!isAllowedDocumentPath(path, allowed)) return { error: json({ error: 'documento non trovato' }, 404) };
  return { path, document: index.documents.find((document) => document.path === path) };
}

async function list(env, table) {
  if (!env.DB) return { items: [] };
  const { results } = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY created_at DESC`).all();
  return { items: results };
}

async function create(env, table, input) {
  if (!env.DB) return json({ error: 'D1 non configurato: eseguire il setup locale/remoto del database.' }, 503);
  const createdAt = now();
  const recordId = id();
  if (table === 'tasks') {
    if (!input.title?.trim()) return json({ error: 'title obbligatorio' }, 400);
    await env.DB.prepare('INSERT INTO tasks (id, title, description, area, status, priority, document_path, due_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(recordId, input.title.trim(), input.description || '', input.area || 'general', 'todo', input.priority || 'medium', input.document_path || null, input.due_date || null, createdAt, createdAt).run();
  } else {
    if (!input.document_path?.trim() || !input.body?.trim()) return json({ error: 'document_path e body sono obbligatori' }, 400);
    await env.DB.prepare('INSERT INTO annotations (id, document_path, heading_anchor, body, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(recordId, input.document_path.trim(), input.heading_anchor || null, input.body.trim(), 'open', createdAt, createdAt).run();
  }
  return json({ id: recordId }, 201);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, service: 'cfo2-hub', d1: Boolean(env.DB) });
    if (url.pathname === '/api/tasks' && request.method === 'GET') return json(await list(env, 'tasks'));
    if (url.pathname === '/api/annotations' && request.method === 'GET') return json(await list(env, 'annotations'));
    if (url.pathname === '/api/tasks' && request.method === 'POST') return create(env, 'tasks', await request.json());
    if (url.pathname === '/api/annotations' && request.method === 'POST') return create(env, 'annotations', await request.json());

    if (url.pathname.startsWith('/api/documents/')) {
      const resolved = await resolveDocument(env, decodeURIComponent(url.pathname.slice('/api/documents/'.length)));
      if (resolved.error) return resolved.error;
      return json({ path: resolved.path, content: resolved.document.content, sourceUpdatedAt: resolved.document.updatedAt });
    }

    if (url.pathname.startsWith('/api/drafts/')) {
      const resolved = await resolveDocument(env, decodeURIComponent(url.pathname.slice('/api/drafts/'.length)));
      if (resolved.error) return resolved.error;
      if (!env.DB) return json({ error: 'D1 non configurato' }, 503);
      if (request.method === 'GET') {
        const draft = await getDraft(env.DB, resolved.path);
        return draft ? json(draft) : json({ error: 'bozza non trovata' }, 404);
      }
      if (request.method === 'PUT') {
        const input = await request.json();
        if (typeof input.content !== 'string') return json({ error: 'content obbligatorio' }, 400);
        const draft = await upsertDraft(env.DB, resolved.path, input.content, input.baseUpdatedAt, now());
        return json(draft, 201);
      }
      if (request.method === 'DELETE') {
        await deleteDraft(env.DB, resolved.path);
        return json({ ok: true });
      }
    }

    if (url.pathname.startsWith('/api/diff/')) {
      const resolved = await resolveDocument(env, decodeURIComponent(url.pathname.slice('/api/diff/'.length)));
      if (resolved.error) return resolved.error;
      const draft = env.DB ? await getDraft(env.DB, resolved.path) : null;
      return json({ path: resolved.path, canonical: resolved.document.content, draft: draft?.content || null, hasChanges: Boolean(draft && draft.content !== resolved.document.content), sourceUpdatedAt: resolved.document.updatedAt });
    }
    return env.ASSETS.fetch(request);
  }
};
