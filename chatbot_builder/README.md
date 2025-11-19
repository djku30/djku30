# 🤖 Chatbot Builder

Un chatbot intelligente che genera siti web e applicazioni Windows con un'interfaccia moderna stile Supabase.

![Chatbot Builder](https://img.shields.io/badge/Version-1.0.0-3ECF8E)
![Python](https://img.shields.io/badge/Python-3.7+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.0-lightgrey)

## ✨ Caratteristiche

- 🎨 **Interfaccia Moderna**: Design dark theme ispirato a Supabase
- 🌐 **Generatore di Siti Web**: Crea portfolio, blog, e-commerce e landing pages
- 💻 **Generatore App Windows**: Crea applicazioni desktop con Tkinter
- 💾 **Salvataggio Bot**: Gestisci e riutilizza i tuoi progetti
- ⚙️ **Pannello Impostazioni**: Configura API esterne (opzionale)
- 🚀 **Zero Configurazione**: Funziona subito con generazione locale

## 📋 Requisiti

- Python 3.7 o superiore
- pip (package manager Python)

## 🚀 Installazione e Avvio

### 1. Installa le dipendenze

```bash
cd chatbot_builder
pip install -r requirements.txt
```

### 2. Avvia il server

```bash
python app.py
```

### 3. Apri il browser

Il server si avvierà automaticamente su:

```
http://localhost:5000
```

Oppure se vuoi accedere da altri dispositivi nella rete:

```
http://TUO_IP_LOCALE:5000
```

Per trovare il tuo IP locale:
- **Windows**: `ipconfig` (cerca IPv4)
- **Linux/Mac**: `ifconfig` o `ip addr`

## 🎯 Come Usare

### Creare un Sito Web

1. Clicca su "Sito Web" nella sidebar
2. Descrivi il tipo di sito che vuoi (esempio: "Crea un portfolio moderno")
3. Il chatbot genererà automaticamente HTML, CSS e JavaScript
4. Scarica i file o visualizza il codice

**Esempi di richieste:**
- "Crea un portfolio con sezioni home, about e contatti"
- "Voglio un blog moderno con design minimalista"
- "Genera un sito aziendale per un'agenzia di marketing"

### Creare un'App Windows

1. Clicca su "App Windows" nella sidebar
2. Descrivi l'applicazione che vuoi (esempio: "Crea una calcolatrice")
3. Il chatbot genererà il codice Python con Tkinter
4. Scarica il file e eseguilo con Python

**Esempi di richieste:**
- "Crea una calcolatrice con interfaccia grafica"
- "Voglio un notepad semplice"
- "Genera un'app per gestire todo list"

### I Miei Bot

- Tutti i progetti generati vengono salvati automaticamente
- Accedi ai tuoi bot dalla sezione "I Miei Bot" nella sidebar
- Clicca su un bot per visualizzare il codice
- Elimina bot non necessari con il pulsante cestino

### Impostazioni API

Clicca sull'icona impostazioni (⚙️) in alto a destra per:
- Configurare chiavi API esterne (OpenAI, Anthropic)
- Impostare endpoint personalizzati
- Scegliere tra generazione locale o API esterne

**Nota**: Per default, il chatbot usa la generazione locale (non richiede API esterne).

## 📁 Struttura del Progetto

```
chatbot_builder/
├── app.py                      # Server Flask principale
├── config.py                   # Configurazione
├── requirements.txt            # Dipendenze Python
├── README.md                   # Questo file
│
├── generators/                 # Generatori di codice
│   ├── __init__.py
│   ├── website_generator.py   # Generatore siti web
│   └── windows_app_generator.py # Generatore app Windows
│
├── templates/                  # Template HTML
│   └── index.html             # Interfaccia principale
│
├── static/                     # File statici
│   ├── css/
│   │   └── style.css          # Stili (Supabase-like)
│   └── js/
│       └── app.js             # Logica frontend
│
└── output/                     # Progetti generati (creato automaticamente)
```

## 🎨 Personalizzazione

### Modificare i Colori

Edita `static/css/style.css` e modifica le variabili CSS:

```css
:root {
    --color-brand: #3ECF8E;        /* Colore principale */
    --color-brand-hover: #2fb574;  /* Hover */
    --color-bg-primary: #1a1a1a;   /* Sfondo principale */
    /* ... */
}
```

### Aggiungere Nuovi Template

1. Apri `generators/website_generator.py` o `generators/windows_app_generator.py`
2. Aggiungi un nuovo metodo generatore (es. `_generate_custom`)
3. Registra il template nel dizionario `self.templates`

## 🔧 Risoluzione Problemi

### Il server non si avvia

```bash
# Verifica che Python sia installato
python --version

# Reinstalla le dipendenze
pip install -r requirements.txt --force-reinstall
```

### Porta 5000 già in uso

Modifica `app.py` cambiando la porta:

```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Usa 8080 invece di 5000
```

### I file non vengono scaricati

Controlla che il browser non blocchi i download automatici. Abilita i download multipli dalle impostazioni del browser.

## 🌟 Funzionalità Future

- [ ] Integrazione AI con OpenAI/Anthropic
- [ ] Generazione progetti più complessi
- [ ] Editor di codice integrato
- [ ] Deploy automatico su hosting
- [ ] Generazione app mobile
- [ ] Temi personalizzabili
- [ ] Export come ZIP unico

## 📄 Licenza

Questo progetto è open source e disponibile per uso personale e commerciale.

## 👨‍💻 Sviluppo

Creato con ❤️ usando:
- **Flask** - Framework web Python
- **Vanilla JavaScript** - Nessuna dipendenza frontend
- **CSS3** - Design moderno e responsivo

---

**Versione**: 1.0.0
**Data**: 2024
**Autore**: Chatbot Builder Team

## 🚀 Quick Start (TL;DR)

```bash
cd chatbot_builder
pip install -r requirements.txt
python app.py
# Apri http://localhost:5000 nel browser
```

---

**Buon coding! 🎉**
