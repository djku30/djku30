# 🪟 Chatbot Builder - Guida Windows

Guida completa per installare e usare il Chatbot Builder su Windows.

---

## 📥 **Passo 1: Scarica il Progetto**

### Opzione A: Con Git (Raccomandato)

Se hai Git installato:

```cmd
git clone https://github.com/djku30/djku30.git
cd djku30\chatbot_builder
```

### Opzione B: Download ZIP

1. Vai su: https://github.com/djku30/djku30
2. Click su "Code" → "Download ZIP"
3. Estrai lo ZIP in una cartella (es: `C:\Users\TuoNome\Desktop\chatbot_builder`)
4. Apri quella cartella

---

## 🐍 **Passo 2: Installa Python**

Se non hai Python installato:

1. **Scarica Python**: https://www.python.org/downloads/
2. **Scarica l'ultima versione** (es: Python 3.11 o 3.12)
3. **IMPORTANTE**: Durante l'installazione, seleziona:
   - ✅ **"Add Python to PATH"**
   - ✅ Installa per tutti gli utenti (opzionale)

4. Verifica l'installazione:
   ```cmd
   python --version
   ```
   Dovresti vedere: `Python 3.x.x`

---

## ⚙️ **Passo 3: Setup Automatico**

Doppio click su: **`setup.bat`**

Questo installerà automaticamente Flask e le dipendenze necessarie.

**Oppure manualmente:**
```cmd
pip install Flask==3.0.0 Werkzeug==3.0.1
```

---

## 🚀 **Passo 4: Avvia l'Applicazione**

Doppio click su: **`start.bat`**

Il server si avvierà e il browser si aprirà automaticamente su:
```
http://localhost:5000
```

---

## 🎨 **Come Usare l'Applicazione**

### 🌐 **Creare un Sito Web**

1. Click su **"Sito Web"** nella sidebar sinistra
2. Scrivi nella chat cosa vuoi creare:
   - "Crea un portfolio moderno con sezioni home, about e progetti"
   - "Voglio un blog con design minimalista"
   - "Genera un sito aziendale per un'agenzia di marketing"

3. Il chatbot genererà HTML, CSS e JavaScript
4. Click su **"Download"** per scaricare i file

### 💻 **Creare un'App Windows**

1. Click su **"App Windows"** nella sidebar
2. Scrivi cosa vuoi creare:
   - "Crea una calcolatrice con interfaccia grafica"
   - "Voglio un notepad semplice"
   - "Genera un'app per gestire todo list"

3. Il chatbot genererà codice Python/Tkinter
4. Scarica il file e eseguilo con: `python nome_file.py`

### 💾 **I Miei Bot**

- Tutti i progetti vengono salvati automaticamente
- Li trovi nella sezione **"I Miei Bot"** nella sidebar
- Click su un bot per vedere il codice generato
- Elimina bot con l'icona cestino 🗑️

### ⚙️ **Impostazioni**

- Click sull'icona **⚙️** in alto a destra
- Configura chiavi API esterne (opzionale)
- Per default usa la generazione locale (non serve API)

---

## 🛑 **Fermare il Server**

Nel terminale/cmd dove gira il server:
- Premi **CTRL + C**
- Oppure chiudi la finestra

---

## ❓ **Risoluzione Problemi**

### ⚠️ Errore: "Python non trovato"

**Soluzione:**
1. Reinstalla Python da: https://www.python.org/downloads/
2. **Importante**: Seleziona "Add Python to PATH"
3. Riavvia il computer
4. Riprova `setup.bat`

### ⚠️ Errore: "pip non riconosciuto"

**Soluzione:**
```cmd
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### ⚠️ Porta 5000 già in uso

**Soluzione:** Modifica `app.py` alla fine:
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Cambia 5000 in 8080
```

Poi apri: `http://localhost:8080`

### ⚠️ Il browser non si apre automaticamente

**Soluzione:** Apri manualmente:
```
http://localhost:5000
```

### ⚠️ Antivirus blocca Python

**Soluzione:** Aggiungi eccezione per:
- `python.exe`
- La cartella del progetto

---

## 📂 **Struttura File**

```
chatbot_builder/
│
├── start.bat              ← Doppio click per avviare
├── setup.bat              ← Doppio click per installare
├── app.py                 ← Server Flask
├── requirements.txt       ← Dipendenze
├── README.md              ← Documentazione completa
│
├── generators/            ← Generatori di codice
│   ├── website_generator.py
│   └── windows_app_generator.py
│
├── templates/             ← Interfaccia HTML
│   └── index.html
│
└── static/                ← CSS e JavaScript
    ├── css/style.css
    └── js/app.js
```

---

## 💡 **Suggerimenti**

### Per Sviluppatori

Se vuoi modificare il codice:
1. Modifica i file in `generators/` per cambiare cosa viene generato
2. Modifica `static/css/style.css` per cambiare i colori
3. Modifica `templates/index.html` per cambiare l'interfaccia

### Per Esportare i Progetti

Tutti i siti web generati:
1. Salva i file HTML/CSS/JS in una cartella
2. Apri `index.html` nel browser
3. Funziona offline!

Tutte le app Windows generate:
1. Salva il file `.py`
2. Esegui con: `python nome_file.py`
3. Oppure crea un eseguibile con PyInstaller:
   ```cmd
   pip install pyinstaller
   pyinstaller --onefile --windowed nome_file.py
   ```

---

## 🎓 **Tutorial Video (Consigliato)**

1. **Primo Avvio**: Doppio click su `setup.bat`, poi `start.bat`
2. **Primo Progetto**: Scrivi "crea un portfolio" e premi Invio
3. **Download**: Click su "Download" per scaricare i file
4. **Testare**: Apri `index.html` nel browser

---

## 📧 **Supporto**

Problemi? Contattami su GitHub:
- Repository: https://github.com/djku30/djku30
- Issues: https://github.com/djku30/djku30/issues

---

## 🎉 **Buon Divertimento!**

Ora puoi creare siti e app con l'intelligenza artificiale! 🚀

---

**Versione**: 1.0.0
**Sistema**: Windows 10/11
**Python**: 3.7+
**Licenza**: Open Source
