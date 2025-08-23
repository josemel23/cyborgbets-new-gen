// Función para scroll suave mejorada con depuración
function scrollToSection(sectionId) {
    console.log(`🎯 Intentando hacer scroll a: ${sectionId}`);
    
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`❌ No se encontró la sección: ${sectionId}`);
        return;
    }

    // Obtener el header y calcular su altura
    const header = document.querySelector('.header') || document.querySelector('header') || document.querySelector('nav');
    let headerHeight = 0;
    
    if (header) {
        // Obtener la altura real del header incluyendo márgenes
        const headerStyles = window.getComputedStyle(header);
        headerHeight = header.offsetHeight + 
                     parseFloat(headerStyles.marginTop) + 
                     parseFloat(headerStyles.marginBottom);
        console.log(`📏 Altura del header: ${headerHeight}px`);
    }

    // Calcular posición de la sección
    const sectionTop = section.offsetTop;
    const scrollPosition = sectionTop - headerHeight - 20; // 20px adicionales de padding
    
    console.log(`📍 Posición de la sección: ${sectionTop}px`);
    console.log(`📍 Posición de scroll calculada: ${scrollPosition}px`);
    console.log(`📍 Posición actual del scroll: ${window.pageYOffset}px`);

    // Realizar el scroll
    window.scrollTo({
        top: Math.max(0, scrollPosition), // Asegurar que no sea negativo
        behavior: 'smooth'
    });

    // Verificar después del scroll (con delay para el smooth scroll)
    setTimeout(() => {
        console.log(`✅ Scroll completado. Nueva posición: ${window.pageYOffset}px`);
    }, 500);
}

// Función alternativa con mejor detección de elementos
function scrollToSectionImproved(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.error(`Sección no encontrada: ${sectionId}`);
        return;
    }

    // Obtener todos los posibles headers/navbars
    const possibleHeaders = [
        '.header',
        'header',
        'nav',
        '.navbar',
        '.nav-bar',
        '.top-nav',
        '.main-nav'
    ];

    let totalHeaderHeight = 0;
    
    possibleHeaders.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            const rect = element.getBoundingClientRect();
            const styles = window.getComputedStyle(element);
            
            // Solo considerar elementos que estén en la parte superior
            if (rect.top <= 10) {
                totalHeaderHeight = Math.max(totalHeaderHeight, element.offsetHeight);
            }
        }
    });

    // Usar getBoundingClientRect para mayor precisión
    const rect = section.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetPosition = rect.top + scrollTop - totalHeaderHeight - 30;

    console.log(`Scrolling to ${sectionId}:`, {
        sectionTop: rect.top,
        currentScroll: scrollTop,
        headerHeight: totalHeaderHeight,
        targetPosition: targetPosition
    });

    window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
    });
}

// Función para depurar elementos en la página
function debugScrollElements() {
    console.log('=== DEBUG: Elementos de la página ===');
    
    // Buscar todos los elementos con ID
    const elementsWithId = document.querySelectorAll('[id]');
    console.log('📋 Elementos con ID encontrados:');
    elementsWithId.forEach(el => {
        console.log(`- ${el.id}: ${el.tagName} (top: ${el.offsetTop}px)`);
    });

    // Buscar headers/navbars
    const headers = document.querySelectorAll('header, nav, .header, .navbar, .nav-bar');
    console.log('📋 Headers/Navbars encontrados:');
    headers.forEach(el => {
        const rect = el.getBoundingClientRect();
        console.log(`- ${el.tagName}.${el.className}: height=${el.offsetHeight}px, top=${rect.top}px`);
    });

    // Información del viewport
    console.log('📱 Información del viewport:');
    console.log(`- Altura de ventana: ${window.innerHeight}px`);
    console.log(`- Posición actual de scroll: ${window.pageYOffset}px`);
    console.log(`- Altura total del documento: ${document.documentElement.scrollHeight}px`);
}

// Función para scroll con animación personalizada
function smoothScrollTo(targetPosition, duration = 500) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // Función de easing (ease-in-out)
        const easeInOutQuad = progress < 0.5 
            ? 2 * progress * progress 
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, startPosition + distance * easeInOutQuad);

        if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

// Función para scroll con offset dinámico
function scrollToSectionWithDynamicOffset(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Calcular offset dinámico basado en elementos fijos
    let dynamicOffset = 0;
    
    // Buscar elementos con position: fixed o sticky
    const fixedElements = [];
    document.querySelectorAll('*').forEach(el => {
        const styles = window.getComputedStyle(el);
        if (styles.position === 'fixed' || styles.position === 'sticky') {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 10) { // Elemento en la parte superior
                fixedElements.push({
                    element: el,
                    height: rect.height,
                    top: rect.top
                });
            }
        }
    });

    // Calcular el offset total
    if (fixedElements.length > 0) {
        dynamicOffset = Math.max(...fixedElements.map(el => el.height));
    }

    const targetPosition = section.offsetTop - dynamicOffset - 20;
    
    console.log(`Scroll dinámico a ${sectionId}:`, {
        sectionTop: section.offsetTop,
        dynamicOffset: dynamicOffset,
        targetPosition: targetPosition,
        fixedElements: fixedElements.length
    });

    smoothScrollTo(Math.max(0, targetPosition));
}

// Función para usar en lugar de la original
function scrollToSection(sectionId) {
    // Usar la función mejorada
    scrollToSectionWithDynamicOffset(sectionId);
}

// Función para inicializar listeners de scroll debugging
function initScrollDebugging() {
    // Listener para detectar cuando se complete el scroll
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            console.log(`📍 Scroll finalizado en: ${window.pageYOffset}px`);
        }, 100);
    });

    // Comando para depurar desde la consola
    window.debugScroll = debugScrollElements;
    console.log('🔧 Debugging habilitado. Usa debugScroll() en la consola para información detallada.');
}

