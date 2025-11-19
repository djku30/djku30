"""
Generatore di Applicazioni Windows
"""
import os
from datetime import datetime

class WindowsAppGenerator:
    def __init__(self):
        self.templates = {
            'utility': self._generate_utility_app,
            'calculator': self._generate_calculator,
            'notepad': self._generate_notepad,
            'todo': self._generate_todo_app,
            'file_manager': self._generate_file_manager
        }

    def generate(self, requirements):
        """Genera un'applicazione Windows basata sui requisiti"""
        app_type = requirements.get('type', 'utility')
        name = requirements.get('name', 'MyApp')
        ui_framework = requirements.get('ui_framework', 'tkinter')

        # Seleziona il template appropriato
        generator_func = self.templates.get(app_type, self._generate_utility_app)

        # Genera i file
        files = generator_func(name, ui_framework)

        return {
            'code': files,
            'files': list(files.keys()),
            'timestamp': datetime.now().isoformat()
        }

    def _generate_utility_app(self, name, ui_framework):
        """Genera un'applicazione utility generica"""
        if ui_framework == 'tkinter':
            return self._generate_tkinter_app(name)
        else:
            return self._generate_tkinter_app(name)

    def _generate_tkinter_app(self, name):
        """Genera un'app Tkinter base"""
        main_code = f'''"""
{name} - Applicazione Windows
Generata automaticamente dal Chatbot Builder
"""
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import json
import os

class {name.replace(' ', '')}App:
    def __init__(self, root):
        self.root = root
        self.root.title("{name}")
        self.root.geometry("800x600")

        # Configura lo stile
        self.setup_styles()

        # Crea l'interfaccia
        self.create_widgets()

    def setup_styles(self):
        """Configura gli stili dell'applicazione"""
        style = ttk.Style()
        style.theme_use('clam')

        # Stili personalizzati
        style.configure('Title.TLabel', font=('Arial', 16, 'bold'))
        style.configure('Action.TButton', padding=10, font=('Arial', 10))

    def create_widgets(self):
        """Crea i widget dell'interfaccia"""
        # Frame principale
        main_frame = ttk.Frame(self.root, padding="20")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        # Titolo
        title = ttk.Label(main_frame, text="{name}", style='Title.TLabel')
        title.grid(row=0, column=0, columnspan=2, pady=20)

        # Menu
        self.create_menu()

        # Area di lavoro
        self.create_work_area(main_frame)

        # Barra di stato
        self.create_status_bar()

        # Configura il ridimensionamento
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(0, weight=1)
        main_frame.columnconfigure(0, weight=1)
        main_frame.rowconfigure(1, weight=1)

    def create_menu(self):
        """Crea il menu dell'applicazione"""
        menubar = tk.Menu(self.root)
        self.root.config(menu=menubar)

        # Menu File
        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="File", menu=file_menu)
        file_menu.add_command(label="Nuovo", command=self.new_file, accelerator="Ctrl+N")
        file_menu.add_command(label="Apri", command=self.open_file, accelerator="Ctrl+O")
        file_menu.add_command(label="Salva", command=self.save_file, accelerator="Ctrl+S")
        file_menu.add_separator()
        file_menu.add_command(label="Esci", command=self.quit_app)

        # Menu Modifica
        edit_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Modifica", menu=edit_menu)
        edit_menu.add_command(label="Copia", accelerator="Ctrl+C")
        edit_menu.add_command(label="Incolla", accelerator="Ctrl+V")

        # Menu Aiuto
        help_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Aiuto", menu=help_menu)
        help_menu.add_command(label="Informazioni", command=self.show_about)

        # Shortcuts
        self.root.bind('<Control-n>', lambda e: self.new_file())
        self.root.bind('<Control-o>', lambda e: self.open_file())
        self.root.bind('<Control-s>', lambda e: self.save_file())

    def create_work_area(self, parent):
        """Crea l'area di lavoro principale"""
        work_frame = ttk.LabelFrame(parent, text="Area di Lavoro", padding="10")
        work_frame.grid(row=1, column=0, columnspan=2, sticky=(tk.W, tk.E, tk.N, tk.S), pady=10)

        # Text widget con scrollbar
        text_frame = ttk.Frame(work_frame)
        text_frame.pack(fill=tk.BOTH, expand=True)

        scrollbar = ttk.Scrollbar(text_frame)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.text_area = tk.Text(text_frame, wrap=tk.WORD, yscrollcommand=scrollbar.set)
        self.text_area.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.config(command=self.text_area.yview)

        # Pulsanti di azione
        button_frame = ttk.Frame(work_frame)
        button_frame.pack(fill=tk.X, pady=10)

        ttk.Button(button_frame, text="Processa", style='Action.TButton',
                  command=self.process_data).pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame, text="Pulisci", style='Action.TButton',
                  command=self.clear_data).pack(side=tk.LEFT, padx=5)

    def create_status_bar(self):
        """Crea la barra di stato"""
        self.status_bar = ttk.Label(self.root, text="Pronto", relief=tk.SUNKEN, anchor=tk.W)
        self.status_bar.grid(row=1, column=0, sticky=(tk.W, tk.E))

    def new_file(self):
        """Crea un nuovo file"""
        self.text_area.delete(1.0, tk.END)
        self.update_status("Nuovo file creato")

    def open_file(self):
        """Apre un file"""
        filename = filedialog.askopenfilename(
            title="Apri file",
            filetypes=[("File di testo", "*.txt"), ("Tutti i file", "*.*")]
        )
        if filename:
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                    self.text_area.delete(1.0, tk.END)
                    self.text_area.insert(1.0, content)
                self.update_status(f"File aperto: {{filename}}")
            except Exception as e:
                messagebox.showerror("Errore", f"Impossibile aprire il file: {{e}}")

    def save_file(self):
        """Salva il file"""
        filename = filedialog.asksaveasfilename(
            title="Salva file",
            defaultextension=".txt",
            filetypes=[("File di testo", "*.txt"), ("Tutti i file", "*.*")]
        )
        if filename:
            try:
                content = self.text_area.get(1.0, tk.END)
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                self.update_status(f"File salvato: {{filename}}")
                messagebox.showinfo("Successo", "File salvato con successo!")
            except Exception as e:
                messagebox.showerror("Errore", f"Impossibile salvare il file: {{e}}")

    def process_data(self):
        """Processa i dati nell'area di testo"""
        content = self.text_area.get(1.0, tk.END).strip()
        if content:
            # Esempio di processing: conta caratteri, parole, righe
            chars = len(content)
            words = len(content.split())
            lines = content.count('\\n') + 1

            result = f"\\nStatistiche:\\n"
            result += f"Caratteri: {{chars}}\\n"
            result += f"Parole: {{words}}\\n"
            result += f"Righe: {{lines}}\\n"

            messagebox.showinfo("Risultato", result)
            self.update_status("Dati processati")
        else:
            messagebox.showwarning("Attenzione", "Nessun dato da processare!")

    def clear_data(self):
        """Pulisce l'area di testo"""
        if messagebox.askyesno("Conferma", "Vuoi davvero pulire tutto il contenuto?"):
            self.text_area.delete(1.0, tk.END)
            self.update_status("Area di lavoro pulita")

    def show_about(self):
        """Mostra le informazioni sull'applicazione"""
        messagebox.showinfo(
            "{name}",
            f"{name}\\nVersione 1.0\\n\\nGenerato con Chatbot Builder\\n© 2024"
        )

    def update_status(self, message):
        """Aggiorna la barra di stato"""
        self.status_bar.config(text=message)

    def quit_app(self):
        """Chiude l'applicazione"""
        if messagebox.askyesno("Conferma", "Vuoi davvero uscire?"):
            self.root.quit()

def main():
    """Funzione principale"""
    root = tk.Tk()
    app = {name.replace(' ', '')}App(root)

    # Centra la finestra sullo schermo
    root.update_idletasks()
    width = root.winfo_width()
    height = root.winfo_height()
    x = (root.winfo_screenwidth() // 2) - (width // 2)
    y = (root.winfo_screenheight() // 2) - (height // 2)
    root.geometry(f'{{width}}x{{height}}+{{x}}+{{y}}')

    root.mainloop()

if __name__ == "__main__":
    main()
'''

        readme = f'''# {name}

Applicazione Windows generata automaticamente dal Chatbot Builder.

## Requisiti

- Python 3.7+
- tkinter (incluso con Python)

## Installazione

```bash
pip install -r requirements.txt
```

## Utilizzo

```bash
python main.py
```

## Funzionalità

- Interfaccia grafica moderna
- Menu con scorciatoie da tastiera
- Apertura e salvataggio file
- Area di lavoro con scrollbar
- Barra di stato

## Personalizzazione

Puoi personalizzare l'applicazione modificando il file `main.py`.
'''

        requirements = '''# Requisiti per l'applicazione Windows
# tkinter è incluso con Python, non serve installarlo
'''

        return {
            'main.py': main_code,
            'README.md': readme,
            'requirements.txt': requirements
        }

    def _generate_calculator(self, name, ui_framework):
        """Genera una calcolatrice"""
        calc_code = '''"""
Calcolatrice - Applicazione Windows
"""
import tkinter as tk
from tkinter import ttk

class Calculator:
    def __init__(self, root):
        self.root = root
        self.root.title("Calcolatrice")
        self.root.geometry("350x450")
        self.root.resizable(False, False)

        self.expression = ""
        self.create_widgets()

    def create_widgets(self):
        """Crea l'interfaccia della calcolatrice"""
        # Display
        self.display = tk.Entry(self.root, font=('Arial', 20), justify='right')
        self.display.grid(row=0, column=0, columnspan=4, padx=10, pady=20, ipady=10)

        # Pulsanti
        buttons = [
            ('7', 1, 0), ('8', 1, 1), ('9', 1, 2), ('/', 1, 3),
            ('4', 2, 0), ('5', 2, 1), ('6', 2, 2), ('*', 2, 3),
            ('1', 3, 0), ('2', 3, 1), ('3', 3, 2), ('-', 3, 3),
            ('0', 4, 0), ('.', 4, 1), ('=', 4, 2), ('+', 4, 3),
            ('C', 5, 0)
        ]

        for (text, row, col) in buttons:
            btn = tk.Button(self.root, text=text, font=('Arial', 18),
                          command=lambda t=text: self.on_button_click(t))
            btn.grid(row=row, column=col, padx=5, pady=5, ipadx=20, ipady=20, sticky='nsew')

        # Configura il ridimensionamento
        for i in range(4):
            self.root.columnconfigure(i, weight=1)
        for i in range(1, 6):
            self.root.rowconfigure(i, weight=1)

    def on_button_click(self, char):
        """Gestisce i click sui pulsanti"""
        if char == 'C':
            self.expression = ""
            self.display.delete(0, tk.END)
        elif char == '=':
            try:
                result = str(eval(self.expression))
                self.display.delete(0, tk.END)
                self.display.insert(0, result)
                self.expression = result
            except:
                self.display.delete(0, tk.END)
                self.display.insert(0, "Errore")
                self.expression = ""
        else:
            self.expression += str(char)
            self.display.delete(0, tk.END)
            self.display.insert(0, self.expression)

if __name__ == "__main__":
    root = tk.Tk()
    app = Calculator(root)
    root.mainloop()
'''
        return {'calculator.py': calc_code}

    def _generate_notepad(self, name, ui_framework):
        """Genera un notepad"""
        return self._generate_tkinter_app("Notepad")

    def _generate_todo_app(self, name, ui_framework):
        """Genera un'app todo list"""
        return self._generate_tkinter_app("TodoApp")

    def _generate_file_manager(self, name, ui_framework):
        """Genera un file manager"""
        return self._generate_tkinter_app("FileManager")
