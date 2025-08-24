// Crear un espacio de nombres para encapsular todo el código
var CyborgMatch = (function() {
    // =================== VARIABLES GLOBALES ===================
    let bets = [];
    let currentEditingId = null;
    let initialBank = 0;
    let currentBank = 0;
    let theme = 'dark';
    let currency = 'USD';

    // Configuración de monedas
    const currencyConfig = {
        'USD': { symbol: '$', position: 'before' },
        'EUR': { symbol: '€', position: 'after' },
        'COP': { symbol: '$', position: 'before' }
    };

    // =================== INICIALIZACIÓN ===================
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        loadData();
        setupEventListeners();
        showLoadingScreen();
        setTimeout(() => {
            hideLoadingScreen();
            if (initialBank === 0) {
                showBankSetup();
            } else {
                updateDashboard();
                updateChartsIfVisible();
            }
        }, 2000);
    }

    function setupEventListeners() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('bet-date');
        if (dateInput) {
            dateInput.value = today;
        }
        const oddsInput = document.getElementById('bet-odds');
        const stakeInput = document.getElementById('bet-stake');
        if (oddsInput && stakeInput) {
            oddsInput.addEventListener('input', updatePotentialReturn);
            stakeInput.addEventListener('input', updatePotentialReturn);
        }
    }

    // =================== LOADING SCREEN ===================
    function showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        const messages = [
            'Inicializando sistema...',
            'Cargando datos...',
            'Preparando dashboard...',
            'Sistema listo!'
        ];
        let progress = 0;
        let messageIndex = 0;
        const interval = setInterval(() => {
            progress += 25;
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (messageIndex < messages.length && loadingText) {
                loadingText.textContent = messages[messageIndex];
                messageIndex++;
            }
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 500);
    }

    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        if (loadingScreen && app) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                app.style.display = 'block';
                app.style.opacity = '0';
                setTimeout(() => {
                    app.style.opacity = '1';
                }, 100);
            }, 500);
        }
    }

    // =================== GESTIÓN DE DATOS ===================
    function loadData() {
        try {
            const storedBets = localStorage.getItem('cyborgmatch_bets');
            const storedBank = localStorage.getItem('cyborgmatch_initial_bank');
            const storedTheme = localStorage.getItem('cyborgmatch_theme');
            const storedCurrency = localStorage.getItem('cyborgmatch_currency');
            // Asegúrate de que bets sea un array
            bets = Array.isArray(JSON.parse(storedBets)) ? JSON.parse(storedBets) : [];
            if (storedBank) {
                initialBank = parseFloat(storedBank);
                currentBank = initialBank;
                calculateCurrentBank();
            }
            if (storedTheme) {
                theme = storedTheme;
                applyTheme(theme);
            }
            if (storedCurrency) {
                currency = storedCurrency;
                const currencySelect = document.getElementById('currency-select');
                if (currencySelect) {
                    currencySelect.value = currency;
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Error al cargar los datos', 'error');
        }
    }

    function saveData() {
        try {
            localStorage.setItem('cyborgmatch_bets', JSON.stringify(bets));
            localStorage.setItem('cyborgmatch_initial_bank', initialBank.toString());
            localStorage.setItem('cyborgmatch_theme', theme);
            localStorage.setItem('cyborgmatch_currency', currency);
        } catch (error) {
            console.error('Error saving data:', error);
            showToast('Error al guardar los datos', 'error');
        }
    }

    // =================== CONFIGURACIÓN INICIAL DEL BANK ===================
    function showBankSetup() {
        const bankSetupCard = document.getElementById('bank-setup-card');
        const statsSection = document.getElementById('stats-section');
        if (bankSetupCard && statsSection) {
            bankSetupCard.style.display = 'block';
            statsSection.style.display = 'none';
        }
    }

    function setupInitialBank() {
        const bankInput = document.getElementById('initial-bank');
        if (!bankInput) return;
        const amount = parseFloat(bankInput.value);
        if (isNaN(amount) || amount <= 0) {
            showToast('Por favor, ingresa un monto válido', 'error');
            return;
        }
        initialBank = amount;
        currentBank = amount;
        const bankSetupCard = document.getElementById('bank-setup-card');
        const statsSection = document.getElementById('stats-section');
        if (bankSetupCard && statsSection) {
            bankSetupCard.style.display = 'none';
            statsSection.style.display = 'block';
        }
        updateDashboard();
        saveData();
        showToast('Sistema inicializado correctamente', 'success');
    }

    function changeBankAmount() {
        const newBankInput = document.getElementById('new-bank');
        if (!newBankInput) return;
        const newAmount = parseFloat(newBankInput.value);
        if (isNaN(newAmount) || newAmount <= 0) {
            showToast('Por favor, ingresa un monto válido', 'error');
            return;
        }
        const oldBank = initialBank;
        initialBank = newAmount;
        calculateCurrentBank();
        updateDashboard();
        saveData();
        showToast(`Bank actualizado de ${formatCurrency(oldBank)} a ${formatCurrency(newAmount)}`, 'success');
        newBankInput.value = '';
    }

    // =================== NAVEGACIÓN ===================
    function switchTab(tabName, element) {
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        element.classList.add('active');
        document.getElementById(tabName).classList.add('active');
        if (tabName === 'analytics') {
            setTimeout(updateCharts, 100);
        }
        if (tabName === 'calculator') {
            const calcBankInput = document.getElementById('calc-bank');
            if (calcBankInput) {
                calcBankInput.value = currentBank;
            }
        }
    }

    // =================== GESTIÓN DE APUESTAS ===================
    function openBetModal(betId = null) {
        const modal = document.getElementById('betModal');
        const form = document.getElementById('bet-form');
        const title = document.getElementById('modal-title');
        if (!modal || !form || !title) return;
        currentEditingId = betId;
        if (betId) {
            const bet = bets.find(b => b.id === betId);
            if (bet) {
                title.textContent = 'Editar Apuesta';
                document.getElementById('bet-date').value = bet.date;
                document.getElementById('bet-event').value = bet.event;
                document.getElementById('bet-sport').value = bet.sport;
                document.getElementById('bet-market').value = bet.market;
                document.getElementById('bet-odds').value = bet.odds;
                document.getElementById('bet-stake').value = bet.stake;
                document.getElementById('bet-status').value = bet.status;
                document.getElementById('bet-notes').value = bet.notes || '';
            }
        } else {
            title.textContent = 'Nueva Apuesta';
            form.reset();
            document.getElementById('bet-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('bet-status').value = 'pending';
        }
        modal.style.display = 'flex';
        updatePotentialReturn();
    }

    function closeBetModal() {
        const modal = document.getElementById('betModal');
        if (modal) {
            modal.style.display = 'none';
        }
        currentEditingId = null;
    }

    function saveBet() {
        const formData = {
            date: document.getElementById('bet-date').value,
            event: document.getElementById('bet-event').value,
            sport: document.getElementById('bet-sport').value,
            market: document.getElementById('bet-market').value,
            odds: parseFloat(document.getElementById('bet-odds').value),
            stake: parseFloat(document.getElementById('bet-stake').value),
            status: document.getElementById('bet-status').value,
            notes: document.getElementById('bet-notes').value
        };
        if (!formData.date || !formData.event || !formData.sport || !formData.market ||
            isNaN(formData.odds) || isNaN(formData.stake) || !formData.status) {
            showToast('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        if (formData.odds < 1) {
            showToast('La cuota debe ser mayor a 1.00', 'error');
            return;
        }
        if (formData.stake <= 0) {
            showToast('El stake debe ser mayor a 0', 'error');
            return;
        }
        if (currentEditingId) {
            const index = bets.findIndex(b => b.id === currentEditingId);
            if (index !== -1) {
                bets[index] = { ...bets[index], ...formData };
                showToast('Apuesta actualizada correctamente', 'success');
            }
        } else {
            const newBet = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            };
            bets.unshift(newBet);
            showToast('Apuesta agregada correctamente', 'success');
        }
        calculateCurrentBank();
        updateDashboard();
        updateBetsTable();
        saveData();
        closeBetModal();
    }

    function deleteBet(betId) {
        if (confirm('¿Estás seguro de que quieres eliminar esta apuesta?')) {
            bets = bets.filter(bet => bet.id !== betId);
            calculateCurrentBank();
            updateDashboard();
            updateBetsTable();
            saveData();
            showToast('Apuesta eliminada correctamente', 'success');
        }
    }

    function updatePotentialReturn() {
        const odds = parseFloat(document.getElementById('bet-odds').value) || 0;
        const stake = parseFloat(document.getElementById('bet-stake').value) || 0;
        if (odds > 0 && stake > 0) {
            const potentialReturn = odds * stake;
            const profit = potentialReturn - stake;
            console.log(`Potential return: ${formatCurrency(potentialReturn)}, Profit: ${formatCurrency(profit)}`);
        }
    }

    // =================== FILTROS ===================
    function filterBets() {
        const statusFilter = document.getElementById('status-filter').value;
        const sportFilter = document.getElementById('sport-filter').value;
        updateBetsTable(statusFilter, sportFilter);
    }

    // =================== CÁLCULOS ===================
    function calculateCurrentBank() {
        if (!Array.isArray(bets)) {
            console.error('bets is not an array');
            return;
        }
        currentBank = initialBank;
        bets.forEach(bet => {
            if (bet.status === 'won') {
                currentBank += (bet.odds * bet.stake - bet.stake);
            } else if (bet.status === 'lost') {
                currentBank -= bet.stake;
            }
        });
    }

    function calculateStats() {
        if (!Array.isArray(bets)) {
            console.error('bets is not an array');
            return {
                totalBets: 0,
                wonBets: 0,
                lostBets: 0,
                pendingBets: 0,
                totalStaked: 0,
                totalReturn: 0,
                netProfit: 0,
                roi: 0,
                winRate: 0,
                avgOdds: 0,
                currentStreak: 0
            };
        }
        const stats = {
            totalBets: bets.length,
            wonBets: bets.filter(b => b.status === 'won').length,
            lostBets: bets.filter(b => b.status === 'lost').length,
            pendingBets: bets.filter(b => b.status === 'pending').length,
            totalStaked: bets.filter(b => b.status !== 'void').reduce((sum, bet) => sum + bet.stake, 0),
            totalReturn: bets.filter(b => b.status === 'won').reduce((sum, bet) => sum + (bet.odds * bet.stake), 0),
            netProfit: currentBank - initialBank,
            roi: initialBank > 0 ? ((currentBank - initialBank) / initialBank * 100) : 0,
            winRate: 0,
            avgOdds: 0,
            currentStreak: 0
        };
        const settledBets = bets.filter(b => b.status === 'won' || b.status === 'lost');
        if (settledBets.length > 0) {
            stats.winRate = (stats.wonBets / settledBets.length) * 100;
        }
        if (bets.length > 0) {
            stats.avgOdds = bets.reduce((sum, bet) => sum + bet.odds, 0) / bets.length;
        }
        const sortedBets = bets.filter(b => b.status === 'won' || b.status === 'lost')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        if (sortedBets.length > 0) {
            const lastStatus = sortedBets[0].status;
            let streak = 0;
            for (const bet of sortedBets) {
                if (bet.status === lastStatus) {
                    streak++;
                } else {
                    break;
                }
            }
            stats.currentStreak = lastStatus === 'won' ? streak : -streak;
        }
        return stats;
    }

    // =================== ACTUALIZACIÓN DE UI ===================
    function updateDashboard() {
        const stats = calculateStats();
        const elements = [
            { id: 'current-bank', value: formatCurrency(currentBank) },
            { id: 'net-profit', value: formatCurrency(stats.netProfit) },
            { id: 'roi-value', value: stats.roi.toFixed(2) + '%' },
            { id: 'win-rate', value: stats.winRate.toFixed(1) + '%' },
            { id: 'total-staked', value: formatCurrency(stats.totalStaked) },
            { id: 'total-wins', value: stats.wonBets },
            { id: 'total-losses', value: stats.lostBets },
            { id: 'pending-bets', value: stats.pendingBets },
            { id: 'avg-odds', value: stats.avgOdds.toFixed(2) },
            { id: 'header-bank', value: formatCurrency(currentBank) },
            { id: 'header-roi', value: stats.roi.toFixed(1) + '%' },
            { id: 'header-winrate', value: stats.winRate.toFixed(1) + '%' }
        ];
        elements.forEach(element => {
            const el = document.getElementById(element.id);
            if (el) {
                el.textContent = element.value;
            }
        });
        updateProgressBars(stats);
        updateChangeIndicators(stats);
        updateRecentActivity();
    }

    function updateProgressBars(stats) {
        const winrateProgress = document.getElementById('winrate-progress');
        if (winrateProgress) {
            winrateProgress.style.width = stats.winRate + '%';
            winrateProgress.className = 'progress-bar';
            if (stats.winRate >= 70) {
                winrateProgress.classList.add('excellent');
            } else if (stats.winRate >= 55) {
                winrateProgress.classList.add('good');
            } else if (stats.winRate >= 45) {
                winrateProgress.classList.add('average');
            } else {
                winrateProgress.classList.add('poor');
            }
        }
    }

    function updateChangeIndicators(stats) {
        const bankChange = document.getElementById('bank-change');
        const profitChange = document.getElementById('profit-change');
        const roiIndicator = document.getElementById('roi-indicator');
        if (bankChange) {
            bankChange.textContent = (stats.netProfit >= 0 ? '+' : '') + formatCurrency(stats.netProfit);
            bankChange.className = 'stat-change ' + (stats.netProfit >= 0 ? 'positive' : 'negative');
        }
        if (profitChange) {
            profitChange.textContent = stats.roi.toFixed(2) + '%';
            profitChange.className = 'stat-change ' + (stats.roi >= 0 ? 'positive' : 'negative');
        }
        if (roiIndicator) {
            roiIndicator.className = 'stat-indicator';
            if (stats.roi >= 10) {
                roiIndicator.classList.add('excellent');
            } else if (stats.roi >= 5) {
                roiIndicator.classList.add('good');
            } else if (stats.roi >= 0) {
                roiIndicator.classList.add('average');
            } else {
                roiIndicator.classList.add('poor');
            }
        }
    }

    function updateRecentActivity() {
        const activityList = document.getElementById('recent-activity');
        if (!activityList) return;
        const recentBets = bets.slice(0, 5);
        if (recentBets.length === 0) {
            activityList.innerHTML = `
                <div class="no-activity">
                    <i class="fas fa-info-circle"></i>
                    <p>No hay actividad reciente</p>
                </div>
            `;
            return;
        }
        activityList.innerHTML = recentBets.map(bet => {
            const statusIcon = getStatusIcon(bet.status);
            const statusClass = getStatusClass(bet.status);
            return `
                <div class="activity-item ${statusClass}">
                    <div class="activity-icon">${statusIcon}</div>
                    <div class="activity-content">
                        <div class="activity-title">${bet.event}</div>
                        <div class="activity-details">
                            ${bet.market} - ${formatCurrency(bet.stake)} @ ${bet.odds}
                        </div>
                    </div>
                    <div class="activity-date">${formatDate(bet.date)}</div>
                </div>
            `;
        }).join('');
    }

    function updateBetsTable(statusFilter = '', sportFilter = '') {
        const tbody = document.getElementById('bets-tbody');
        if (!tbody) return;
        let filteredBets = bets;
        if (statusFilter) {
            filteredBets = filteredBets.filter(bet => bet.status === statusFilter);
        }
        if (sportFilter) {
            filteredBets = filteredBets.filter(bet => bet.sport === sportFilter);
        }
        if (filteredBets.length === 0) {
            tbody.innerHTML = `
                <tr class="no-data">
                    <td colspan="10">
                        <div class="no-data-content">
                            <i class="fas fa-inbox"></i>
                            <p>No se encontraron apuestas</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        tbody.innerHTML = filteredBets.map(bet => {
            const statusIcon = getStatusIcon(bet.status);
            const statusClass = getStatusClass(bet.status);
            const returnAmount = calculateReturnAmount(bet);
            return `
                <tr class="bet-row ${statusClass}">
                    <td>#${bet.id.toString().slice(-4)}</td>
                    <td>${formatDate(bet.date)}</td>
                    <td class="event-cell">
                        <div class="event-name">${bet.event}</div>
                        ${bet.notes ? `<div class="event-notes">${bet.notes}</div>` : ''}
                    </td>
                    <td>${getSportIcon(bet.sport)} ${getSportName(bet.sport)}</td>
                    <td>${bet.market}</td>
                    <td class="odds-cell">${bet.odds}</td>
                    <td class="stake-cell">${formatCurrency(bet.stake)}</td>
                    <td class="status-cell">
                        <span class="status-badge ${statusClass}">
                            ${statusIcon} ${getStatusName(bet.status)}
                        </span>
                    </td>
                    <td class="return-cell ${statusClass}">${formatCurrency(returnAmount)}</td>
                    <td class="actions-cell">
                        <button class="btn-icon btn-edit" onclick="CyborgMatch.openBetModal(${bet.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="CyborgMatch.deleteBet(${bet.id})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // =================== CALCULADORAS ===================
    function calculateStake() {
        const bank = parseFloat(document.getElementById('calc-bank').value);
        const odds = parseFloat(document.getElementById('calc-odds').value);

        if (isNaN(bank) || isNaN(odds)) {
            showToast('Por favor, completa todos los campos', 'error');
            return;
        }

        // Calcular porcentaje automáticamente según la cuota
        let percentage = calculatePercentageByOdds(odds);

        const stake = (bank * percentage) / 100;
        const potentialReturn = stake * odds;
        const profit = potentialReturn - stake;

        const resultElement = document.getElementById('stake-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <div class="calc-result-content">
                    <div class="result-item">
                        <span class="result-label">Cuota:</span>
                        <span class="result-value">${odds.toFixed(3)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">% Calculado:</span>
                        <span class="result-value">${percentage.toFixed(1)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Stake recomendado:</span>
                        <span class="result-value">${formatCurrency(stake)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Retorno potencial:</span>
                        <span class="result-value">${formatCurrency(potentialReturn)}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Beneficio potencial:</span>
                        <span class="result-value">${formatCurrency(profit)}</span>
                    </div>
                </div>
            `;
        }
    }

    // Función para calcular el porcentaje según la cuota
    function calculatePercentageByOdds(odds) {
        // Lógica: Cuotas más bajas = mayor porcentaje, cuotas más altas = menor porcentaje

        if (odds <= 1.30) {
            return 20; // Cuotas muy bajas, máxima inversión
        } else if (odds <= 1.40) {
            return 18; // Cuotas bajas
        } else if (odds <= 1.50) {
            return 15; // Tu ejemplo de cuota 1.48
        } else if (odds <= 1.60) {
            return 12;
        } else if (odds <= 1.80) {
            return 10;
        } else if (odds <= 2.00) {
            return 9;
        } else if (odds <= 2.50) {
            return 7; // Cuotas altas
        } else if (odds <= 3.00) {
            return 6;
        } else if (odds <= 4.00) {
            return 5;
        } else if (odds <= 5.00) {
            return 4;
        } else {
            return 2; // Cuotas muy altas, mínima inversión
        }
    }

    function calculateValue() {
        const realProbability = parseFloat(document.getElementById('real-probability').value);
        const bookmakerOdds = parseFloat(document.getElementById('bookmaker-odds').value);

        if (isNaN(realProbability) || isNaN(bookmakerOdds)) {
            showToast('Por favor, completa todos los campos', 'error');
            return;
        }

        const impliedProbability = (1 / bookmakerOdds) * 100;
        const valueBet = realProbability > impliedProbability;
        const value = ((realProbability / 100) * bookmakerOdds - 1) * 100;

        const resultElement = document.getElementById('value-result');
        if (resultElement) {
            resultElement.innerHTML = `
                <div class="calc-result-content">
                    <div class="result-item">
                        <span class="result-label">Probabilidad implícita:</span>
                        <span class="result-value">${impliedProbability.toFixed(3)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Valor esperado:</span>
                        <span class="result-value ${value > 0 ? 'positive' : 'negative'}">${value.toFixed(3)}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">¿Apuesta de valor?</span>
                        <span class="result-value ${valueBet ? 'positive' : 'negative'}">
                            ${valueBet ? '✅ SÍ' : '❌ NO'}
                        </span>
                    </div>
                </div>
            `;
        }
    }

    // =================== GRÁFICOS ===================
    function updateChartsIfVisible() {
        const analyticsTab = document.getElementById('analytics');
        if (analyticsTab && analyticsTab.classList.contains('active')) {
            updateCharts();
        }
    }

    function updateCharts() {
        updateBankTable();
        updateStatusTable();
        updateSportTable();
        updateOddsTable();
    }

    function updateBankTable() {
        const tableBody = document.querySelector('#bankTable tbody');
        if (!tableBody) return;
        if (!Array.isArray(bets)) {
            console.error('bets is not an array');
            return;
        }
        const sortedBets = [...bets].sort((a, b) => new Date(a.date) - new Date(b.date));
        let runningBank = initialBank;
        tableBody.innerHTML = '';
        const initialRow = document.createElement('tr');
        initialRow.innerHTML = `
            <td>Inicial</td>
            <td>${formatCurrency(initialBank)}</td>
        `;
        tableBody.appendChild(initialRow);
        sortedBets.forEach(bet => {
            if (bet.status === 'won') {
                runningBank += bet.odds * bet.stake - bet.stake;
            } else if (bet.status === 'lost') {
                runningBank -= bet.stake;
            }
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(bet.date)}</td>
                <td>${formatCurrency(runningBank)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateStatusTable() {
        const tableBody = document.querySelector('#statusTable tbody');
        if (!tableBody) return;
        const stats = calculateStats();
        tableBody.innerHTML = '';
        const statusData = [
            { label: 'Ganadas', value: stats.wonBets },
            { label: 'Perdidas', value: stats.lostBets },
            { label: 'Pendientes', value: stats.pendingBets }
        ];
        statusData.forEach(status => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${status.label}</td>
                <td>${status.value}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateSportTable() {
        const tableBody = document.querySelector('#sportTable tbody');
        if (!tableBody) return;
        const sportStats = {};
        bets.forEach(bet => {
            if (!sportStats[bet.sport]) {
                sportStats[bet.sport] = { total: 0, won: 0, profit: 0 };
            }
            sportStats[bet.sport].total++;
            if (bet.status === 'won') {
                sportStats[bet.sport].won++;
                sportStats[bet.sport].profit += bet.odds * bet.stake - bet.stake;
            } else if (bet.status === 'lost') {
                sportStats[bet.sport].profit -= bet.stake;
            }
        });
        tableBody.innerHTML = '';
        Object.entries(sportStats).forEach(([sport, stats]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${getSportName(sport)}</td>
                <td>${stats.won}</td>
                <td>${stats.total}</td>
                <td>${formatCurrency(stats.profit)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function updateOddsTable() {
        const tableBody = document.querySelector('#oddsTable tbody');
        if (!tableBody) return;
        const oddsRanges = {
            'Bajas (1.0-1.5)': bets.filter(b => b.odds >= 1.0 && b.odds < 1.5).length,
            'Medias (1.5-2.5)': bets.filter(b => b.odds >= 1.5 && b.odds < 2.5).length,
            'Altas (2.5-5.0)': bets.filter(b => b.odds >= 2.5 && b.odds < 5.0).length,
            'Muy Altas (5.0+)': bets.filter(b => b.odds >= 5.0).length,
        };
        tableBody.innerHTML = '';
        Object.entries(oddsRanges).forEach(([range, count]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${range}</td>
                <td>${count}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // =================== UTILIDADES ===================
   function formatCurrency(value) {
    // Asegurarse de que el valor es un número
    const numericValue = parseFloat(value);

    // Verificar si el valor es un número válido
    if (isNaN(numericValue)) {
        return "0.00";
    }

    // Formatear el valor para que siempre muestre dos decimales
    return numericValue.toFixed(3);
}


    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    }

    function getStatusIcon(status) {
        const icons = {
            'pending': '🔵',
            'won': '🟢',
            'lost': '🔴',
            'void': '🟡'
        };
        return icons[status] || '❓';
    }

    function getStatusClass(status) {
        return `status-${status}`;
    }

    function getStatusName(status) {
        const names = {
            'pending': 'Pendiente',
            'won': 'Ganada',
            'lost': 'Perdida',
            'void': 'Nula'
        };
        return names[status] || status;
    }

    function getSportIcon(sport) {
        const icons = {
            'football': '⚽',
            'basketball': '🏀',
            'other': '🏟️'
        };
        return icons[sport] || '🏟️';
    }

    function getSportName(sport) {
        const names = {
            'football': 'Fútbol',
            'basketball': 'Baloncesto',
            'other': 'Otros'
        };
        return names[sport] || 'Desconocido';
    }

    function calculateReturnAmount(bet) {
        switch (bet.status) {
            case 'won':
                return bet.odds * bet.stake;
            case 'lost':
                return 0;
            case 'void':
                return bet.stake;
            case 'pending':
                return bet.odds * bet.stake;
            default:
                return 0;
        }
    }

    // =================== TEMA Y PERSONALIZACIÓN ===================
    function toggleTheme() {
        theme = theme === 'dark' ? 'light' : 'dark';
        applyTheme(theme);
        saveData();
    }

    function changeTheme() {
        const select = document.getElementById('theme-select');
        if (!select) return;
        theme = select.value;
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        applyTheme(theme);
        saveData();
    }

    function applyTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
        const themeIcon = document.querySelector('.header-actions .fa-moon, .header-actions .fa-sun');
        if (themeIcon) {
            themeIcon.className = themeName === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    function changeCurrency() {
        const select = document.getElementById('currency-select');
        if (!select) return;
        currency = select.value;
        updateDashboard();
        updateBetsTable();
        saveData();
        showToast(`Moneda cambiada a ${currency}`, 'success');
    }

    // =================== EXPORTAR/IMPORTAR DATOS ===================
    function exportData() {
        const data = {
            bets: bets,
            initialBank: initialBank,
            currency: currency,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `cyborgmatch_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('Datos exportados correctamente', 'success');
    }

    function importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.bets || !Array.isArray(data.bets)) {
                        throw new Error('Formato de archivo inválido');
                    }
                    bets = data.bets;
                    if (data.initialBank) {
                        initialBank = data.initialBank;
                    }
                    if (data.currency) {
                        currency = data.currency;
                        const currencySelect = document.getElementById('currency-select');
                        if (currencySelect) {
                            currencySelect.value = currency;
                        }
                    }
                    calculateCurrentBank();
                    updateDashboard();
                    updateBetsTable();
                    saveData();
                    showToast(`Datos importados: ${bets.length} apuestas`, 'success');
                } catch (error) {
                    showToast('Error al importar: ' + error.message, 'error');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function confirmClearData() {
        if (confirm('⚠️ ATENCIÓN: Esta acción eliminará TODOS los datos de forma permanente.\n\n¿Estás seguro de que quieres continuar?')) {
            if (confirm('Esta es tu última oportunidad. ¿Realmente quieres eliminar todos los datos?')) {
                clearAllData();
            }
        }
    }

    function clearAllData() {
        bets = [];
        initialBank = 0;
        currentBank = 0;
        localStorage.removeItem('cyborgmatch_bets');
        localStorage.removeItem('cyborgmatch_initial_bank');
        showBankSetup();
        updateDashboard();
        updateBetsTable();
        showToast('Todos los datos han sido eliminados', 'success');
    }

    // =================== NOTIFICACIONES ===================
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icon = getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    function getToastIcon(type) {
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // =================== ATAJOS DE TECLADO ===================
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            openBetModal();
        }
        if (event.key === 'Escape') {
            const modal = document.getElementById('betModal');
            if (modal && modal.style.display === 'flex') {
                closeBetModal();
            }
        }
        if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
            event.preventDefault();
            exportData();
        }
    });

    // =================== FUNCIONES AUXILIARES ===================
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

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =================== VALIDACIONES ===================
    function validateBetForm(formData) {
        const errors = [];
        if (!formData.date) errors.push('La fecha es obligatoria');
        if (!formData.event.trim()) errors.push('El evento es obligatorio');
        if (!formData.sport) errors.push('El deporte es obligatorio');
        if (!formData.market.trim()) errors.push('El mercado es obligatorio');
        if (isNaN(formData.odds) || formData.odds < 1) errors.push('La cuota debe ser mayor a 1.00');
        if (isNaN(formData.stake) || formData.stake <= 0) errors.push('El stake debe ser mayor a 0');
        if (!formData.status) errors.push('El estado es obligatorio');
        return errors;
    }

    // =================== EVENTOS DE RESIZE ===================
    window.addEventListener('resize', debounce(() => {
        updateChartsIfVisible();
    }, 250));

    // =================== AUTO-SAVE ===================
    let autoSaveInterval;
    function startAutoSave() {
        autoSaveInterval = setInterval(() => {
            saveData();
        }, 30000);
    }

    function stopAutoSave() {
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
        }
    }

    // =================== ESTADÍSTICAS AVANZADAS ===================
    function getAdvancedStats() {
        const stats = calculateStats();
        const settledBets = bets.filter(b => b.status === 'won' || b.status === 'lost');
        let longestWinStreak = 0;
        let longestLossStreak = 0;
        let currentWinStreak = 0;
        let currentLossStreak = 0;
        settledBets.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(bet => {
            if (bet.status === 'won') {
                currentWinStreak++;
                currentLossStreak = 0;
                longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
            } else {
                currentLossStreak++;
                currentWinStreak = 0;
                longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
            }
        });
        const profitByMonth = {};
        bets.forEach(bet => {
            const month = bet.date.substring(0, 7);
            if (!profitByMonth[month]) profitByMonth[month] = 0;
            if (bet.status === 'won') {
                profitByMonth[month] += (bet.odds * bet.stake - bet.stake);
            } else if (bet.status === 'lost') {
                profitByMonth[month] -= bet.stake;
            }
        });
        return {
            ...stats,
            longestWinStreak,
            longestLossStreak,
            profitByMonth,
            avgStake: stats.totalBets > 0 ? stats.totalStaked / stats.totalBets : 0,
            bestWin: Math.max(...bets.filter(b => b.status === 'won').map(b => b.odds * b.stake - b.stake), 0),
            worstLoss: Math.max(...bets.filter(b => b.status === 'lost').map(b => b.stake), 0)
        };
    }

    // =================== BÚSQUEDA Y FILTROS AVANZADOS ===================
    function setupAdvancedFilters() {
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');
        if (dateFrom && dateTo) {
            dateFrom.addEventListener('change', filterBets);
            dateTo.addEventListener('change', filterBets);
        }
        const searchInput = document.getElementById('bet-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(filterBets, 300));
        }
    }

    // =================== INICIALIZACIÓN COMPLETA ===================
    function completeInitialization() {
        startAutoSave();
        setupAdvancedFilters();
        if (!localStorage.getItem('cyborgmatch_theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
            applyTheme(theme);
        }
        if (typeof Chart !== 'undefined') {
            Chart.defaults.global.defaultFontFamily = "'Inter', sans-serif";
            Chart.defaults.global.defaultFontColor = '#64748b';
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (theme === 'auto') {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // =================== CLEANUP ===================
    window.addEventListener('beforeunload', () => {
        stopAutoSave();
        saveData();
    });

    // =================== PERFORMANCE MONITORING ===================
    function logPerformance(operation, startTime) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (duration > 100) {
            console.warn(`Performance: ${operation} took ${duration.toFixed(3)}ms`);
        }
    }

    // Initialize performance monitoring
    const originalUpdateDashboard = updateDashboard;
    updateDashboard = function() {
        const startTime = performance.now();
        originalUpdateDashboard.apply(this, arguments);
        logPerformance('updateDashboard', startTime);
    };

    // =================== FINAL INITIALIZATION ===================
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
        completeInitialization();
        console.log('🤖 CyborgMatch v2.0 initialized successfully!');
    });

    // Exponer las funciones que necesitan ser accesibles desde fuera
    return {
    initializeApp,
    openBetModal,
    closeBetModal,
    saveBet,
    deleteBet,
    filterBets,
    switchTab,
    calculateStake,
    calculateValue,
    toggleTheme,
    changeTheme,
    changeCurrency,
    changeBankAmount, // <-- Agrega esta línea
    exportData,
    importData,
    confirmClearData,
    setupInitialBank
};

})();
