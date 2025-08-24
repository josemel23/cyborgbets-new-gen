// Encapsulación del analizador de ligas optimizado
(function() {
    'use strict';

    // Configuración de ligas
    const LEAGUE_CONFIG = {
        files: {
            'spain': 'static/la_liga_data.json',
            'spain2': 'static/liga_hypermotion_data.json',
            'england': 'static/premier_league_data.json',
            'championship': 'static/championship_data.json',
            'germany': 'static/bundesliga_data.json',
            'germany2': 'static/bundesliga_2_data.json',
            'italy': 'static/serie_a_data.json',
            'italy2': 'static/serie_b_data.json',
            'france': 'static/ligue_1_data.json',
            'france2': 'static/ligue_2_data.json',
            'netherlands': 'static/eredivisie_data.json',
            'netherlands2': 'static/eerste_divisie_data.json',
            'portugal': 'static/primeira_liga_data.json',
            'portugal2': 'static/liga_portugal_2_data.json',
            'argentina': 'static/primera_division_argentina_data.json',
            'brazil': 'static/serie_a_brasil_data.json',
            'brazil2': 'static/serie_b_brasil_data.json',
            'bulgaria': 'static/bulgaria_data.json',
            'mexico': 'static/liga_mx_data.json',
            'scotland': 'static/scotland Premiership_data.json',
            'colombia': 'static/liga_betplay_data.json',
            'estonia': 'static/meistriliiga_data.json',
            'scotland': 'static/scotland_premiership_data.json',
            'japan': 'static/j1_league_data.json',
            'china': 'static/super_league_china_data.json',
            'croacia': 'static/croacia_data.json',
            'sweden': 'static/allsvenskan_data.json',
            'belgium': 'static/pro_league_belgium_data.json',
            'norway': 'static/eliteserien_data.json',
            'suiza': 'static/super_league_suiza_data.json',
            'turkey': 'static/super_lig_turkey_data.json',
            'ecuador': 'static/serie_a_ecuador_data.json',
            'usa': 'static/mls_usa_data.json',
            'australia': 'static/a_league_australia_data.json',
            'greece': 'static/super_league_greece_data.json',
            'chile': 'static/primera_division_chile_data.json',
            'República Checa': 'static/checa_data.json',
            'libertadores': 'static/libertadores_data.json',
            'sudamericana': 'static/sudamericana_data.json',
            'bolivia': 'static/Lfpb.json'
        },
        displayNames: {
            'spain': 'La Liga',
            'spain2': 'Liga Hypermotion',
            'england': 'Premier League',
            'championship': 'Championship',
            'germany': 'Bundesliga',
            'germany2': 'Bundesliga 2',
            'italy': 'Serie A',
            'italy2': 'Serie B',
            'france': 'Ligue 1',
            'france2': 'Ligue 2',
            'netherlands': 'Eredivisie',
            'netherlands2': 'Eerste Divisie',
            'portugal': 'Primeira Liga',
            'portugal2': 'Liga Portugal 2',
            'argentina': 'Primera División',
            'brazil': 'Serie A Brasil',
            'brazil2': 'Serie B Brasil',
            'bulgaria': 'Primera Liga Bulgaria',
            'mexico': 'Liga MX',
            'colombia': 'Liga BetPlay',
            'estonia': 'Meistriliiga',
            'scotland': 'Premiership',
            'japan': 'J1 League',
            'china': 'Super League China',
            'croacia': 'HNL Croacia',
            'sweden': 'Allsvenskan',
            'belgium': 'Pro League',
            'norway': 'Eliteserien',
            'suiza': 'Super League Suiza',
            'turkey': 'Süper Lig',
            'ecuador': 'Serie A Ecuador',
            'usa': 'MLS',
            'australia': 'A-League',
            'greece': 'Super League Greece',
            'chile': 'Primera División Chile',
            'República Checa': 'Liga Checa',
            'libertadores': 'Copa Libertadores',
            'sudamericana': 'Copa Sudamericana',
            'bolivia': 'Liga de Fútbol Bolivia'
        }
    };

    // Configuración de categorías ACTUALIZADA con esquinas y rentabilidad
        const CATEGORY_CONFIG = {
            ascending: ['mejor_posicion', 'goles_contra_promedio', 'goles_contra_total'],
            titles: {
                // Goles
                'goles_over15': 'Over 1.5 Goles',
                'goles_over25': 'Over 2.5 Goles',
                'goles_over35': 'Over 3.5 Goles',
                'goles_under15': 'Under 1.5 Goles',
                'goles_under25': 'Under 2.5 Goles',
                'goles_under35': 'Under 3.5 Goles',
                // BTTS
                'btts_yes': 'BTTS Sí',
                'btts_no': 'BTTS No',
                // Tarjetas
                'tarjetas_35': 'Over 3.5 Tarjetas',
                'tarjetas_45': 'Over 4.5 Tarjetas',
                'tarjetas_55': 'Over 5.5 Tarjetas',
                'tarjetas_under35': 'Under 3.5 Tarjetas',
                'tarjetas_under45': 'Under 4.5 Tarjetas',
                'tarjetas_under55': 'Under 5.5 Tarjetas',
                // ESQUINAS
                'esquinas_over85': 'Over 8.5 Esquinas',
                'esquinas_over95': 'Over 9.5 Esquinas',
                'esquinas_under95': 'Under 9.5 Esquinas',
                'esquinas_under105': 'Under 10.5 Esquinas',
                // Rendimiento
                'victorias_porcentaje': '% Victorias',
                'empates_porcentaje': '% Empates',
                'derrotas_porcentaje': '% Derrotas',
                'puntos_promedio': 'Puntos por Partido',
                'puntos_totales': 'Total de Puntos',
                // Goles equipo
                'goles_favor_promedio': 'Promedio Goles a Favor',
                'goles_contra_promedio': 'Promedio Goles en Contra',
                'diferencia_goles': 'Diferencia de Goles',
                'goles_favor_total': 'Total Goles a Favor',
                'goles_contra_total': 'Total Goles en Contra',
                // Posición
                'mejor_posicion': 'Mejores Posicionados',
                'peor_posicion': 'Peores Posicionados',
                // Rentabilidad
                'equipos_rentables': 'Equipos Más Rentables',
            },
            classes: {
                // Goles
                'goles_over15': 'goles', 'goles_over25': 'goles', 'goles_over35': 'goles',
                'goles_under15': 'goles', 'goles_under25': 'goles', 'goles_under35': 'goles',
                // BTTS
                'btts_yes': 'btts', 'btts_no': 'btts',
                // Tarjetas
                'tarjetas_35': 'tarjetas', 'tarjetas_45': 'tarjetas', 'tarjetas_55': 'tarjetas',
                'tarjetas_under35': 'tarjetas', 'tarjetas_under45': 'tarjetas', 'tarjetas_under55': 'tarjetas',
                // ESQUINAS
                'esquinas_over85': 'esquinas', 'esquinas_over95': 'esquinas',
                'esquinas_under95': 'esquinas', 'esquinas_under105': 'esquinas',
                // Rendimiento
                'victorias_porcentaje': 'rendimiento', 'empates_porcentaje': 'rendimiento', 'derrotas_porcentaje': 'rendimiento',
                'puntos_promedio': 'rendimiento', 'puntos_totales': 'rendimiento',
                // Goles equipo
                'goles_favor_promedio': 'goles-equipo', 'goles_contra_promedio': 'goles-equipo',
                'diferencia_goles': 'goles-equipo', 'goles_favor_total': 'goles-equipo', 'goles_contra_total': 'goles-equipo',
                // Posición
                'mejor_posicion': 'posicion', 'peor_posicion': 'posicion',
                // Rentabilidad
                'equipos_rentables': 'rentabilidad',
            }
        };

        class LeagueAnalyzer {
            constructor() {
                this.teamsCache = null;
                this.isScrollHandlerActive = false;
                this.initializeScrollBehavior();
            }

            // Inicializar comportamiento de scroll
            initializeScrollBehavior() {
                let ticking = false;
                const handleScroll = () => {
                    if (!ticking) {
                        requestAnimationFrame(() => {
                            this.updateScrollBehavior();
                            ticking = false;
                        });
                        ticking = true;
                    }
                };
                window.addEventListener('scroll', handleScroll, { passive: true });
            }

            // Actualizar comportamiento basado en scroll
            updateScrollBehavior() {
                const filtersContainer = document.querySelector('.filters-container, #filtersContainer, .filter-section');
                const resultsContainer = document.getElementById('resultsContainer');
                if (!filtersContainer || !resultsContainer) return;
                const scrollY = window.scrollY;
                const resultsTop = resultsContainer.offsetTop;
                const triggerPoint = resultsTop - 100;
                if (scrollY > triggerPoint) {
                    this.hideFilters(filtersContainer);
                    this.showScrollToTop();
                } else {
                    this.showFilters(filtersContainer);
                    this.hideScrollToTop();
                }
            }

            // Ocultar filtros con animación
            hideFilters(filtersContainer) {
                if (!filtersContainer.classList.contains('hidden-filters')) {
                    filtersContainer.classList.add('hidden-filters');
                    filtersContainer.style.transform = 'translateY(-100%)';
                    filtersContainer.style.opacity = '0';
                    filtersContainer.style.pointerEvents = 'none';
                }
            }

            // Mostrar filtros con animación
            showFilters(filtersContainer) {
                if (filtersContainer.classList.contains('hidden-filters')) {
                    filtersContainer.classList.remove('hidden-filters');
                    filtersContainer.style.transform = 'translateY(0)';
                    filtersContainer.style.opacity = '1';
                    filtersContainer.style.pointerEvents = 'auto';
                }
            }

            // Mostrar botón de scroll to top
            showScrollToTop() {
                let scrollBtn = document.getElementById('scrollToTopBtn');
                if (!scrollBtn) {
                    scrollBtn = this.createScrollToTopButton();
                }
                scrollBtn.classList.add('visible');
            }

            // Ocultar botón de scroll to top
            hideScrollToTop() {
                const scrollBtn = document.getElementById('scrollToTopBtn');
                if (scrollBtn) {
                    scrollBtn.classList.remove('visible');
                }
            }

            // Crear botón de scroll to top
            createScrollToTopButton() {
                const button = document.createElement('button');
                button.id = 'scrollToTopBtn';
                button.className = 'scroll-to-top-btn';
                button.innerHTML = '↑';
                button.title = 'Volver arriba';
                button.addEventListener('click', () => {
                    this.smoothScrollTo(0, 1200);
                });
                this.addScrollStyles();
                document.body.appendChild(button);
                return button;
            }

            // Agregar estilos CSS para scroll
            addScrollStyles() {
                if (document.getElementById('scrollStyles')) return;
                const style = document.createElement('style');
                style.id = 'scrollStyles';
                style.textContent = `
                    .scroll-to-top-btn {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        width: 50px;
                        height: 50px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 50%;
                        font-size: 20px;
                        font-weight: bold;
                        cursor: pointer;
                        opacity: 0;
                        visibility: hidden;
                        transform: translateY(20px);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        z-index: 1000;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    .scroll-to-top-btn.visible {
                        opacity: 1;
                        visibility: visible;
                        transform: translateY(0);
                    }
                    .scroll-to-top-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                    }
                    .scroll-to-top-btn:active {
                        transform: translateY(0);
                    }
                    .filters-container,
                    #filtersContainer,
                    .filter-section {
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        z-index: 100;
                    }
                    .category-card {
                        opacity: 0;
                        transform: translateY(20px);
                        animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    }
                    .category-card:nth-child(1) { animation-delay: 0.1s; }
                    .category-card:nth-child(2) { animation-delay: 0.2s; }
                    .category-card:nth-child(3) { animation-delay: 0.3s; }
                    .category-card:nth-child(4) { animation-delay: 0.4s; }
                    .category-card:nth-child(5) { animation-delay: 0.5s; }
                    .category-card:nth-child(n+6) { animation-delay: 0.6s; }
                    @keyframes slideInUp {
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    html {
                        scroll-behavior: smooth;
                    }
                    .loading {
                        text-align: center;
                        padding: 40px 20px;
                    }
                    .loading-spinner {
                        width: 40px;
                        height: 40px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .category-card.esquinas {
                        border-left: 4px solid #ff6b35;
                        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
                    }
                    .category-card.esquinas .stat-value {
                        color: #ff6b35;
                    }
                    .category-card.rentabilidad {
                        border-left: 4px solid #4CAF50;
                        background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
                    }
                    .category-card.rentabilidad .stat-value {
                        color: #4CAF50;
                    }
                `;
                document.head.appendChild(style);
            }

            // Scroll automático a resultados
            scrollToResults() {
                const resultsContainer = document.getElementById('resultsContainer');
                if (resultsContainer) {
                    const offset = 80;
                    const elementPosition = resultsContainer.offsetTop;
                    const offsetPosition = elementPosition - offset;
                    const currentPosition = window.scrollY;
                    const distance = offsetPosition - currentPosition;
                    if (Math.abs(distance) > 100) {
                        this.smoothScrollTo(offsetPosition, 1500);
                    }
                }
            }

            // Función de scroll suave personalizada
            smoothScrollTo(targetPosition, duration = 1500) {
                const startPosition = window.scrollY;
                const distance = targetPosition - startPosition;
                let startTime = null;
                const easeInOutCubic = (t) => {
                    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                };
                const animation = (currentTime) => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const easedProgress = easeInOutCubic(progress);
                    const currentScrollPosition = startPosition + (distance * easedProgress);
                    window.scrollTo(0, currentScrollPosition);
                    if (progress < 1) {
                        requestAnimationFrame(animation);
                    }
                };
                requestAnimationFrame(animation);
            }

            // Cargar datos de ligas
            async loadLeagueData() {
                if (this.teamsCache) return this.teamsCache;
                const allTeams = [];
                const loadPromises = Object.entries(LEAGUE_CONFIG.files).map(
                    async ([leagueName, filePath]) => {
                        try {
                            const response = await fetch(filePath);
                            if (!response.ok) {
                                console.warn(`No se pudo cargar ${filePath}: ${response.status}`);
                                return null;
                            }
                            const data = await response.json();
                            if (data.teams && Array.isArray(data.teams)) {
                                return data.teams.map(team => ({
                                    ...team,
                                    league: leagueName,
                                    leagueDisplayName: LEAGUE_CONFIG.displayNames[leagueName] || leagueName
                                }));
                            }
                        } catch (error) {
                            console.error(`Error al cargar ${filePath}:`, error);
                        }
                        return null;
                    }
                );
                const results = await Promise.all(loadPromises);
                results.forEach(teams => {
                    if (teams) allTeams.push(...teams);
                });
                console.log(`✅ Cargados ${allTeams.length} equipos de ${Object.keys(LEAGUE_CONFIG.files).length} ligas`);
                this.teamsCache = allTeams;
                return allTeams;
            }

            // Filtrar y ordenar equipos
            filterTeams(teams, category, minMatches) {
                const filteredTeams = teams.filter(team => team.matches_played >= minMatches);
                const isAscending = CATEGORY_CONFIG.ascending.includes(category);
                return filteredTeams.sort((a, b) => {
                    const aValue = this.getStatValue(a, category);
                    const bValue = this.getStatValue(b, category);
                    if (isNaN(aValue) && isNaN(bValue)) return 0;
                    if (isNaN(aValue)) return 1;
                    if (isNaN(bValue)) return -1;
                    return isAscending ? aValue - bValue : bValue - aValue;
                });
            }

            // Obtener valor de estadística
            getStatValue(team, category) {
                try {
                    const statMap = {
                        // Goles
                        'goles_over15': () => this.parsePercentage(team.goals?.['1.5']),
                        'goles_over25': () => this.parsePercentage(team.goals?.['2.5']),
                        'goles_over35': () => this.parsePercentage(team.goals?.['3.5']),
                        'goles_under15': () => 100 - this.parsePercentage(team.goals?.['1.5']),
                        'goles_under25': () => 100 - this.parsePercentage(team.goals?.['2.5']),
                        'goles_under35': () => 100 - this.parsePercentage(team.goals?.['3.5']),
                        // BTTS
                        'btts_yes': () => this.parsePercentage(team.btts?.Yes),
                        'btts_no': () => 100 - this.parsePercentage(team.btts?.Yes),
                        // Tarjetas
                        'tarjetas_35': () => this.parsePercentage(team.cards?.over_3_5),
                        'tarjetas_45': () => this.parsePercentage(team.cards?.over_4_5),
                        'tarjetas_55': () => this.parsePercentage(team.cards?.over_5_5),
                        'tarjetas_under35': () => 100 - this.parsePercentage(team.cards?.over_3_5),
                        'tarjetas_under45': () => 100 - this.parsePercentage(team.cards?.over_4_5),
                        'tarjetas_under55': () => 100 - this.parsePercentage(team.cards?.over_5_5),
                        // ESQUINAS
                        'esquinas_over85': () => this.parsePercentage(team.corners?.['8.5']),
                        'esquinas_over95': () => this.parsePercentage(team.corners?.['9.5']),
                        'esquinas_under95': () => 100 - this.parsePercentage(team.corners?.['9.5']),
                        'esquinas_under105': () => 100 - this.parsePercentage(team.corners?.['10.5']),
                        // Rendimiento
                        'victorias_porcentaje': () => (team.wins / team.matches_played * 100) || 0,
                        'empates_porcentaje': () => (team.draws / team.matches_played * 100) || 0,
                        'derrotas_porcentaje': () => (team.losses / team.matches_played * 100) || 0,
                        'puntos_promedio': () => (team.points / team.matches_played) || 0,
                        'puntos_totales': () => team.points || 0,
                        // Goles equipo
                        'goles_favor_promedio': () => (team.goals_for / team.matches_played) || 0,
                        'goles_contra_promedio': () => (team.goals_against / team.matches_played) || 0,
                        'diferencia_goles': () => (team.goals_for - team.goals_against) || 0,
                        'goles_favor_total': () => team.goals_for || 0,
                        'goles_contra_total': () => team.goals_against || 0,
                        // Posición
                        'mejor_posicion': () => team.position || 999,
                        'peor_posicion': () => team.position || 999,
                        // Rentabilidad
                        'equipos_rentables': () => {
                            const puntosPorPartido = (team.points / team.matches_played) || 0;
                            const diferenciaGoles = (team.goals_for - team.goals_against) || 0;
                            const porcentajeVictorias = (team.wins / team.matches_played * 100) || 0;
                            const porcentajeEmpates = (team.draws / team.matches_played * 100) || 0;
                            // Fórmula de rentabilidad
                            return (puntosPorPartido * 2) + (diferenciaGoles * 0.5) + (porcentajeVictorias * 0.3) + (porcentajeEmpates * 0.1);
                        },
                    };
                    return statMap[category] ? statMap[category]() : 0;
                } catch (error) {
                    console.error(`Error al obtener estadística ${category}:`, error);
                    return 0;
                }
            }

            // Helper: Parsear porcentaje
            parsePercentage(value) {
                if (!value) return 0;
                const parsed = parseFloat(value.toString().replace('%', ''));
                return isNaN(parsed) ? 0 : parsed;
            }

            // Formatear valor para mostrar
            formatDisplayValue(value, category) {
                if (isNaN(value)) return 'N/A';
                const percentageCategories = [
                    'goles_over15', 'goles_over25', 'goles_over35',
                    'goles_under15', 'goles_under25', 'goles_under35',
                    'btts_yes', 'btts_no',
                    'tarjetas_35', 'tarjetas_45', 'tarjetas_55',
                    'tarjetas_under35', 'tarjetas_under45', 'tarjetas_under55',
                    'esquinas_over85', 'esquinas_over95', 'esquinas_under95', 'esquinas_under105',
                    'victorias_porcentaje', 'empates_porcentaje', 'derrotas_porcentaje'
                ];
                const decimalCategories = [
                    'puntos_promedio', 'goles_favor_promedio', 'goles_contra_promedio',
                    'equipos_rentables' // Agregado para mostrar con decimales
                ];
                if (percentageCategories.includes(category)) {
                    return `${value.toFixed(1)}%`;
                } else if (decimalCategories.includes(category)) {
                    return value.toFixed(2);
                } else {
                    return Math.round(Math.abs(value)).toString();
                }
            }

            // Mostrar resultados con animaciones
            displayResults(teams, topCount) {
                const container = document.getElementById('resultsContainer');
                if (!container) {
                    console.error('No se encontró el contenedor de resultados');
                    return;
                }
                container.innerHTML = '';
                const categorySelect = document.getElementById('categorySelect');
                const category = categorySelect?.value;
                const topTeams = teams.slice(0, topCount);
                if (topTeams.length === 0) {
                    container.innerHTML = '<div class="no-results">No se encontraron equipos que cumplan los criterios.</div>';
                    return;
                }
                const fragment = document.createDocumentFragment();
                topTeams.forEach((team, index) => {
                    const card = document.createElement('div');
                    card.className = `category-card ${CATEGORY_CONFIG.classes[category] || 'default'}`;
                    const statValue = this.getStatValue(team, category);
                    const displayValue = this.formatDisplayValue(statValue, category);
                    card.innerHTML = `
                        <div class="rank-badge">#${index + 1}</div>
                        <div class="team-item">
                            <div class="team-info">
                                <div class="team-name">${team.team}</div>
                                <div class="team-league">${team.leagueDisplayName}</div>
                                <div class="team-matches">Partidos: ${team.matches_played}</div>
                            </div>
                            <div class="team-stats">
                                <div class="stat-value">${displayValue}</div>
                                <div class="stat-label">${CATEGORY_CONFIG.titles[category] || category}</div>
                            </div>
                        </div>
                    `;
                    fragment.appendChild(card);
                });
                container.appendChild(fragment);
                setTimeout(() => this.scrollToResults(), 400);
            }

            // Análisis principal optimizado
            async analyzeAllLeagues() {
                try {
                    const elements = {
                        category: document.getElementById('categorySelect'),
                        topCount: document.getElementById('topCount'),
                        minMatches: document.getElementById('minMatches'),
                        container: document.getElementById('resultsContainer')
                    };
                    if (!elements.category || !elements.topCount || !elements.minMatches) {
                        throw new Error('No se encontraron todos los elementos del formulario');
                    }
                    const params = {
                        category: elements.category.value,
                        topCount: parseInt(elements.topCount.value),
                        minMatches: parseInt(elements.minMatches.value)
                    };
                    if (!params.category || params.topCount < 1 || params.minMatches < 1) {
                        throw new Error('Parámetros inválidos');
                    }
                    if (elements.container) {
                        elements.container.innerHTML = `
                            <div class="loading">
                                <div class="loading-spinner"></div>
                                <p>Analizando datos de ${CATEGORY_CONFIG.titles[params.category] || params.category}...</p>
                            </div>
                        `;
                    }
                    console.log(`🔍 Iniciando análisis: ${params.category}, Top ${params.topCount}, Min ${params.minMatches} partidos`);
                    const teams = await this.loadLeagueData();
                    const filteredTeams = this.filterTeams(teams, params.category, params.minMatches);
                    console.log(`📊 Equipos filtrados: ${filteredTeams.length}`);
                    this.displayResults(filteredTeams, params.topCount);
                } catch (error) {
                    console.error('❌ Error al analizar las ligas:', error);
                    const container = document.getElementById('resultsContainer');
                    if (container) {
                        container.innerHTML = `
                            <div class="error">
                                <h3>❌ Error al cargar los datos</h3>
                                <p>Por favor, verifica tu conexión a internet e inténtalo de nuevo</p>
                                <button onclick="window.LeagueAnalyzerInstance.analyzeAllLeagues()" class="retry-btn">🔄 Reintentar</button>
                            </div>
                        `;
                    }
                }
            }

            // Métodos de utilidad
            clearCache() {
                this.teamsCache = null;
                console.log('🗑️ Caché limpiado');
            }

            getCacheStats() {
                if (!this.teamsCache) return null;
                const leagueCount = this.teamsCache.reduce((acc, team) => {
                    acc[team.league] = (acc[team.league] || 0) + 1;
                    return acc;
                }, {});
                const cornersStats = this.teamsCache.reduce((acc, team) => {
                    if (team.corners) {
                        acc.withCornersData++;
                        const cornersFields = Object.keys(team.corners);
                        cornersFields.forEach(field => {
                            acc.fieldsAvailable[field] = (acc.fieldsAvailable[field] || 0) + 1;
                        });
                    }
                    return acc;
                }, { withCornersData: 0, fieldsAvailable: {} });
                return {
                    totalTeams: this.teamsCache.length,
                    totalLeagues: Object.keys(leagueCount).length,
                    leagueBreakdown: leagueCount,
                    cornersDataStats: {
                        teamsWithCornersData: cornersStats.withCornersData,
                        cornerFieldsAvailability: cornersStats.fieldsAvailable,
                        cornersDataPercentage: ((cornersStats.withCornersData / this.teamsCache.length) * 100).toFixed(1) + '%'
                    }
                };
            }
        }

        // Inicialización global
        window.LeagueAnalyzerInstance = new LeagueAnalyzer();
        window.analyzeAllLeagues = () => window.LeagueAnalyzerInstance.analyzeAllLeagues();
        window.clearLeagueCache = () => window.LeagueAnalyzerInstance.clearCache();
        window.getLeagueStats = () => window.LeagueAnalyzerInstance.getCacheStats();

        // Auto-inicialización
        const initialize = () => {
            console.log('⚽ League Analyzer optimizado cargado y listo');
            console.log('💰 Soporte para "Equipos Más Rentables" agregado');
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    })();