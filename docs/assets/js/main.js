/**
 * =========================================================================
 * main.js
 * =========================================================================
 *
 * Autor: (Seu Nome)
 * Descrição: Script principal para a Documentação Grandiosa.
 * Gerencia todas as interações do usuário, animações e funcionalidades dinâmicas.
 *
 * Tabela de Conteúdos:
 * 1.  App Class (Estrutura Principal)
 * - Construtor e Inicialização
 * - Seletores de DOM
 * 2.  Módulo de Carregamento (Loader)
 * - Anima e esconde a tela de carregamento.
 * 3.  Módulo do Header
 * - Lógica de "esconder ao rolar para baixo".
 * - Adiciona classe 'scrolled' ao rolar.
 * - Gerencia o menu mobile.
 * 4.  Módulo de Tema (Theme Switcher)
 * - Carrega, aplica e salva a preferência de tema.
 * 5.  Módulo do Modal de Busca
 * - Abre/fecha o modal e gerencia atalhos.
 * 6.  Módulo da Referência da API
 * - Troca de abas de código.
 * - Navegação "spy scroll".
 * 7.  Módulo de Animações Criativas
 * - Animações da seção Hero.
 * - Animações de entrada com ScrollTrigger.
 * - Inicialização do canvas de fundo (Three.js).
 * 8.  Inicialização Geral
 * - Instancia a classe principal no DOMContentLoaded.
 * =========================================================================
 */

class GrandDocsApp {
    /**
     * 1. App Class - Construtor e Inicialização
     */
    constructor() {
        this.initDOMSelectors();
        this.initModules();
    }

    initDOMSelectors() {
        this.dom = {
            body: document.body,
            header: document.getElementById('main-header'),
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mainNavList: document.getElementById('main-menu-list'),
            themeToggle: document.getElementById('theme-switcher-toggle'),
            themeOptions: document.getElementById('theme-options'),
            searchModalTrigger: document.getElementById('search-modal-trigger'),
            searchModal: document.getElementById('search-modal'),
            // Adicionaremos mais seletores conforme necessário
        };
        this.lastScrollY = window.scrollY;
    }

    initModules() {
        this.initLoader();
        this.initHeaderBehavior();
        this.initThemeSwitcher();
        this.initMobileMenu();
        this.initSearchModal();
        this.initApiReference();
        this.initCreativeAnimations();
        this.initPrism();
    }


    /**
     * 2. Módulo de Carregamento (Loader)
     */
    initLoader() {
        window.addEventListener('load', () => {
            this.dom.body.classList.remove('loading');
            this.dom.body.classList.add('loaded');
            // Remove o aria-hidden do wrapper da página para leitores de tela
            document.getElementById('page-wrapper').setAttribute('aria-hidden', 'false');
        });
    }


    /**
     * 3. Módulo do Header
     */
    initHeaderBehavior() {
        // Lógica de esconder/mostrar header ao rolar
        window.addEventListener('scroll', () => {
            if (window.scrollY > this.lastScrollY && window.scrollY > this.dom.header.clientHeight) {
                // Rolando para baixo
                this.dom.header.classList.add('hidden');
            } else {
                // Rolando para cima
                this.dom.header.classList.remove('hidden');
            }

            // Adiciona a classe 'scrolled' para aplicar o fundo
            if (window.scrollY > 50) {
                this.dom.header.classList.add('scrolled');
                // Converte a cor de fundo para RGBA para o efeito de transparência
                // Isso só precisa ser feito uma vez, mas aqui simplificamos
                const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background-offset').trim();
                const rgb = this.hexToRgb(bgColor);
                if (rgb) {
                    this.dom.header.style.setProperty('--color-background-offset-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
                }

            } else {
                this.dom.header.classList.remove('scrolled');
            }

            this.lastScrollY = window.scrollY;
        }, { passive: true });
    }

    initMobileMenu() {
        if (!this.dom.mobileMenuToggle) return;

        this.dom.mobileMenuToggle.addEventListener('click', () => {
            const isMenuOpen = this.dom.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            this.dom.mobileMenuToggle.setAttribute('aria-expanded', !isMenuOpen);
            this.dom.header.classList.toggle('menu-open');
            this.dom.body.classList.toggle('no-scroll'); // Previne rolagem do body quando o menu está aberto

            // TODO: Implementar o menu mobile real (ex: deslizando da lateral)
            // Por enquanto, apenas o estado do botão é gerenciado.
        });
    }

    // Função utilitária para converter HEX para RGB
    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    /**
     * 4. Módulo de Tema (Theme Switcher)
     */
    initThemeSwitcher() {
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (theme) => {
            if (theme === 'system') {
                document.documentElement.setAttribute('data-theme', systemPrefersDark.matches ? 'dark' : 'light');
            } else {
                document.documentElement.setAttribute('data-theme', theme);
            }
        };
        
        // Aplica o tema na carga inicial
        applyTheme(storedTheme || 'system');

        // Lógica de abrir/fechar o menu de opções de tema
        this.dom.themeToggle.addEventListener('click', () => {
            const isExpanded = this.dom.themeToggle.getAttribute('aria-expanded') === 'true';
            this.dom.themeToggle.setAttribute('aria-expanded', !isExpanded);
            this.dom.themeOptions.classList.toggle('visible');
        });

        // Lógica de seleção de tema
        this.dom.themeOptions.addEventListener('click', (e) => {
            const themeButton = e.target.closest('.theme-option');
            if (themeButton) {
                const selectedTheme = themeButton.dataset.theme;
                localStorage.setItem('theme', selectedTheme);
                applyTheme(selectedTheme);
                // Fecha o menu após a seleção
                this.dom.themeToggle.setAttribute('aria-expanded', 'false');
                this.dom.themeOptions.classList.remove('visible');
            }
        });

        // Ouve mudanças na preferência do sistema
        systemPrefersDark.addEventListener('change', () => {
            if (localStorage.getItem('theme') === 'system') {
                applyTheme('system');
            }
        });

        // Fecha o menu de temas se clicar fora
        document.addEventListener('click', (e) => {
            if (!this.dom.themeToggle.contains(e.target) && !this.dom.themeOptions.contains(e.target)) {
                 this.dom.themeToggle.setAttribute('aria-expanded', 'false');
                 this.dom.themeOptions.classList.remove('visible');
            }
        });
    }

    /**
     * 5. Módulo do Modal de Busca
     * (Será implementado na próxima parte)
     */
    initSearchModal() {
        // TODO
    }

    /**
     * 6. Módulo da Referência da API
     * (Será implementado na próxima parte)
     */
    initApiReference() {
        // TODO
    }

    /**
     * 7. Módulo de Animações Criativas
     * (Será implementado na próxima parte)
     */
    initCreativeAnimations() {
        // TODO
    }
    
    /**
     * Inicializa o Prism.js manualmente
     * (Será implementado na próxima parte)
     */
    initPrism() {
        // TODO
    }
}


/**
 * 8. Inicialização Geral
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se as bibliotecas necessárias estão carregadas
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP ou ScrollTrigger não foram carregados. As animações serão desativadas.');
        return;
    }
    // Instancia e inicia a aplicação
    window.app = new GrandDocsApp();
});