// Inicializar debugging cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollDebugging);
} else {
    initScrollDebugging();
}

// Función para convertir porcentajes de string a número
function parsePercentage(value) {
    if (value === null || value === undefined || value === '') return 0;
    
    if (typeof value === 'string') {
        // Limpiar espacios y símbolos
        const cleaned = value.replace(/[%\s]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    } 
    
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : value;
    }
    
    return 0;
}

// Generar predicciones basadas en los datos
function generatePredictions(homeData, awayData) {
    const predictions = {};

    // Predicciones de goles
    const homeOver15 = parsePercentage(homeData.goals?.over_1_5);
    const awayOver15 = parsePercentage(awayData.goals?.over_1_5);
    const homeOver25 = parsePercentage(homeData.goals?.over_2_5);
    const awayOver25 = parsePercentage(awayData.goals?.over_2_5);
    const homeBts = parsePercentage(homeData.goals?.bts);
    const awayBts = parsePercentage(awayData.goals?.bts);

    predictions.over15 = Math.round((homeOver15 + awayOver15) / 2);
    predictions.over25 = Math.round((homeOver25 + awayOver25) / 2);
    predictions.bts = Math.round((homeBts + awayBts) / 2);

    // Predicciones de tarjetas (agregando 5.5)
    const homeCards35 = parsePercentage(homeData.cards?.over_3_5);
    const awayCards35 = parsePercentage(awayData.cards?.over_3_5);
    const homeCards45 = parsePercentage(homeData.cards?.over_4_5);
    const awayCards45 = parsePercentage(awayData.cards?.over_4_5);
    const homeCards55 = parsePercentage(homeData.cards?.over_5_5);
    const awayCards55 = parsePercentage(awayData.cards?.over_5_5);

    predictions.cards35 = Math.round((homeCards35 + awayCards35) / 2);
    predictions.cards45 = Math.round((homeCards45 + awayCards45) / 2);
    predictions.cards55 = Math.round((homeCards55 + awayCards55) / 2);

    // Predicciones de córners
    const homeCorners = homeData.corners?.local?.corners_favor || 5;
    const awayCorners = awayData.corners?.visitante?.corners_favor || 4;

    predictions.homeCorners = Math.round(homeCorners * 10) / 10;
    predictions.awayCorners = Math.round(awayCorners * 10) / 10;
    predictions.totalCorners = Math.round((homeCorners + awayCorners) * 10) / 10;

    // Predicciones específicas de córners
    predictions.corners85 = calculateCornerPrediction(homeData, awayData, 8.5);
    predictions.corners95 = calculateCornerPrediction(homeData, awayData, 9.5);
    predictions.corners105 = calculateCornerPrediction(homeData, awayData, 10.5);

    // Datos de posición
    predictions.homePosition = homeData.position?.posicion || '-';
    predictions.awayPosition = awayData.position?.posicion || '-';
    predictions.homePoints = homeData.position?.puntos || '-';
    predictions.awayPoints = awayData.position?.puntos || '-';
    predictions.homeGoalsFor = homeData.position?.goles_favor || '-';
    predictions.awayGoalsFor = awayData.position?.goles_favor || '-';

    // Recomendación final
    predictions.recommendation = generateRecommendation(homeData, awayData, predictions);
    predictions.confidence = calculateConfidence(homeData, awayData);

    return predictions;
}

function calculateCornerPrediction(homeData, awayData, threshold) {
    let homeCornerPercentage, awayCornerPercentage;

    // Obtener los porcentajes de córners específicos para el threshold dado
    switch (threshold) {
        case 8.5:
            homeCornerPercentage = homeData.corners?.local?.corners_8_5 || 0;
            awayCornerPercentage = awayData.corners?.visitante?.corners_8_5 || 0;
            break;
        case 9.5:
            homeCornerPercentage = homeData.corners?.local?.corners_9_5 || 0;
            awayCornerPercentage = awayData.corners?.visitante?.corners_9_5 || 0;
            break;
        case 10.5:
            homeCornerPercentage = homeData.corners?.local?.corners_10_5 || 0;
            awayCornerPercentage = awayData.corners?.visitante?.corners_10_5 || 0;
            break;
        default:
            homeCornerPercentage = 0;
            awayCornerPercentage = 0;
    }

    // Calcular el promedio de los porcentajes de los dos equipos
    const averagePercentage = (homeCornerPercentage + awayCornerPercentage) / 2;

    return Math.round(averagePercentage);
}

