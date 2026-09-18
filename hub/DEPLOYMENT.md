Riepilogo istruzioni

# Deploy personale

## Ordine obbligatorio

1. Creare o selezionare un repository GitHub personale privato.
2. Inizializzare e verificare il repository locale.
3. Autenticare Wrangler con l’account Cloudflare personale.
4. Creare il database D1 personale in giurisdizione UE se richiesto.
5. Sostituire il `database_id` placeholder in `wrangler.jsonc`.
6. Applicare `db/schema.sql` al database locale e remoto.
7. Collegare il repository a Workers Builds oppure usare Wrangler.
8. Configurare Cloudflare Access sul dominio del Worker.
9. Verificare health check, documenti, task e annotazioni.

## Vincoli

- Non usare l’account aziendale condiviso.
- Non salvare token nel repository.
- Non pubblicare dati contabili reali prima di avere verificato autenticazione e policy Access.
