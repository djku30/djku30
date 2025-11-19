// Chatbot Builder - App JavaScript

class ChatbotBuilder {
    constructor() {
        this.currentView = 'chat';
        this.currentProjectType = null;
        this.generatedCode = null;
        this.myBots = this.loadBots();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMyBots();
        this.autoResizeTextarea();
    }

    setupEventListeners() {
        // Send button
        const sendBtn = document.getElementById('send-btn');
        const chatInput = document.getElementById('chat-input');

        sendBtn.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Navigation items
        document.querySelectorAll('.nav-item[data-type]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const type = item.getAttribute('data-type');
                this.switchView(type);
                this.updateActiveNav(item);
            });
        });
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('chat-input');
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        });
    }

    updateActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        activeItem.classList.add('active');
    }

    switchView(type) {
        this.currentProjectType = type;
        const chatView = document.getElementById('chat-view');
        const formView = document.getElementById('form-view');
        const codeView = document.getElementById('code-view');

        // Hide all views
        chatView.classList.add('hidden');
        formView.classList.add('hidden');
        codeView.classList.add('hidden');

        // Update header
        const pageTitle = document.getElementById('page-title');
        const breadcrumb = document.getElementById('breadcrumb-current');

        switch(type) {
            case 'chat':
                chatView.classList.remove('hidden');
                pageTitle.textContent = 'Nuova Chat';
                breadcrumb.textContent = 'Chat';
                break;
            case 'website':
                chatView.classList.remove('hidden');
                pageTitle.textContent = 'Crea Sito Web';
                breadcrumb.textContent = 'Sito Web';
                this.addSystemMessage('Perfetto! Descrivimi che tipo di sito web vuoi creare. Ad esempio:\n- Portfolio personale\n- Blog\n- Sito aziendale\n- E-commerce\n- Landing page');
                break;
            case 'windows':
                chatView.classList.remove('hidden');
                pageTitle.textContent = 'Crea App Windows';
                breadcrumb.textContent = 'App Windows';
                this.addSystemMessage('Ottimo! Dimmi che tipo di applicazione Windows vuoi creare. Ad esempio:\n- Calcolatrice\n- Notepad\n- Todo List\n- File Manager\n- App personalizzata');
                break;
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addUserMessage(message);
        input.value = '';
        input.style.height = 'auto';

        // Show loading
        const loadingId = this.addLoadingMessage();

        try {
            // Send to API
            const response = await this.callAPI(message);

            // Remove loading
            this.removeMessage(loadingId);

            // Add bot response
            this.addBotMessage(response.message);

            // If code was generated, show it
            if (response.code) {
                this.generatedCode = response.code;
                this.showCodePreview(response.code);

                // Save bot
                this.saveBot(message, response);
            }

        } catch (error) {
            this.removeMessage(loadingId);
            this.addBotMessage('Mi dispiace, si è verificato un errore: ' + error.message);
        }
    }

    async callAPI(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                type: this.currentProjectType,
                requirements: this.parseRequirements(message)
            })
        });

        if (!response.ok) {
            throw new Error('Errore nella comunicazione con il server');
        }

        return await response.json();
    }

    parseRequirements(message) {
        // Parse message to extract requirements
        const requirements = {
            name: 'Il Mio Progetto',
            type: 'portfolio',
            colors: {
                primary: '#3ECF8E',
                secondary: '#2ecc71'
            },
            sections: ['home', 'about', 'contact'],
            features: []
        };

        // Extract name if mentioned
        const nameMatch = message.match(/chiama.*["']([^"']+)["']/i);
        if (nameMatch) {
            requirements.name = nameMatch[1];
        }

        // Determine type based on keywords
        if (message.match(/portfolio/i)) requirements.type = 'portfolio';
        if (message.match(/blog/i)) requirements.type = 'blog';
        if (message.match(/azien|business/i)) requirements.type = 'business';
        if (message.match(/e-commerce|negozio/i)) requirements.type = 'ecommerce';
        if (message.match(/landing/i)) requirements.type = 'landing';
        if (message.match(/calcolat/i)) requirements.type = 'calculator';
        if (message.match(/notepad|editor/i)) requirements.type = 'notepad';
        if (message.match(/todo|task/i)) requirements.type = 'todo';

        return requirements;
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');

        // Remove welcome message if present
        const welcomeMsg = messagesContainer.querySelector('.welcome-message');
        if (welcomeMsg) welcomeMsg.remove();

        const messageEl = this.createMessageElement(text, 'user');
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageEl = this.createMessageElement(text, 'bot');
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    addSystemMessage(text) {
        const messagesContainer = document.getElementById('chat-messages');

        // Remove welcome message if present
        const welcomeMsg = messagesContainer.querySelector('.welcome-message');
        if (welcomeMsg) welcomeMsg.remove();

        const messageEl = this.createMessageElement(text, 'bot');
        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    addLoadingMessage() {
        const messagesContainer = document.getElementById('chat-messages');
        const id = 'loading-' + Date.now();

        const messageEl = document.createElement('div');
        messageEl.className = 'message bot';
        messageEl.id = id;
        messageEl.innerHTML = `
            <div class="message-avatar">CB</div>
            <div class="message-content">
                <div class="loading"></div>
            </div>
        `;

        messagesContainer.appendChild(messageEl);
        this.scrollToBottom();

        return id;
    }

    removeMessage(id) {
        const msg = document.getElementById(id);
        if (msg) msg.remove();
    }

    createMessageElement(text, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;

        const avatar = type === 'user' ? 'Tu' : 'CB';
        const time = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

        messageEl.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        return messageEl;
    }

    formatMessage(text) {
        // Simple markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showCodePreview(code) {
        const codeView = document.getElementById('code-view');
        const chatView = document.getElementById('chat-view');
        const tabsContainer = document.getElementById('code-tabs');
        const codeContent = document.getElementById('code-content');

        // Show code view
        chatView.classList.add('hidden');
        codeView.classList.remove('hidden');

        // Create tabs for each file
        tabsContainer.innerHTML = '';
        const files = Object.keys(code);

        files.forEach((filename, index) => {
            const tab = document.createElement('button');
            tab.className = 'tab' + (index === 0 ? ' active' : '');
            tab.textContent = filename;
            tab.onclick = () => this.showFile(filename);
            tabsContainer.appendChild(tab);
        });

        // Show first file
        if (files.length > 0) {
            this.showFile(files[0]);
        }
    }

    showFile(filename) {
        const codeContent = document.getElementById('code-content');
        const tabs = document.querySelectorAll('.tab');

        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.textContent === filename);
        });

        // Show file content
        const content = this.generatedCode[filename];
        codeContent.textContent = content;
    }

    saveBot(prompt, response) {
        const bot = {
            id: Date.now(),
            name: this.extractBotName(prompt),
            type: this.currentProjectType,
            prompt: prompt,
            createdAt: new Date().toISOString(),
            files: response.files,
            code: response.code
        };

        this.myBots.unshift(bot);
        localStorage.setItem('chatbot_builder_bots', JSON.stringify(this.myBots));
        this.renderMyBots();
    }

    loadBots() {
        const saved = localStorage.getItem('chatbot_builder_bots');
        return saved ? JSON.parse(saved) : [];
    }

    extractBotName(prompt) {
        // Try to extract a meaningful name from the prompt
        const nameMatch = prompt.match(/chiama.*["']([^"']+)["']/i);
        if (nameMatch) return nameMatch[1];

        // Otherwise use first few words
        const words = prompt.split(' ').slice(0, 3).join(' ');
        return words.length > 30 ? words.substring(0, 30) + '...' : words;
    }

    renderMyBots() {
        // Find or create the "I Miei Bot" section
        let myBotsSection = document.querySelector('.my-bots-section');

        if (!myBotsSection) {
            const navSections = document.querySelector('.sidebar-nav');
            myBotsSection = document.createElement('div');
            myBotsSection.className = 'nav-section my-bots-section';
            myBotsSection.innerHTML = `
                <div class="nav-section-title">I Miei Bot</div>
                <div class="my-bots-list"></div>
            `;
            navSections.appendChild(myBotsSection);
        }

        const botsList = myBotsSection.querySelector('.my-bots-list');
        botsList.innerHTML = '';

        if (this.myBots.length === 0) {
            botsList.innerHTML = '<div style="padding: 8px; color: var(--color-text-muted); font-size: 12px;">Nessun bot ancora</div>';
            return;
        }

        this.myBots.slice(0, 10).forEach(bot => {
            const botItem = document.createElement('a');
            botItem.href = '#';
            botItem.className = 'nav-item bot-item';
            botItem.innerHTML = `
                <span class="example-dot"></span>
                <span style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${bot.name}</span>
                <button class="delete-bot-btn" data-id="${bot.id}" title="Elimina">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            `;

            botItem.onclick = (e) => {
                if (!e.target.closest('.delete-bot-btn')) {
                    e.preventDefault();
                    this.loadBot(bot);
                }
            };

            const deleteBtn = botItem.querySelector('.delete-bot-btn');
            deleteBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deleteBot(bot.id);
            };

            botsList.appendChild(botItem);
        });
    }

    loadBot(bot) {
        this.generatedCode = bot.code;
        this.showCodePreview(bot.code);

        // Update header
        document.getElementById('page-title').textContent = bot.name;
        document.getElementById('breadcrumb-current').textContent = 'Bot Salvato';
    }

    deleteBot(id) {
        showConfirmDialog(
            'Elimina Bot',
            'Vuoi davvero eliminare questo bot? Questa azione non può essere annullata.',
            (confirmed) => {
                if (confirmed) {
                    this.myBots = this.myBots.filter(bot => bot.id !== id);
                    localStorage.setItem('chatbot_builder_bots', JSON.stringify(this.myBots));
                    this.renderMyBots();
                    showToast('🗑️ Bot eliminato con successo', 'success');
                }
            }
        );
    }
}