function generateRecommendation(homeData, awayData, predictions) {
    const homeTeamName = Object.keys(currentLeagueData).find(team => currentLeagueData[team] === homeData);
    const awayTeamName = Object.keys(currentLeagueData).find(team => currentLeagueData[team] === awayData);

    // Verificar si es Copa Libertadores o Sudamericana
    const isCopaLibertadores = homeData.tournament === 'Copa Libertadores' || awayData.tournament === 'Copa Libertadores';
    const isCopaSudamericana = homeData.tournament === 'Copa Sudamericana' || awayData.tournament === 'Copa Sudamericana';

    let recommendation = '';
    const strongBets = []; // Para almacenar apuestas fuertes

    // === ANÁLISIS DE FAVORITO ===
    if (!isCopaLibertadores && !isCopaSudamericana) {
        const homePos = homeData.position?.posicion || 10;
        const awayPos = awayData.position?.posicion || 10;
        const homePoints = homeData.position?.puntos || 30;
        const awayPoints = awayData.position?.puntos || 30;

        if (homePos < awayPos && homePoints > awayPoints) {
            recommendation = `🏠 ${homeTeamName} es favorito (${homePos}° vs ${awayPos}° lugar, ${homePoints} vs ${awayPoints} pts). `;
        } else if (awayPos < homePos && awayPoints > homePoints) {
            recommendation = `✈️ ${awayTeamName} es favorito (${awayPos}° vs ${homePos}° lugar, ${awayPoints} vs ${homePoints} pts). `;
        } else {
            recommendation = `⚖️ Partido equilibrado entre ${homeTeamName} y ${awayTeamName}. `;
        }
    } else {
        recommendation = `🏆 Partido de Copa entre ${homeTeamName} y ${awayTeamName} - mayor incertidumbre. `;
    }

    // === ANÁLISIS DE GOLES (MEJORADO) ===
    if (predictions.over25 > 70) {
        recommendation += `🥅 FUERTE: +2.5 goles (${predictions.over25}%). `;
        strongBets.push(`Over 2.5 goles (${predictions.over25}%)`);
    } else if (predictions.over25 > 60) {
        recommendation += `🥅 +2.5 goles probable (${predictions.over25}%). `;
    } else if (predictions.over25 < 40) {
        recommendation += `🥅 Partido con pocos goles esperados (Under 2.5: ${100 - predictions.over25}%). `;
        if ((100 - predictions.over25) > 65) {
            strongBets.push(`Under 2.5 goles (${100 - predictions.over25}%)`);
        }
    }

    // === ANÁLISIS DETALLADO DE TARJETAS ===
    let cardRecommendation = '';
    if (predictions.cards55 > 65) {
        cardRecommendation = `🔴 MUY FUERTE: +5.5 tarjetas (${predictions.cards55}%) - Partido muy caliente. `;
        strongBets.push(`Over 5.5 tarjetas (${predictions.cards55}%)`);
    } else if (predictions.cards45 > 70) {
        cardRecommendation = `🟡 FUERTE: +4.5 tarjetas (${predictions.cards45}%). `;
        strongBets.push(`Over 4.5 tarjetas (${predictions.cards45}%)`);
    } else if (predictions.cards35 > 75) {
        cardRecommendation = `🟡 FUERTE: +3.5 tarjetas (${predictions.cards35}%). `;
        strongBets.push(`Over 3.5 tarjetas (${predictions.cards35}%)`);
    } else if (predictions.cards35 > 60) {
        cardRecommendation = `🟡 +3.5 tarjetas probable (${predictions.cards35}%). `;
    } else {
        cardRecommendation = `🟢 Partido disciplinado esperado. `;
    }
    recommendation += cardRecommendation;

    // === ANÁLISIS INTELIGENTE DE CÓRNERS ===
    const cornerAnalysis = analyzeCornersIntelligent(predictions);
    recommendation += cornerAnalysis.text;
    if (cornerAnalysis.strongBet) {
        strongBets.push(cornerAnalysis.strongBet);
    }

    // === AMBOS EQUIPOS MARCAN ===
    if (predictions.bts > 65) {
        recommendation += `⚽ Ambos marcan muy probable (${predictions.bts}%). `;
        if (predictions.bts > 70) {
            strongBets.push(`Ambos marcan (${predictions.bts}%)`);
        }
    } else if (predictions.bts < 35) {
        recommendation += `⚽ Posible que solo marque uno (No BTS: ${100 - predictions.bts}%). `;
    }

    // === RESUMEN DE APUESTAS FUERTES ===
    if (strongBets.length > 0) {
        recommendation += `\n\n🎯 APUESTAS DESTACADAS: ${strongBets.join(', ')}.`;
    }

    return recommendation;
}

// Función auxiliar para análisis inteligente de córners
function analyzeCornersIntelligent(predictions) {
    let text = '';
    let strongBet = null;

    if (predictions.corners105 && predictions.corners105 < 45) {
        text = `🚩 Under 10.5 córners recomendado (${100 - predictions.corners105}%). `;
        if ((100 - predictions.corners105) > 60) {
            strongBet = `Under 10.5 córners (${100 - predictions.corners105}%)`;
        }
    } else if (predictions.corners95 && predictions.corners95 < 45) {
        text = `🚩 Under 9.5 córners posible (${100 - predictions.corners95}%). `;
    } else if (predictions.corners85 > 60) {
        text = `🚩 Over 8.5 córners probable (${predictions.corners85}%). `;
        if (predictions.corners85 > 70) {
            strongBet = `Over 8.5 córners (${predictions.corners85}%)`;
        }
    } else {
        text = `🚩 Córners equilibrados (Total estimado: ${predictions.totalCorners}). `;
    }

    return { text, strongBet };
}



