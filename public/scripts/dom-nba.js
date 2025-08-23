// Función para mostrar sugerencias de apuestas
function mostrarSugerencias() {
    const sugerenciasDiv = document.getElementById('apuestas-sugerencias');
    sugerenciasDiv.innerHTML = '';
    if (selectedLocalTeam && selectedVisitorTeam) {
        const sugerencia = calcularApuesta(selectedLocalTeam, selectedVisitorTeam);
        const lines = sugerencia.split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'sugerencia-item';
                itemDiv.innerHTML = `<p>${line}</p>`;
                sugerenciasDiv.appendChild(itemDiv);
            }
        });
    } else {
        sugerenciasDiv.innerHTML = "<p>Selecciona ambos equipos para ver las sugerencias.</p>";
    }
}

// Función para cargar equipos
async function loadTeams() {
    try {
        const response = await fetch('static/nba_standings.json');
        const data = await response.json();
        equiposData = data;
        createTeamLogosInterface();
    } catch (error) {
        console.error('Error al cargar los equipos:', error);
    }
}

// Función para crear la interfaz de logos
function createTeamLogosInterface() {
    const localContainer = document.getElementById('local-team-logos');
    const visitorContainer = document.getElementById('visitor-team-logos');
    localContainer.innerHTML = '';
    visitorContainer.innerHTML = '';
    Object.entries(TEAM_LOGOS).forEach(([teamName, logoUrl]) => {
        const localLogoItem = createLogoItem(teamName, logoUrl, 'local');
        localContainer.appendChild(localLogoItem);
        const visitorLogoItem = createLogoItem(teamName, logoUrl, 'visitor');
        visitorContainer.appendChild(visitorLogoItem);
    });
}

// Función para crear un elemento de logo
function createLogoItem(teamName, logoUrl, type) {
    const logoItem = document.createElement('div');
    logoItem.className = 'team-logo-item';
    logoItem.setAttribute('data-team', teamName);
    logoItem.setAttribute('data-type', type);
    logoItem.innerHTML = `
        <img src="${logoUrl}" alt="${teamName}" onerror="this.src='https://via.placeholder.com/60x60/ff6b35/white?text=NBA'">
        <span>${getTeamAbbreviation(teamName)}</span>
    `;
    logoItem.addEventListener('click', () => selectTeam(teamName, type));
    return logoItem;
}

// Función para seleccionar un equipo
function selectTeam(teamName, type) {
    if (type === 'local') {
        document.querySelectorAll('#local-team-logos .team-logo-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`#local-team-logos .team-logo-item[data-team="${teamName}"]`).classList.add('selected');
        selectedLocalTeam = teamName;
    } else {
        document.querySelectorAll('#visitor-team-logos .team-logo-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`#visitor-team-logos .team-logo-item[data-team="${teamName}"]`).classList.add('selected');
        selectedVisitorTeam = teamName;
    }
    updateSelectedTeamsDisplay();
    if (selectedLocalTeam && selectedVisitorTeam) {
        showSuggestionsLoader();
        setTimeout(() => {
            mostrarSugerencias();
            hideSuggestionsLoader();
        }, 2000);
    }
}

// Función para actualizar la visualización de equipos seleccionados
function updateSelectedTeamsDisplay() {
    const selectedTeamsDiv = document.getElementById('selected-teams');
    const localLogo = document.getElementById('selected-local-logo');
    const localName = document.getElementById('selected-local-name');
    const visitorLogo = document.getElementById('selected-visitor-logo');
    const visitorName = document.getElementById('selected-visitor-name');
    if (selectedLocalTeam || selectedVisitorTeam) {
        selectedTeamsDiv.style.display = 'flex';
        if (selectedLocalTeam) {
            localLogo.src = TEAM_LOGOS[selectedLocalTeam];
            localName.textContent = getTeamAbbreviation(selectedLocalTeam);
        } else {
            localLogo.src = '';
            localName.textContent = '-';
        }
        if (selectedVisitorTeam) {
            visitorLogo.src = TEAM_LOGOS[selectedVisitorTeam];
            visitorName.textContent = getTeamAbbreviation(selectedVisitorTeam);
        } else {
            visitorLogo.src = '';
            visitorName.textContent = '-';
        }
    } else {
        selectedTeamsDiv.style.display = 'none';
    }
}

// Función para mostrar/ocultar loader de sugerencias
function showSuggestionsLoader() {
    const loader = document.getElementById('suggestions-loader');
    const suggestions = document.getElementById('apuestas-sugerencias');
    if (loader) loader.style.display = 'block';
    if (suggestions) suggestions.style.display = 'none';
}

function hideSuggestionsLoader() {
    const loader = document.getElementById('suggestions-loader');
    const suggestions = document.getElementById('apuestas-sugerencias');
    if (loader) loader.style.display = 'none';
    if (suggestions) suggestions.style.display = 'block';
}

// Función para cargar jugadores
async function loadPlayers() {
    try {
        const response = await fetch('static/nba_player_stats.json');
        const data = await response.json();
        jugadoresData = data.players;
    } catch (error) {
        console.error('Error al cargar los jugadores:', error);
    }
}

// Función para mostrar jugadores
function displayAllPlayers() {
    const playerList = document.getElementById('player-list');
    if (!playerList) return;
    playerList.innerHTML = '';
    jugadoresData.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card');
        playerCard.innerHTML = `
            <img src="${player.team_logo}" alt="${player.equipo}" class="team-logo">
            <div class="player-info">
                <div class="player-name">${player.nombre.replace('\n', ' ')}</div>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value">${player.puntos}</div>
                        <div class="stat-label">Puntos</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${player.rebotes}</div>
                        <div class="stat-label">Rebotes</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${player.asistencias}</div>
                        <div class="stat-label">Asistencias</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${player.partidos}</div>
                        <div class="stat-label">Partidos</div>
                    </div>
                </div>
            </div>
        `;
        playerList.appendChild(playerCard);
    });
}

