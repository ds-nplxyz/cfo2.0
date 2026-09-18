const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

function now() { return new Date().toISOString(); }
function id() { return crypto.randomUUID(); }

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
    return env.ASSETS.fetch(request);
  }
};