// Calcular nivel de confianza MEJORADO Y REALISTA
function calculateConfidence(homeData, awayData) {
    let confidence = 50; // Base más conservadora
    const factors = [];
    
    // Factor 1: Calidad de datos de posición (peso: 15% máximo)
    let positionScore = 0;
    if (homeData.position?.puntos && awayData.position?.puntos) {
        const avgPoints = (homeData.position.puntos + awayData.position.puntos) / 2;
        // Normalizar de forma más conservadora
        positionScore = Math.min(avgPoints / 80, 1) * 15; // Reducido de 25 a 15
        factors.push(`Posición: +${Math.round(positionScore)}`);
        confidence += positionScore;
    } else {
        // Penalizar falta de datos de posición
        confidence -= 5;
        factors.push('Sin datos posición: -5');
    }

    // Factor 2: Calidad de datos de goles (peso: 12% máximo)
    let goalsScore = 0;
    if (homeData.goals?.over_2_5 && awayData.goals?.over_2_5) {
        const homeGoals = parsePercentage(homeData.goals.over_2_5);
        const awayGoals = parsePercentage(awayData.goals.over_2_5);
        if (homeGoals > 0 && awayGoals > 0) {
            // Más conservador: dividir entre 15 en lugar de 10
            goalsScore = Math.min((homeGoals + awayGoals) / 15, 12);
            factors.push(`Goles: +${Math.round(goalsScore)}`);
            confidence += goalsScore;
        }
    } else {
        confidence -= 3;
        factors.push('Sin datos goles: -3');
    }

    // Factor 3: Calidad de datos de córners (peso: 8% máximo)
    let cornersScore = 0;
    if (homeData.corners?.local && awayData.corners?.visitante) {
        const homeCorners = homeData.corners.local.corners_favor || 0;
        const awayCorners = awayData.corners.visitante.corners_favor || 0;
        if (homeCorners > 0 && awayCorners > 0) {
            cornersScore = Math.min((homeCorners + awayCorners) / 3, 8); // Más conservador
            factors.push(`Córners: +${Math.round(cornersScore)}`);
            confidence += cornersScore;
        }
    } else {
        confidence -= 2;
        factors.push('Sin datos córners: -2');
    }

    // Factor 4: Calidad de datos de tarjetas (peso: 8% máximo)
    let cardsScore = 0;
    if (homeData.cards?.over_3_5 && awayData.cards?.over_3_5) {
        const homeCards = parsePercentage(homeData.cards.over_3_5);
        const awayCards = parsePercentage(awayData.cards.over_3_5);
        if (homeCards > 0 && awayCards > 0) {
            cardsScore = Math.min((homeCards + awayCards) / 15, 8); // Más conservador
            factors.push(`Tarjetas: +${Math.round(cardsScore)}`);
            confidence += cardsScore;
        }
    } else {
        confidence -= 2;
        factors.push('Sin datos tarjetas: -2');
    }

    // Factor 5: Diferencia de nivel (peso: 7% máximo)
    let levelScore = 0;
    if (homeData.position?.posicion && awayData.position?.posicion) {
        const posDiff = Math.abs(homeData.position.posicion - awayData.position.posicion);
        levelScore = Math.min(posDiff / 3, 7); // Más conservador
        factors.push(`Diferencia nivel: +${Math.round(levelScore)}`);
        confidence += levelScore;
    }

    // NUEVOS FACTORES DE PENALIZACIÓN REALISTAS
    
    // Factor 6: Penalización por falta de partidos jugados
    if (homeData.position?.partidos && awayData.position?.partidos) {
        const avgMatches = (homeData.position.partidos + awayData.position.partidos) / 2;
        if (avgMatches < 10) {
            const penalty = Math.max(5 - avgMatches / 2, 0);
            confidence -= penalty;
            factors.push(`Pocos partidos: -${Math.round(penalty)}`);
        }
    }

    // Factor 7: Inconsistencia en los datos (penalización)
    let inconsistencyPenalty = 0;
    
    // Verificar si los porcentajes son muy extremos o inconsistentes
    const extremeValues = [];
    
    if (homeData.goals?.over_2_5) {
        const val = parsePercentage(homeData.goals.over_2_5);
        if (val > 80 || val < 10) extremeValues.push('goles');
    }
    
    if (homeData.cards?.over_3_5) {
        const val = parsePercentage(homeData.cards.over_3_5);
        if (val > 85 || val < 5) extremeValues.push('tarjetas');
    }

    if (extremeValues.length > 0) {
        inconsistencyPenalty = extremeValues.length * 3;
        confidence -= inconsistencyPenalty;
        factors.push(`Valores extremos: -${inconsistencyPenalty}`);
    }

    // Factor 8: Randomización controlada (±5%)
    const randomFactor = (Math.random() - 0.5) * 10; // Entre -5 y +5
    confidence += randomFactor;
    factors.push(`Factor aleatorio: ${randomFactor > 0 ? '+' : ''}${Math.round(randomFactor)}`);

    // Detectar tipo de competición
    const isCopaLibertadores = homeData.tournament === 'Copa Libertadores' || awayData.tournament === 'Copa Libertadores';
    const isCopaSudamericana = homeData.tournament === 'Copa Sudamericana' || awayData.tournament === 'Copa Sudamericana';
    
    // Ajuste por tipo de competición (más severo)
    if (isCopaLibertadores) {
        confidence -= 8; // Copas Libertadores son muy impredecibles
        factors.push('Copa Libertadores: -8');
    } else if (isCopaSudamericana) {
        confidence -= 6;
        factors.push('Copa Sudamericana: -6');
    }

    // RANGOS MÁS REALISTAS: 45% - 82%
    confidence = Math.max(45, Math.min(confidence, 82));
    
    // Redondear a enteros para evitar decimales extraños
    confidence = Math.round(confidence);

    // Log detallado para debugging
    const homeTeamName = Object.keys(currentLeagueData).find(team => currentLeagueData[team] === homeData) || 'Equipo Local';
    console.log(`🎯 Confianza calculada para ${homeTeamName}:`, {
        base: 50,
        factors: factors,
        final: confidence,
        rango: 'Normal: 55-70% | Alto: 71-82% | Bajo: 45-54%'
    });

    return confidence;
}

// Función auxiliar para interpretar el nivel de confianza
function getConfidenceLevel(confidence) {
    if (confidence >= 75) return { level: 'MUY ALTA', color: '#4CAF50', description: 'Predicciones muy confiables' };
    if (confidence >= 65) return { level: 'ALTA', color: '#8BC34A', description: 'Predicciones confiables' };
    if (confidence >= 55) return { level: 'MEDIA', color: '#FF9800', description: 'Predicciones moderadas' };
    return { level: 'BAJA', color: '#F44336', description: 'Predicciones con incertidumbre' };
}

