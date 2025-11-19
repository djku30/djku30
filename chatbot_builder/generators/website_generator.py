"""
Generatore di Siti Web
"""
import os
from datetime import datetime

class WebsiteGenerator:
    def __init__(self):
        self.templates = {
            'portfolio': self._generate_portfolio,
            'blog': self._generate_blog,
            'business': self._generate_business,
            'ecommerce': self._generate_ecommerce,
            'landing': self._generate_landing
        }

    def generate(self, requirements):
        """Genera un sito web basato sui requisiti"""
        site_type = requirements.get('type', 'portfolio')
        name = requirements.get('name', 'Il Mio Sito')
        colors = requirements.get('colors', {'primary': '#3498db', 'secondary': '#2ecc71'})
        sections = requirements.get('sections', ['home', 'about', 'contact'])

        # Seleziona il template appropriato
        generator_func = self.templates.get(site_type, self._generate_portfolio)

        # Genera i file
        files = generator_func(name, colors, sections)

        return {
            'code': files,
            'files': list(files.keys()),
            'timestamp': datetime.now().isoformat()
        }

    def _generate_portfolio(self, name, colors, sections):
        """Genera un sito portfolio"""
        html = f'''<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <h1 class="logo">{name}</h1>
            <ul class="nav-links">
                {''.join(f'<li><a href="#{section}">{section.capitalize()}</a></li>' for section in sections)}
            </ul>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="container">
            <h2>Benvenuto nel mio Portfolio</h2>
            <p>Crea qualcosa di straordinario</p>
            <button class="cta-button">Scopri di più</button>
        </div>
    </section>

    <section id="about" class="section">
        <div class="container">
            <h2>Chi Sono</h2>
            <p>Sono un professionista appassionato del mio lavoro. Qui puoi trovare i miei progetti e competenze.</p>
        </div>
    </section>

    <section id="projects" class="section">
        <div class="container">
            <h2>I Miei Progetti</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <h3>Progetto 1</h3>
                    <p>Descrizione del progetto 1</p>
                </div>
                <div class="project-card">
                    <h3>Progetto 2</h3>
                    <p>Descrizione del progetto 2</p>
                </div>
                <div class="project-card">
                    <h3>Progetto 3</h3>
                    <p>Descrizione del progetto 3</p>
                </div>
            </div>
        </div>
    </section>

    <section id="contact" class="section">
        <div class="container">
            <h2>Contattami</h2>
            <form class="contact-form">
                <input type="text" placeholder="Nome" required>
                <input type="email" placeholder="Email" required>
                <textarea placeholder="Messaggio" rows="5" required></textarea>
                <button type="submit" class="submit-button">Invia</button>
            </form>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2024 {name}. Tutti i diritti riservati.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>'''

        css = f'''* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}}

body {{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
}}

.container {{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}}

/* Navbar */
.navbar {{
    background: {colors['primary']};
    color: white;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}}

.navbar .container {{
    display: flex;
    justify-content: space-between;
    align-items: center;
}}

.logo {{
    font-size: 1.5rem;
    font-weight: bold;
}}

.nav-links {{
    display: flex;
    list-style: none;
    gap: 2rem;
}}

.nav-links a {{
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
}}

.nav-links a:hover {{
    opacity: 0.8;
}}

/* Hero Section */
.hero {{
    background: linear-gradient(135deg, {colors['primary']}, {colors['secondary']});
    color: white;
    padding: 8rem 0;
    text-align: center;
}}

.hero h2 {{
    font-size: 3rem;
    margin-bottom: 1rem;
}}

.hero p {{
    font-size: 1.5rem;
    margin-bottom: 2rem;
}}

.cta-button {{
    background: white;
    color: {colors['primary']};
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s;
}}

.cta-button:hover {{
    transform: translateY(-3px);
}}

/* Sections */
.section {{
    padding: 4rem 0;
}}

.section h2 {{
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: {colors['primary']};
}}

/* Projects Grid */
.projects-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}}

.project-card {{
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s;
}}

.project-card:hover {{
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}}

.project-card h3 {{
    color: {colors['primary']};
    margin-bottom: 1rem;
}}

/* Contact Form */
.contact-form {{
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}}

.contact-form input,
.contact-form textarea {{
    padding: 1rem;
    border: 2px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    font-family: inherit;
}}

.contact-form input:focus,
.contact-form textarea:focus {{
    outline: none;
    border-color: {colors['primary']};
}}

.submit-button {{
    background: {colors['primary']};
    color: white;
    border: none;
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}}

.submit-button:hover {{
    background: {colors['secondary']};
}}

/* Footer */
footer {{
    background: #333;
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 4rem;
}}

/* Responsive */
@media (max-width: 768px) {{
    .navbar .container {{
        flex-direction: column;
        gap: 1rem;
    }}

    .hero h2 {{
        font-size: 2rem;
    }}

    .hero p {{
        font-size: 1.2rem;
    }}
}}'''

        js = '''// Smooth scrolling per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gestione form contatti
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Qui puoi aggiungere la logica per inviare il form
        alert('Grazie per il tuo messaggio! Ti risponderò presto.');

        // Reset form
        this.reset();
    });
}

// Animazione al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Applica animazioni agli elementi
document.querySelectorAll('.project-card, .section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});

console.log('Sito web caricato con successo!');'''

        return {
            'index.html': html,
            'style.css': css,
            'script.js': js
        }

    def _generate_blog(self, name, colors, sections):
        """Genera un sito blog"""
        # Implementazione simile per blog
        return self._generate_portfolio(name, colors, sections)

    def _generate_business(self, name, colors, sections):
        """Genera un sito business"""
        # Implementazione simile per business
        return self._generate_portfolio(name, colors, sections)

    def _generate_ecommerce(self, name, colors, sections):
        """Genera un sito e-commerce"""
        # Implementazione simile per e-commerce
        return self._generate_portfolio(name, colors, sections)

    def _generate_landing(self, name, colors, sections):
        """Genera una landing page"""
        # Implementazione simile per landing page
        return self._generate_portfolio(name, colors, sections)
