Riepilogo istruzioni

# Piano: editor Markdown browser-first per CFO Hub

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere a CFO Hub un editor Milkdown protetto da Access che consenta di creare e recuperare bozze Markdown in D1, senza modificare ancora GitHub automaticamente.

**Architecture:** Il catalogo esistente resta intatto; una pagina editor dedicata carica il documento indicizzato, usa Milkdown per l’editing visuale e mantiene una modalità raw. Le bozze sono salvate in D1 tramite API Worker. GitHub publication è una fase separata.

**Tech Stack:** Cloudflare Worker, D1, JavaScript browser, Vite, Milkdown/Crepe, Markdown/GFM, test Node e Wrangler locale.

**Spec:** `docs/superpowers/specs/2026-09-19-cfo-hub-milkdown-editor-design.md`

## Global Constraints

- Non inserire token, password o dati contabili reali.
- Non modificare il comportamento corrente di task, annotazioni, catalogo e responsive layout salvo integrazione necessaria.
- Non creare commit GitHub automatici nella prima fase.
- Validare ogni percorso Markdown contro l’indice generato; impedire traversal.
- Preferire test dei contratti API e della conversione Markdown prima dell’implementazione.
- Usare `apply_patch` per le modifiche ai file.

---

### Task 1: Contratti e migrazione D1

**Files:**
- Create: `hub/db/migrations/0002_document_drafts.sql`
- Create: `hub/src/document-store.js`
- Create: `hub/src/document-store.test.js`
- Modify: `hub/wrangler.jsonc`
- Modify: `hub/README.md`

- [ ] Scrivere test per normalizzazione del path, rifiuto traversal, lookup documento e upsert bozza.
- [ ] Implementare helper D1 per `document_drafts`, timestamp ISO e activity log.
- [ ] Aggiungere migrazione idempotente con indici essenziali.
- [ ] Documentare comando locale e remoto per applicare la migrazione senza includere segreti.
- [ ] Eseguire i test del modulo e verificare che falliscano prima dell’implementazione e passino dopo.

### Task 2: API documenti e bozze

**Files:**
- Create: `hub/src/path-validation.js`
- Create: `hub/src/path-validation.test.js`
- Modify: `hub/src/index.js`
- Modify: `hub/scripts/build-index.mjs`

- [ ] Definire test per `GET`, `PUT`, `DELETE` e diff con input valido, path inesistente e body incompleto.
- [ ] Implementare validazione comune del path e lookup nell’indice pubblicato.
- [ ] Implementare gli endpoint `/api/documents`, `/api/drafts` e `/api/diff` mantenendo gli endpoint task/annotazioni.
- [ ] Restituire errori JSON coerenti e non rivelare path arbitrari del filesystem.
- [ ] Verificare con Wrangler locale health, lettura e ciclo save/reload/reset.

### Task 3: Pipeline frontend editor

**Files:**
- Modify: `hub/package.json`
- Modify: `hub/package-lock.json`
- Create: `hub/editor/index.html`
- Create: `hub/editor/main.js`
- Create: `hub/editor/editor.css`
- Create: `hub/editor/markdown.js`
- Create: `hub/editor/markdown.test.js`
- Modify: `hub/scripts/build-index.mjs`

- [ ] Scrivere test per il round-trip dei blocchi GFM supportati e per il fallback raw.
- [ ] Aggiungere dipendenze Milkdown/Crepe e una build Vite dedicata, senza riscrivere il catalogo esistente.
- [ ] Implementare caricamento da `?path=...`, stato `canonical/draft/dirty/saving` e schermata di errore accessibile.
- [ ] Montare Crepe con toolbar essenziale e serializzazione Markdown.
- [ ] Implementare pulsanti `Salva bozza`, `Anteprima`, `Ripristina canonico`, `Raw Markdown` e ritorno al catalogo.
- [ ] Generare gli asset editor nella directory pubblica durante `npm run check` e `npm run deploy`.

### Task 4: Collegamento dal catalogo e stile responsive

**Files:**
- Modify: `hub/public/index.html`
- Modify: `hub/public/app.js`
- Modify: `hub/public/styles.css`
- Modify: `hub/README.md`

- [ ] Aggiungere azione `Modifica` alla scheda/documento aperto con path codificato correttamente.
- [ ] Mantenere visibilità esclusiva dei pannelli Task/Annotazioni già corretta.
- [ ] Aggiungere link editor mobile-friendly e stati di focus/errore.
- [ ] Verificare viewport desktop e larghezza mobile senza scroll orizzontale.

### Task 5: Verifica end-to-end locale

**Files:**
- Modify: `hub/README.md`
- Modify: `docs/task-board.md`
- Modify: `docs/registro-avanzamenti.md`

- [ ] Eseguire `npm run check` dalla directory `hub`.
- [ ] Avviare `npm run dev` e verificare health, catalogo, apertura editor, salvataggio bozza, reload e reset.
- [ ] Verificare che il file canonico nel repository non venga modificato dal salvataggio browser.
- [ ] Eseguire controllo `git diff --check` e ispezionare asset generati/segreti esclusi.
- [ ] Aggiornare task board e registro con evidenza dei test; lasciare esplicitamente separata la fase GitHub App/token.

### Task 6: Fase successiva non inclusa

**Files previsti dopo approvazione separata:**
- `hub/src/github-client.js`
- `hub/src/publish-service.js`
- nuovi endpoint publish e test di conflitto
- secret Worker per GitHub App o fine-grained token

- [ ] Scegliere GitHub App oppure fine-grained token limitato al repository.
- [ ] Definire policy di commit, branch e gestione conflitti.
- [ ] Implementare solo dopo test end-to-end della fase bozze.