// Función para mostrar la confianza con más detalle
function displayConfidenceWithDetails(predictions) {
    const confidenceLevelEl = document.getElementById('confidenceLevel');
    const confidenceDetails = getConfidenceLevel(predictions.confidence);
    
    if (confidenceLevelEl) {
        const confidencePercentageEl = confidenceLevelEl.querySelector('.confidence-percentage');
        const confidenceFillEl = confidenceLevelEl.querySelector('.confidence-fill');
        const confidenceLevelTextEl = confidenceLevelEl.querySelector('.confidence-level-text') || 
                                     document.createElement('div');
        
        if (confidencePercentageEl) {
            confidencePercentageEl.textContent = `${predictions.confidence}%`;
            confidencePercentageEl.style.fontWeight = 'bold';
        }
        
        if (confidenceFillEl) {
            confidenceFillEl.style.width = `${predictions.confidence}%`;
            confidenceFillEl.style.backgroundColor = confidenceDetails.color;
            confidenceFillEl.style.transition = 'all 0.3s ease';
        }
        
        // Agregar texto descriptivo si no existe
        if (!confidenceLevelEl.querySelector('.confidence-level-text')) {
            confidenceLevelTextEl.className = 'confidence-level-text';
            confidenceLevelTextEl.style.cssText = `
                font-size: 12px;
                color: #666;
                margin-top: 5px;
                text-align: center;
            `;
            confidenceLevelEl.appendChild(confidenceLevelTextEl);
        }
        
        confidenceLevelTextEl.textContent = `${confidenceDetails.level} - ${confidenceDetails.description}`;
    }
}

// TESTING: Función para probar diferentes niveles de confianza
function testConfidenceLevels() {
    console.log('🧪 PROBANDO NIVELES DE CONFIANZA:');
    
    // Crear datos de prueba con diferentes calidades
    const testCases = [
        {
            name: 'Datos completos y consistentes',
            home: {
                position: { posicion: 3, puntos: 45, partidos: 20 },
                goals: { over_2_5: '60%' },
                cards: { over_3_5: '45%' },
                corners: { local: { corners_favor: 6 } }
            },
            away: {
                position: { posicion: 8, puntos: 35, partidos: 20 },
                goals: { over_2_5: '55%' },
                cards: { over_3_5: '50%' },
                corners: { visitante: { corners_favor: 5 } }
            }
        },
        {
            name: 'Datos limitados',
            home: {
                position: { posicion: 5, puntos: 40 },
                goals: { over_2_5: '50%' }
            },
            away: {
                position: { posicion: 7, puntos: 38 },
                goals: { over_2_5: '48%' }
            }
        },
        {
            name: 'Datos muy limitados',
            home: { position: { posicion: 10 } },
            away: { position: { posicion: 12 } }
        }
    ];
    
    testCases.forEach(testCase => {
        const confidence = calculateConfidence(testCase.home, testCase.away);
        const level = getConfidenceLevel(confidence);
        console.log(`${testCase.name}: ${confidence}% (${level.level})`);
    });
}

// Ejecutar test al cargar
// testConfidenceLevels();

// Mostrar resultados
function displayResults(homeTeam, awayTeam, predictions) {
    // Nombres de equipos
    const homeTeamNameEl = document.getElementById('homeTeamName');
    const awayTeamNameEl = document.getElementById('awayTeamName');
    if (homeTeamNameEl) homeTeamNameEl.textContent = homeTeam;
    if (awayTeamNameEl) awayTeamNameEl.textContent = awayTeam;

    // Predicciones de goles
    const over15El = document.getElementById('over15Prediction');
    const over25El = document.getElementById('over25Prediction');
    const btsEl = document.getElementById('btsPrediction');
    if (over15El) over15El.textContent = !isNaN(predictions.over15) ? `${predictions.over15}%` : 'N/A';
    if (over25El) over25El.textContent = !isNaN(predictions.over25) ? `${predictions.over25}%` : 'N/A';
    if (btsEl) btsEl.textContent = !isNaN(predictions.bts) ? `${predictions.bts}%` : 'N/A';

    // Predicciones de tarjetas (agregando 5.5)
    const cards35El = document.getElementById('cards35Prediction');
    const cards45El = document.getElementById('cards45Prediction');
    const cards55El = document.getElementById('cards55Prediction');
    if (cards35El) cards35El.textContent = !isNaN(predictions.cards35) ? `${predictions.cards35}%` : 'N/A';
    if (cards45El) cards45El.textContent = !isNaN(predictions.cards45) ? `${predictions.cards45}%` : 'N/A';
    if (cards55El) cards55El.textContent = !isNaN(predictions.cards55) ? `${predictions.cards55}%` : 'N/A';

    // Predicciones de córners
    const homeCornersEl = document.getElementById('homeCornersPrediction');
    const awayCornersEl = document.getElementById('awayCornersPrediction');
    const totalCornersEl = document.getElementById('totalCornersPrediction');
    const corners85El = document.getElementById('corners85Prediction');
    const corners95El = document.getElementById('corners95Prediction');
    const corners105El = document.getElementById('corners105Prediction');

    if (homeCornersEl) homeCornersEl.textContent = predictions.homeCorners;
    if (awayCornersEl) awayCornersEl.textContent = predictions.awayCorners;
    if (totalCornersEl) totalCornersEl.textContent = predictions.totalCorners;
    if (corners85El) corners85El.textContent = !isNaN(predictions.corners85) ? `${predictions.corners85}%` : 'N/A';
    if (corners95El) corners95El.textContent = !isNaN(predictions.corners95) ? `${predictions.corners95}%` : 'N/A';
    if (corners105El) corners105El.textContent = !isNaN(predictions.corners105) ? `${predictions.corners105}%` : 'N/A';

    // Análisis de forma
    const homeData = currentLeagueData[homeTeam];
    const awayData = currentLeagueData[awayTeam];

    // Actualizar títulos de formularios
    const homeFormTitleEl = document.getElementById('homeTeamFormTitle');
    const awayFormTitleEl = document.getElementById('awayTeamFormTitle');
    if (homeFormTitleEl) homeFormTitleEl.textContent = homeTeam;
    if (awayFormTitleEl) awayFormTitleEl.textContent = awayTeam;

    // Mostrar datos reales de posición
    const homePositionEl = document.getElementById('homePosition');
    const homePointsEl = document.getElementById('homePoints');
    const homeGoalsForEl = document.getElementById('homeGoalsFor');
    const awayPositionEl = document.getElementById('awayPosition');
    const awayPointsEl = document.getElementById('awayPoints');
    const awayGoalsForEl = document.getElementById('awayGoalsFor');

    if (homePositionEl) homePositionEl.textContent = homeData.position?.posicion || '-';
    if (homePointsEl) homePointsEl.textContent = homeData.position?.puntos || '-';
    if (homeGoalsForEl) homeGoalsForEl.textContent = homeData.position?.goles_favor || '-';
    if (awayPositionEl) awayPositionEl.textContent = awayData.position?.posicion || '-';
    if (awayPointsEl) awayPointsEl.textContent = awayData.position?.puntos || '-';
    if (awayGoalsForEl) awayGoalsForEl.textContent = awayData.position?.goles_favor || '-';

    // Recomendación y confianza
    const recommendationEl = document.getElementById('finalRecommendation');
    const confidenceLevelEl = document.getElementById('confidenceLevel');
    const confidencePercentageEl = confidenceLevelEl?.querySelector('.confidence-percentage');
    const confidenceFillEl = confidenceLevelEl?.querySelector('.confidence-fill');

    if (recommendationEl) recommendationEl.textContent = predictions.recommendation;
    if (confidencePercentageEl) confidencePercentageEl.textContent = `${predictions.confidence}%`;

    // Actualizar barra de confianza
    if (confidenceFillEl) {
        confidenceFillEl.style.width = `${predictions.confidence}%`;
    }

    // Mostrar recomendaciones específicas de tarjetas
    displayCardRecommendations(predictions);

    // Mostrar panel de resultados
    if (resultsPanel) {
        resultsPanel.style.display = 'block';
    }
}


