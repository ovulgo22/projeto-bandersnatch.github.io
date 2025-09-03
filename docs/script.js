/*
    PROJETO: Documentação de Cargos em Desenvolvimento Web
    ARQUIVO: script.js
    VERSÃO: 3.0
    DATA: 03/09/2025 (06:16 America/Sao_Paulo)
    
    CHANGELOG v3.0 (ATUALIZAÇÃO ARQUITETURAL):
    - CORREÇÃO/REATORAÇÃO: O script foi adaptado para a nova arquitetura multi-página.
    - LÓGICA CONDICIONAL: O módulo de Scroll Spy agora é envolvido por uma verificação.
      Ele só é executado se detectar a presença de uma barra de navegação lateral ('.sidebar-nav') na página.
    - PREVENÇÃO DE ERROS: Isso previne erros de console na página principal (index.html) e garante
      que a funcionalidade de rolagem só seja ativada nas páginas de detalhe, onde é necessária.
    - MANTIDO: O módulo de alternância de tema continua global e funciona em todas as páginas sem alterações.
*/

// O evento 'DOMContentLoaded' continua a ser a base para a execução segura do script.
document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: ALTERNÂNCIA DE TEMA (Global) ---
    // Esta função anônima auto-executável (IIFE) mantém seu escopo isolado.
    // Funciona em todas as páginas.
    (() => {
        const themeToggleButton = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;

        if (!themeToggleButton) {
            // A verificação continua sendo uma boa prática.
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


    // --- MÓDULO 2: SCROLL SPY PARA NAVEGAÇÃO LATERAL (Condicional - Apenas em Páginas de Detalhe) ---
    
    // QA & Front-End: A verificação principal. Buscamos um elemento que só existe nas páginas de detalhe.
    const sidebarNav = document.querySelector('.sidebar-nav');

    // Se o elemento .sidebar-nav for encontrado, então executamos a lógica do Scroll Spy.
    if (sidebarNav) {
        // O código a seguir é idêntico ao da v2.0, mas agora só é executado quando necessário.
        (() => {
            const sections = document.querySelectorAll('.role-section');
            const navLinks = sidebarNav.querySelectorAll('a:not(.back-link)'); // Ignora o link de voltar

            if (sections.length === 0 || navLinks.length === 0) {
                return;
            }

            const observerOptions = {
                root: null,
                rootMargin: '-40% 0px -60% 0px',
                threshold: 0
            };

            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const currentSectionId = entry.target.id;
                        
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                        });

                        const activeLink = sidebarNav.querySelector(`a[href="#${currentSectionId}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                        }
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => {
                observer.observe(section);
            });
        })();
    }

});
