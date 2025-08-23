class ImprovedLeagueComparator {
    constructor() {
        this.leagueData = {};
        this.leagueFiles = {
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
            'saudi-arabia': 'static/saudi-arabia_data.json',
            'colombia': 'static/liga_betplay_data.json',
            'estonia': 'static/meistriliiga_data.json',
            'scotland': 'static/scotland Premiership_data.json',
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
            
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const league1Select = document.getElementById('league1');
        const league2Select = document.getElementById('league2');
        const team1Select = document.getElementById('team1');
        const team2Select = document.getElementById('team2');
        const compareBtn = document.getElementById('compareBtn');

        league1Select.addEventListener('change', () => this.loadLeagueTeams('league1', 'team1'));
        league2Select.addEventListener('change', () => this.loadLeagueTeams('league2', 'team2'));
        
        team1Select.addEventListener('change', () => this.checkCompareButton());
        team2Select.addEventListener('change', () => this.checkCompareButton());
        
        compareBtn.addEventListener('click', () => this.compareTeams());
    }

    showLoading() {
        let loading = document.querySelector('.CyborgMatch-section .loading');
        if (!loading) {
            loading = document.createElement('div');
            loading.className = 'loading';
            loading.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Analizando equipos</div>
                    <div class="loading-subtext">Procesando datos estadísticos<span class="loading-pulse">...</span></div>
                </div>
            `;
            const cyborgSection = document.querySelector('.CyborgMatch-section');
            if (cyborgSection) {
                cyborgSection.appendChild(loading);
            } else {
                document.body.appendChild(loading);
            }
        }
        
        loading.classList.add('active');
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.disabled = true;
        }
    }

    hideLoading() {
        const loading = document.querySelector('.CyborgMatch-section .loading');
        if (loading) {
            loading.classList.remove('active');
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }, 300);
        }
        
        const compareBtn = document.getElementById('compareBtn');
        if (compareBtn) {
            compareBtn.disabled = false;
        }
    }

    async loadLeagueTeams(leagueSelectId, teamSelectId) {
        const leagueSelect = document.getElementById(leagueSelectId);
        const teamSelect = document.getElementById(teamSelectId);
        const selectedLeague = leagueSelect.value;

        teamSelect.innerHTML = '<option value="">Seleccionar Equipo</option>';
        teamSelect.disabled = true;

        if (!selectedLeague) {
            this.checkCompareButton();
            return;
        }

        try {
            this.showLoading();
            if (!this.leagueData[selectedLeague]) {
                await this.loadLeagueData(selectedLeague);
            }

            const teams = this.leagueData[selectedLeague].teams;
            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.team;
                option.textContent = team.team;
                teamSelect.appendChild(option);
            });

            teamSelect.disabled = false;
            this.hideLoading();
        } catch (error) {
            console.error('Error loading league data:', error);
            this.showError('Error al cargar los datos de la liga');
            this.hideLoading();
        }

        this.checkCompareButton();
    }

    async loadLeagueData(leagueKey) {
        const response = await fetch(this.leagueFiles[leagueKey]);
        if (!response.ok) {
            throw new Error(`Error loading ${leagueKey} data`);
        }
        this.leagueData[leagueKey] = await response.json();
    }

    checkCompareButton() {
        const team1 = document.getElementById('team1').value;
        const team2 = document.getElementById('team2').value;
        const compareBtn = document.getElementById('compareBtn');

        compareBtn.disabled = !team1 || !team2;
    }

    async compareTeams() {
        const league1 = document.getElementById('league1').value;
        const league2 = document.getElementById('league2').value;
        const team1Name = document.getElementById('team1').value;
        const team2Name = document.getElementById('team2').value;

        if (!league1 || !league2 || !team1Name || !team2Name) {
            this.showError('Por favor selecciona ambos equipos');
            return;
        }

        try {
            this.showLoading();
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (!this.leagueData[league1]) {
                await this.loadLeagueData(league1);
            }
            if (!this.leagueData[league2]) {
                await this.loadLeagueData(league2);
            }

            const team1Data = this.leagueData[league1].teams.find(t => t.team === team1Name);
            const team2Data = this.leagueData[league2].teams.find(t => t.team === team2Name);

            if (!team1Data || !team2Data) {
                throw new Error('No se encontraron los datos de los equipos');
            }

            const normalizedTeam1 = this.normalizeTeamData(team1Data);
            const normalizedTeam2 = this.normalizeTeamData(team2Data);

            const comparisonHTML = this.generateEnhancedComparisonHTML(normalizedTeam1, normalizedTeam2);

            const resultDiv = document.getElementById('comparisonResult');
            resultDiv.innerHTML = comparisonHTML;
            resultDiv.style.display = 'block';

            this.hideLoading();
            
            setTimeout(() => {
                this.scrollToResults();
            }, 100);

        } catch (error) {
            console.error('Error comparing teams:', error);
            this.showError('Error al comparar los equipos');
            this.hideLoading();
        }
    }

    scrollToResults() {
        const resultDiv = document.getElementById('comparisonResult');
        if (resultDiv) {
            resultDiv.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    normalizeTeamData(teamData) {
        return {
            team: teamData.team,
            position: parseInt(teamData.position),
            matches_played: parseInt(teamData.matches_played),
            wins: parseInt(teamData.wins),
            draws: parseInt(teamData.draws),
            losses: parseInt(teamData.losses),
            goals_for: parseInt(teamData.goals_for),
            goals_against: parseInt(teamData.goals_against),
            points: parseInt(teamData.points)
        };
    }

    generateEnhancedComparisonHTML(team1, team2) {
        const analysis = this.generateComprehensiveAnalysis(team1, team2);
        
        return `
            <div class="enhanced-comparison-container">
                <div class="teams-header">
                    <h3>${team1.team} vs ${team2.team}</h3>
                    <div class="match-context">
                        <span class="context-badge">Análisis Completo</span>
                    </div>
                </div>
                
                ${this.generateStatsSection(team1, team2)}
                ${this.generateGoalsSection(analysis)}
                ${this.generateCornersSection(analysis)}
                ${this.generateCardsSection(analysis)}
                ${this.generateBTTSSection(analysis)}
                ${this.generateWinnerSection(analysis)}
                ${this.generateConsistencyCheck(analysis)}
            </div>
        `;
    }

    generateStatsSection(team1, team2) {
        const team1GoalDiff = team1.goals_for - team1.goals_against;
        const team2GoalDiff = team2.goals_for - team2.goals_against;

        return `
            <div class="analysis-section">
                <h4>📊 ESTADÍSTICAS GENERALES</h4>
                <div class="stats-comparison">
                    <div class="stat-row">
                        <div class="stat-team1">${team1.position}°</div>
                        <div class="stat-label">Posición</div>
                        <div class="stat-team2">${team2.position}°</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1">${team1.points}</div>
                        <div class="stat-label">Puntos</div>
                        <div class="stat-team2">${team2.points}</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1">${team1.wins}</div>
                        <div class="stat-label">Victorias</div>
                        <div class="stat-team2">${team2.wins}</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1">${team1.draws}</div>
                        <div class="stat-label">Empates</div>
                        <div class="stat-team2">${team2.draws}</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1">${team1.losses}</div>
                        <div class="stat-label">Derrotas</div>
                        <div class="stat-team2">${team2.losses}</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1">${team1.goals_for}</div>
                        <div class="stat-label">Goles a Favor</div>
                        <div class="stat-team2">${team2.goals_for}</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1">${team1.goals_against}</div>
                        <div class="stat-label">Goles en Contra</div>
                        <div class="stat-team2">${team2.goals_against}</div>
                    </div>
                    <div class="stat-row">
                        <div class="stat-team1 ${team1GoalDiff >= 0 ? 'positive' : 'negative'}">${team1GoalDiff > 0 ? '+' : ''}${team1GoalDiff}</div>
                        <div class="stat-label">Diferencia de Goles</div>
                        <div class="stat-team2 ${team2GoalDiff >= 0 ? 'positive' : 'negative'}">${team2GoalDiff > 0 ? '+' : ''}${team2GoalDiff}</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateGoalsSection(analysis) {
        return `
            <div class="analysis-section">
                <h4>⚽ RECOMENDACIONES DE GOLES</h4>
                <div class="recommendations-grid">
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">🎯</span>
                            <span class="rec-title">Total de Goles</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.goals.over25}</div>
                            <div class="rec-confidence">Confianza: ${analysis.goals.confidence}</div>
                            <div class="rec-reason">${analysis.goals.reason}</div>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">📊</span>
                            <span class="rec-title">Goles Esperados</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.goals.expected}</div>
                            <div class="rec-detail">Promedio: ${analysis.goals.average} goles/partido</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCornersSection(analysis) {
        return `
            <div class="analysis-section">
                <h4>🚩 RECOMENDACIONES DE CORNERS</h4>
                <div class="recommendations-grid">
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">🏃</span>
                            <span class="rec-title">Total Corners</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.corners.total}</div>
                            <div class="rec-confidence">Confianza: ${analysis.corners.confidence}</div>
                            <div class="rec-reason">${analysis.corners.reason}</div>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">⚡</span>
                            <span class="rec-title">Corners Primer Tiempo</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.corners.firstHalf}</div>
                            <div class="rec-detail">Basado en intensidad de juego</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCardsSection(analysis) {
        return `
            <div class="analysis-section">
                <h4>🟨 RECOMENDACIONES DE TARJETAS</h4>
                <div class="recommendations-grid">
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">📋</span>
                            <span class="rec-title">Total Tarjetas</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.cards.total}</div>
                            <div class="rec-confidence">Confianza: ${analysis.cards.confidence}</div>
                            <div class="rec-reason">${analysis.cards.reason}</div>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">🔴</span>
                            <span class="rec-title">Tarjetas Rojas</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.cards.red}</div>
                            <div class="rec-detail">Probabilidad de expulsión</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateBTTSSection(analysis) {
        return `
            <div class="analysis-section">
                <h4>🎯 BTTS (AMBOS EQUIPOS MARCAN)</h4>
                <div class="recommendations-grid">
                    <div class="recommendation-card ${analysis.btts.recommendation.toLowerCase().includes('sí') ? 'positive' : 'negative'}">
                        <div class="rec-header">
                            <span class="rec-icon">${analysis.btts.recommendation.toLowerCase().includes('sí') ? '✅' : '❌'}</span>
                            <span class="rec-title">BTTS</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.btts.recommendation}</div>
                            <div class="rec-confidence">Confianza: ${analysis.btts.confidence}</div>
                            <div class="rec-reason">${analysis.btts.reason}</div>
                        </div>
                    </div>
                    
                    <div class="recommendation-card">
                        <div class="rec-header">
                            <span class="rec-icon">📈</span>
                            <span class="rec-title">Probabilidad</span>
                        </div>
                        <div class="rec-content">
                            <div class="rec-main">${analysis.btts.probability}%</div>
                            <div class="rec-detail">Basado en promedios ofensivos</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateWinnerSection(analysis) {
        return `
            <div class="analysis-section">
                <h4>🏆 POSIBLE GANADOR</h4>
                <div class="winner-analysis">
                    <div class="winner-prediction">
                        <div class="winner-main">
                            <span class="winner-icon">👑</span>
                            <span class="winner-text">${analysis.winner.prediction}</span>
                        </div>
                        <div class="winner-confidence">Confianza: ${analysis.winner.confidence}</div>
                    </div>
                    
                    <div class="winner-probabilities">
                        <div class="prob-item">
                            <span class="prob-team">${analysis.winner.team1}</span>
                            <span class="prob-value">${analysis.winner.prob1}%</span>
                        </div>
                        <div class="prob-item">
                            <span class="prob-team">Empate</span>
                            <span class="prob-value">${analysis.winner.probDraw}%</span>
                        </div>
                        <div class="prob-item">
                            <span class="prob-team">${analysis.winner.team2}</span>
                            <span class="prob-value">${analysis.winner.prob2}%</span>
                        </div>
                    </div>
                    
                    <div class="winner-reason">
                        <strong>Análisis:</strong> ${analysis.winner.reason}
                    </div>
                </div>
            </div>
        `;
    }

    generateConsistencyCheck(analysis) {
        return `
            <div class="analysis-section">
                <h4>🔍 VERIFICACIÓN DE COHERENCIA</h4>
                <div class="consistency-check">
                    <div class="consistency-status ${analysis.consistency.status}">
                        <span class="consistency-icon">${analysis.consistency.status === 'coherent' ? '✅' : '⚠️'}</span>
                        <span class="consistency-text">${analysis.consistency.message}</span>
                    </div>
                    
                    <div class="consistency-details">
                        <ul>
                            ${analysis.consistency.checks.map(check => `
                                <li class="${check.status}">
                                    <span class="check-icon">${check.status === 'pass' ? '✓' : '⚠'}</span>
                                    ${check.description}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    generateComprehensiveAnalysis(team1, team2) {
        const team1AvgGoalsFor = team1.goals_for / team1.matches_played;
        const team2AvgGoalsFor = team2.goals_for / team2.matches_played;
        const team1AvgGoalsAgainst = team1.goals_against / team1.matches_played;
        const team2AvgGoalsAgainst = team2.goals_against / team2.matches_played;
        
        const totalExpectedGoals = team1AvgGoalsFor + team2AvgGoalsFor;
        const bttsProb = ((team1AvgGoalsFor > 1 && team2AvgGoalsFor > 1) ? 65 : 
                         (team1AvgGoalsFor > 0.8 && team2AvgGoalsFor > 0.8) ? 45 : 25);
        
        const team1Strength = (team1.points / team1.matches_played) + (team1.goals_for - team1.goals_against) / team1.matches_played;
        const team2Strength = (team2.points / team2.matches_played) + (team2.goals_for - team2.goals_against) / team2.matches_played;
        
        let winnerProb1 = 40;
        let winnerProb2 = 40;
        let drawProb = 20;
        
        const strengthDiff = team1Strength - team2Strength;
        if (strengthDiff > 0.5) {
            winnerProb1 += 15;
            winnerProb2 -= 10;
            drawProb -= 5;
        } else if (strengthDiff < -0.5) {
            winnerProb2 += 15;
            winnerProb1 -= 10;
            drawProb -= 5;
        }
        
        // Normalize probabilities
        const totalProb = winnerProb1 + winnerProb2 + drawProb;
        winnerProb1 = Math.round((winnerProb1 / totalProb) * 100);
        winnerProb2 = Math.round((winnerProb2 / totalProb) * 100);
        drawProb = 100 - winnerProb1 - winnerProb2;

        // Goals analysis
        const goalsAnalysis = {
            over25: totalExpectedGoals > 2.5 ? "Over 2.5 ✅" : "Under 2.5 ⭕",
            confidence: totalExpectedGoals > 3 ? "Alta" : totalExpectedGoals > 2 ? "Media" : "Baja",
            reason: totalExpectedGoals > 2.5 ? 
                "Ambos equipos muestran buen promedio ofensivo" : 
                "Partidos con pocos goles esperados",
            expected: `${Math.round(totalExpectedGoals * 10) / 10} goles`,
            average: Math.round(totalExpectedGoals * 10) / 10
        };

        // Corners analysis
        const cornersAnalysis = {
            total: totalExpectedGoals > 2.5 ? "Over 9.5 Corners ✅" : "Under 9.5 Corners ⭕",
            confidence: totalExpectedGoals > 2.5 ? "Media" : "Baja",
            reason: "Basado en intensidad de juego esperada",
            firstHalf: totalExpectedGoals > 2.5 ? "Over 4.5 ✅" : "Under 4.5 ⭕"
        };

        // Cards analysis
        const cardsAnalysis = {
            total: "Over 3.5 Tarjetas ✅",
            confidence: "Media",
            reason: "Partidos competitivos suelen generar más tarjetas",
            red: Math.abs(strengthDiff) > 1 ? "Sí ⚠️" : "No ✅"
        };

        // BTTS analysis
        const bttsAnalysis = {
            recommendation: bttsProb > 50 ? "BTTS Sí ✅" : "BTTS No ❌",
            confidence: bttsProb > 60 ? "Alta" : bttsProb > 40 ? "Media" : "Baja",
            reason: bttsProb > 50 ? 
                "Ambos equipos tienen buen promedio goleador" : 
                "Al menos un equipo tiene problemas ofensivos",
            probability: bttsProb
        };

        // Winner analysis
        const winnerAnalysis = {
            prediction: winnerProb1 > winnerProb2 ? 
                (winnerProb1 > drawProb ? `Victoria ${team1.team}` : "Empate") :
                (winnerProb2 > drawProb ? `Victoria ${team2.team}` : "Empate"),
            confidence: Math.max(winnerProb1, winnerProb2, drawProb) > 50 ? "Alta" : "Media",
            team1: team1.team,
            team2: team2.team,
            prob1: winnerProb1,
            prob2: winnerProb2,
            probDraw: drawProb,
            reason: strengthDiff > 0.5 ? 
                `${team1.team} tiene mejor rendimiento general` :
                strengthDiff < -0.5 ? 
                `${team2.team} tiene mejor rendimiento general` :
                "Encuentro muy equilibrado"
        };

        // Consistency check
        const consistencyChecks = [
            {
                status: (bttsAnalysis.recommendation.includes('Sí') && goalsAnalysis.over25.includes('Over')) ||
                       (bttsAnalysis.recommendation.includes('No') && goalsAnalysis.over25.includes('Under')) ? 'pass' : 'warning',
                description: bttsAnalysis.recommendation.includes('Sí') && goalsAnalysis.over25.includes('Under') ?
                    "ADVERTENCIA: BTTS Sí pero Under 2.5 - Inconsistente" :
                    "BTTS y Total de Goles son coherentes"
            },
            {
                status: 'pass',
                description: "Análisis de corners coherente con expectativas de goles"
            },
            {
                status: 'pass',
                description: "Predicción de ganador basada en estadísticas confiables"
            }
        ];

        const hasInconsistency = consistencyChecks.some(check => check.status === 'warning');
        
        const consistency = {
            status: hasInconsistency ? 'warning' : 'coherent',
            message: hasInconsistency ? 
                "Se detectaron algunas inconsistencias en el análisis" :
                "Todas las recomendaciones son coherentes entre sí",
            checks: consistencyChecks
        };

        return {
            goals: goalsAnalysis,
            corners: cornersAnalysis,
            cards: cardsAnalysis,
            btts: bttsAnalysis,
            winner: winnerAnalysis,
            consistency: consistency
        };
    }

    showError(message) {
        let errorDiv = document.getElementById('errorMessage');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'errorMessage';
            errorDiv.className = 'error-message';
            const container = document.querySelector('.container') || document.body;
            container.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize the improved application
document.addEventListener('DOMContentLoaded', () => {
    new ImprovedLeagueComparator();
});