/*
    PROJETO: Documentação de Cibersegurança Web
    ARQUIVO: script.js
    VERSÃO: 4.1
    DATA: 03/09/2025 (06:35 America/Sao_Paulo)
    
    CHANGELOG v4.1 (ATUALIZAÇÃO DE REFINAMENTO):
    - ATUALIZAÇÃO VISUAL: Adicionada lógica para suportar uma transição suave (crossfade) ao alternar temas.
    - CORREÇÃO: Implementado um mecanismo para desativar temporariamente as transições no carregamento
      da página, prevenindo o "flash de transição" inicial e garantindo que apenas as
      ações do usuário sejam animadas.
    - ORGANIZAÇÃO: O código foi levemente reestruturado para acomodar a nova lógica de transição.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: ALTERNÂNCIA DE TEMA (Com transição suave) ---

    (() => {
        const themeToggleButton = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;
        const bodyElement = document.body;

        if (!themeToggleButton || !bodyElement) {
            console.warn('Elementos essenciais para o tema não encontrados no DOM.');
            return;
        }

        // CORREÇÃO: Adiciona uma classe para desativar transições durante a configuração inicial.
        bodyElement.classList.add('no-transitions');

        const ICONS = { light: '☀️', dark: '🌙' };

        const applyTheme = (theme) => {
            htmlElement.classList.toggle('light-theme', theme === 'light');
            
            const newLabel = `Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`;
            themeToggleButton.setAttribute('aria-label', newLabel);
            themeToggleButton.innerHTML = theme === 'light' ? ICONS.dark : ICONS.light;

            localStorage.setItem('theme', theme);
        };

        const savedTheme = localStorage.getItem('theme');
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
        
        applyTheme(initialTheme);

        // ATUALIZAÇÃO VISUAL: Reativa as transições após a configuração inicial.
        // O setTimeout garante que o navegador processe a renderização inicial antes de reativar as transições.
        setTimeout(() => {
            bodyElement.classList.remove('no-transitions');
        }, 100);


        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    })();


    // --- MÓDULO 2: SCROLL SPY PARA PÁGINAS DE DETALHE (Sem alterações) ---
    
    const sidebarNav = document.querySelector('.sidebar-nav');

    if (sidebarNav) {
        (() => {
            const sections = document.querySelectorAll('.content-section'); 
            const navLinks = sidebarNav.querySelectorAll('a:not(.back-link)');

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
