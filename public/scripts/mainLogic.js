// Mapeo de logos de ligas actualizado para coincidir con los nombres exactos
const leagueLogos = {
    'spain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/LaLiga_EA_Sports_2023_Vertical_Logo.svg/2560px-LaLiga_EA_Sports_2023_Vertical_Logo.svg.png',
    'spain2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/LaLiga_Hypermotion_%28Black%29.svg/1200px-LaLiga_Hypermotion_%28Black%29.svg.png',
    'england': 'https://i.pinimg.com/736x/cf/56/61/cf5661ceae37d26aee8aa18c4a6a1df0.jpg',
    'championship': 'https://whatthelogo.com/storage/logos/sky-bet-championship-230897.webp',
    'germany': 'https://whatthelogo.com/storage/logos/bundesliga-228171.webp',
    'germany2': 'https://upload.wikimedia.org/wikipedia/en/7/7b/2._Bundesliga_logo.svg',
    'italy': 'https://whatthelogo.com/storage/logos/serie-a-tim-liga-italiana-232772.webp',
    'italy2': 'https://whatthelogo.com/storage/logos/serie-b-232961.webp',
    'france': 'https://whatthelogo.com/storage/logos/ligue-1-228388.webp',
    'france2': 'https://whatthelogo.com/storage/logos/ligue-2-bkt-242217.webp',
    'netherlands': 'https://whatthelogo.com/storage/logos/eredivisie-233122.webp',
    'netherlands2': 'https://res.cloudinary.com/dq4uxsxpv/image/upload/v1645166657/netherlands-eerste-divisie.webp',
    'portugal': 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbw9Pu7bke27SinLaqu6FIcAw5Y3T9CU1DoLVS1k9W11IWhC7QTuHeHq8MdNfcX9q-wiT9MpCC1hlmpEym3XYC1FjF1xdK-a3ZYHqicHYkkX9FWtPIBX283A9TnrH33Ux4fZoSudx1Mq5Y/s1600/all-new-liga-portugal+%25281%2529.jpg',
    'portugal2': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Liga_Portugal_2_logo.png',
    'argentina': 'https://assets.gmlinteractive.com/sites/15/2025/01/4a3776d7dac0_3138332.png',
    'dinamarca': 'https://res.cloudinary.com/dq4uxsxpv/image/upload/denmark-superliga.webp',
    'israel': 'https://static.flashscore.com/res/image/data/viYyzoTp-MZqsIdD1.png',
    'brazil': 'https://static.flashscore.com/res/image/data/fNdt78BO-SEJanvAm.png',
    'brazil2': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/2299.png',
    'bulgaria': 'https://static.flashscore.com/res/image/data/hnzY7wld-CbwNlnIA.png',
    'mexico': 'https://whatthelogo.com/storage/logos/liga-mx-228948.webp',
    'colombia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/BetPlay-Dimayor_logo.svg/200px-BetPlay-Dimayor_logo.svg.png',
    'estonia': 'https://upload.wikimedia.org/wikipedia/en/8/82/Premium_Liiga_logo_2024.png',
    'japan': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/J1_logo.png',
    'china': 'https://a2.espncdn.com/combiner/i?img=%2Fi%2Fleaguelogos%2Fsoccer%2F500%2F2350.png',
    'sweden': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Allsvenskan_logo.svg/345px-Allsvenskan_logo.svg.png',
    'belgium': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/6.png',
    'norway': 'https://i0.wp.com/www.elpoderdelasideas.com/wp-content/uploads/Eliteserien-logo-2016.png?resize=600%2C330',
    'switzerland': 'https://a.espncdn.com/combiner/i?img=/i/leaguelogos/soccer/500/17.png',
    'scotland': 'https://logos-world.net/wp-content/uploads/2025/01/Cinch-Premiership-Logo-2021.png',
    'saudi-arabia': 'https://static.flashscore.com/res/image/data/ETIVFlkD-lb5afHuE.png',
    'croatia': 'https://img.uefa.com/imgml/uefacom/elements/logos/ma/CRO.svg',
    'República Checa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Chance_Liga.png/800px-Chance_Liga.png',
    'turkey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/S%C3%BCper_Lig_logo.svg/200px-S%C3%BCper_Lig_logo.svg.png',
    'ecuador': 'https://i.namu.wiki/i/mTq3-KQVIX3oaAuVLRb8MWg61ADFSXWR6hkB8ICXOZia2qe1pGi_Ti8p_-aaMmUDkz9rPEwUvbLomsjNUPAdUg.webp',
    'usa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/MLS_crest_logo_RGB_gradient.svg/1200px-MLS_crest_logo_RGB_gradient.svg.png',
    'australia': 'https://imagecache.365scores.com/image/upload/f_png,w_68,h_68,c_limit,q_auto:eco,dpr_2,d_Countries:Round:36.png/v1/Competitions/light/151',
    'greece': 'https://static.flashscore.com/res/image/data/OQxpkTT1-nRG0DCx4.png',
    'chile': 'https://www.topmercato.com/cl/app/uploads/2024/01/image4.png',
    'libertadores':'https://res.cloudinary.com/dq4uxsxpv/image/upload/v1659928407/south-america-copa-libertadores.webp',
    'sudamericana':'https://res.cloudinary.com/dq4uxsxpv/image/upload/south-america-copa-sudamericana.webp',
    'bolivia':'https://res.cloudinary.com/dq4uxsxpv/image/upload/bolivia-lfpb.webp',
    'austria': 'https://static.flashscore.com/res/image/data/jkEi83gU-f7CHEncm.png',
    'rumania':'https://static.flashscore.com/res/image/data/r9Ek8xRp-pU6hjxh6.png'

};