// Quick start functions
function quickStart(type) {
    const typeMap = {
        'website': 'website',
        'windows': 'windows'
    };

    const navItem = document.querySelector(`.nav-item[data-type="${typeMap[type]}"]`);
    if (navItem) navItem.click();
}

function loadExample(type) {
    const examples = {
        'portfolio': 'Crea un portfolio moderno con sezioni home, about, progetti e contatti',
        'calculator': 'Crea una calcolatrice Windows con interfaccia grafica',
        'blog': 'Crea un blog con articoli, categorie e commenti'
    };

    const input = document.getElementById('chat-input');
    input.value = examples[type] || '';
    input.focus();
}

function downloadCode() {
    if (!app.generatedCode) {
        alert('Nessun codice da scaricare');
        return;
    }

    // Create a zip file with all the code
    const files = app.generatedCode;
    const timestamp = new Date().toISOString().split('T')[0];
    const projectName = `chatbot-project-${timestamp}`;

    // For simplicity, download each file separately
    // In production, you would create a ZIP file
    Object.keys(files).forEach(filename => {
        const content = files[filename];
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });

    alert(`Download completato! ${Object.keys(files).length} file scaricati.`);
}

// Settings functions (HTML5 Dialog API)
async function openSettings() {
    const dialog = document.getElementById('settings-dialog');

    // Load current settings
    try {
        const response = await fetch('/api/settings');
        const settings = await response.json();

        document.getElementById('use_local_generation').checked = settings.use_local_generation;
        document.getElementById('openai_api_key').value = settings.openai_api_key || '';
        document.getElementById('anthropic_api_key').value = settings.anthropic_api_key || '';
        document.getElementById('custom_api_endpoint').value = settings.custom_api_endpoint || '';
    } catch (error) {
        console.error('Error loading settings:', error);
    }

    // Setup form submit
    const form = document.getElementById('settings-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await saveSettings();
    };

    // Show dialog with modern API
    dialog.showModal();

    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            closeSettings();
        }
    });
}