// Función para mostrar recomendaciones de tarjetas (actualizada para incluir 5.5)
function displayCardRecommendations(predictions) {
    // Crear o actualizar sección de recomendaciones de tarjetas
    let cardRecommendationsEl = document.getElementById('cardRecommendations');
    
    if (!cardRecommendationsEl) {
        cardRecommendationsEl = document.createElement('div');
        cardRecommendationsEl.id = 'cardRecommendations';
        cardRecommendationsEl.className = 'card-recommendations';
        
        // Buscar dónde insertarlo (después de las predicciones de goles)
        const goalsSection = document.querySelector('.goals-predictions') || document.querySelector('.prediction-card');
        if (goalsSection) {
            goalsSection.insertAdjacentElement('afterend', cardRecommendationsEl);
        }
    }

    // Generar recomendaciones (actualizada para incluir 5.5)
    let cardRecommendation = '';
    
    if (predictions.cards55 > 60) {
        cardRecommendation = `🔴 RECOMENDACIÓN MUY FUERTE: Más de 5.5 tarjetas (${predictions.cards55}% probabilidad) - Partido muy intenso`;
    } else if (predictions.cards45 > 70) {
        cardRecommendation = `🟡 RECOMENDACIÓN FUERTE: Más de 4.5 tarjetas (${predictions.cards45}% probabilidad)`;
    } else if (predictions.cards35 > 70) {
        cardRecommendation = `🟡 RECOMENDACIÓN FUERTE: Más de 3.5 tarjetas (${predictions.cards35}% probabilidad)`;
    } else if (predictions.cards35 > 50) {
        cardRecommendation = `🟡 RECOMENDACIÓN MODERADA: Más de 3.5 tarjetas (${predictions.cards35}% probabilidad)`;
    } else if (predictions.cards45 > 60) {
        cardRecommendation = `🟡 RECOMENDACIÓN: Más de 4.5 tarjetas (${predictions.cards45}% probabilidad)`;
    } else if (predictions.cards55 > 40) {
        cardRecommendation = `🟡 RECOMENDACIÓN: Más de 5.5 tarjetas (${predictions.cards55}% probabilidad)`;
    } else {
        cardRecommendation = `🟢 Partido con pocas tarjetas esperadas (3.5: ${predictions.cards35}%, 4.5: ${predictions.cards45}%, 5.5: ${predictions.cards55}%)`;
    }

    cardRecommendationsEl.innerHTML = `
        <div class="prediction-card">
            <h3>📋 Recomendaciones de Tarjetas</h3>
            <div class="card-prediction-grid">
                <div class="prediction-item">
                    <div class="prediction-label">Más de 3.5 tarjetas</div>
                    <div class="prediction-value">${predictions.cards35}%</div>
                </div>
                <div class="prediction-item">
                    <div class="prediction-label">Más de 4.5 tarjetas</div>
                    <div class="prediction-value">${predictions.cards45}%</div>
                </div>
                <div class="prediction-item">
                    <div class="prediction-label">Más de 5.5 tarjetas</div>
                    <div class="prediction-value">${predictions.cards55}%</div>
                </div>
            </div>
            <div class="card-recommendation-text">
                ${cardRecommendation}
            </div>
        </div>
    `;
}