// Variables globales
let currentLeagueData = {};
let currentLeague = 'spain';

// DOM Elements
const leagueCards = document.querySelectorAll('.league-card');
const homeTeamSelect = document.getElementById('homeTeam');
const awayTeamSelect = document.getElementById('awayTeam');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsPanel = document.getElementById('resultsPanel');
const loadingOverlay = document.getElementById('loadingOverlay');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    updateTeamSelectorLogo(); // Actualizar logo en selector de equipos
});

// Función mejorada para actualizar el logo en la sección del selector de equipos
function updateTeamSelectorLogo() {
    console.log('Iniciando updateTeamSelectorLogo, liga actual:', currentLeague);
    
    const logoUrl = leagueLogos[currentLeague] || leagueLogos['default'];
    
    // Buscar elementos existentes primero para evitar duplicados
    const existingLogo = document.querySelector('.football-team-selector-logo');
    if (existingLogo) {
        // Si ya existe, solo actualizar la imagen
        const logoImg = existingLogo.querySelector('.football-selector-logo-img');
        if (logoImg) {
            logoImg.src = logoUrl;
            logoImg.alt = `Logo ${currentLeague}`;
            return;
        }
    }
    
    // Buscar el contenedor del selector de equipos
    const homeSelect = document.getElementById('homeTeam');
    const awaySelect = document.getElementById('awayTeam');
    
    if (!homeSelect || !awaySelect) {
        console.log('No se encontraron los selectores de equipos');
        return;
    }
    
    // Buscar el contenedor padre que contiene ambos selectores
    const container = findCommonParent(homeSelect, awaySelect);
    
    if (!container) {
        console.log('No se encontró el contenedor común');
        return;
    }
    
    // Estrategia 1: Buscar elemento con texto "VS" o similar
    const vsElement = findVSElement(container);
    if (vsElement) {
        replaceWithLogo(vsElement, logoUrl);
        return;
    }
    
    // Estrategia 2: Buscar entre los selectores e insertar logo
    insertLogoBetweenSelectors(homeSelect, awaySelect, logoUrl);
}

// Función auxiliar para encontrar el contenedor común de dos elementos
function findCommonParent(element1, element2) {
    let parent1 = element1.parentElement;
    
    while (parent1) {
        if (parent1.contains(element2)) {
            return parent1;
        }
        parent1 = parent1.parentElement;
    }
    
    return null;
}

