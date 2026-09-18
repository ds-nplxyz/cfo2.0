Riepilogo istruzioni

# CFO Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Creare una prima applicazione locale navigabile da browser per il progetto CFO 2.0, predisposta per deploy Cloudflare e annotazioni/task persistenti.

**Architecture:** Un Worker Cloudflare servirà gli asset statici e in seguito le API. Il contenuto documentale resterà nei Markdown del repository; task e annotazioni saranno separati in D1. La prima consegna locale userà un server di sviluppo semplice e un’interfaccia web senza credenziali.

**Tech Stack:** Node.js, JavaScript, HTML/CSS, Cloudflare Workers Static Assets, D1, Wrangler.

**Spec:** `docs/superpowers/specs/2026-09-18-cfo-hub-design.md`

## Global Constraints

- Non inserire segreti, token o dati contabili reali.
- Non collegare l’app all’account Cloudflare aziendale.
- Mantenere i Markdown come fonte documentale.
- Separare task e annotazioni dai file Markdown.
- Verificare localmente prima di ogni configurazione remota.

---

### Task 1: Scaffolding dell’app Hub

**Files:**
- Create: `hub/package.json`
- Create: `hub/wrangler.jsonc`
- Create: `hub/public/index.html`
- Create: `hub/public/app.js`
- Create: `hub/public/styles.css`
- Create: `hub/README.md`

**Deliverable:** Una pagina locale che presenta il progetto e le aree principali, con struttura pronta per essere servita come asset statico.

- [ ] **Step 1: Create the package and Wrangler configuration**

Definire script `dev`, `build` e `deploy` senza token nel file. Configurare gli asset statici da `public/` e una compatibility date esplicita.

- [ ] **Step 2: Create the static application shell**

Creare una pagina responsive con sidebar, ricerca locale, elenco aree e pannello contenuto. Usare dati iniziali dichiarativi, senza simulare dati contabili.

- [ ] **Step 3: Document local startup**

Documentare i prerequisiti e il comando locale in `hub/README.md`, distinguendo sviluppo locale da deploy remoto.

- [ ] **Step 4: Verify the shell**

Run: `npm install` e `npm run dev` dalla directory `hub`.
Expected: il server locale risponde e la pagina mostra il titolo CFO Hub senza errori JavaScript.

### Task 2: Indicizzazione locale dei Markdown

**Files:**
- Create: `hub/scripts/build-index.mjs`
- Create: `hub/public/content/index.json`
- Modify: `hub/package.json`
- Modify: `hub/README.md`

**Deliverable:** Un comando locale che legge i Markdown del progetto, esclude segreti e cartelle tecniche, e genera un indice JSON per la navigazione.

- [ ] **Step 1: Define the index contract**

Ogni voce deve contenere `path`, `title`, `area`, `relativePath`, `excerpt` e `updatedAt`.

- [ ] **Step 2: Implement the index builder**

Leggere i Markdown dalla root del progetto, ignorare `node_modules`, `.wrangler` e file sensibili, ricavare titolo e primo contenuto utile, quindi scrivere `hub/public/content/index.json`.

- [ ] **Step 3: Connect the browser UI**

Caricare `content/index.json` e usare i dati per la ricerca e la lista dei documenti.

- [ ] **Step 4: Verify indexing**

Run: `npm run build:index`.
Expected: `hub/content/index.json` contiene i Markdown esistenti senza credenziali e la pagina li elenca.

### Task 3: Schema D1 per task e annotazioni

**Files:**
- Create: `hub/db/schema.sql`
- Create: `hub/db/seed.sql`
- Modify: `hub/wrangler.jsonc`
- Modify: `hub/README.md`

**Deliverable:** Schema versionato per `tasks`, `annotations` e `activity_log`, predisposto per una binding D1 personale.

- [ ] **Step 1: Define relational tables**

Usare identificativi testuali, timestamp ISO, stato controllato, percorso documento e ancora opzionale. Aggiungere indici per stato e documento.

- [ ] **Step 2: Add safe seed data**

Inserire solo un task e un’annotazione dimostrativi chiaramente marcati come dati locali di esempio.

- [ ] **Step 3: Add D1 configuration placeholders**

Inserire nel Wrangler solo il nome logico della binding e indicare nel README che il `database_id` viene aggiunto dopo l’autenticazione dell’account personale.

- [ ] **Step 4: Verify SQL locally**

Run: `npx wrangler d1 execute cfo-hub-local --local --file=hub/db/schema.sql` dalla root corretta del progetto.
Expected: le tabelle vengono create senza usare un account remoto.

### Task 4: API locale e UI per task/annotazioni

**Files:**
- Create: `hub/src/index.js`
- Modify: `hub/wrangler.jsonc`
- Modify: `hub/public/app.js`
- Modify: `hub/public/index.html`
- Modify: `hub/public/styles.css`

**Deliverable:** Endpoint locali per leggere e creare task/annotazioni, con form essenziali nella UI.

- [ ] **Step 1: Implement read endpoints**

Implementare `GET /api/tasks`, `GET /api/annotations` e `GET /api/health`, con risposte JSON e errori strutturati.

- [ ] **Step 2: Implement write endpoints**

Implementare `POST /api/tasks` e `POST /api/annotations`, validando titolo, testo e percorso prima dell’inserimento D1.

- [ ] **Step 3: Connect forms**

Aggiungere form per nuovo task e nuova annotazione, con messaggio di esito accessibile e ricarica dei dati.

- [ ] **Step 4: Verify API behavior**

Run: `npm run dev` e chiamare gli endpoint con browser o `Invoke-RestMethod`.
Expected: health check 200, letture JSON valide, input incompleto rifiutato con 400.

### Task 5: Verifica finale e predisposizione al deploy

**Files:**
- Modify: `hub/README.md`
- Create: `hub/.gitignore`
- Create: `hub/.dev.vars.example`
- Create: `hub/DEPLOYMENT.md`

**Deliverable:** Configurazione sicura e checklist per il collegamento futuro all’account Cloudflare personale e a un repository Git personale.

- [ ] **Step 1: Exclude local state and secrets**

Ignorare `.wrangler`, `.dev.vars`, database locali, log e output temporanei.

- [ ] **Step 2: Document account boundary**

Indicare che l’utente deve autenticarsi con l’account Cloudflare personale prima di creare D1 o eseguire deploy.

- [ ] **Step 3: Document Git choice**

Raccomandare un repository GitHub personale privato; Cloudflare Workers Builds supporta GitHub/GitLab e deploy su push.

- [ ] **Step 4: Run final local checks**

Run: `npm run build:index`, controllo JSON, avvio locale e test health/API.
Expected: tutto il percorso locale funziona senza account remoto.
