Riepilogo istruzioni

# CFO 2.0 Hub

Prima versione locale del portale browser per il progetto CFO 2.0.

## Avvio locale

Prerequisiti: Node.js e npm.

```powershell
npm install
npm run build:index
npm run dev
```

Aprire l’URL indicato da Wrangler, normalmente `http://localhost:8787`.

## Cosa contiene

- `public/`: interfaccia web statica;
- `scripts/build-index.mjs`: indicizzazione dei Markdown;
- `src/index.js`: API Worker;
- `db/schema.sql`: schema D1;
- `wrangler.jsonc`: configurazione locale/remota predisposta.

## Account e deploy

Non eseguire `npm run deploy` finché Wrangler non è autenticato con l’account Cloudflare personale. Il `database_id` nel file di configurazione è un placeholder e deve essere sostituito dopo la creazione del D1 personale.

Il repository Git consigliato è un repository GitHub personale privato. Cloudflare Workers Builds può collegarsi a GitHub o GitLab e distribuire il progetto al push su un branch configurato.