// Función auxiliar para encontrar elemento que contenga "VS"
function findVSElement(container) {
    // Buscar por selectores CSS comunes
    const selectors = [
        '.vs', '.vs-text', '.match-vs', '.team-vs', 
        '.separator', '.divider', '[class*="vs"]',
        '.versus', '.against'
    ];
    
    for (const selector of selectors) {
        const element = container.querySelector(selector);
        if (element) {
            console.log('Encontrado elemento VS por selector:', selector);
            return element;
        }
    }
    
    // Buscar por contenido de texto
    const allElements = container.querySelectorAll('*');
    for (const element of allElements) {
        const text = element.textContent.trim();
        if (text === 'VS' || text === 'vs' || text === 'V/S' || text === 'contra' || text === 'VERSUS') {
            console.log('Encontrado elemento VS por texto:', text);
            return element;
        }
    }
    
    // Buscar nodos de texto directamente
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let textNode;
    while (textNode = walker.nextNode()) {
        const text = textNode.nodeValue.trim();
        if (text === 'VS' || text === 'vs' || text === 'V/S' || text === 'contra' || text === 'VERSUS') {
            console.log('Encontrado nodo de texto VS:', text);
            return textNode.parentElement;
        }
    }
    
    return null;
}

// Función auxiliar para reemplazar elemento con logo
function replaceWithLogo(element, logoUrl) {
    // Verificar si ya tiene logo
    if (element.querySelector('.football-selector-logo-img')) {
        const logoImg = element.querySelector('.football-selector-logo-img');
        logoImg.src = logoUrl;
        logoImg.alt = `Logo ${currentLeague}`;
        return;
    }
    
    // Reemplazar contenido con logo
    element.innerHTML = `
        <div class="football-team-selector-logo">
            <img src="${logoUrl}" alt="Logo ${currentLeague}" class="football-selector-logo-img">
        </div>
    `;
    
    // Añadir clases para mejor estilo
    element.classList.add('vs-logo-container');
}

// Función auxiliar para insertar logo entre selectores
function insertLogoBetweenSelectors(homeSelect, awaySelect, logoUrl) {
    // Buscar si hay un elemento entre los selectores
    const homeParent = homeSelect.parentElement;
    const awayParent = awaySelect.parentElement;
    
    // Si están en el mismo contenedor
    if (homeParent === awayParent) {
        const homeIndex = Array.from(homeParent.children).indexOf(homeSelect);
        const awayIndex = Array.from(homeParent.children).indexOf(awaySelect);
        
        // Insertar logo entre ellos
        const logoElement = document.createElement('div');
        logoElement.className = 'football-team-selector-logo vs-inserted';
        logoElement.innerHTML = `<img src="${logoUrl}" alt="Logo ${currentLeague}" class="football-selector-logo-img">`;
        
        if (homeIndex < awayIndex) {
            homeParent.insertBefore(logoElement, awaySelect);
        } else {
            homeParent.insertBefore(logoElement, homeSelect);
        }
        
        console.log('Logo insertado entre selectores');
        return;
    }
    
    // Si están en contenedores diferentes, buscar contenedor común
    const commonParent = findCommonParent(homeSelect, awaySelect);
    if (commonParent) {
        // Crear contenedor para el logo si no existe
        let logoContainer = commonParent.querySelector('.football-team-selector-logo');
        if (!logoContainer) {
            logoContainer = document.createElement('div');
            logoContainer.className = 'football-team-selector-logo center-logo';
            logoContainer.innerHTML = `<img src="${logoUrl}" alt="Logo ${currentLeague}" class="football-selector-logo-img">`;
            
            // Insertarlo en el centro del contenedor común
            const middleIndex = Math.floor(commonParent.children.length / 2);
            if (middleIndex < commonParent.children.length) {
                commonParent.insertBefore(logoContainer, commonParent.children[middleIndex]);
            } else {
                commonParent.appendChild(logoContainer);
            }
            
            console.log('Logo insertado en contenedor común');
        }
    }
}

// Función mejorada para inicializar después de cargar datos
function selectLeague(league) {
    // Actualizar UI
    leagueCards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-league') === league) {
            card.classList.add('active');
        }
    });

    currentLeague = league;
    loadLeagueData(league).then(() => {
        // Esperar un poco más para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            updateTeamSelectorLogo();
        }, 100);
        
        // Desplazamiento suave hacia abajo después de cargar los datos de la liga
        setTimeout(() => {
            window.scrollBy({
                top: 300,
                behavior: 'smooth'
            });
        }, 300);
    });
}