// Función para mostrar jugadores de un equipo
function displayTeamPlayers(teamName, containerId) {
    const teamAbbr = getTeamAbbreviation(teamName);
    const teamPlayersContainer = document.querySelector(`#${containerId} .team-players-container`);
    const teamPlayers = jugadoresData.filter(player => player.equipo === teamAbbr);
    if (teamPlayers.length > 0) {
        let playersHTML = `
            <div class="team-players">
                <h4>Jugadores del Equipo</h4>
                <div class="players-grid">
        `;
        teamPlayers.forEach(player => {
            playersHTML += `
                <div class="player-mini-card">
                    <div class="player-name">${player.nombre.replace('\n', ' ')}</div>
                    <div class="player-stats">
                        <span>PTS: ${player.puntos}</span>
                        <span>REB: ${player.rebotes}</span>
                        <span>AST: ${player.asistencias}</span>
                    </div>
                </div>
            `;
        });
        playersHTML += `
                </div>
            </div>
        `;
        teamPlayersContainer.innerHTML = playersHTML;
    } else {
        teamPlayersContainer.innerHTML = '<p>No se encontraron jugadores para este equipo.</p>';
    }
}

// Función para cargar juegos
async function loadGames() {
    try {
        const response = await fetch('static/nba_games.json');
        const games = await response.json();
        displayGames(games);
    } catch (error) {
        console.error('Error al cargar los juegos:', error);
    }
}

// Función para mostrar juegos
function displayGames(games) {
    const gamesList = document.getElementById('games-list');
    if (!gamesList) return;
    gamesList.innerHTML = '';
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        const [equipoLocal, equipoVisitante] = game.emparejamiento.split(" @ ");
        const nombreCompletoEquipoLocal = getNombreCompleto(equipoLocal);
        const nombreCompletoEquipoVisitante = getNombreCompleto(equipoVisitante);
        gameCard.innerHTML = `
            <div class="game-info">
                <h4>Hora: <span>${game.hora}</span></h4>
                <h4><span>${nombreCompletoEquipoLocal} @ ${nombreCompletoEquipoVisitante}</span></h4>
                <h4>Resultado: <span>${game.resultado}</span></h4>
                <h4>Ubicación: <span>${game.ubicacion}</span></h4>
            </div>
        `;
        gamesList.appendChild(gameCard);
    });
}

// Event Listeners e Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    await loadTeams();
    await loadPlayers();
    const playersButton = document.getElementById('players-button');
    const gamesButton = document.getElementById('games-button');
    const backButton = document.getElementById('back-button');
    const mainContent = document.getElementById('main-content');
    const playerContainer = document.getElementById('player-container');
    const gamesContainer = document.getElementById('games-container');

    function hideAllSections() {
        if (mainContent) mainContent.style.display = "none";
        if (playerContainer) playerContainer.style.display = "none";
        if (gamesContainer) gamesContainer.style.display = "none";
        if (backButton) backButton.style.display = "none";
    }

    function showSection(section) {
        hideAllSections();
        if (section) section.style.display = "block";
        if (section !== mainContent && backButton) {
            backButton.style.display = "block";
        }
    }

    playersButton?.addEventListener('click', () => {
        showSection(playerContainer);
        displayAllPlayers();
    });

    gamesButton?.addEventListener('click', () => {
        showSection(gamesContainer);
        loadGames();
    });

    backButton?.addEventListener('click', () => {
        showSection(mainContent);
    });

    showSection(mainContent);
});
