// Variables globales
let equiposData = {};
let jugadoresData = [];
let selectedLocalTeam = null;
let selectedVisitorTeam = null;

// Diccionario de equipos
const equipos = {
    "MIL": "Milwaukee Bucks",
    "CLE": "Cleveland Cavaliers",
    "ORL": "Orlando Magic",
    "OKC": "Oklahoma City Thunder",
    "BOS": "Boston Celtics",
    "BKN": "Brooklyn Nets",
    "NYK": "New York Knicks",
    "PHI": "Philadelphia 76ers",
    "TOR": "Toronto Raptors",
    "CHI": "Chicago Bulls",
    "DET": "Detroit Pistons",
    "IND": "Indiana Pacers",
    "ATL": "Atlanta Hawks",
    "MIA": "Miami Heat",
    "CHA": "Charlotte Hornets",
    "WAS": "Washington Wizards",
    "DAL": "Dallas Mavericks",
    "HOU": "Houston Rockets",
    "MEM": "Memphis Grizzlies",
    "NOP": "New Orleans Pelicans",
    "SAS": "San Antonio Spurs",
    "DEN": "Denver Nuggets",
    "MIN": "Minnesota Timberwolves",
    "POR": "Portland Trail Blazers",
    "UTA": "Utah Jazz",
    "GSW": "Golden State Warriors",
    "LAC": "Los Angeles Clippers",
    "LAL": "Los Angeles Lakers",
    "PHX": "Phoenix Suns",
    "SAC": "Sacramento Kings"
};

// TEAM_LOGOS mapping
const TEAM_LOGOS = {
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

// Función para redondear a la mitad más cercana
const roundToHalf = (num) => Math.round(num * 2) / 2;

// Función para obtener la abreviación del equipo
function getTeamAbbreviation(teamName) {
    const teamAbbreviations = {
        'Los Angeles Lakers': 'LAL',
        'Boston Celtics': 'BOS',
        'Brooklyn Nets': 'BKN',
        'New York Knicks': 'NYK',
        'Philadelphia 76ers': 'PHI',
        'Toronto Raptors': 'TOR',
        'Golden State Warriors': 'GSW',
        'LA Clippers': 'LAC',
        'Phoenix Suns': 'PHX',
        'Sacramento Kings': 'SAC',
        'Denver Nuggets': 'DEN',
        'Minnesota Timberwolves': 'MIN',
        'Oklahoma City Thunder': 'OKC',
        'Portland Trail Blazers': 'POR',
        'Utah Jazz': 'UTA',
        'Chicago Bulls': 'CHI',
        'Cleveland Cavaliers': 'CLE',
        'Detroit Pistons': 'DET',
        'Indiana Pacers': 'IND',
        'Milwaukee Bucks': 'MIL',
        'Atlanta Hawks': 'ATL',
        'Charlotte Hornets': 'CHA',
        'Miami Heat': 'MIA',
        'Orlando Magic': 'ORL',
        'Washington Wizards': 'WAS',
        'Dallas Mavericks': 'DAL',
        'Houston Rockets': 'HOU',
        'Memphis Grizzlies': 'MEM',
        'New Orleans Pelicans': 'NOP',
        'San Antonio Spurs': 'SAS'
    };
    return teamAbbreviations[teamName] || teamName;
}

// Función para obtener el nombre completo del equipo
function getNombreCompleto(abreviatura) {
    return equipos[abreviatura] || abreviatura;
}

// Función para buscar datos de un equipo
function findTeamData(teamName) {
    if (!equiposData || !equiposData['Eastern Conference'] || !equiposData['Western Conference']) {
        console.warn('Datos de equipos incompletos');
        return null;
    }
    const allTeams = [...equiposData['Eastern Conference'], ...equiposData['Western Conference']];
    return allTeams.find(team => team.team === teamName);
}
