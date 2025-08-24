// Analytics - Sección de Análisis
let charts = {};

function initAnalytics() {
    // Solo crear gráficos si Chart.js está disponible
    if (typeof Chart !== 'undefined') {
        updateBankChart();
        updateStatusChart();
        updateSportChart();
        updateOddsChart();
    } else {
        // Mostrar mensaje si no hay Chart.js
        console.log('Chart.js no disponible - usando vista simplificada');
        showSimpleAnalytics();
    }
}

function updateBankChart() {
    const ctx = document.getElementById('bankChart');
    if (!ctx) return;
    
    const bets = JSON.parse(localStorage.getItem('bets') || '[]');
    const initialBank = parseFloat(localStorage.getItem('initialBank') || '0');
    
    // Calcular evolución del bank
    let bankHistory = [initialBank];
    let labels = ['Inicio'];
    let currentBank = initialBank;
    
    bets.filter(bet => bet.status !== 'pending')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach((bet, index) => {
            if (bet.status === 'won') {
                currentBank += (parseFloat(bet.stake) * parseFloat(bet.odds)) - parseFloat(bet.stake);
            } else if (bet.status === 'lost') {
                currentBank -= parseFloat(bet.stake);
            }
            bankHistory.push(currentBank);
            labels.push(`#${index + 1}`);
        });
    
    // Destruir gráfico anterior si existe
    if (charts.bank) {
        charts.bank.destroy();
    }
    
    charts.bank = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Bank',
                data: bankHistory,
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    const bets = JSON.parse(localStorage.getItem('bets') || '[]');
    
    const statusCount = {
        won: bets.filter(b => b.status === 'won').length,
        lost: bets.filter(b => b.status === 'lost').length,
        pending: bets.filter(b => b.status === 'pending').length,
        void: bets.filter(b => b.status === 'void').length
    };
    
    if (charts.status) {
        charts.status.destroy();
    }
    
    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ganadas', 'Perdidas', 'Pendientes', 'Nulas'],
            datasets: [{
                data: [statusCount.won, statusCount.lost, statusCount.pending, statusCount.void],
                backgroundColor: ['#00ff88', '#ff4757', '#00ffff', '#ffa502']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateSportChart() {
    const ctx = document.getElementById('sportChart');
    if (!ctx) return;
    
    const bets = JSON.parse(localStorage.getItem('bets') || '[]');
    
    const sportStats = {};
    bets.forEach(bet => {
        if (!sportStats[bet.sport]) {
            sportStats[bet.sport] = { profit: 0, count: 0 };
        }
        
        sportStats[bet.sport].count++;
        
        if (bet.status === 'won') {
            sportStats[bet.sport].profit += (parseFloat(bet.stake) * parseFloat(bet.odds)) - parseFloat(bet.stake);
        } else if (bet.status === 'lost') {
            sportStats[bet.sport].profit -= parseFloat(bet.stake);
        }
    });
    
    const sportNames = { football: 'Fútbol', basketball: 'Baloncesto', other: 'Otros' };
    
    if (charts.sport) {
        charts.sport.destroy();
    }
    
    charts.sport = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(sportStats).map(sport => sportNames[sport] || sport),
            datasets: [{
                label: 'Beneficio',
                data: Object.values(sportStats).map(stat => stat.profit),
                backgroundColor: function(context) {
                    return context.parsed.y >= 0 ? '#00ff88' : '#ff4757';
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function updateOddsChart() {
    const ctx = document.getElementById('oddsChart');
    if (!ctx) return;
    
    const bets = JSON.parse(localStorage.getItem('bets') || '[]');
    
    const wonBets = bets.filter(b => b.status === 'won').map(b => ({
        x: parseFloat(b.odds),
        y: parseFloat(b.stake)
    }));
    
    const lostBets = bets.filter(b => b.status === 'lost').map(b => ({
        x: parseFloat(b.odds),
        y: parseFloat(b.stake)
    }));
    
    if (charts.odds) {
        charts.odds.destroy();
    }
    
    charts.odds = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Ganadas',
                data: wonBets,
                backgroundColor: '#00ff88'
            }, {
                label: 'Perdidas',
                data: lostBets,
                backgroundColor: '#ff4757'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: { display: true, text: 'Cuota' }
                },
                y: {
                    title: { display: true, text: 'Stake' },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function showSimpleAnalytics() {
    // Vista alternativa sin gráficos
    const bets = JSON.parse(localStorage.getItem('bets') || '[]');
    const charts = document.querySelectorAll('.chart-container canvas');
    
    charts.forEach(chart => {
        chart.parentElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: #666;">
                <div style="text-align: center;">
                    <i class="fas fa-chart-line" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <p>Gráficos disponibles con Chart.js</p>
                    <p style="font-size: 14px;">Total de apuestas: ${bets.length}</p>
                </div>
            </div>
        `;
    });
}

// Actualizar analytics cuando cambien los datos
function refreshAnalytics() {
    if (document.querySelector('#analytics.active')) {
        initAnalytics();
    }
}

// Modificar la función switchTab para inicializar analytics
function switchTabWithAnalytics(tabName, element) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(tabName).classList.add('active');
    element.classList.add('active');
    
    // Si es analytics, inicializar gráficos
    if (tabName === 'analytics') {
        setTimeout(() => initAnalytics(), 100);
    }
}

// Reemplazar la función switchTab original
window.switchTab = switchTabWithAnalytics;