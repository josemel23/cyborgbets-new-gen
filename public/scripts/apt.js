class SmartLineManager {
    constructor() {
        this.contentContainer = document.getElementById('smartlineContent');
        
        // Datos incluidos directamente - CAMBIAR AQUÍ PARA ACTUALIZAR
        this.bettingData = {
            "lines": [
               {
                    "match": "KuPS (Fin) -RFS (Lat)",
                    "league": "Europa League",
                    "date": "14/08/2025 10:00 AM",
                    "betType": "Gol Asiatico",
                    "prediction": "Under de 3",
                    "odds": "1.52",
                    "confidence": 78
                },
                {
                    "match": "Cerro Porteño - Estudiantes de La Plata",
                    "league": "Copa Libertadores",
                    "date": "13/08/2025 5:30 PM",
                    "betType": "Tiros De Esquina",
                    "prediction": "Mas De 7.5",
                    "odds": "1.45",
                    "confidence": 70
                },
                
            ],
            "lastUpdated": "14/08/2025 6:45 AM",
            "version": "2.0"
        };
        
        this.init();
    }

    async init() {
        try {
            // Simular un pequeño delay para mostrar loading
            this.showLoading();
            await this.sleep(500);
            this.renderBettingLines(this.bettingData);
        } catch (error) {
            this.showError('Error al cargar las líneas de apuesta');
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showLoading() {
        this.contentContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">Cargando líneas de apuesta...</div>
            </div>
        `;
    }

    renderBettingLines(data) {
        try {
            if (!data || !data.lines || !Array.isArray(data.lines)) {
                this.showError('Los datos no tienen el formato correcto');
                return;
            }
            
            if (data.lines.length === 0) {
                this.showError('No hay líneas de apuesta disponibles');
                return;
            }

            const html = `
                <div class="smartline-header">
                    <h2>Líneas Smart</h2>
                    <div class="last-updated">
                        Última actualización: ${data.lastUpdated || 'No disponible'}
                    </div>
                </div>
                <div class="smartline-grid">
                    ${data.lines.map(line => this.createLineCard(line)).join('')}
                </div>
                <div class="smartline-footer">
                    <small>Versión: ${data.version || '1.0'} | Total de líneas: ${data.lines.length}</small>
                </div>
            `;

            this.contentContainer.innerHTML = html;
            console.log(`Renderizadas ${data.lines.length} líneas de apuesta exitosamente`);
            
        } catch (error) {
            console.error('Error al renderizar:', error);
            this.showError('Error al mostrar las líneas de apuesta');
        }
    }

    createLineCard(line) {
        const safeMatch = line.match || 'Partido no especificado';
        const safeLeague = line.league || 'Liga no especificada';
        const safeDate = this.formatDate(line.date);
        const safeBetType = line.betType || 'Tipo no especificado';
        const safePrediction = line.prediction || 'Predicción no disponible';
        const safeOdds = line.odds || 'N/A';
        const confidence = line.confidence ? parseInt(line.confidence) : null;

        return `
            <div class="line-card">
                <div class="line-header">
                    <i class="fas fa-chart-line line-icon"></i>
                    <h3 class="line-title">${safeMatch}</h3>
                </div>
                
                <div class="line-info">
                    <span class="line-label">Liga:</span>
                    <span class="line-value">${safeLeague}</span>
                </div>
                
                <div class="line-info">
                    <span class="line-label">Fecha:</span>
                    <span class="line-value">${safeDate}</span>
                </div>
                
                <div class="line-info">
                    <span class="line-label">Tipo:</span>
                    <span class="line-value">${safeBetType}</span>
                </div>
                
                <div class="line-info">
                    <span class="line-label">Predicción:</span>
                    <span class="line-value prediction-highlight">${safePrediction}</span>
                </div>
                
                <div class="line-odds">
                    <span class="odds-label">Cuota:</span>
                    <span class="odds-value">${safeOdds}</span>
                </div>
                
                ${confidence !== null && !isNaN(confidence) ? `
                    <div class="line-confidence">
                        <span class="confidence-label">Confianza:</span>
                        <span class="confidence-value confidence-${this.getConfidenceClass(confidence)}">${confidence}%</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${confidence}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getConfidenceClass(confidence) {
        if (confidence >= 90) return 'high';
        if (confidence >= 70) return 'medium';
        return 'low';
    }

    formatDate(dateString) {
        if (!dateString) return 'Fecha no disponible';
        
        try {
            // Si ya está en formato DD/MM/YYYY con hora, mantenerlo
            if (typeof dateString === 'string' && 
                dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}\s+(AM|PM)$/)) {
                return dateString;
            }
            
            // Si es formato ISO, convertir
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return dateString;
            }
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            
            return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
            
        } catch (error) {
            return String(dateString);
        }
    }

    showError(message) {
        this.contentContainer.innerHTML = `
            <div class="error-container">
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle error-icon"></i>
                    <h3>Error</h3>
                    <p class="error-text">${message}</p>
                    <div class="error-actions">
                        <button class="refresh-btn primary" onclick="window.smartLineManager.refresh()">
                            <i class="fas fa-sync-alt"></i>
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    refresh() {
        this.showLoading();
        setTimeout(() => {
            this.init();
        }, 500);
    }

    // Método para actualizar los datos fácilmente
    updateData(newData) {
        this.bettingData = newData;
        this.refresh();
    }

    // Método para añadir nueva línea
    addLine(newLine) {
        this.bettingData.lines.push(newLine);
        this.bettingData.lastUpdated = new Date().toLocaleString('es-ES');
        this.refresh();
    }

    // Método para limpiar todas las líneas
    clearLines() {
        this.bettingData.lines = [];
        this.bettingData.lastUpdated = new Date().toLocaleString('es-ES');
        this.refresh();
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    window.smartLineManager = new SmartLineManager();
});

// Auto-refresh cada 5 minutos (opcional - puedes comentar si no lo necesitas)
setInterval(() => {
    if (window.smartLineManager && document.visibilityState === 'visible') {
        // Solo actualiza la fecha, no recarga los datos
        window.smartLineManager.bettingData.lastUpdated = new Date().toLocaleString('es-ES');
        window.smartLineManager.refresh();
    }
}, 300000);
function toggleTip(element) {
  const card = element.parentElement;
  card.classList.toggle("open");
}

// Función principal para expandir/contraer estrategias
function expandTip(id) {
  const allCards = document.querySelectorAll('.tip-card');
  const clickedCard = document.querySelector(`[data-id="${id}"]`);
  
  // Si la tarjeta clickeada ya está activa, la cerramos
  if (clickedCard.classList.contains('active')) {
    clickedCard.classList.remove('active');
    return;
  }
  
  // Cerrar todas las tarjetas
  allCards.forEach(card => {
    card.classList.remove('active');
  });
  
  // Abrir la tarjeta clickeada
  clickedCard.classList.add('active');
  
  // Scroll suave hacia la tarjeta expandida
  setTimeout(() => {
    clickedCard.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 200);
}

// Calculadora: Escalera de Cuotas
function calcularEscalera() {
  const cuota1 = parseFloat(document.getElementById('cuota1-escalera').value);
  const cuota2 = parseFloat(document.getElementById('cuota2-escalera').value);
  const inversion = parseFloat(document.getElementById('inversion-escalera').value);
  const resultado = document.getElementById('resultadoEscalera');

  // Validar inputs
  if (isNaN(cuota1) || isNaN(cuota2) || isNaN(inversion)) {
    mostrarError(resultado, 'Completa todos los campos con valores válidos.');
    return;
  }

  if (cuota1 < 1.01 || cuota2 < 1.01) {
    mostrarError(resultado, 'Las cuotas deben ser mayores a 1.01');
    return;
  }

  if (inversion <= 0) {
    mostrarError(resultado, 'La inversión debe ser mayor a 0');
    return;
  }

  // Cálculos
  const cuotaFinal = (cuota1 * cuota2).toFixed(2);
  const gananciaTotal = (inversion * cuota1 * cuota2).toFixed(3);
  const gananciaNeta = (gananciaTotal - inversion).toFixed(3);
  const porcentajeGanancia = (((gananciaTotal - inversion) / inversion) * 100).toFixed(1);

  // Mostrar resultado exitoso
  resultado.innerHTML = `
    🎯 <strong>Cuota combinada:</strong> ${cuotaFinal}<br>
    💰 <strong>Ganancia total:</strong> ${gananciaTotal}<br>
    📈 <strong>Ganancia neta:</strong> ${gananciaNeta} (${porcentajeGanancia}%)
  `;
  resultado.style.borderLeftColor = '#00e676';
  resultado.style.background = 'rgba(0, 230, 118, 0.1)';
  resultado.style.color = '#00e676';
}

// Calculadora: Stake Fijo
function calcularStakeFijo() {
  const cuota = parseFloat(document.getElementById('cuota-stake').value);
  const stake = parseFloat(document.getElementById('stake-fijo').value);
  const resultado = document.getElementById('resultadoStakeFijo');

  // Validar inputs
  if (isNaN(cuota) || isNaN(stake)) {
    mostrarError(resultado, 'Completa todos los campos con valores válidos.');
    return;
  }

  if (cuota < 1.01) {
    mostrarError(resultado, 'La cuota debe ser mayor a 1.01');
    return;
  }

  if (stake <= 0) {
    mostrarError(resultado, 'El stake debe ser mayor a 0');
    return;
  }

  // Cálculos
  const gananciaTotal = (cuota * stake).toFixed(3);
  const gananciaNeta = (gananciaTotal - stake).toFixed(3);
  const porcentajeGanancia = (((gananciaTotal - stake) / stake) * 100).toFixed(1);

  // Cálculo de apuestas mensuales (ejemplo)
  const apuestasMes = 30;
  const gananciaNetaMensual = (gananciaNeta * apuestasMes * 0.6).toFixed(3); // Asumiendo 60% de acierto

  // Mostrar resultado exitoso
  resultado.innerHTML = `
    💰 <strong>Ganancia total:</strong> ${gananciaTotal}<br>
    📈 <strong>Ganancia neta:</strong> ${gananciaNeta} (${porcentajeGanancia}%)<br>
    📊 <strong>Proyección mensual:</strong> ${gananciaNetaMensual} (60% acierto, 30 apuestas)
  `;
  resultado.style.borderLeftColor = '#00e676';
  resultado.style.background = 'rgba(0, 230, 118, 0.1)';
  resultado.style.color = '#00e676';
}

// Calculadora: Sistema Fibonacci
function calcularFibonacci() {
  const base = parseFloat(document.getElementById('fibo-base').value);
  const perdidas = parseInt(document.getElementById('fibo-perdidas').value);
  const resultado = document.getElementById('resultadoFibonacci');

  // Validar inputs
  if (isNaN(base) || isNaN(perdidas)) {
    mostrarError(resultado, 'Completa todos los campos con valores válidos.');
    return;
  }

  if (base <= 0) {
    mostrarError(resultado, 'El valor base debe ser mayor a 0');
    return;
  }

  if (perdidas < 0 || perdidas > 10) {
    mostrarError(resultado, 'El número de pérdidas debe estar entre 0 y 10');
    return;
  }

  // Generar secuencia Fibonacci hasta la posición requerida
  const secuencia = [1, 1];
  for (let i = 2; i <= perdidas; i++) {
    secuencia[i] = secuencia[i - 1] + secuencia[i - 2];
  }

  // Calcular apuestas y totales
  const apuestas = [];
  let totalInvertido = 0;
  
  for (let i = 0; i <= perdidas; i++) {
    const apuesta = base * secuencia[i];
    apuestas.push(apuesta);
    totalInvertido += apuesta;
  }

  // Calcular lo que se recupera si gana la última apuesta (cuota 2.0)
  const ultimaApuesta = apuestas[apuestas.length - 1];
  const recuperacionMinima = ultimaApuesta * 2; // Asumiendo cuota 2.0
  const gananciaNeta = recuperacionMinima - totalInvertido;

  // Mostrar resultado exitoso
  resultado.innerHTML = `
    📊 <strong>Secuencia:</strong> ${secuencia.slice(0, perdidas + 1).join(' → ')}<br>
    💸 <strong>Total a invertir:</strong> ${totalInvertido.toFixed(3)}<br>
    🎯 <strong>Última apuesta:</strong> ${ultimaApuesta.toFixed(3)}<br>
    ✅ <strong>Recuperación (cuota 2.0):</strong> ${recuperacionMinima.toFixed(3)}<br>
    📈 <strong>Ganancia neta:</strong> ${gananciaNeta.toFixed(3)}
  `;
  resultado.style.borderLeftColor = '#00e676';
  resultado.style.background = 'rgba(0, 230, 118, 0.1)';
  resultado.style.color = '#00e676';
}

// Calculadora: Martingala Moderada
function calcularMartingala() {
  const base = parseFloat(document.getElementById('martingala-base').value);
  const perdidas = parseInt(document.getElementById('martingala-perdidas').value);
  const resultado = document.getElementById('resultadoMartingala');

  // Validar inputs
  if (isNaN(base) || isNaN(perdidas)) {
    mostrarError(resultado, 'Completa todos los campos con valores válidos.');
    return;
  }

  if (base <= 0) {
    mostrarError(resultado, 'La apuesta base debe ser mayor a 0');
    return;
  }

  if (perdidas < 0 || perdidas > 8) {
    mostrarError(resultado, 'El número de pérdidas debe estar entre 0 y 8');
    return;
  }

  // Calcular progresión Martingala Moderada (multiplicador 1.5)
  const multiplicador = 1.5;
  const apuestas = [];
  let totalInvertido = 0;
  let apuestaActual = base;

  for (let i = 0; i <= perdidas; i++) {
    apuestas.push(apuestaActual);
    totalInvertido += apuestaActual;
    apuestaActual *= multiplicador;
  }

  // Calcular recuperación con cuota 2.0
  const ultimaApuesta = apuestas[apuestas.length - 1];
  const recuperacionMinima = ultimaApuesta * 2;
  const gananciaNeta = recuperacionMinima - totalInvertido;

  // Mostrar progresión detallada
  const progresionTexto = apuestas.map((apuesta, index) => 
    `${index + 1}°: ${apuesta.toFixed(3)}`
  ).join(' → ');

  // Mostrar resultado exitoso
  resultado.innerHTML = `
    📊 <strong>Progresión:</strong> ${progresionTexto}<br>
    💸 <strong>Total acumulado:</strong> ${totalInvertido.toFixed(3)}<br>
    🎯 <strong>Última apuesta:</strong> ${ultimaApuesta.toFixed(3)}<br>
    ✅ <strong>Recuperación (cuota 2.0):</strong> ${recuperacionMinima.toFixed(2)}<br>
    📈 <strong>Ganancia neta:</strong> ${gananciaNeta.toFixed(3)}<br>
    ⚠️ <strong>Riesgo total:</strong> ${Math.round((totalInvertido / base) * 100) / 100}x la apuesta base
  `;
  resultado.style.borderLeftColor = '#00e676';
  resultado.style.background = 'rgba(0, 230, 118, 0.1)';
  resultado.style.color = '#00e676';
}

// Función auxiliar para mostrar errores
function mostrarError(elemento, mensaje) {
  elemento.innerHTML = `❗ <strong>Error:</strong> ${mensaje}`;
  elemento.style.borderLeftColor = '#ff5252';
  elemento.style.background = 'rgba(255, 82, 82, 0.1)';
  elemento.style.color = '#ff5252';
}

// Función para limpiar resultados cuando se modifican los inputs
function setupInputListeners() {
  // Escalera
  const escaleraInputs = ['cuota1-escalera', 'cuota2-escalera', 'inversion-escalera'];
  escaleraInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('resultadoEscalera').innerHTML = '';
      });
    }
  });

  // Stake Fijo
  const stakeInputs = ['cuota-stake', 'stake-fijo'];
  stakeInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('resultadoStakeFijo').innerHTML = '';
      });
    }
  });

  // Fibonacci
  const fiboInputs = ['fibo-base', 'fibo-perdidas'];
  fiboInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('resultadoFibonacci').innerHTML = '';
      });
    }
  });

  // Martingala
  const martingalaInputs = ['martingala-base', 'martingala-perdidas'];
  martingalaInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        document.getElementById('resultadoMartingala').innerHTML = '';
      });
    }
  });
}

