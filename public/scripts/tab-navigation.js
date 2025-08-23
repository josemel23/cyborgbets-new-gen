// Navegación por pestañas - Solo por menús
class TabNavigation {
    constructor() {
       this.sections = {
    'inicio': document.querySelector('#inicio'),
    'radar': document.querySelector('#radar'),
    'ligas': document.querySelector('#ligas'),
    'SmartLine': document.querySelector('#SmartLine'),
    'CyborgMatch': document.querySelector('#CyborgMatch'),
    'BetManager': document.querySelector('#BetManager'),
    'estadisticas': document.querySelector('#estadisticas'),
    'nba': document.querySelector('#nba'),
    'tips': document.querySelector('#tips'),
    'presentacion': document.querySelector('#presentacion'),
};

        
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentSection = 'inicio';
        this.isTransitioning = false;
        this.isInitialized = false;
        
        // Guardar posiciones de scroll para cada sección
        this.scrollPositions = {};
        
        this.init();
    }
    
    init() {
        // Inicializar el estado
        this.setupSections();
        this.setupNavigation();
        
        // Mostrar sección inicial solo si no hay contenido visible
        this.initializeFirstTime();
    }
    
    setupSections() {
        // Preparar secciones para navegación por pestañas
        Object.values(this.sections).forEach(section => {
            if (section) {
                section.classList.add('content-section');
                // Preservar el comportamiento normal del scroll
                section.style.position = 'relative';
                section.style.overflow = 'visible';
                section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }
        });
    }
    
    initializeFirstTime() {
        // Verificar si hay un hash en la URL
        const urlHash = window.location.hash.replace('#', '');
        
        // Inicializar posiciones de scroll
        Object.keys(this.sections).forEach(sectionName => {
            this.scrollPositions[sectionName] = {
                top: 0,
                left: 0
            };
        });
        
        if (urlHash && this.sections[urlHash]) {
            // Si hay un hash válido, mostrar esa sección
            this.showSection(urlHash, true);
        } else {
            // Si no hay hash, verificar si alguna sección ya está visible
            let hasVisibleSection = false;
            
            Object.entries(this.sections).forEach(([name, section]) => {
                if (section) {
                    const isVisible = section.style.display !== 'none' && 
                                     section.offsetHeight > 0 && 
                                     section.offsetWidth > 0;
                    
                    if (isVisible && !hasVisibleSection) {
                        this.currentSection = name;
                        hasVisibleSection = true;
                        section.classList.add('active');
                        this.updateNavigation(name);
                        // Guardar posición inicial
                        this.saveScrollPosition(name);
                    } else if (isVisible) {
                        // Si hay múltiples secciones visibles, ocultar las demás
                        section.style.display = 'none';
                    }
                }
            });
            
            // Si no hay ninguna sección visible, mostrar inicio
            if (!hasVisibleSection) {
                this.showSection('inicio', true);
            }
        }
        
        this.isInitialized = true;
    }
    
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Obtener el nombre de la sección del href
                const href = link.getAttribute('href');
                const sectionName = href ? href.replace('#', '') : null;
                
