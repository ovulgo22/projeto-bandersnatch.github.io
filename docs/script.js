/*
    PROJETO: Documentação de Cibersegurança Web
    ARQUIVO: script.js
    VERSÃO: 4.0
    DATA: 03/09/2025 (06:25 America/Sao_Paulo)
    
    CHANGELOG v4.0 (MEGA ATUALIZAÇÃO - NOVA TEMÁTICA):
    - CORREÇÃO (LÓGICA DE TEMA): Refatorado para a nova abordagem "dark-first" do CSS.
      - O script agora alterna a classe `.light-theme` no elemento <html>.
      - A lógica de `localStorage` e `prefers-color-scheme` foi invertida para refletir que escuro é o padrão.
    - MANUTENÇÃO (SCROLL SPY): O módulo de Scroll Spy foi mantido, pois será utilizado
      nas futuras páginas de detalhe. Sua lógica condicional previne a execução na página principal.
    - LIMPEZA: Comentários e variáveis atualizados para a nova temática.
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- MÓDULO 1: ALTERNÂNCIA DE TEMA (Lógica invertida para "dark-first") ---

    (() => {
        const themeToggleButton = document.getElementById('theme-toggle');
        const htmlElement = document.documentElement;

        if (!themeToggleButton) {
            console.warn('Botão de alternância de tema não encontrado no DOM.');
            return;
        }

        const ICONS = { light: '☀️', dark: '🌙' };

        const applyTheme = (theme) => {
            // Se o tema for 'light', adiciona a classe. Se for 'dark', remove (voltando ao padrão).
            htmlElement.classList.toggle('light-theme', theme === 'light');
            
            // O label e o ícone são o OPOSTO do tema atual. Se o tema é claro, o botão mostra a lua para MUDAR para escuro.
            const newLabel = `Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`;
            themeToggleButton.setAttribute('aria-label', newLabel);
            themeToggleButton.innerHTML = theme === 'light' ? ICONS.dark : ICONS.light;

            localStorage.setItem('theme', theme);
        };

        const savedTheme = localStorage.getItem('theme');
        // Agora, o não-padrão é o tema claro.
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

        // O tema inicial será o salvo, OU 'light' se o sistema preferir, OU o padrão ('dark').
        const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
        
        applyTheme(initialTheme);

        themeToggleButton.addEventListener('click', () => {
            // Verifica o tema atual pela ausência ou presença da classe.
            const currentTheme = htmlElement.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    })();


    // --- MÓDULO 2: SCROLL SPY PARA PÁGINAS DE DETALHE (Mantido para uso futuro) ---
    
    // Esta lógica não será executada na página principal (index.html), pois
    // o elemento '.sidebar-nav' não existe nela. Ela aguarda as páginas de conteúdo.
    const sidebarNav = document.querySelector('.sidebar-nav');

    if (sidebarNav) {
        (() => {
            // Nota: a classe '.content-section' poderá ser usada nas páginas de detalhe
            // no lugar de '.role-section' para se adequar à nova temática.
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
