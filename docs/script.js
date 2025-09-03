/*
    PROJETO: Documentação de Cargos em Desenvolvimento Web
    ARQUIVO: script.js
    VERSÃO: 2.0
    DATA: 03/09/2025 (06:07 America/Sao_Paulo)
    
    CHANGELOG v2.0:
    - MÓDULO ADICIONADO: Scroll Spy (Espião de Rolagem) para a navegação lateral.
    - FUNCIONALIDADE: Destaca o link na barra lateral que corresponde à seção visível na tela.
    - TECNOLOGIA: Implementado com a Intersection Observer API para alta performance, evitando
                  eventos de 'scroll' que podem causar lentidão.
    - REATORAÇÃO: O código foi organizado em módulos para melhor legibilidade e manutenção.
*/

// QA & Front-End: O evento 'DOMContentLoaded' continua sendo a melhor prática para garantir
// que o DOM esteja pronto antes da execução de qualquer script.
document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: ALTERNÂNCIA DE TEMA (Lógica da v1.0, sem alterações) ---

    (() => {
        const themeToggleButton = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;

        if (!themeToggleButton) {
            console.warn('Botão de alternância de tema não encontrado no DOM.');
            return;
        }

        const ICONS = { light: '☀️', dark: '🌙' };

        const applyTheme = (theme) => {
            htmlElement.classList.toggle('dark-theme', theme === 'dark');
            const newLabel = `Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`;
            themeToggleButton.setAttribute('aria-label', newLabel);
            themeToggleButton.innerHTML = theme === 'dark' ? ICONS.light : ICONS.dark;
            localStorage.setItem('theme', theme);
        };

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        applyTheme(initialTheme);

        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.classList.contains('dark-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    })();


    // --- MÓDULO 2: SCROLL SPY PARA NAVEGAÇÃO LATERAL (Novo na v2.0) ---

    (() => {
        // Front-End: Selecionamos todas as seções que queremos observar e todos os links da navegação.
        const sections = document.querySelectorAll('.role-section');
        const navLinks = document.querySelectorAll('.sidebar-nav a');

        // QA: Se não houver seções ou links (página vazia), o script não executa o resto do módulo.
        if (sections.length === 0 || navLinks.length === 0) {
            return;
        }

        // UX/Front-End: Opções para o Intersection Observer.
        // O 'rootMargin' cria uma "linha de gatilho" imaginária no centro da tela.
        // -40% do topo e -60% da base significa que a seção só é considerada "ativa"
        // quando seu início cruza a linha dos 40% superiores da viewport.
        const observerOptions = {
            root: null, // Observa em relação à viewport do navegador.
            rootMargin: '-40% 0px -60% 0px',
            threshold: 0
        };

        // A função que será executada sempre que uma seção entrar ou sair da "linha de gatilho".
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // Se a seção está cruzando nossa linha de gatilho na direção correta...
                if (entry.isIntersecting) {
                    // Pega o ID da seção que está visível.
                    const currentSectionId = entry.target.id;

                    // Remove a classe 'active' de todos os links.
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });

                    // Encontra o link de navegação que corresponde à seção atual e adiciona a classe 'active'.
                    const activeLink = document.querySelector(`.sidebar-nav a[href="#${currentSectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        };

        // Front-End: Cria a instância do observer.
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Inicia a observação para cada uma das seções de conteúdo.
        sections.forEach(section => {
            observer.observe(section);
        });
    })();

});
