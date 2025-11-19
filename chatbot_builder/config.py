"""
Configurazione dell'applicazione Chatbot Builder
"""
import os
import json

class Config:
    """Configurazione base"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    OUTPUT_FOLDER = 'output'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB

    # API Settings (opzionali per future integrazioni)
    API_SETTINGS_FILE = 'api_settings.json'

    @staticmethod
    def load_api_settings():
        """Carica le impostazioni API salvate"""
        if os.path.exists(Config.API_SETTINGS_FILE):
            with open(Config.API_SETTINGS_FILE, 'r') as f:
                return json.load(f)
        return {
            'openai_api_key': '',
            'anthropic_api_key': '',
            'custom_api_endpoint': '',
            'use_local_generation': True  # Usa generazione locale di default
        }

    @staticmethod
    def save_api_settings(settings):
        """Salva le impostazioni API"""
        with open(Config.API_SETTINGS_FILE, 'w') as f:
            json.dump(settings, f, indent=2)