// Llamar también cuando se inicialice la app
function initializeApp() {
    setupEventListeners();
    loadLeagueData(currentLeague).then(() => {
        // Asegurar que el logo se muestre al inicializar
        setTimeout(() => {
            updateTeamSelectorLogo();
        }, 200);
    });
}

// Observador para detectar cambios en el DOM (opcional, por si el contenido se carga dinámicamente)
function setupDOMObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                // Si se detectan cambios en el área de selectores, actualizar logo
                const hasTeamSelectors = document.getElementById('homeTeam') && document.getElementById('awayTeam');
                if (hasTeamSelectors && !document.querySelector('.football-team-selector-logo')) {
                    setTimeout(() => {
                        updateTeamSelectorLogo();
                    }, 100);
                }
            }
        });
    });
    
    // Observar cambios en el body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Llamar al observador si es necesario
document.addEventListener('DOMContentLoaded', () => {
    setupDOMObserver();
});

// Función principal de inicialización
function initializeApp() {
    setupEventListeners();
    loadLeagueData(currentLeague);
}

// Configurar event listeners
function setupEventListeners() {
    // League selection
    leagueCards.forEach(card => {
        card.addEventListener('click', () => {
            const league = card.getAttribute('data-league');
            selectLeague(league);
        });
    });

    // Team selection
    homeTeamSelect.addEventListener('change', checkTeamSelection);
    awayTeamSelect.addEventListener('change', checkTeamSelection);

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeMatch);

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Seleccionar liga
function selectLeague(league) {
    // Actualizar UI
    leagueCards.forEach(card => {
        card.classList.remove('active');
        if (card.getAttribute('data-league') === league) {
            card.classList.add('active');
        }
    });

    currentLeague = league;
    loadLeagueData(league).then(() => {
        // Actualizar logo en selector después de cambiar liga
        updateTeamSelectorLogo();
        
        // Desplazamiento suave hacia abajo después de cargar los datos de la liga
        setTimeout(() => {
            window.scrollBy({
                top: 300,
                behavior: 'smooth'
            });
        }, 300);
    });
}

// Cargar datos de la liga
async function loadLeagueData(league) {
    showLoading(true);

    const leagueFiles = {
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
            'dinamarca': 'static/dinamarca_data.json',
            'israel': 'static/israel_data.json',
            'saudi-arabia': 'static/saudi-arabia_data.json',
            'colombia': 'static/liga_betplay_data.json',
            'estonia': 'static/meistriliiga_data.json',
            'scotland': 'static/scotland Premiership_data.json',
            'japan': 'static/j1_league_data.json',
            'china': 'static/super_league_china_data.json',
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
            'croacia': 'static/croacia_data.json',
            'libertadores': 'static/libertadores_data.json',
            'sudamericana': 'static/sudamericana_data.json',
            'bolivia': 'static/Lfpb.json',
            'austria': 'static/austria_data.json',
            'rumania': 'static/rumania_data.json'
};

    const dataFile = leagueFiles[league];
    
    if (dataFile) {
        try {
            const response = await fetch(dataFile);
            if (response.ok) {
                const jsonData = await response.json();
                currentLeagueData = convertToOldStructure(jsonData);
                populateTeamSelects();
                updateLeagueStats();
            }
        } catch (error) {
            console.log('Error cargando datos:', error);
        }
    }

    showLoading(false);
}