// Función para permitir cálculo con Enter
function setupEnterKeyListeners() {
  // Escalera
  document.getElementById('inversion-escalera')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcularEscalera();
  });

  // Stake Fijo
  document.getElementById('stake-fijo')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcularStakeFijo();
  });

  // Fibonacci
  document.getElementById('fibo-perdidas')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcularFibonacci();
  });

  // Martingala
  document.getElementById('martingala-perdidas')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') calcularMartingala();
  });
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
  setupInputListeners();
  setupEnterKeyListeners();
  
  // Cerrar tarjetas al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.tip-card')) {
      document.querySelectorAll('.tip-card.active').forEach(card => {
        card.classList.remove('active');
      });
    }
  });
});

// Función para copiar resultados al portapapeles
function copiarResultado(estrategia) {
  const resultado = document.getElementById(`resultado${estrategia}`);
  if (resultado && resultado.textContent.trim()) {
    const texto = resultado.textContent.replace(/\s+/g, ' ').trim();
    navigator.clipboard.writeText(texto).then(() => {
      // Mostrar feedback visual
      const originalContent = resultado.innerHTML;
      resultado.innerHTML = '📋 ¡Copiado al portapapeles!';
      setTimeout(() => {
        resultado.innerHTML = originalContent;
      }, 2000);
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }
}
// Calculadora Dutching
function calcularDutching() {
    const cuota1 = parseFloat(document.getElementById('dutching-cuota1').value);
    const cuota2 = parseFloat(document.getElementById('dutching-cuota2').value);
    const inversion = parseFloat(document.getElementById('dutching-inversion').value);
    
    if (!cuota1 || !cuota2 || !inversion || cuota1 <= 1 || cuota2 <= 1) {
        document.getElementById('resultadoDutching').innerHTML = '❌ Por favor ingresa cuotas válidas (mayor a 1.00) e inversión total';
        return;
    }
    
    // Calcular si hay valor (suma de inversos menor a 1)
    const sumaInversos = (1/cuota1) + (1/cuota2);
    
    if (sumaInversos >= 1) {
        document.getElementById('resultadoDutching').innerHTML = 
            `❌ <strong>No hay valor:</strong> Suma de inversos = ${sumaInversos.toFixed(4)} (debe ser < 1.00)<br>` +
            `🔍 <strong>Busca mejores cuotas para tener ganancia garantizada</strong>`;
        return;
    }
    
    // Calcular apuestas
    const apuesta1 = (inversion / cuota1) / sumaInversos;
    const apuesta2 = (inversion / cuota2) / sumaInversos;
    
    // Calcular ganancias
    const ganancia1 = (apuesta1 * cuota1) - inversion;
    const ganancia2 = (apuesta2 * cuota2) - inversion;
    
    // Formatear números agregando .000 siempre
    const formatNumber = (num) => {
        return Math.round(num).toLocaleString('es-ES') + '.000';
    };
    
    document.getElementById('resultadoDutching').innerHTML = 
        `✅ <strong>Distribución de apuestas:</strong><br>` +
        `🎯 Resultado 1 (cuota ${cuota1}): <strong>${formatNumber(apuesta1)}</strong><br>` +
        `🎯 Resultado 2 (cuota ${cuota2}): <strong>${formatNumber(apuesta2)}</strong><br>` +
        `💰 <strong>Ganancia garantizada:</strong> ${formatNumber(ganancia1)}<br>` +
        `📊 <strong>ROI:</strong> ${Math.round((ganancia1/inversion)*100)}%`;
}

// Calculadora d'Alembert
function calcularDAlembert() {
    const base = parseFloat(document.getElementById('dalembert-base').value);
    const perdidas = parseInt(document.getElementById('dalembert-perdidas').value);
    const victorias = parseInt(document.getElementById('dalembert-victorias').value);
    
    if (!base || base <= 0) {
        document.getElementById('resultadoDAlembert').innerHTML = '❌ Por favor ingresa una unidad base válida';
        return;
    }
    
    if (perdidas < 0 || victorias < 0) {
        document.getElementById('resultadoDAlembert').innerHTML = '❌ Las pérdidas y victorias deben ser números positivos';
        return;
    }
    
    // Calcular progresión después de pérdidas
    let apuestaActual = base + (perdidas * base);
    
    // Calcular progresión después de victorias (mínimo 1 unidad)
    apuestaActual = Math.max(base, apuestaActual - (victorias * base));
    
    // Calcular pérdida total acumulada durante las pérdidas
    let perdidaTotal = 0;
    for (let i = 1; i <= perdidas; i++) {
        perdidaTotal += base * i;
    }
    
    // Calcular ganancia total durante las victorias
    let gananciaTotal = 0;
    let apuestaTemporal = base + (perdidas * base);
    for (let i = 1; i <= victorias; i++) {
        // Asumiendo cuota 1.85 para el cálculo
        gananciaTotal += apuestaTemporal * 0.85; // ganancia neta con cuota 1.85
        apuestaTemporal = Math.max(base, apuestaTemporal - base);
    }
    
    const balanceNeto = gananciaTotal - perdidaTotal;
    
    // Formatear números agregando .000 siempre
    const formatNumber = (num) => {
        return Math.round(num).toLocaleString('es-ES') + '.000';
    };
    
    let resultado = `📊 <strong>Análisis d'Alembert:</strong><br>`;
    
    if (perdidas > 0) {
        resultado += `📉 Después de ${perdidas} pérdida(s): Apuesta actual = <strong>${formatNumber(apuestaActual + (victorias * base))}</strong><br>`;
    }
    
    if (victorias > 0) {
        resultado += `📈 Después de ${victorias} victoria(s): Próxima apuesta = <strong>${formatNumber(apuestaActual)}</strong><br>`;
    }
    
    if (perdidas > 0 || victorias > 0) {
        resultado += `💰 <strong>Balance estimado:</strong> ${balanceNeto >= 0 ? '+' : ''}${formatNumber(balanceNeto)}<br>`;
        resultado += `🎯 <strong>Estado:</strong> ${balanceNeto >= 0 ? '✅ Positivo' : '❌ Negativo'}<br>`;
    }
    
    resultado += `⚠️ <strong>Bankroll recomendado:</strong> ${formatNumber(base * 50)} (50 unidades)`;
    
    document.getElementById('resultadoDAlembert').innerHTML = resultado;
}

// Función para expandir/contraer tips (si no existe)
function expandTip(tipId) {
    const card = document.querySelector(`[data-id="${tipId}"]`);
    const body = card.querySelector('.tip-body');
    const icon = card.querySelector('.toggle-icon');
    
    if (body.style.display === 'none' || body.style.display === '') {
        body.style.display = 'block';
        icon.textContent = '▲';
    } else {
        body.style.display = 'none';
        icon.textContent = '▼';
    }
}