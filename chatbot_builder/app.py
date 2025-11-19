"""
Chatbot Builder - Un chatbot che genera siti web e applicazioni Windows
"""
from flask import Flask, render_template, request, jsonify, send_file
from generators.website_generator import WebsiteGenerator
from generators.windows_app_generator import WindowsAppGenerator
from config import Config
import os
import json
from datetime import datetime

app = Flask(__name__)

# Configurazione
app.config.from_object(Config)
app.config['OUTPUT_FOLDER'] = 'output'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Inizializza i generatori
website_gen = WebsiteGenerator()
windows_gen = WindowsAppGenerator()

@app.route('/')
def index():
    """Pagina principale del chatbot"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint per gestire le richieste del chatbot"""
    try:
        data = request.json
        user_message = data.get('message', '').lower()
        project_type = data.get('type', '')
        requirements = data.get('requirements', {})

        response = {
            'success': True,
            'message': '',
            'code': None,
            'files': []
        }

        # Analizza la richiesta e genera il progetto
        if 'sito' in user_message or 'website' in user_message or project_type == 'website':
            result = website_gen.generate(requirements)
            response['message'] = 'Ho generato il tuo sito web! Ecco i file creati.'
            response['code'] = result['code']
            response['files'] = result['files']

        elif 'app' in user_message or 'applicazione' in user_message or project_type == 'windows':
            result = windows_gen.generate(requirements)
            response['message'] = 'Ho generato la tua applicazione Windows! Ecco il codice.'
            response['code'] = result['code']
            response['files'] = result['files']

        else:
            response['message'] = """
            Ciao! Sono un chatbot che può aiutarti a creare:

            1. **Siti Web** - Dimmi che tipo di sito vuoi (portfolio, blog, e-commerce, ecc.)
            2. **Applicazioni Windows** - Specifica che tipo di applicazione (calcolatrice, gestionale, ecc.)

            Cosa vuoi creare oggi?
            """

        return jsonify(response)

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Errore: {str(e)}'
        }), 500

@app.route('/api/generate/website', methods=['POST'])
def generate_website():
    """Genera un sito web basato sui requisiti"""
    try:
        data = request.json
        requirements = {
            'name': data.get('name', 'Il Mio Sito'),
            'type': data.get('type', 'portfolio'),
            'colors': data.get('colors', {'primary': '#3498db', 'secondary': '#2ecc71'}),
            'sections': data.get('sections', ['home', 'about', 'contact']),
            'features': data.get('features', [])
        }

        result = website_gen.generate(requirements)

        return jsonify({
            'success': True,
            'message': 'Sito web generato con successo!',
            'files': result['files'],
            'code': result['code']
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Errore nella generazione: {str(e)}'
        }), 500

@app.route('/api/generate/windows-app', methods=['POST'])
def generate_windows_app():
    """Genera un'applicazione Windows"""
    try:
        data = request.json
        requirements = {
            'name': data.get('name', 'MyApp'),
            'type': data.get('type', 'utility'),
            'features': data.get('features', []),
            'ui_framework': data.get('ui_framework', 'tkinter')
        }

        result = windows_gen.generate(requirements)

        return jsonify({
            'success': True,
            'message': 'Applicazione Windows generata con successo!',
            'files': result['files'],
            'code': result['code']
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Errore nella generazione: {str(e)}'
        }), 500

@app.route('/api/download/<project_id>')
def download_project(project_id):
    """Scarica il progetto generato"""
    try:
        # Implementa la logica per scaricare il progetto come ZIP
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], project_id)
        if os.path.exists(output_path):
            # Crea un file ZIP e invialo
            import shutil
            zip_path = shutil.make_archive(output_path, 'zip', output_path)
            return send_file(zip_path, as_attachment=True)
        else:
            return jsonify({'error': 'Progetto non trovato'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Ottieni le impostazioni API"""
    try:
        settings = Config.load_api_settings()
        # Nascondi le chiavi API (mostra solo se sono impostate)
        safe_settings = {
            'openai_api_key': '***' if settings.get('openai_api_key') else '',
            'anthropic_api_key': '***' if settings.get('anthropic_api_key') else '',
            'custom_api_endpoint': settings.get('custom_api_endpoint', ''),
            'use_local_generation': settings.get('use_local_generation', True)
        }
        return jsonify(safe_settings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/settings', methods=['POST'])
def update_settings():
    """Aggiorna le impostazioni API"""
    try:
        data = request.json
        current_settings = Config.load_api_settings()

        # Aggiorna solo i campi forniti
        if 'openai_api_key' in data and data['openai_api_key'] != '***':
            current_settings['openai_api_key'] = data['openai_api_key']

        if 'anthropic_api_key' in data and data['anthropic_api_key'] != '***':
            current_settings['anthropic_api_key'] = data['anthropic_api_key']

        if 'custom_api_endpoint' in data:
            current_settings['custom_api_endpoint'] = data['custom_api_endpoint']

        if 'use_local_generation' in data:
            current_settings['use_local_generation'] = data['use_local_generation']

        Config.save_api_settings(current_settings)

        return jsonify({
            'success': True,
            'message': 'Impostazioni salvate con successo!'
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Errore nel salvataggio: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Crea le cartelle necessarie
    os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║        CHATBOT BUILDER - Server Avviato!                ║
    ║                                                          ║
    ║  Apri il browser su: http://localhost:5000              ║
    ║                                                          ║
    ║  Funzionalità:                                           ║
    ║  - Generazione siti web                                  ║
    ║  - Generazione applicazioni Windows                      ║
    ║                                                          ║
    ╚══════════════════════════════════════════════════════════╝
    """)

    app.run(debug=True, host='0.0.0.0', port=5000)