// Actualizar estadísticas de liga - VERSION OPTIMIZADA
function updateLeagueStats() {
    console.log('🔄 Iniciando updateLeagueStats...');
    console.log('📊 currentLeagueData:', currentLeagueData);
    
    // Manejar diferentes estructuras posibles de datos
    let teams = [];
    let dataStructure = 'unknown';
    
    if (!currentLeagueData) {
        console.error('❌ currentLeagueData no existe');
        dataStructure = 'missing';
    } else if (currentLeagueData.teams && Array.isArray(currentLeagueData.teams)) {
        // Estructura NUEVA: { teams: [{ team: "Barcelona", position: "1", ... }] }
        teams = currentLeagueData.teams;
        dataStructure = 'new_format';
        console.log('✅ Estructura NUEVA detectada - teams array:', teams.length, 'equipos');
    } else if (Array.isArray(currentLeagueData)) {
        // Estructura: directamente un array [{ team: "Barcelona", ... }]
        teams = currentLeagueData;
        dataStructure = 'direct_array';
        console.log('✅ Array directo detectado:', teams.length, 'equipos');
    } else if (typeof currentLeagueData === 'object') {
        // Estructura VIEJA: { "Barcelona": { position: { posicion: 1 } }, "Madrid": {...} }
        const teamKeys = Object.keys(currentLeagueData).filter(key => 
            key !== '_metadata' && typeof currentLeagueData[key] === 'object'
        );
        
        if (teamKeys.length > 0) {
            teams = teamKeys.map(teamName => ({
                team: teamName,
                // Mapear estructura VIEJA a NUEVA
                position: currentLeagueData[teamName]?.position?.posicion || null,
                matches_played: currentLeagueData[teamName]?.position?.partidos || 0,
                wins: currentLeagueData[teamName]?.position?.victorias || 0,
                draws: currentLeagueData[teamName]?.position?.empates || 0,
                losses: currentLeagueData[teamName]?.position?.derrotas || 0,
                goals_for: currentLeagueData[teamName]?.position?.goles_favor || 0,
                goals_against: currentLeagueData[teamName]?.position?.goles_contra || 0,
                goal_difference: currentLeagueData[teamName]?.position?.diferencia || 0,
                points: currentLeagueData[teamName]?.position?.puntos || 0,
                // Mapear otros datos necesarios
                corners: {
                    average: ((currentLeagueData[teamName]?.corners?.local?.corners_favor || 0) + 
                             (currentLeagueData[teamName]?.corners?.visitante?.corners_favor || 0)) / 2
                },
                goals: currentLeagueData[teamName]?.goals || {},
                cards: currentLeagueData[teamName]?.cards || {}
            }));
            dataStructure = 'old_format';
            console.log('✅ Estructura VIEJA detectada y convertida:', teams.length, 'equipos');
        }
    }
    
    console.log('📋 Estructura detectada:', dataStructure);
    
    if (teams.length === 0) {
        console.error('❌ No se encontraron equipos válidos');
        // Mostrar valores por defecto solo para las estadísticas que necesitamos
        const elements = [
            'leagueLeader', 'topScorer', 'bestDefense', 'mostCorners',
            'bestGoalDiff', 'avgGoalsLeague', 'mostOver25', 'alwaysConcedes',
            'mostCards35', 'mostCards45', 'mostCards55', 'leastDisciplined'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = 'No disponible';
        });
        return;
    }

    console.log('👥 Equipos procesados:', teams.length);
    console.log('🔍 Ejemplo del primer equipo:', teams[0]);

    // Función helper para convertir valores con % a números
    const parseValue = (value) => {
        if (typeof value === 'string') {
            return parseFloat(value.replace('%', ''));
        }
        return parseFloat(value) || 0;
    };

    // 1. Encontrar líder (menor posición)
    let leader = 'No disponible';
    let bestPosition = 999;

    teams.forEach(team => {
        const position = parseInt(team.position);
        if (position && position < bestPosition) {
            bestPosition = position;
            leader = team.team;
        }
    });

    // 2. Encontrar mejor ataque (más goles a favor)
    let topScorer = 'No disponible';
    let mostGoals = 0;

    teams.forEach(team => {
        const goals = parseInt(team.goals_for);
        if (goals && goals > mostGoals) {
            mostGoals = goals;
            topScorer = team.team;
        }
    });

    // 3. Encontrar mejor defensa (menos goles en contra)
    let bestDefense = 'No disponible';
    let fewestGoals = 999;

    teams.forEach(team => {
        const goals = parseInt(team.goals_against);
        if (goals !== undefined && goals < fewestGoals) {
            fewestGoals = goals;
            bestDefense = team.team;
        }
    });

    // 4. Encontrar equipo con más córners promedio
    let mostCorners = 'No disponible';
    let maxCorners = 0;

    teams.forEach(team => {
        if (team.corners && team.corners.average) {
            const avgCorners = parseValue(team.corners.average);
            if (avgCorners && avgCorners > maxCorners) {
                maxCorners = avgCorners;
                mostCorners = team.team;
            }
        }
    });

    // 5. Encontrar mayor diferencia de goles
    let bestGoalDiff = 'No disponible';
    let maxDifference = -999;

    teams.forEach(team => {
        const difference = parseInt(team.goal_difference);
        if (difference !== undefined && difference > maxDifference) {
            maxDifference = difference;
            bestGoalDiff = team.team;
        }
    });

    // 6. Calcular promedio de goles de la liga
    let totalGoals = 0;
    let totalMatches = 0;
    teams.forEach(team => {
        const matchesPlayed = parseInt(team.matches_played);
        const goalsFor = parseInt(team.goals_for);
        const goalsAgainst = parseInt(team.goals_against);
        if (matchesPlayed && goalsFor !== undefined && goalsAgainst !== undefined) {
            totalGoals += goalsFor + goalsAgainst;
            totalMatches += matchesPlayed;
        }
    });
    const avgGoalsLeague = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(2) : 'No disponible';

    // 7. Encontrar equipo con más Over 2.5
    let mostOver25 = 'No disponible';
    let maxOver25 = 0;

    teams.forEach(team => {
        // Probar diferentes posibles nombres de propiedades
        let over25Value = null;
        
        if (team.goals) {
            over25Value = parseValue(team.goals["2.5"]) || 
                         parseValue(team.goals["over_2_5"]) || 
                         parseValue(team.goals.over_25);
        }
        
        if (over25Value && over25Value > maxOver25) {
            maxOver25 = over25Value;
            mostOver25 = team.team;
        }
    });

    // 8. Siempre encaja (más goles en contra por partido)
    let alwaysConcedes = 'No disponible';
    let worstDefenseRatio = 0;

    teams.forEach(team => {
        const matches = parseInt(team.matches_played);
        const goalsAgainst = parseInt(team.goals_against);
        if (matches > 0 && goalsAgainst !== undefined) {
            const ratio = goalsAgainst / matches;
            if (ratio > worstDefenseRatio) {
                worstDefenseRatio = ratio;
                alwaysConcedes = team.team;
            }
        }
    });

    // 9. Encontrar más tarjetas 3.5+
    let mostCards35 = 'No disponible';
    let maxCards35 = 0;

    teams.forEach(team => {
        if (team.cards && team.cards.over_3_5) {
            const cards35 = parseValue(team.cards.over_3_5);
            if (cards35 && cards35 > maxCards35) {
                maxCards35 = cards35;
                mostCards35 = team.team;
            }
        }
    });

    // 10. Encontrar más tarjetas 4.5+
    let mostCards45 = 'No disponible';
    let maxCards45 = 0;

    teams.forEach(team => {
        if (team.cards && team.cards.over_4_5) {
            const cards45 = parseValue(team.cards.over_4_5);
            if (cards45 && cards45 > maxCards45) {
                maxCards45 = cards45;
                mostCards45 = team.team;
            }
        }
    });

    // 11. Encontrar más tarjetas 5.5+
    let mostCards55 = 'No disponible';
    let maxCards55 = 0;

    teams.forEach(team => {
        if (team.cards && team.cards.over_5_5) {
            const cards55 = parseValue(team.cards.over_5_5);
            if (cards55 && cards55 > maxCards55) {
                maxCards55 = cards55;
                mostCards55 = team.team;
            }
        }
    });

    // 12. Menos disciplinado (suma de todas las tarjetas)
    let leastDisciplined = 'No disponible';
    let maxTotalCards = 0;

    teams.forEach(team => {
        if (team.cards) {
            const cards35 = parseValue(team.cards.over_3_5) || 0;
            const cards45 = parseValue(team.cards.over_4_5) || 0;
            const cards55 = parseValue(team.cards.over_5_5) || 0;
            const totalCards = cards35 + cards45 + cards55;
            
            if (totalCards > maxTotalCards) {
                maxTotalCards = totalCards;
                leastDisciplined = team.team;
            }
        }
    });

    // Actualizar UI con solo las estadísticas necesarias
    const updates = {
        'leagueLeader': leader,
        'topScorer': topScorer !== 'No disponible' ? `${topScorer} (${mostGoals})` : 'No disponible',
        'bestDefense': bestDefense !== 'No disponible' ? `${bestDefense} (${fewestGoals})` : 'No disponible',
        'mostCorners': mostCorners !== 'No disponible' ? `${mostCorners} (${maxCorners})` : 'No disponible',
        'bestGoalDiff': bestGoalDiff !== 'No disponible' ? `${bestGoalDiff} (+${maxDifference})` : 'No disponible',
        'avgGoalsLeague': avgGoalsLeague,
        'mostOver25': mostOver25 !== 'No disponible' ? `${mostOver25} (${maxOver25}%)` : 'No disponible',
        'alwaysConcedes': alwaysConcedes !== 'No disponible' ? `${alwaysConcedes} (${worstDefenseRatio.toFixed(2)}/partido)` : 'No disponible',
        'mostCards35': mostCards35 !== 'No disponible' ? `${mostCards35} (${maxCards35}%)` : 'No disponible',
        'mostCards45': mostCards45 !== 'No disponible' ? `${mostCards45} (${maxCards45}%)` : 'No disponible',
        'mostCards55': mostCards55 !== 'No disponible' ? `${mostCards55} (${maxCards55}%)` : 'No disponible',
        'leastDisciplined': leastDisciplined !== 'No disponible' ? `${leastDisciplined}` : 'No disponible'
    };

    // Aplicar todas las actualizaciones
    Object.keys(updates).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = updates[id];
            console.log(`✅ Actualizado ${id}: ${updates[id]}`);
        } else {
            console.warn(`⚠️ Elemento no encontrado: ${id}`);
        }
    });

    console.log('✅ updateLeagueStats completado');
}