// Función para convertir la nueva estructura JSON a la estructura antigua
function convertToOldStructure(jsonData) {
    const convertedData = {};

    if (jsonData.teams && Array.isArray(jsonData.teams)) {
        jsonData.teams.forEach(teamData => {
            if (!teamData.team) return;

            const teamName = teamData.team;

            convertedData[teamName] = {
                corners: {
                    local: {
                        partidos: parseInt(teamData.matches_played) || 0,
                        corners_favor: parseFloat(teamData.corners?.average) || 0,
                        corners_contra: parseFloat(teamData.corners?.average) || 0,
                        corners_8_5: parsePercentage(teamData.corners?.["8.5"]),
                        corners_9_5: parsePercentage(teamData.corners?.["9.5"]),
                        corners_10_5: parsePercentage(teamData.corners?.["10.5"])
                    },
                    visitante: {
                        partidos: parseInt(teamData.matches_played) || 0,
                        corners_favor: parseFloat(teamData.corners?.average) || 0,
                        corners_contra: parseFloat(teamData.corners?.average) || 0,
                        corners_8_5: parsePercentage(teamData.corners?.["8.5"]),
                        corners_9_5: parsePercentage(teamData.corners?.["9.5"]),
                        corners_10_5: parsePercentage(teamData.corners?.["10.5"])
                    }
                },
                goals: {
                    over_1_5: teamData.goals?.["1.5"] || "0%",
                    over_2_5: teamData.goals?.["2.5"] || "0%",
                    over_3_5: teamData.goals?.["3.5"] || "0%",
                    bts: teamData.btts?.Yes || "0%"
                },
                cards: {
                    over_3_5: teamData.cards?.over_3_5 || "0%",
                    over_4_5: teamData.cards?.over_4_5 || "0%",
                    over_5_5: teamData.cards?.over_5_5 || "0%"
                },
                position: {
                    posicion: parseInt(teamData.position) || 0,
                    partidos: parseInt(teamData.matches_played) || 0,
                    ganados: parseInt(teamData.wins) || 0,
                    empatados: parseInt(teamData.draws) || 0,
                    perdidos: parseInt(teamData.losses) || 0,
                    goles_favor: parseInt(teamData.goals_for) || 0,
                    goles_contra: parseInt(teamData.goals_against) || 0,
                    diferencia: parseInt(teamData.goal_difference) || 0,
                    puntos: parseInt(teamData.points) || 0
                }
            };
        });
    } else {
        return jsonData;
    }

    return convertedData;
}

// Función helper para parsear porcentajes
function parsePercentage(value) {
    if (!value) return 0;
    if (typeof value === 'string') {
        return parseFloat(value.replace('%', '')) || 0;
    }
    return parseFloat(value) || 0;
}

// Poblar selects de equipos
function populateTeamSelects() {
    if (!homeTeamSelect || !awayTeamSelect) return;

    homeTeamSelect.innerHTML = '<option value="">Seleccionar equipo...</option>';
    awayTeamSelect.innerHTML = '<option value="">Seleccionar equipo...</option>';

    if (!currentLeagueData) return;

    const teams = Object.keys(currentLeagueData).filter(key => key !== '_metadata');
    teams.sort();

    teams.forEach(team => {
        const homeOption = document.createElement('option');
        homeOption.value = team;
        homeOption.textContent = team;
        homeTeamSelect.appendChild(homeOption);

        const awayOption = document.createElement('option');
        awayOption.value = team;
        awayOption.textContent = team;
        awayTeamSelect.appendChild(awayOption);
    });
}

// Verificar selección de equipos
function checkTeamSelection() {
    if (!homeTeamSelect || !awayTeamSelect || !analyzeBtn) return;

    const homeTeam = homeTeamSelect.value;
    const awayTeam = awayTeamSelect.value;

    analyzeBtn.disabled = !homeTeam || !awayTeam || homeTeam === awayTeam;
}

// Función de análisis de partido
function analyzeMatch() {
    const homeTeam = homeTeamSelect.value;
    const awayTeam = awayTeamSelect.value;

    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;

    const homeData = currentLeagueData[homeTeam];
    const awayData = currentLeagueData[awayTeam];

    if (!homeData || !awayData) return;

    const predictions = generatePredictions(homeData, awayData);
    displayResults(homeTeam, awayTeam, predictions);

    if (resultsPanel) {
        resultsPanel.style.display = 'block';
    }

    setTimeout(() => {
        const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
        const resultsPanelPosition = resultsPanel.getBoundingClientRect().top + window.scrollY - headerHeight - 70;
        window.scrollTo({
            top: resultsPanelPosition,
            behavior: 'smooth'
        });
    }, 300);
}

// Función para mostrar loading
function showLoading(show) {
  if (show) {
    mostrarCargando();
  } else {
    ocultarCargando();
  }
}

