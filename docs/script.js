/* =================================================================== */
/* ARQUIVO: script.js (Versão 1.0)                                     */
/* DESCRIÇÃO: Script para interatividade e animações do portfólio.     */
/* =================================================================== */

// Garante que o script rode em modo estrito e só após o DOM carregar
'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* =================================================================== */
    /* 1. NAVEGAÇÃO MÓVEL (HAMBÚRGUER)                                     */
    /* (A11y Developer / Front-End Developer)                              */
    /* =================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Alterna as classes para o estado ativo
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Atualiza os atributos ARIA para acessibilidade
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            // Trava o scroll do body quando o menu está aberto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Fecha o menu ao clicar em um link (para SPAs de página única)
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }


    /* =================================================================== */
    /* 2. EFEITO DO CABEÇALHO AO ROLAR (HEADER ON SCROLL)                  */
    /* (UX Designer)                                                       */
    /* =================================================================== */
    const header = document.querySelector('.main-header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(30, 30, 30, 0.8)'; // Cor mais sólida ao rolar
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
            } else {
                header.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
                header.style.boxShadow = 'none';
            }
        });
    }


    /* =================================================================== */
    /* 3. ANIMAÇÕES DE SCROLL (SCROLL REVEAL)                              */
    /* (Creative Developer / Front-End Developer)                          */
    /* =================================================================== */
    const animatedElements = document.querySelectorAll('.section-title, .about-content, .skill-category, .project-card');

    // CSS para o estado inicial dos elementos a serem animados
    // Adicione esta classe ao seu CSS se preferir.
    // .reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    // .is-visible { opacity: 1; transform: translateY(0); }
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% do elemento visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que ativa a animação
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Para de observar o elemento após a animação para otimizar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (animatedElements.length > 0) {
        animatedElements.forEach(el => observer.observe(el));
    }


    /* =================================================================== */
    /* 4. PLACEHOLDER PARA ANIMAÇÃO INTERATIVA NO HERÓI                    */
    /* (Creative Developer / Creative Technologist)                        */
    /* =================================================================== */
    const heroAnimationCanvas = document.querySelector('.hero-background-animation canvas');

    if (heroAnimationCanvas) {
        // Exemplo de como você poderia iniciar uma animação mais complexa.
        // Bibliotecas como Three.js (para 3D), p5.js (para 2D criativo) ou 
        // particles.js seriam importadas e inicializadas aqui.
        
        console.log('Canvas da seção Herói está pronto para receber uma animação complexa.');
        
        // Exemplo simples com Canvas 2D API:
        const ctx = heroAnimationCanvas.getContext('2d');
        heroAnimationCanvas.width = window.innerWidth;
        heroAnimationCanvas.height = window.innerHeight;
        
        ctx.fillStyle = 'rgba(138, 180, 248, 0.5)'; // Cor primária com opacidade
        ctx.beginPath();
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.fill();
        // Este é apenas um placeholder visual. O ideal seria uma animação em loop.
    }


    /* =================================================================== */
    /* 5. SCROLL SUAVE PARA LINKS ÂNCORA                                   */
    /* (UX Designer)                                                       */
    /* =================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

});
