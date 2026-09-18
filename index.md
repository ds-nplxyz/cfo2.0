Riepilogo istruzioni

# CFO 2.0 — Index del progetto

## Scopo

Questa è la pagina principale di orientamento del progetto CFO 2.0. Deve permettere di capire rapidamente cosa esiste, cosa è in corso, cosa è bloccato e dove si trovano le informazioni di dettaglio.

## Stato attuale

| Area | Stato | Prossimo passo |
|---|---|---|
| Struttura documentale | In corso | Compilare i contenuti con dati verificati |
| CFO Hub locale | In corso | Verificare l’interfaccia nel browser |
| Cloudflare personale | Da configurare | Autenticare l’account personale |
| Git personale | Da configurare | Creare repository GitHub privato |
| P&L e riclassificazione | Da analizzare | Documentare sorgenti e regole |

## Aree del progetto

- [Documentazione generale](docs/00-contesto-e-obiettivi.md)
- [Architettura dati](docs/01-architettura-dati.md)
- [Processo di chiusura mensile](docs/02-processo-chiusura-mensile.md)
- [Profit & Loss](docs/04-profit-loss.md)
- [Riclassificazione](docs/05-riclassificazione.md)
- [Centri di costo](docs/06-centri-di-costo.md)
- [Filiali](docs/07-filiali.md)
- [Modello dati sorgente](data-model/schema-sorgenti/libro-giornale.md)
- [Modello DWH](data-model/schema-dwh/fact_movimenti_contabili.md)
- [Allocazione costi generali](data-model/allocation/regole-allocazione.md)
- [Documentazione MCP e Trino](mcp/documentazione/trino-connessione.md)
- [Decisioni architetturali](decisions/ADR-001-trino-layer-unico.md)
- [Task board](docs/task-board.md)
- [Registro avanzamenti](docs/registro-avanzamenti.md)

## Roadmap

1. Completare la documentazione delle tabelle e delle regole.
2. Validare il modello P&L e la riclassificazione.
3. Collegare il CFO Hub al repository Git personale.
4. Configurare Cloudflare personale, D1 e Access.
5. Aggiungere task e annotazioni persistenti.
6. Costruire i controlli mensili e il workflow di chiusura.
7. Collegare dashboard e dati reali solo dopo la validazione.

## Regole di aggiornamento

- Aggiornare questo file quando cambia lo stato di un’area o una priorità.
- Registrare gli eventi importanti in [registro avanzamenti](docs/registro-avanzamenti.md).
- Registrare decisioni architetturali negli ADR.
- Collegare ogni task al documento o alla query interessata.
- Non inserire password, token, dati riservati o credenziali.

## Fonte storica

Il contesto iniziale e le decisioni emerse dalla conversazione sono conservati in [chat_iniziale.md](chat_iniziale.md).
