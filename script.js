// ========================================
// INICIALIZACIÓN Y CONFIGURACIÓN
// ========================================

// Inicializar AOS (Animate On Scroll) cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar AOS con opciones personalizadas
    AOS.init({
        duration: 1000,        // Duración de la animación en milisegundos
        easing: 'ease-out-cubic', // Tipo de easing
        once: true,            // Animar solo una vez
        offset: 100,           // Offset desde el trigger point
        delay: 0,              // Delay antes de la animación
        mirror: false          // No animar al hacer scroll hacia arriba
    });

    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollEffects();
    initContactForm();
    initMobileMenu();
    initSmoothScrolling();
});

// ========================================
// NAVEGACIÓN Y MENÚ
// ========================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Efecto de transparencia en la barra de navegación al hacer scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Actualizar enlace activo basado en la sección visible
        updateActiveNavLink();
    });

    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll suave a la sección
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú móvil si está abierto
                closeMobileMenu();
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========================================
// MENÚ MÓVIL (HAMBURGER)
// ========================================

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        toggleMobileMenu();
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========================================
// EFECTOS DE SCROLL
// ========================================

function initScrollEffects() {
    // Parallax effect para las formas del hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        // Efecto parallax en el indicador de scroll
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        }
    });
}

// ========================================
// SMOOTH SCROLLING PERSONALIZADO
// ========================================

function initSmoothScrolling() {
    // Mejorar el scroll suave para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// FORMULARIO DE CONTACTO
// ========================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const nombre = formData.get('nombre');
        const email = formData.get('email');
        const mensaje = formData.get('mensaje');
        
        // Validar campos
        if (!validateForm(nombre, email, mensaje)) {
            return;
        }
        
        // Simular envío del formulario
        submitForm(form, { nombre, email, mensaje });
    });
    
    // Agregar validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(nombre, email, mensaje) {
    let isValid = true;
    
    // Validar nombre
    if (nombre.trim().length < 2) {
        showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    } else {
        clearFieldError('nombre');
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Por favor, introduce un email válido');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    // Validar mensaje
    if (mensaje.trim().length < 10) {
        showFieldError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    } else {
        clearFieldError('mensaje');
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch (fieldName) {
        case 'nombre':
            if (value.length < 2) {
                showFieldError(fieldName, 'El nombre debe tener al menos 2 caracteres');
            } else {
                clearFieldError(fieldName);
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, 'Por favor, introduce un email válido');
            } else {
                clearFieldError(fieldName);
            }
            break;
        case 'mensaje':
            if (value.length < 10) {
                showFieldError(fieldName, 'El mensaje debe tener al menos 10 caracteres');
            } else {
                clearFieldError(fieldName);
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const fieldGroup = field.parentElement;
    
    // Agregar clase de error
    field.classList.add('error');
    field.style.borderColor = '#ff4444';
    
    // Mostrar mensaje de error si no existe
    let errorElement = fieldGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ff4444';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.display = 'block';
        fieldGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const fieldGroup = field.parentElement;
    const errorElement = fieldGroup.querySelector('.error-message');
    
    field.classList.remove('error');
    field.style.borderColor = '';
    
    if (errorElement) {
        errorElement.remove();
    }
}

function submitForm(form, data) {
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Cambiar estado del botón a "enviando"
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular tiempo de envío
    setTimeout(() => {
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Resetear formulario
        form.reset();
        
        // Restaurar botón
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.log('Datos del formulario:', data);
    }, 2000);
}

function showSuccessMessage() {
    // Crear mensaje de éxito
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.5s ease;
        ">
            <i class="fas fa-check-circle"></i>
            ¡Mensaje enviado con éxito!
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Remover mensaje después de 3 segundos
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// ========================================
// EFECTOS INTERACTIVOS ADICIONALES
// ========================================

// Efecto de typing para el título del hero
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar efecto después de un pequeño delay
        setTimeout(typeWriter, 500);
    }
}

// Contador animado para estadísticas (si decides agregar)
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar cuando el elemento sea visible
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ========================================
// UTILIDADES Y HELPERS
// ========================================

// Función para detectar si un elemento está en viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function para optimizar eventos de scroll/resize
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar eventos de scroll y resize
const optimizedScrollHandler = debounce(() => {
    updateActiveNavLink();
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// ========================================
// MANEJO DE ERRORES Y FALLBACKS
// ========================================

// Manejo de errores para AOS
window.addEventListener('error', function(e) {
    if (e.message.includes('AOS')) {
        console.warn('AOS no está disponible, usando animaciones CSS fallback');
        // Agregar clase fallback para elementos que usan AOS
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
});

// Verificar soporte para Intersection Observer
if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver no soportado, usando fallback');
    // Implementar fallback simple basado en scroll
}

// ========================================
// PERFORMANCE Y OPTIMIZACIÓN
// ========================================

// Lazy loading para imágenes (si agregas más imágenes)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Preload de recursos críticos
function preloadCriticalResources() {
    const criticalResources = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Inicializar optimizaciones cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        preloadCriticalResources();
        initLazyLoading();
    });
} else {
    preloadCriticalResources();
    initLazyLoading();
}