// Mostrar/ocultar loading
function showLoading(show) {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }
}

// Mostrar error
function showError(message) {
    // Crear notificación de error
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
        <button class="error-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

console.log('SoccerPredict app initialized successfully! ⚽');
document.getElementById('comenzarBtn').addEventListener('click', function() {
    // Crear la tarjeta con ID único
    const cardId = 'notif_' + Date.now();
    const card = document.createElement('div');
    card.id = cardId;
    card.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        min-width: 300px;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        font-family: inherit;
    `;
    
    card.innerHTML = `
        <div style="display: flex; align-items: center;">
            <i class="fas fa-code" style="font-size: 24px; margin-right: 15px; color: #ffd700;"></i>
            <div>
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">¡Importante!</div>
                <div style="font-size: 14px; opacity: 0.9;">Obtén tus códigos para empezar</div>
            </div>
        </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(card);
    
    // Mostrar con animación
    setTimeout(() => {
        card.style.transform = 'translateX(0)';
        card.style.opacity = '1';
    }, 10);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        card.style.transform = 'translateX(400px)';
        card.style.opacity = '0';
        
        // Eliminar del DOM
        setTimeout(() => {
            if (document.getElementById(cardId)) {
                document.body.removeChild(card);
            }
        }, 300);
    }, 4000);
});
function debugPredictions(homeTeam, awayTeam, predictions) {
    console.log(`
    🔍 ANÁLISIS DETALLADO: ${homeTeam} vs ${awayTeam}
    ================================================
    
    📊 PREDICCIONES:
    - Over 1.5: ${predictions.over15}%
    - Over 2.5: ${predictions.over25}%
    - BTS: ${predictions.bts}%
    - Tarjetas 3.5+: ${predictions.cards35}%
    - Tarjetas 4.5+: ${predictions.cards45}%
    - Tarjetas 5.5+: ${predictions.cards55}%
    - Córners totales: ${predictions.totalCorners}
    
    🎯 CONFIANZA: ${predictions.confidence}%
    
    📝 RECOMENDACIÓN:
    ${predictions.recommendation}
    
    ================================================
    `);
}

console.log('✅ Mejoras graduales listas para implementar!');