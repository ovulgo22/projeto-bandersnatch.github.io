/* =================================================================== */
/* ARQUIVO: script.js (Versão 2.0)                                     */
/* DESCRIÇÃO: Script avançado para todas as interatividades do site v2.0 */
/* =================================================================== */
'use strict';

/**
 * Ponto de entrada principal. Aguarda o DOM estar totalmente carregado
 * para inicializar todas as funcionalidades do site.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Função de inicialização que chama todos os módulos.
     */
    function init() {
        initTheme();
        initMobileNav();
        initHeaderScrollEffect();
        initScrollAnimations();
        initProjectFiltering(); // Para a página projects.html
        initContactForm();
    }

    /**
     * MÓDULO 1: SELETOR DE TEMA
     * Gerencia o tema claro/escuro, salvando a preferência do usuário.
     */
    function initTheme() {
        const themeSwitcher = document.getElementById('theme-switcher');
        const doc = document.documentElement;
        const currentTheme = localStorage.getItem('theme');

        // Aplica o tema salvo ou o tema preferido do sistema na inicialização
        if (currentTheme) {
            doc.className = currentTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            doc.className = 'theme-light';
        }

        if (themeSwitcher) {
            themeSwitcher.addEventListener('click', () => {
                const newTheme = doc.classList.contains('theme-dark') ? 'theme-light' : 'theme-dark';
                doc.className = newTheme;
                localStorage.setItem('theme', newTheme);
            });
        }
    }

    /**
     * MÓDULO 2: NAVEGAÇÃO MÓVEL (HAMBÚRGUER)
     * Controla a abertura/fechamento do menu em dispositivos móveis.
     */
    function initMobileNav() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                toggleMenu();
            });

            // Fecha o menu ao clicar em um link
            navMenu.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    closeMenu();
                }
            });

            // Fecha o menu com a tecla 'Escape'
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMenu();
                }
            });
        }

        const toggleMenu = () => {
            const isActive = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        }

        const closeMenu = () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    /**
     * MÓDULO 3: EFEITO DE SCROLL NO CABEÇALHO
     * Adiciona uma classe ao header quando a página é rolada.
     */
    function initHeaderScrollEffect() {
        const header = document.querySelector('.main-header');
        if (!header) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Se o topo da página (entry.target) NÃO está visível, adiciona a classe.
                header.classList.toggle('scrolled', !entry.isIntersecting);
            },
            { rootMargin: "100px 0px 0px 0px", threshold: 0 }
        );
        // Cria um elemento sentinela no topo do body para ser observado
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        observer.observe(sentinel);
    }
    
    /**
     * MÓDULO 4: ANIMAÇÕES DE SCROLL REVEAL
     * Anima elementos quando eles entram no viewport.
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona delay da animação se especificado no HTML
                    const delay = entry.target.dataset.animationDelay;
                    if(delay) {
                        entry.target.style.transitionDelay = delay;
                    }
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Otimização: para de observar após animar
                }
            });
        }, { threshold: 0.1 }); // Dispara quando 10% do elemento está visível

        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * MÓDULO 5: LÓGICA DE FILTRAGEM DE PROJETOS
     * Funcionalidade para a página projects.html.
     */
    function initProjectFiltering() {
        const filtersContainer = document.getElementById('project-filters');
        const projectsGrid = document.getElementById('projects-grid');
        
        // Só executa se os elementos de filtro existirem na página atual
        if (!filtersContainer || !projectsGrid) return;
        
        const projectCards = projectsGrid.querySelectorAll('.project-card');

        filtersContainer.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;

            // Gerencia o estado ativo dos botões
            const currentActive = filtersContainer.querySelector('.active');
            currentActive.classList.remove('active');
            e.target.classList.add('active');

            const filterValue = e.target.dataset.filter;

            // Mostra ou esconde os cards
            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    /**
     * MÓDULO 6: ENVIO DO FORMULÁRIO DE CONTATO
     * Envio assíncrono com a API Fetch para melhor UX.
     */
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset();
                    submitButton.textContent = 'Mensagem Enviada! ✔';
                    setTimeout(() => {
                        submitButton.textContent = originalButtonText;
                    }, 4000);
                } else {
                    throw new Error('Houve um problema com a resposta da rede.');
                }
            } catch (error) {
                console.error('Erro ao enviar formulário:', error);
                submitButton.textContent = 'Erro ao Enviar ✖';
                 setTimeout(() => {
                        submitButton.textContent = originalButtonText;
                    }, 4000);
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Inicia tudo!
    init();
});
