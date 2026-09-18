const state = { documents: [], tasks: [], annotations: [] };
const $ = (selector) => document.querySelector(selector);

function escapeHtml(value = '') {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function markdownToHtml(markdown) {
  return markdown.split(/\r?\n/).map((line) => {
    if (!line.trim()) return '';
    const safe = escapeHtml(line);
    if (safe.startsWith('### ')) return `<h3>${safe.slice(4)}</h3>`;
    if (safe.startsWith('## ')) return `<h2>${safe.slice(3)}</h2>`;
    if (safe.startsWith('# ')) return `<h1>${safe.slice(2)}</h1>`;
    if (safe.startsWith('- ')) return `<li>${safe.slice(2)}</li>`;
    return `<p>${safe.replace(/`([^`]+)`/g, '<code>$1</code>')}</p>`;
  }).join('').replace(/(<li>.*?<\/li>)+/g, (items) => `<ul>${items}</ul>`);
}

function showPanel(id) {
  $('#document-list').hidden = id !== 'documents';
  $('#document').hidden = id !== 'document';
  $('#tasks').hidden = id !== 'tasks';
  $('#annotations').hidden = id !== 'annotations';

  const activePanel = id === 'documents' ? $('#document-list') : id === 'document' ? $('#document') : $(`#${id}`);
  if (activePanel) activePanel.scrollIntoView({ block: 'start', behavior: 'auto' });
}

function renderDocuments(query = '') {
  const needle = query.toLowerCase();
  const filtered = state.documents.filter((doc) => `${doc.title} ${doc.area} ${doc.content}`.toLowerCase().includes(needle));
  $('#document-list').innerHTML = filtered.map((doc) => `<article class="document-card" data-path="${escapeHtml(doc.path)}"><h2>${escapeHtml(doc.title)}</h2><p>${escapeHtml(doc.excerpt)}</p><div class="meta">${escapeHtml(doc.area)} · ${escapeHtml(doc.relativePath)}</div></article>`).join('') || '<p>Nessun documento trovato.</p>';
  document.querySelectorAll('.document-card').forEach((card) => card.addEventListener('click', () => openDocument(card.dataset.path)));
}

function openDocument(path) {
  const doc = state.documents.find((item) => item.path === path);
  if (!doc) return;
  $('#document').innerHTML = `${markdownToHtml(doc.content)}<p class="meta">Percorso: ${escapeHtml(doc.relativePath)}</p>`;
  showPanel('document');
}

function renderAreas() {
  const areas = [...new Set(state.documents.map((doc) => doc.area))].sort();
  $('#areas').innerHTML = `<button type="button" data-area="">Tutti i documenti</button>${areas.map((area) => `<button type="button" data-area="${escapeHtml(area)}">${escapeHtml(area)}</button>`).join('')}`;
  $('#areas').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    const area = button.dataset.area;
    renderDocuments(area ? area : '');
    showPanel('documents');
  }));
}

function renderRecords() {
  $('#task-count').textContent = `${state.tasks.length} task`;
  $('#annotation-count').textContent = `${state.annotations.length} annotazioni`;
  $('#task-list').innerHTML = state.tasks.map((task) => `<li><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.status)} · priorità ${escapeHtml(task.priority)}</small></li>`).join('') || '<li>Nessun task.</li>';
  $('#annotation-list').innerHTML = state.annotations.map((note) => `<li><strong>${escapeHtml(note.document_path)}</strong><small>${escapeHtml(note.body)}</small></li>`).join('') || '<li>Nessuna annotazione.</li>';
}

async function load() {
  const index = await fetch('/content/index.json').then((response) => response.json());
  state.documents = index.documents;
  renderAreas();
  renderDocuments();
  const [tasks, annotations, health] = await Promise.all([
    fetch('/api/tasks').then((response) => response.json()),
    fetch('/api/annotations').then((response) => response.json()),
    fetch('/api/health').then((response) => response.json())
  ]);
  state.tasks = tasks.items || [];
  state.annotations = annotations.items || [];
  $('#health').textContent = health.ok ? 'Locale pronto' : 'API non disponibile';
  renderRecords();
}

$('#search').addEventListener('input', (event) => { renderDocuments(event.target.value); showPanel('documents'); });
document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => showPanel(button.dataset.view)));
$('#task-form').addEventListener('submit', async (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); await fetch('/api/tasks', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) }); event.target.reset(); await load(); showPanel('tasks'); });
$('#annotation-form').addEventListener('submit', async (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); await fetch('/api/annotations', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) }); event.target.reset(); await load(); showPanel('annotations'); });
load().catch((error) => { $('#health').textContent = `Errore: ${error.message}`; });
