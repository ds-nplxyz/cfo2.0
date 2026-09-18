Riepilogo istruzioni

# CFO Hub: design iniziale

## Obiettivo

Rendere il progetto CFO 2.0 consultabile da browser ovunque, mantenendo i file Markdown come fonte documentale e aggiungendo un livello separato per task e annotazioni.

## Architettura approvata

- Repository locale/Git: fonte dei Markdown, query, decisioni e documentazione.
- Cloudflare Worker: applicazione web e API.
- Static Assets: interfaccia web e documenti pubblicabili.
- D1: task, annotazioni, registro eventi e stato operativo.
- Cloudflare Access: autenticazione dell’utente personale.

## Confini della prima versione

La prima versione deve offrire navigazione dei documenti, ricerca, task e annotazioni. Non deve ancora modificare automaticamente i Markdown dal browser e non deve contenere dati contabili reali o credenziali.

## Modello operativo

Le modifiche strutturali ai Markdown avvengono localmente tramite Git. Le annotazioni web sono record separati collegati a percorso file e ancora/sezione. Una successiva versione potrà proporre modifiche Markdown tramite branch o Pull Request.

## Sicurezza

Nessun token Cloudflare, GitHub o database viene salvato nel repository. L’applicazione remota sarà collegata esclusivamente all’account Cloudflare personale dell’utente.

## Criteri di accettazione

- L’app parte localmente con un comando documentato.
- `index.md` e i Markdown del progetto sono navigabili.
- È possibile cercare per titolo e contenuto indicizzato.
- Task e annotazioni hanno API e schema separati dai documenti.
- La configurazione Cloudflare è predisposta ma non autenticata né deployata senza l’account personale.
