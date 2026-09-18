import { Crepe } from '@milkdown/crepe';
import { chooseEditorMode, encodeDocumentPath } from './markdown.js';
import './editor.css';

const path = new URLSearchParams(window.location.search).get('path');
const title = document.querySelector('#document-title');
const status = document.querySelector('#status');
const visual = document.querySelector('#visual-editor');
const raw = document.querySelector('#raw-editor');
const preview = document.querySelector('#preview');
const previewContent = document.querySelector('#preview-content');
const saveButton = document.querySelector('#save-button');
const previewButton = document.querySelector('#preview-button');
let canonical = null;
let sourceUpdatedAt = null;
let editor = null;
let mode = 'visual';

function setStatus(message, error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

function apiPath(kind) { return `/api/${kind}/${encodeDocumentPath(path)}`; }

function currentContent() { return mode === 'raw' ? raw.value : editor.getMarkdown(); }

async function load() {
  if (!path) throw new Error('Parametro path mancante');
  const response = await fetch(apiPath('documents'));
  if (!response.ok) throw new Error('Documento non trovato');
  const document = await response.json();
  canonical = document.content;
  sourceUpdatedAt = document.sourceUpdatedAt;
  title.textContent = path;
  mode = chooseEditorMode(path, canonical);
  if (mode === 'raw') {
    visual.hidden = true;
    raw.hidden = false;
    raw.value = canonical;
    setStatus('Modalità raw attiva per preservare la sintassi avanzata.');
  } else {
    editor = await new Crepe({ root: visual, defaultValue: canonical }).create();
    setStatus('Documento canonico caricato.');
  }
  const draftResponse = await fetch(apiPath('drafts'));
  if (draftResponse.ok) {
    const draft = await draftResponse.json();
    if (mode === 'raw') raw.value = draft.content;
    else {
      await editor.destroy();
      editor = await new Crepe({ root: visual, defaultValue: draft.content }).create();
    }
    setStatus('Bozza locale recuperata da D1.');
  }
}

async function save() {
  saveButton.disabled = true;
  setStatus('Salvataggio bozza…');
  try {
    const response = await fetch(apiPath('drafts'), { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: currentContent(), baseUpdatedAt: sourceUpdatedAt }) });
    if (!response.ok) throw new Error('Salvataggio non riuscito');
    setStatus('Bozza salvata in D1. Il file canonico non è stato modificato.');
  } catch (error) { setStatus(error.message, true); } finally { saveButton.disabled = false; }
}

async function showPreview() {
  const content = currentContent();
  preview.hidden = false;
  previewContent.innerHTML = `<p><strong>Documento:</strong> ${path}</p><pre></pre>`;
  previewContent.querySelector('pre').textContent = content;
}

saveButton.addEventListener('click', save);
previewButton.addEventListener('click', showPreview);
document.querySelector('#close-preview').addEventListener('click', () => { preview.hidden = true; });
load().catch((error) => setStatus(error.message, true));
