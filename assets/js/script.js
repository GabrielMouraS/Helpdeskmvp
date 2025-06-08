/**
 * TechConnect - Landing Page JavaScript
 * Funcionalidades:
 * - Menu mobile responsivo
 * - Animações de entrada dos elementos
 * - Rolagem suave para links internos
 * - Efeitos de hover dinâmicos
 * - Detecção de scroll para header fixo
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== VARIÁVEIS =====
    const header = document.querySelector('.header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const benefitCards = document.querySelectorAll('.benefit-card');
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('section');
    
    // ===== FUNÇÕES =====
    
    // Menu mobile 
    function toggleMenu() {
        navMenu.classList.toggle('active');
        
        // Alterna o ícone do menu
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Fechar menu ao clicar em link
    function closeMenu() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Rolagem suave para links internos
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetPosition = document.querySelector(targetId).offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // Ajuste para o header fixo
        const duration = 800;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        // Função de easing
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Efeito de scroll no header
    function scrollHeader() {
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-medium)';
            header.style.height = '70px';
        } else {
            header.style.boxShadow = 'none';
            header.style.height = 'auto';
        }
    }
    
    // Animações de entrada com Intersection Observer
    function setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Adiciona classe de animação com base no atributo data-aos
                    const target = entry.target;
                    const animation = target.getAttribute('data-aos') || 'fade-in-up';
                    const delay = target.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        target.classList.add(animation);
                        target.style.opacity = '1';
                    }, delay);
                    
                    // Para de observar após animar
                    observer.unobserve(target);
                }
            });
        }, options);
        
        // Observa cards de benefícios
        benefitCards.forEach(card => {
            card.style.opacity = '0';
            observer.observe(card);
        });
        
        // Observa steps
        steps.forEach(step => {
            step.style.opacity = '0';
            observer.observe(step);
        });
        
        // Observa seções
        sections.forEach(section => {
            const header = section.querySelector('.section__header');
            if (header) {
                header.style.opacity = '0';
                header.setAttribute('data-aos', 'fade-in-up');
                observer.observe(header);
            }
        });
    }
    
    // Efeito de hover dinâmico nos botões
    function setupButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function(e) {
                const x = e.clientX - button.getBoundingClientRect().left;
                const y = e.clientY - button.getBoundingClientRect().top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('btn-ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    // Adicionar efeito de ripple ao CSS
    function addRippleStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .btn-ripple {
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Inicializar contador de estatísticas
    function initCounters() {
        const counters = document.querySelectorAll('.hero__stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.innerText);
            const suffix = counter.innerText.replace(/[0-9]/g, '');
            let count = 0;
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            
            counter.innerText = '0' + suffix;
            
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.innerText = Math.floor(count) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            
            // Iniciar contador quando visível
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    requestAnimationFrame(updateCount);
                    observer.unobserve(counter);
                }
            });
            
            observer.observe(counter);
        });
    }
    
    // ===== EVENT LISTENERS =====
    
    // Toggle menu
    navToggle.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
        link.addEventListener('click', smoothScroll);
    });
    
    // Scroll header
    window.addEventListener('scroll', scrollHeader);
    
    // ===== INICIALIZAÇÃO =====
    
    // Adicionar estilo de ripple
    addRippleStyle();
    
    // Configurar efeitos de botão
    setupButtonEffects();
    
    // Configurar animações de entrada
    setupIntersectionObserver();
    
    // Inicializar contadores
    initCounters();
    
    // Aplicar classe de animação na hero section
    document.querySelector('.hero__text').classList.add('fade-in-left');
    document.querySelector('.hero__image').classList.add('fade-in-right');
});

