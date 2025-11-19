# Replit IDE

Un IDE moderno simile a Replit costruito con React e Node.js, con editor di codice Monaco, file browser, terminal integrato e output in tempo reale.

## Caratteristiche

- **Editor di Codice**: Monaco Editor (lo stesso editor di VS Code) con syntax highlighting per JavaScript, Python, HTML, CSS e altri linguaggi
- **File Explorer**: Navigazione intuitiva dei file con possibilità di creare, eliminare e organizzare file e cartelle
- **Terminal Integrato**: Terminal completamente funzionale con WebSocket per interazione in tempo reale
- **Esecuzione Codice**: Esegui JavaScript, Python e Bash direttamente nell'IDE con output immediato
- **Split View**: Layout responsive con pannelli ridimensionabili
- **Auto-save**: Salva automaticamente con Ctrl+S o Cmd+S
- **Tema Dark**: Interfaccia moderna con tema scuro simile a VS Code

## Stack Tecnologico

### Frontend
- React 18
- Monaco Editor (VS Code editor)
- xterm.js (terminal emulator)
- react-split (pannelli ridimensionabili)
- Lucide React (icone)

### Backend
- Node.js
- Express
- WebSocket (ws)
- node-pty (terminal backend)

## Installazione

### Prerequisiti
- Node.js 16+ installato
- npm o yarn

### Setup

1. Clona il repository:
```bash
git clone <repository-url>
cd djku30
```

2. Installa le dipendenze del server:
```bash
npm install
```

3. Installa le dipendenze del client:
```bash
cd client
npm install
cd ..
```

4. Configura le variabili d'ambiente del client:
```bash
cp client/.env.example client/.env
```

## Utilizzo

### Modalità Sviluppo

Avvia sia il server che il client in modalità sviluppo:

```bash
npm run dev
```

Questo comando avvierà:
- Server backend su `http://localhost:3001`
- Client React su `http://localhost:3000`

### Modalità Produzione

1. Costruisci il client:
```bash
npm run build
```

2. Avvia il server:
```bash
npm start
```

L'applicazione sarà disponibile su `http://localhost:3001`

## Struttura del Progetto

```
djku30/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/    # Componenti React
│   │   │   ├── Editor.js        # Monaco Editor
│   │   │   ├── FileExplorer.js  # File browser
│   │   │   ├── Terminal.js      # Terminal integrato
│   │   │   ├── Preview.js       # Output preview
│   │   │   └── Header.js        # Header con pulsante Run
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Backend Node.js
│   └── index.js          # Server Express + WebSocket
├── workspace/            # Directory di lavoro (creata automaticamente)
├── package.json
└── README.md
```

## Funzionalità

### Editor di Codice
- Syntax highlighting automatico basato sull'estensione del file
- Auto-completamento
- Minimap
- Line numbers
- Salvataggio con `Ctrl+S` o `Cmd+S`

### File Operations
- **Nuovo File**: Click sull'icona documento nella barra del file explorer
- **Nuova Cartella**: Click sull'icona + nella barra del file explorer
- **Elimina**: Click sull'icona cestino accanto al file/cartella
- **Apri File**: Click sul nome del file

### Esecuzione Codice
- Click sul pulsante verde "Run" o `Ctrl+Enter`
- Supporta: JavaScript (.js), Python (.py), Bash (.sh)
- L'output appare nella tab "Output"

### Terminal
- Terminal bash completo
- Supporta tutti i comandi bash standard
- Accesso alla directory workspace
- Comunicazione in tempo reale via WebSocket

## API Endpoints

- `GET /api/files` - Ottieni l'albero dei file
- `GET /api/file?path=<path>` - Leggi contenuto file
- `POST /api/file` - Salva file
- `POST /api/create` - Crea file o cartella
- `DELETE /api/file?path=<path>` - Elimina file o cartella
- `POST /api/execute` - Esegui codice

## WebSocket

Il terminal usa WebSocket per la comunicazione in tempo reale:
- Endpoint: `ws://localhost:3001`
- Messaggi:
  - `{type: 'input', data: string}` - Input da client a server
  - `{type: 'output', data: string}` - Output da server a client

## Sicurezza

**IMPORTANTE**: Questo IDE è pensato per uso locale/sviluppo. Prima di deployare in produzione:

- Implementa autenticazione utente
- Aggiungi sandboxing per l'esecuzione del codice
- Limita l'accesso al filesystem
- Implementa rate limiting
- Usa HTTPS per le connessioni WebSocket
- Valida e sanitizza tutti gli input

## Licenza

MIT

## Autore

@djku30
