// NBA Standings Script - Versión Corregida
class NBAStandingsManager {
    constructor() {
        this.standings = null;
        this.currentConference = 'Eastern Conference';

        // Logos de los equipos
        this.teamLogos = {
            'Boston Celtics': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
            'Brooklyn Nets': 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
            'New York Knicks': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
            'Philadelphia 76ers': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
            'Toronto Raptors': 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
            'Chicago Bulls': 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
            'Cleveland Cavaliers': 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
            'Detroit Pistons': 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
            'Indiana Pacers': 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
            'Milwaukee Bucks': 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
            'Atlanta Hawks': 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
            'Charlotte Hornets': 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
            'Miami Heat': 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
            'Orlando Magic': 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
            'Washington Wizards': 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg',
            'Denver Nuggets': 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
            'Minnesota Timberwolves': 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
            'Oklahoma City Thunder': 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
            'Portland Trail Blazers': 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
            'Utah Jazz': 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
            'Golden State Warriors': 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
            'LA Clippers': 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
            'Los Angeles Lakers': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
            'Phoenix Suns': 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
            'Sacramento Kings': 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
            'Dallas Mavericks': 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
            'Houston Rockets': 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
            'Memphis Grizzlies': 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
            'New Orleans Pelicans': 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
            'San Antonio Spurs': 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg'
        };

        this.init();
    }

    async init() {
        try {
            await this.loadStandings();
            this.setupEventListeners();
            this.showStandings();
        } catch (error) {
            console.error('Error al inicializar las estadísticas:', error);
            this.showErrorMessage('No se pudieron cargar las estadísticas. Por favor, verifica que el archivo nba_standings.json existe y está accesible.');
        }
    }

    async loadStandings() {
        // Array de posibles rutas para buscar el archivo JSON
        const possiblePaths = [
            './public/static/nba_standings.json',
            'public/static/nba_standings.json',
            './static/nba_standings.json',
            'static/nba_standings.json',
            './nba_standings.json',
            'nba_standings.json',
            './data/nba_standings.json',
            'data/nba_standings.json'
        ];

        console.log('Intentando cargar estadísticas desde múltiples rutas...');

        for (const path of possiblePaths) {
            try {
                console.log(`Intentando cargar desde: ${path}`);
                const response = await fetch(path);
                
                if (response.ok) {
                    this.standings = await response.json();
                    console.log(`✅ Estadísticas cargadas correctamente desde: ${path}`, this.standings);
                    return; // Salir del bucle si se carga exitosamente
                } else {
                    console.log(`❌ Error ${response.status} al cargar desde: ${path}`);
                }
            } catch (error) {
                console.log(`❌ Error de red al cargar desde ${path}:`, error.message);
            }
        }

        // Si llegamos aquí, ninguna ruta funcionó
        throw new Error('No se pudo encontrar el archivo nba_standings.json en ninguna de las rutas esperadas');
    }