                if (sectionName && this.sections[sectionName]) {
                    this.showSection(sectionName);
                }
            });
        });
        
        // Navegación por teclado opcional (Alt + número)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                const sectionKeys = {
                    '1': 'inicio',
                    '2': 'ligas',
                    '3': 'CyborgMatch',
                    '4': 'estadisticas',
                    '5': 'nba'
                };
                
                if (sectionKeys[e.key]) {
                    e.preventDefault();
                    this.showSection(sectionKeys[e.key]);
                }
            }
        });
    }
    
    showSection(sectionName, isInitial = false) {
        if (this.isTransitioning || !this.sections[sectionName] || sectionName === this.currentSection) {
            return;
        }
        
        this.isTransitioning = true;
        
        const currentSectionEl = this.sections[this.currentSection];
        const newSectionEl = this.sections[sectionName];
        
        // Guardar posición de scroll de la sección actual (pero no para inicio)
        if (currentSectionEl && this.currentSection && this.currentSection !== 'inicio') {
            this.saveScrollPosition(this.currentSection);
        }
        
        // Si vamos a mostrar inicio, resetear inmediatamente su posición
        if (sectionName === 'inicio') {
            this.scrollPositions['inicio'] = { top: 0, left: 0 };
        }
        
        if (isInitial) {
            // Para la inicialización, mostrar directamente sin animación
            Object.values(this.sections).forEach(section => {
                if (section) {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }
            });
            
            newSectionEl.style.display = 'block';
            newSectionEl.style.opacity = '1';
            newSectionEl.style.transform = 'none';
            newSectionEl.classList.add('active');
            
            this.currentSection = sectionName;
            this.updateNavigation(sectionName);
            
            // Restaurar posición de scroll
            setTimeout(() => {
                this.restoreScrollPosition(sectionName);
                
                // ✅ Para inicio en inicialización, asegurar que esté en el top
                if (sectionName === 'inicio') {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                }
                
                this.isTransitioning = false;
            }, 50);
            
            // Actualizar URL sin recargar
            if (history.replaceState && sectionName !== 'inicio') {
                history.replaceState(null, null, `#${sectionName}`);
            } else if (sectionName === 'inicio') {
                history.replaceState(null, null, window.location.pathname);
            }
            
            return;
        }
        
        // Animar salida de la sección actual
        if (currentSectionEl) {
            currentSectionEl.style.opacity = '0';
            currentSectionEl.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                currentSectionEl.style.display = 'none';
                currentSectionEl.classList.remove('active');
                currentSectionEl.style.transform = 'translateX(0)';
            }, 200);
        }
        
        // Animar entrada de la nueva sección
        setTimeout(() => {
            newSectionEl.style.display = 'block';
            newSectionEl.classList.add('active');
            newSectionEl.style.opacity = '0';
            newSectionEl.style.transform = 'translateX(20px)';
            
            // Forzar reflow
            newSectionEl.offsetHeight;
            
            // Animar entrada
            setTimeout(() => {
                newSectionEl.style.opacity = '1';
                newSectionEl.style.transform = 'translateX(0)';
                
                // Restaurar posición de scroll después de que la animación termine
                setTimeout(() => {
                    this.restoreScrollPosition(sectionName);
                    
                    // ✅ Para inicio, forzar scroll al top una vez más después de la animación
                    if (sectionName === 'inicio') {
                        setTimeout(() => {
                            window.scrollTo(0, 0);
                            document.documentElement.scrollTop = 0;
                            document.body.scrollTop = 0;
                        }, 50);
                    }
                }, 100);
            }, 50);
            
            // Actualizar navegación
            this.updateNavigation(sectionName);
            this.currentSection = sectionName;
            
            // Finalizar transición
            setTimeout(() => {
                this.isTransitioning = false;
                
                // Disparar evento personalizado
                const sectionChangeEvent = new CustomEvent('sectionChanged', {
                    detail: {
                        currentSection: sectionName,
                        previousSection: this.currentSection
                    }
                });
                document.dispatchEvent(sectionChangeEvent);
            }, 300);
            
        }, 150);
        
        // Actualizar URL sin recargar
        if (history.pushState) {
            if (sectionName !== 'inicio') {
                history.pushState(null, null, `#${sectionName}`);
            } else {
                history.pushState(null, null, window.location.pathname);
            }
        }
    }
    
    updateNavigation(sectionName) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href === `#${sectionName}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Guardar posición de scroll de una sección
    saveScrollPosition(sectionName) {
        const section = this.sections[sectionName];
        if (section && sectionName !== 'inicio') { // ✅ No guardar posición para inicio
            // Guardar scroll del documento principal
            this.scrollPositions[sectionName] = {
                top: window.pageYOffset || document.documentElement.scrollTop,
                left: window.pageXOffset || document.documentElement.scrollLeft
            };
            
            // También guardar scroll interno de la sección si tiene
            const scrollableElements = section.querySelectorAll('[data-scroll-save]');
            scrollableElements.forEach(el => {
                const key = `${sectionName}_${el.dataset.scrollSave}`;
                this.scrollPositions[key] = {
                    top: el.scrollTop,
                    left: el.scrollLeft
                };
            });
        }
    }
    
    // Restaurar posición de scroll de una sección
    restoreScrollPosition(sectionName) {
        const section = this.sections[sectionName];
        if (section) {
            // ✅ Para inicio, siempre ir al top inmediatamente
            if (sectionName === 'inicio') {
                // Forzar scroll al top inmediatamente
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                return;
            }
            
            // Para otras secciones, restaurar posición guardada
            if (this.scrollPositions[sectionName]) {
                const pos = this.scrollPositions[sectionName];
                window.scrollTo(pos.left, pos.top);
            } else {
                // Si no hay posición guardada, ir al top
                window.scrollTo(0, 0);
            }
            
            // También restaurar scroll interno de elementos específicos
            const scrollableElements = section.querySelectorAll('[data-scroll-save]');
            scrollableElements.forEach(el => {
                const key = `${sectionName}_${el.dataset.scrollSave}`;
                if (this.scrollPositions[key]) {
                    el.scrollTop = this.scrollPositions[key].top;
                    el.scrollLeft = this.scrollPositions[key].left;
                }
            });
        }
    }
    
    // Método público para cambiar sección programáticamente
    navigateTo(sectionName) {
        this.showSection(sectionName);
    }
    
    // Método para obtener la sección actual
    getCurrentSection() {
        return this.currentSection;
    }
    
    // Método para verificar si está inicializado
    isReady() {
        return this.isInitialized;
    }
    
    // Método para destruir la navegación
    destroy() {
        // Guardar posición actual antes de destruir (pero no para inicio)
        if (this.currentSection && this.currentSection !== 'inicio') {
            this.saveScrollPosition(this.currentSection);
        }
        
        // Restaurar el comportamiento normal
        Object.values(this.sections).forEach(section => {
            if (section) {
                section.style.display = 'block';
                section.style.opacity = '1';
                section.style.transform = 'none';
                section.style.transition = 'none';
                section.classList.remove('content-section', 'active');
            }
        });
        
        // Limpiar navegación
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        this.isInitialized = false;
        this.scrollPositions = {};
    }
}

// Inicializar la navegación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Crear instancia global de navegación
    window.tabNavigation = new TabNavigation();
    
    // Manejar navegación del botón atrás del navegador
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash.replace('#', '');
        if (hash && window.tabNavigation.sections[hash]) {
            window.tabNavigation.showSection(hash);
        } else {
            window.tabNavigation.showSection('inicio');
        }
    });
    
    // Guardar posición cuando el usuario hace scroll
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (window.tabNavigation && window.tabNavigation.isReady() && !window.tabNavigation.isTransitioning) {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const currentSection = window.tabNavigation.getCurrentSection();
                if (currentSection && currentSection !== 'inicio') { // ✅ No guardar scroll para inicio
                    window.tabNavigation.saveScrollPosition(currentSection);
                }
            }, 100);
        }
    });
});

// Funciones auxiliares para compatibilidad con código existente
function comenzarAnalisis() {
    if (window.tabNavigation) {
        window.tabNavigation.navigateTo('ligas');
    }
}

// Función para navegación programática desde otros scripts
function navigateToSection(sectionName) {
    if (window.tabNavigation) {
        window.tabNavigation.navigateTo(sectionName);
    }
}

// Función para obtener la sección actual
function getCurrentSection() {
    return window.tabNavigation ? window.tabNavigation.getCurrentSection() : 'inicio';
}

// Función para verificar si la navegación está lista
function isNavigationReady() {
    return window.tabNavigation ? window.tabNavigation.isReady() : false;
}

// Función para habilitar/deshabilitar la navegación por pestañas
function toggleTabNavigation(enable = true) {
    if (enable && !window.tabNavigation) {
        window.tabNavigation = new TabNavigation();
    } else if (!enable && window.tabNavigation) {
        window.tabNavigation.destroy();
        window.tabNavigation = null;
    }
}

// Exportar para uso en otros módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        TabNavigation, 
        navigateToSection, 
        getCurrentSection, 
        toggleTabNavigation,
        isNavigationReady
    };
}