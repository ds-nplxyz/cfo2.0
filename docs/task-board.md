Riepilogo istruzioni

# Task board

## Da fare

- [ ] **[Trino | Media]** Documentare cataloghi, schemi e tabelle Trino. Documento: `mcp/documentazione/cataloghi-e-schemi.md`. Criterio: catalogo/schemi/tabelle verificati e annotati.
- [ ] **[Riclassificazione | Alta]** Validare la tabella flat di riclassificazione attuale. Documento: `mcp/documentazione/tabella-riclassificazione-attuale.md`. Criterio: struttura, chiavi, regole e controlli documentati.
- [ ] **[Sicurezza | Alta]** Verificare l’accesso da una sessione non autenticata. Documento: `hub/DEPLOYMENT.md`. Criterio: dominio negato prima del login e raggiungibile dopo il login.

## In corso

- [ ] **[CFO Hub | Alta]** Aggiornare task e annotazioni dal portale remoto. Documento: `hub/README.md`. Criterio: creazione e consultazione verificate su D1 remoto.
- [ ] **[CFO Hub editor | Alta]** Applicare la migrazione `document_drafts` al D1 remoto e pubblicare l’editor Milkdown. Documento: `hub/README.md`. Criterio: apertura documento, salvataggio bozza e recupero dopo reload sul dominio protetto.

## Bloccati

Nessun blocco registrato.

## Completati

- [x] Creare la struttura iniziale del progetto.
- [x] Compilare i Markdown con istruzioni base.
- [x] Creare la prima app locale CFO Hub.
- [x] **[CFO Hub editor | Alta]** Implementare localmente editor Milkdown, modalità raw, bozze D1, diff e link dal catalogo. Evidenza: `npm run check`, migrazione D1 locale e ciclo HTTP documento/bozza/diff/reset verificati.
- [x] Predisporre schema D1 locale.
- [x] **[GitHub | Alta]** Creare e collegare il repository privato `ds-nplxyz/cfo2.0`. Evidenza: branch `main` pubblicato su GitHub.
- [x] **[Cloudflare | Alta]** Autenticare Wrangler con l’account personale. Evidenza: deploy Workers Builds completato.
- [x] **[Cloudflare D1 | Alta]** Creare e applicare lo schema al database remoto `cfo-hub`. Evidenza: binding D1 configurato in `hub/wrangler.jsonc`.
- [x] **[Cloudflare Workers | Alta]** Pubblicare il CFO Hub sul dominio `https://cfo.nonplusultra.xyz/`. Evidenza: Worker raggiungibile dal browser.
- [x] **[Cloudflare Access | Alta]** Proteggere produzione e preview con policy `Cloudflare account members`. Evidenza: Worker Access `All traffic`.

## Regola

Ogni task deve indicare area, priorità, documento collegato e criterio di completamento.