    showErrorMessage(message) {
        // Mostrar mensaje de error en la interfaz
        const errorContainer = document.createElement('div');
        errorContainer.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 20px;
                border-radius: 10px;
                margin: 20px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            ">
                <h3>⚠️ Error al cargar datos</h3>
                <p>${message}</p>
                <details style="margin-top: 15px; text-align: left;">
                    <summary style="cursor: pointer; font-weight: bold;">🔧 Soluciones posibles:</summary>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li>Verifica que el archivo <code>nba_standings.json</code> existe</li>
                        <li>Asegúrate que esté en una de estas rutas:
                            <ul>
                                <li><code>./public/static/nba_standings.json</code></li>
                                <li><code>./static/nba_standings.json</code></li>
                                <li><code>./data/nba_standings.json</code></li>
                                <li><code>./nba_standings.json</code></li>
                            </ul>
                        </li>
                        <li>Si usas un servidor local, asegúrate que esté corriendo</li>
                        <li>Revisa la consola del navegador para más detalles</li>
                    </ul>
                </details>
                <button onclick="location.reload()" style="
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">🔄 Reintentar</button>
            </div>
        `;

        // Insertar el mensaje de error en el contenedor apropiado
        const standingsContainer = document.getElementById('standings-container') || document.body;
        standingsContainer.insertBefore(errorContainer, standingsContainer.firstChild);
    }

    setupEventListeners() {
        // Botón de estadísticas
        const standingsButton = document.getElementById('standings-button');
        standingsButton?.addEventListener('click', () => this.showStandingsSection());

        // Botones de regreso
        const backButton = document.getElementById('back-button');
        backButton?.addEventListener('click', () => this.showMainContent());

        // Botones de conferencia
        const easternBtn = document.getElementById('eastern-btn');
        const westernBtn = document.getElementById('western-btn');

        easternBtn?.addEventListener('click', () => this.switchConference('Eastern Conference'));
        westernBtn?.addEventListener('click', () => this.switchConference('Western Conference'));

        // Selectores de equipos para comparación
        const team1Select = document.getElementById('team1-select-nba');
        const team2Select = document.getElementById('team2-select-nba');
        const compareBtn = document.getElementById('compare-btn-nba');

        team1Select?.addEventListener('change', (e) => this.handleTeamSelectChange(e));
        team2Select?.addEventListener('change', (e) => this.handleTeamSelectChange(e));
        compareBtn?.addEventListener('click', () => this.compareTeams());
    }

    handleTeamSelectChange(e) {
        if (e.target.id === 'team1-select-nba' || e.target.id === 'team2-select-nba') {
            this.updateCompareButton();
        }
    }

    showStandingsSection() {
        // Ocultar otras secciones
        const mainContent = document.getElementById('main-content');
        const playerContainer = document.getElementById('player-container');
        const gamesContainer = document.getElementById('games-container');
        
        if (mainContent) mainContent.style.display = 'none';
        if (playerContainer) playerContainer.style.display = 'none';
        if (gamesContainer) gamesContainer.style.display = 'none';

        // Mostrar sección de estadísticas
        const standingsContainer = document.getElementById('standings-container');
        const backButton = document.getElementById('back-button');
        
        if (standingsContainer) standingsContainer.style.display = 'block';
        if (backButton) backButton.style.display = 'inline-block';

        this.populateTeamSelectors();
    }

    showMainContent() {
        // Mostrar contenido principal
        const mainContent = document.getElementById('main-content');
        if (mainContent) mainContent.style.display = 'block';

        // Ocultar otras secciones
        const standingsContainer = document.getElementById('standings-container');
        const playerContainer = document.getElementById('player-container');
        const gamesContainer = document.getElementById('games-container');
        const backButton = document.getElementById('back-button');

        if (standingsContainer) standingsContainer.style.display = 'none';
        if (playerContainer) playerContainer.style.display = 'none';
        if (gamesContainer) gamesContainer.style.display = 'none';
        if (backButton) backButton.style.display = 'none';
    }

    switchConference(conference) {
        this.currentConference = conference;

        // Actualizar botones activos
        const easternBtn = document.getElementById('eastern-btn');
        const westernBtn = document.getElementById('western-btn');

        easternBtn?.classList.toggle('active', conference === 'Eastern Conference');
        westernBtn?.classList.toggle('active', conference === 'Western Conference');

        this.showStandings();
    }

    showStandings() {
        if (!this.standings) {
            console.warn('No hay datos de estadísticas disponibles');
            return;
        }

        const tbody = document.getElementById('standings-tbody');
        if (!tbody) {
            console.warn('No se encontró el elemento standings-tbody');
            return;
        }

        tbody.innerHTML = '';
        const conferenceData = this.standings[this.currentConference];
        
        if (!conferenceData) {
            console.warn(`No se encontraron datos para la conferencia: ${this.currentConference}`);
            return;
        }

        conferenceData.forEach(team => {
            const row = document.createElement('tr');

            // Calcular diferencia de puntos
            const pointsDiff = (parseFloat(team.points_for) - parseFloat(team.points_against)).toFixed(1);
            const diffColor = pointsDiff > 0 ? '#4CAF50' : '#f44336';

            row.innerHTML = `
                <td class="position">${team.position}</td>
                <td class="team-name">${team.team}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td class="win-percentage">${team.win_percentage}%</td>
                <td>${team.points_for}</td>
                <td>${team.points_against}</td>
                <td style="color: ${diffColor};">${pointsDiff > 0 ? '+' : ''}${pointsDiff}</td>
            `;

            tbody.appendChild(row);
        });
    }

    populateTeamSelectors() {
        const team1Select = document.getElementById('team1-select-nba');
        const team2Select = document.getElementById('team2-select-nba');

        if (!team1Select || !team2Select || !this.standings) return;

        // Limpiar opciones existentes
        team1Select.innerHTML = '<option value="">Seleccionar Equipo 1</option>';
        team2Select.innerHTML = '<option value="">Seleccionar Equipo 2</option>';

        // Agregar equipos de ambas conferencias
        const allTeams = [
            ...this.standings['Eastern Conference'],
            ...this.standings['Western Conference']
        ];

        allTeams.forEach(team => {
            const option1 = document.createElement('option');
            option1.value = team.team;
            option1.textContent = team.team;
            team1Select.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = team.team;
            option2.textContent = team.team;
            team2Select.appendChild(option2);
        });
    }

    updateCompareButton() {
        const team1Select = document.getElementById('team1-select-nba');
        const team2Select = document.getElementById('team2-select-nba');
        const compareBtn = document.getElementById('compare-btn-nba');

        if (!team1Select || !team2Select || !compareBtn) return;

        const team1Selected = team1Select.value !== '';
        const team2Selected = team2Select.value !== '';
        const differentTeams = team1Select.value !== team2Select.value;

        compareBtn.disabled = !(team1Selected && team2Selected && differentTeams);
    }

    compareTeams() {
        const team1Select = document.getElementById('team1-select-nba');
        const team2Select = document.getElementById('team2-select-nba');
        const comparisonContainer = document.getElementById('comparison-container-nba');
        const comparisonContent = document.getElementById('comparison-content-nba');

        if (!team1Select || !team2Select || !comparisonContainer || !comparisonContent) return;

        const team1Name = team1Select.value;
        const team2Name = team2Select.value;

        // Buscar datos de los equipos
        const team1Data = this.findTeamData(team1Name);
        const team2Data = this.findTeamData(team2Name);

        if (!team1Data || !team2Data) {
            alert('Error: No se pudieron encontrar los datos de los equipos seleccionados.');
            return;
        }

        // Generar comparación
        comparisonContent.innerHTML = this.generateComparisonHTML(team1Data, team2Data);
        comparisonContainer.style.display = 'block';

        // Hacer scroll hacia la comparación con offset adicional
        setTimeout(() => {
            const rect = comparisonContainer.getBoundingClientRect();
            const offset = 60; // Espacio adicional hacia arriba
            window.scrollTo({
                top: window.pageYOffset + rect.top - offset,
                behavior: 'smooth'
            });
        }, 100);
    }

    findTeamData(teamName) {
        if (!this.standings) return null;

        // Buscar en conferencia este
        let teamData = this.standings['Eastern Conference']?.find(team => team.team === teamName);

        // Si no se encuentra, buscar en conferencia oeste
        if (!teamData) {
            teamData = this.standings['Western Conference']?.find(team => team.team === teamName);
        }

        return teamData;
    }

    // Función para obtener el logo del equipo
    getTeamLogo(teamName) {
        return this.teamLogos[teamName] || 'https://cdn.nba.com/logos/nba/nba-logo.svg'; // Logo por defecto de la NBA
    }

    // Nueva función para generar comentarios comparativos
    generateComparisonComment(team1, team2) {
        const team1Wins = parseInt(team1.wins);
        const team2Wins = parseInt(team2.wins);
        const team1WinPct = parseFloat(team1.win_percentage);
        const team2WinPct = parseFloat(team2.win_percentage);
        const team1Diff = parseFloat(team1.points_for) - parseFloat(team1.points_against);
        const team2Diff = parseFloat(team2.points_for) - parseFloat(team2.points_against);
        const team1Position = parseInt(team1.position);
        const team2Position = parseInt(team2.position);
        let comment = "";
        let winnerTeam = "";
        let analysis = [];

        // Determinar el equipo dominante
        if (team1WinPct > team2WinPct) {
            winnerTeam = team1.team;
        } else if (team2WinPct > team1WinPct) {
            winnerTeam = team2.team;
        }

        // Análisis de rendimiento general
        const winPctDiff = Math.abs(team1WinPct - team2WinPct);
        if (winPctDiff > 20) {
            analysis.push(`${winnerTeam} tiene una ventaja significativa con ${winPctDiff.toFixed(1)}% más de efectividad`);
        } else if (winPctDiff > 10) {
            analysis.push(`${winnerTeam} mantiene una ventaja sólida en porcentaje de victorias`);
        } else if (winPctDiff > 5) {
            analysis.push("Los equipos muestran un rendimiento bastante equilibrado");
        } else {
            analysis.push("Ambos equipos tienen un rendimiento muy similar");
        }

        // Análisis ofensivo/defensivo
        const team1OffRating = parseFloat(team1.points_for);
        const team2OffRating = parseFloat(team2.points_for);
        const team1DefRating = parseFloat(team1.points_against);
        const team2DefRating = parseFloat(team2.points_against);

        if (team1OffRating > team2OffRating && team1DefRating < team2DefRating) {
            analysis.push(`${team1.team} domina tanto en ataque como en defensa`);
        } else if (team2OffRating > team1OffRating && team2DefRating < team1DefRating) {
            analysis.push(`${team2.team} domina tanto en ataque como en defensa`);
        } else {
            if (Math.abs(team1OffRating - team2OffRating) > 5) {
                const betterOffense = team1OffRating > team2OffRating ? team1.team : team2.team;
                analysis.push(`${betterOffense} tiene ventaja ofensiva significativa`);
            }
            if (Math.abs(team1DefRating - team2DefRating) > 5) {
                const betterDefense = team1DefRating < team2DefRating ? team1.team : team2.team;
                analysis.push(`${betterDefense} muestra mejor defensa`);
            }
        }

        // Análisis de posición en standings
        const positionDiff = Math.abs(team1Position - team2Position);
        if (positionDiff > 10) {
            const higherTeam = team1Position < team2Position ? team1.team : team2.team;
            analysis.push(`${higherTeam} está considerablemente mejor posicionado en la tabla`);
        } else if (positionDiff > 5) {
            const higherTeam = team1Position < team2Position ? team1.team : team2.team;
            analysis.push(`${higherTeam} tiene una posición ligeramente mejor`);
        }

        // Análisis de diferencial de puntos
        if (team1Diff > 5 && team2Diff < 0) {
            analysis.push(`${team1.team} tiene un diferencial positivo sólido mientras ${team2.team} lucha por equilibrar su juego`);
        } else if (team2Diff > 5 && team1Diff < 0) {
            analysis.push(`${team2.team} tiene un diferencial positivo sólido mientras ${team1.team} lucha por equilibrar su juego`);
        }

        // Construir comentario final
        if (analysis.length > 0) {
            comment = `
                <div class="comparison-analysis">
                    <h5>📊 Análisis Comparativo</h5>
                    <p>${analysis.join('. ')}.</p>
                    ${this.getMatchupPrediction(team1, team2)}
                </div>
            `;
        }

        return comment;
    }

    // Función para generar predicción de enfrentamiento
    getMatchupPrediction(team1, team2) {
        const team1WinPct = parseFloat(team1.win_percentage);
        const team2WinPct = parseFloat(team2.win_percentage);
        const team1Diff = parseFloat(team1.points_for) - parseFloat(team1.points_against);
        const team2Diff = parseFloat(team2.points_for) - parseFloat(team2.points_against);
        let prediction = "";
        let favoritePct = 0;
        let favoriteTeam = "";

        // Calcular favorito basado en múltiples factores
        let team1Score = 0;
        let team2Score = 0;

        // Factor 1: Porcentaje de victorias
        team1Score += team1WinPct;
        team2Score += team2WinPct;

        // Factor 2: Diferencial de puntos (normalizado)
        team1Score += team1Diff * 2;
        team2Score += team2Diff * 2;

        // Factor 3: Posición (invertida, menor posición = mejor)
        team1Score += (16 - parseInt(team1.position)) * 2;
        team2Score += (16 - parseInt(team2.position)) * 2;

        if (team1Score > team2Score) {
            favoriteTeam = team1.team;
            favoritePct = Math.min(65, 50 + ((team1Score - team2Score) / team1Score * 15));
        } else {
            favoriteTeam = team2.team;
            favoritePct = Math.min(65, 50 + ((team2Score - team1Score) / team2Score * 15));
        }

        prediction = `
            <div class="matchup-prediction">
                <p><strong>🏀 En un enfrentamiento directo:</strong></p>
                <p>${favoriteTeam} sería favorito con ${favoritePct.toFixed(0)}% de probabilidades de victoria</p>
            </div>
        `;

        return prediction;
    }

    generateComparisonHTML(team1, team2) {
        const getWinnerClass = (value1, value2, higherIsBetter = true) => {
            const val1 = parseFloat(value1);
            const val2 = parseFloat(value2);

            if (val1 === val2) return '';

            if (higherIsBetter) {
                return val1 > val2 ? 'winner' : 'loser';
            } else {
                return val1 < val2 ? 'winner' : 'loser';
            }
        };

        const team1Diff = (parseFloat(team1.points_for) - parseFloat(team1.points_against)).toFixed(1);
        const team2Diff = (parseFloat(team2.points_for) - parseFloat(team2.points_against)).toFixed(1);

        // Obtener los logos de los equipos
        const team1Logo = this.getTeamLogo(team1.team);
        const team2Logo = this.getTeamLogo(team2.team);

        // Generar comentario comparativo
        const comparisonComment = this.generateComparisonComment(team1, team2);

        return `
            ${comparisonComment}

            <div class="teams-comparison-wrapper">
                <div class="team-comparison-card">
                    <div class="team-header">
                        <img src="${team1Logo}" alt="${team1.team} logo" class="team-logo" onerror="this.src='https://cdn.nba.com/logos/nba/nba-logo.svg'">
                        <h4>${team1.team}</h4>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Posición:</span>
                        <span class="stat-value ${getWinnerClass(team1.position, team2.position, false)}">#${team1.position}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Victorias:</span>
                        <span class="stat-value ${getWinnerClass(team1.wins, team2.wins)}">${team1.wins}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Derrotas:</span>
                        <span class="stat-value ${getWinnerClass(team1.losses, team2.losses, false)}">${team1.losses}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">% Victorias:</span>
                        <span class="stat-value ${getWinnerClass(team1.win_percentage, team2.win_percentage)}">${team1.win_percentage}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Puntos a Favor:</span>
                        <span class="stat-value ${getWinnerClass(team1.points_for, team2.points_for)}">${team1.points_for}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Puntos en Contra:</span>
                        <span class="stat-value ${getWinnerClass(team1.points_against, team2.points_against, false)}">${team1.points_against}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Diferencia:</span>
                        <span class="stat-value ${getWinnerClass(team1Diff, team2Diff)}">${team1Diff > 0 ? '+' : ''}${team1Diff}</span>
                    </div>
                </div>

                <div class="vs-divider">
                    VS
                </div>

                <div class="team-comparison-card">
                    <div class="team-header">
                        <img src="${team2Logo}" alt="${team2.team} logo" class="team-logo" onerror="this.src='https://cdn.nba.com/logos/nba/nba-logo.svg'">
                        <h4>${team2.team}</h4>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Posición:</span>
                        <span class="stat-value ${getWinnerClass(team2.position, team1.position, false)}">#${team2.position}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Victorias:</span>
                        <span class="stat-value ${getWinnerClass(team2.wins, team1.wins)}">${team2.wins}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Derrotas:</span>
                        <span class="stat-value ${getWinnerClass(team2.losses, team1.losses, false)}">${team2.losses}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">% Victorias:</span>
                        <span class="stat-value ${getWinnerClass(team2.win_percentage, team1.win_percentage)}">${team2.win_percentage}%</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Puntos a Favor:</span>
                        <span class="stat-value ${getWinnerClass(team2.points_for, team1.points_for)}">${team2.points_for}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Puntos en Contra:</span>
                        <span class="stat-value ${getWinnerClass(team2.points_against, team1.points_against, false)}">${team2.points_against}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Diferencia:</span>
                        <span class="stat-value ${getWinnerClass(team2Diff, team1Diff)}">${team2Diff > 0 ? '+' : ''}${team2Diff}</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// CSS adicional para los estilos de comparación
const additionalStyles = `
    .winner {
        color: #4CAF50 !important;
        font-weight: bold;
    }

    .loser {
        color: #f44336 !important;
    }

    .stat-row {
        transition: background-color 0.3s ease;
    }

    .stat-row:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .team-comparison-card {
        transition: transform 0.3s ease;
    }

    .team-comparison-card:hover {
        transform: translateY(-2px);
    }

    .team-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .team-logo {
        width: 50px;
        height: 50px;
        object-fit: contain;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .team-header h4 {
        margin: 0;
        font-size: 1.2em;
        font-weight: bold;
    }

    .comparison-analysis {
        background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(80, 200, 120, 0.1));
        border: 1px solid rgba(74, 144, 226, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 25px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .comparison-analysis h5 {
        margin: 0 0 15px 0;
        color: #4A90E2;
        font-size: 1.1em;
        font-weight: bold;
    }

    .comparison-analysis p {
        margin: 0 0 10px 0;
        line-height: 1.6;
        color: #e0e0e0;
    }

    .matchup-prediction {
        background: rgba(255, 193, 7, 0.1);
        border: 1px solid rgba(255, 193, 7, 0.3);
        border-radius: 8px;
        padding: 15px;
        margin-top: 15px;
    }

    .matchup-prediction p {
        margin: 5px 0;
        color: #FFC107;
        font-size: 0.95em;
    }

    .matchup-prediction strong {
        color: #FFD54F;
    }

    .teams-comparison-wrapper {
        display: flex;
        gap: 20px;
        align-items: stretch;
        justify-content: center;
        flex-wrap: wrap;
    }

    .vs-divider {
        display: flex;
        align-items: center;
        font-size: 2em;
        font-weight: bold;
        color: #4A90E2;
        background: linear-gradient(135deg, #4A90E2, #50C878);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        min-height: 100px;
    }

    @media (max-width: 768px) {
        .teams-comparison-wrapper {
            flex-direction: column;
            align-items: center;
        }

        .vs-divider {
            min-height: auto;
            padding: 20px 0;
        }
    }
`;

// Inyectar estilos adicionales solo si no existen
if (!document.getElementById('nba-comparison-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'nba-comparison-styles';
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}

// Verificar si el manager ya está inicializado
if (typeof window.nbaStandingsManager === 'undefined') {
    // Inicializar el gestor de estadísticas cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.nbaStandingsManager = new NBAStandingsManager();
        });
    } else {
        window.nbaStandingsManager = new NBAStandingsManager();
    }
}