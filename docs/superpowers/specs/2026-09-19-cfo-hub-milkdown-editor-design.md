Riepilogo istruzioni

# CFO Hub: editor Markdown browser-first

## Obiettivo

Permettere di leggere e modificare dal browser i documenti Markdown del progetto CFO 2.0, senza Obsidian, mantenendo GitHub come sorgente canonica e Cloudflare Hub come interfaccia protetta.

## Decisioni architetturali

- **Cloudflare Access** protegge Worker, API e pagina editor.
- **Milkdown/Crepe** fornisce l’editor visuale WYSIWYG Markdown, con fallback al testo grezzo per file avanzati.
- **D1** conserva bozze, versioni temporanee, task e annotazioni; non sostituisce il repository.
- **GitHub** resta la fonte canonica dei file pubblicati.
- **Workers Build** ricostruisce l’indice e pubblica il contenuto dopo un commit sul branch configurato.
- **R2** resta opzionale per backup/export, non è necessario per la prima versione.

## Flusso utente

1. L’utente apre un documento dal catalogo.
2. Seleziona `Modifica`.
3. Il browser apre `/edit.html?path=...` e carica Markdown canonico più eventuale bozza D1.
4. Milkdown mostra il contenuto modificabile.
5. `Salva bozza` persiste il testo Markdown in D1.
6. `Anteprima modifiche` mostra diff tra canonico e bozza.
7. `Pubblica` sarà abilitato solo nella fase GitHub e creerà un commit controllato.
8. Dopo il commit, l’indice viene rigenerato dal deploy e la bozza viene marcata pubblicata.

## Confini della prima incrementazione

La prima incrementazione implementa editor, caricamento documento, bozze D1, autosave esplicito, anteprima diff e modalità raw Markdown. Non implementa ancora commit GitHub automatici finché non viene scelto e configurato il meccanismo di autenticazione server-side.

## Contratti API

- `GET /api/documents/:path` — restituisce `{ path, content, sourceUpdatedAt }` dopo validazione del percorso.
- `GET /api/drafts/:path` — restituisce la bozza corrente oppure `404`.
- `PUT /api/drafts/:path` — body `{ content, baseUpdatedAt }`; esegue upsert, aggiorna `updated_at` e restituisce la bozza.
- `DELETE /api/drafts/:path` — elimina la bozza solo su azione esplicita.
- `GET /api/diff/:path` — restituisce dati sufficienti al client per mostrare canonico, bozza e stato.

I percorsi sono relativi alla root documentale, normalizzati con slash `/`, e non possono uscire dalla root tramite `..`, backslash o file esclusi dall’indice.

## Modello D1

Nuova tabella `document_drafts`:

- `document_path TEXT PRIMARY KEY`
- `content TEXT NOT NULL`
- `base_updated_at TEXT`
- `status TEXT CHECK (status IN ('draft', 'published', 'discarded'))`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`
- `published_at TEXT`

Le operazioni di modifica devono registrare un evento in `activity_log` senza salvare segreti.

## Frontend e compatibilità Markdown

- L’attuale pagina Hub rimane il catalogo e il pannello operativo.
- L’editor viene compilato separatamente in un entry point dedicato, per limitare il rischio sul frontend esistente.
- Milkdown copre GFM comune: titoli, paragrafi, liste, citazioni, codice, tabelle e link.
- File con SQL, diagrammi Mermaid o sintassi non supportata devono poter essere modificati in modalità raw senza perdita di testo.
- Il salvataggio deve essere esplicito; eventuale autosave sarà un miglioramento successivo e non deve sovrascrivere silenziosamente una bozza.

## Sicurezza e concorrenza

- Nessun token GitHub o Cloudflare nel browser, nel repository o in D1.
- Le API assumono la protezione Cloudflare Access già configurata.
- La pubblicazione GitHub dovrà usare una GitHub App limitata al repository oppure, solo come bootstrap, un fine-grained token limitato allo stesso repository e conservato come secret Worker.
- `baseUpdatedAt` serve a rilevare una modifica remota intervenuta dopo il caricamento; in caso di conflitto il sistema blocca la pubblicazione e mostra il diff.
- La prima fase non effettua commit o push esterni.

## Criteri di accettazione

- Un documento Markdown esistente è apribile dall’elenco in modalità editor.
- Il contenuto visualizzato può essere modificato e salvato in D1.
- Riaprendo la pagina, la bozza è recuperata senza alterare il file canonico.
- Anteprima e reset distinguono chiaramente canonico e bozza.
- Un documento avanzato può essere aperto in raw mode.
- Percorsi non validi sono rifiutati con `400` o `404` e non consentono traversal.
- `npm run check` passa e le API sono verificabili localmente senza segreti.