function closeSettings() {
    const dialog = document.getElementById('settings-dialog');
    dialog.close();
}

async function saveSettings() {
    const settings = {
        use_local_generation: document.getElementById('use_local_generation').checked,
        openai_api_key: document.getElementById('openai_api_key').value,
        anthropic_api_key: document.getElementById('anthropic_api_key').value,
        custom_api_endpoint: document.getElementById('custom_api_endpoint').value
    };

    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        const result = await response.json();

        if (result.success) {
            showToast('✅ Impostazioni salvate con successo!', 'success');
            closeSettings();
        } else {
            showToast('❌ Errore: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('❌ Errore nel salvataggio: ' + error.message, 'error');
    }
}

// Confirm Dialog Helper
let confirmCallback = null;

function showConfirmDialog(title, message, callback) {
    const dialog = document.getElementById('confirm-dialog');
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    confirmCallback = callback;
    dialog.showModal();
}

function closeConfirmDialog(confirmed) {
    const dialog = document.getElementById('confirm-dialog');
    dialog.close();
    if (confirmCallback) {
        confirmCallback(confirmed);
        confirmCallback = null;
    }
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Add to DOM
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
.toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 16px 24px;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text-primary);
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast.show {
    opacity: 1;
    transform: translateY(0);
}

.toast-success {
    border-color: var(--color-brand);
    background: rgba(62, 207, 142, 0.1);
}

.toast-error {
    border-color: var(--color-error);
    background: rgba(239, 68, 68, 0.1);
}

.toast-info {
    border-color: var(--color-brand);
}
`;
document.head.appendChild(toastStyles);

// Initialize app
const app = new ChatbotBuilder();

// Add CSS for delete button
const style = document.createElement('style');
style.textContent = `
.bot-item {
    position: relative;
}

.delete-bot-btn {
    opacity: 0;
    background: transparent;
    border: none;
    color: var(--color-error);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
}

.bot-item:hover .delete-bot-btn {
    opacity: 1;
}

.delete-bot-btn:hover {
    background: var(--color-bg-hover);
}
`;
document.head.appendChild(style);
