from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import os
import re
from datetime import datetime

NBA_TEAM_LOGOS = {
    "ATL": "https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg",
    "BOS": "https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg",
    "BKN": "https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg",
    "CHA": "https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg",
    "CHI": "https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg",
    "CLE": "https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg",
    "DAL": "https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg",
    "DEN": "https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg",
    "DET": "https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg",
    "GSW": "https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg",
    "HOU": "https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg",
    "IND": "https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg",
    "LAC": "https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg",
    "LAL": "https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg",
    "MEM": "https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg",
    "MIA": "https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg",
    "MIL": "https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg",
    "MIN": "https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg",
    "NOP": "https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg",
    "NYK": "https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg",
    "OKC": "https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg",
    "ORL": "https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg",
    "PHI": "https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg",
    "PHX": "https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg",
    "POR": "https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg",
    "SAC": "https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg",
    "SAS": "https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg",
    "TOR": "https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg",
    "UTA": "https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg",
    "WAS": "https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg",
}

TEAM_NAME_TO_ABBR = {
    "Hawks": "ATL", "Celtics": "BOS", "Nets": "BKN", "Hornets": "CHA",
    "Bulls": "CHI", "Cavaliers": "CLE", "Mavericks": "DAL", "Nuggets": "DEN",
    "Pistons": "DET", "Warriors": "GSW", "Rockets": "HOU", "Pacers": "IND",
    "Clippers": "LAC", "Lakers": "LAL", "Grizzlies": "MEM", "Heat": "MIA",
    "Bucks": "MIL", "Timberwolves": "MIN", "Pelicans": "NOP", "Knicks": "NYK",
    "Thunder": "OKC", "Magic": "ORL", "76ers": "PHI", "Suns": "PHX",
    "Trail Blazers": "POR", "Blazers": "POR", "Kings": "SAC", "Spurs": "SAS",
    "Raptors": "TOR", "Jazz": "UTA", "Wizards": "WAS",
    "Atlanta": "ATL", "Boston": "BOS", "Brooklyn": "BKN", "Charlotte": "CHA",
    "Chicago": "CHI", "Cleveland": "CLE", "Dallas": "DAL", "Denver": "DEN",
    "Detroit": "DET", "Golden State": "GSW", "Houston": "HOU", "Indiana": "IND",
    "LA Clippers": "LAC", "Los Angeles Clippers": "LAC", 
    "LA Lakers": "LAL", "Los Angeles Lakers": "LAL",
    "Memphis": "MEM", "Miami": "MIA", "Milwaukee": "MIL", "Minnesota": "MIN",
    "New Orleans": "NOP", "New York": "NYK", "Oklahoma City": "OKC",
    "Orlando": "ORL", "Philadelphia": "PHI", "Phoenix": "PHX",
    "Portland": "POR", "Sacramento": "SAC", "San Antonio": "SAS",
    "Toronto": "TOR", "Utah": "UTA", "Washington": "WAS"
}

def setup_chrome_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--ignore-ssl-errors")
    options.add_argument("--disable-web-security")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--lang=en")  # Cambiar a inglés para mejor compatibilidad
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-gpu")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.set_page_load_timeout(90)
    driver.implicitly_wait(10)
    
    return driver

def save_json_data(data, filename):
    try:
        os.makedirs("public/static", exist_ok=True)
        filepath = os.path.join("public/static", filename)
        
        if isinstance(data, dict) and "last_updated" not in data:
            data["last_updated"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        
        count = len(data) if isinstance(data, list) else len(data.get("players", []))
        print(f"[OK] Guardado: {filepath} ({count} elementos)")
        return True
    except Exception as e:
        print(f"[ERROR] Error guardando {filename}: {str(e)}")
        return False

def get_team_abbr(team_name):
    for name, abbr in TEAM_NAME_TO_ABBR.items():
        if name.lower() in team_name.lower():
            return abbr
    return team_name[:3].upper()

def fetch_nba_player_stats(driver=None):
    print("\n=== Extrayendo estadisticas de jugadores NBA (API) ===")
    player_stats = {"players": []}
    
    try:
        import requests
        
        url = "https://stats.nba.com/stats/leagueLeaders"
        
        params = {
            'LeagueID': '00',
            'PerMode': 'PerGame',
            'Scope': 'S',
            'Season': '2024-25',
            'SeasonType': 'Regular Season',
            'StatCategory': 'PTS'
        }
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.nba.com/',
            'Origin': 'https://www.nba.com',
            'Connection': 'keep-alive',
            'x-nba-stats-origin': 'stats',
            'x-nba-stats-token': 'true'
        }
        
        print("[INFO] Solicitando datos de NBA Stats API...")
        response = requests.get(url, params=params, headers=headers, timeout=30)
        
        if response.status_code != 200:
            print(f"[ERROR] Status code: {response.status_code}")
            raise Exception(f"API retornó status {response.status_code}")
        
        data = response.json()
        headers_list = data['resultSet']['headers']
        rows = data['resultSet']['rowSet']
        
        print(f"[INFO] API retornó {len(rows)} jugadores")
        print(f"[DEBUG] Headers disponibles: {headers_list}")
        
        # Buscar índices de forma segura
        def get_index(header_name, alternatives=[]):
            """Busca un header por nombre o alternativas"""
            if header_name in headers_list:
                return headers_list.index(header_name)
            for alt in alternatives:
                if alt in headers_list:
                    return headers_list.index(alt)
            return None
        
        idx_player = get_index('PLAYER', ['PLAYER_NAME'])
        idx_team = get_index('TEAM_ABBREVIATION', ['TEAM', 'TEAM_ABBR'])
        idx_gp = get_index('GP', ['GAMES_PLAYED'])
        idx_pts = get_index('PTS', ['POINTS'])
        idx_reb = get_index('REB', ['REBOUNDS', 'TOTAL_REBOUNDS'])
        idx_ast = get_index('AST', ['ASSISTS'])
        
        # Verificar que tenemos los índices necesarios
        if idx_player is None or idx_pts is None:
            print(f"[ERROR] No se encontraron columnas necesarias")
            print(f"[ERROR] Headers: {headers_list}")
            raise Exception("Columnas requeridas no encontradas")
        
        for row in rows[:50]:
            try:
                nombre = row[idx_player] if idx_player is not None else "Unknown"
                equipo = row[idx_team] if idx_team is not None else "N/A"
                partidos = str(int(row[idx_gp])) if idx_gp is not None else "0"
                puntos = str(round(row[idx_pts], 1)) if idx_pts is not None else "0.0"
                rebotes = str(round(row[idx_reb], 1)) if idx_reb is not None else "0.0"
                asistencias = str(round(row[idx_ast], 1)) if idx_ast is not None else "0.0"
                
                player_data = {
                    "nombre": nombre,
                    "equipo": equipo,
                    "posicion": "N/A",
                    "partidos": partidos,
                    "puntos": puntos,
                    "rebotes": rebotes,
                    "asistencias": asistencias,
                    "team_logo": NBA_TEAM_LOGOS.get(equipo, "")
                }
                
                player_stats["players"].append(player_data)
            except Exception as e:
                print(f"[WARN] Error procesando jugador: {e}")
                continue
        
        if player_stats["players"]:
            print(f"[OK] {len(player_stats['players'])} jugadores extraidos correctamente")
            print(f"[DEBUG] Primer jugador: {player_stats['players'][0]['nombre']} - {player_stats['players'][0]['equipo']} - {player_stats['players'][0]['puntos']} PTS")
        else:
            print("[ERROR] Lista de jugadores vacía")
        
        save_json_data(player_stats, "nba_player_stats.json")
        return True
        
    except Exception as e:
        print(f"[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        save_json_data({"players": []}, "nba_player_stats.json")
        return False

def fetch_nba_standings(driver):
    print("\n=== Extrayendo clasificacion NBA (TyC Sports) ===")
    standings = {"Eastern Conference": [], "Western Conference": []}

    try:
        driver.get("https://www.tycsports.com/estadisticas/estados-unidos/nba/tabla-de-posiciones.html")
        time.sleep(8)

        tables = driver.find_elements(By.CSS_SELECTOR, "table")

        if not tables or len(tables) < 2:
            print("[ERROR] No se encontraron tablas")
            save_json_data(standings, "nba_standings.json")
            return

        for idx, conference_name in enumerate(["Eastern Conference", "Western Conference"]):
            rows = tables[idx].find_elements(By.CSS_SELECTOR, "tbody tr")

            print(f"\nProcesando {conference_name} ({len(rows)} filas)")

            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) < 8:
                        continue

                    position = columns[0].text.strip()
                    team_full_text = columns[2].text.strip()
                    team_name = ' '.join(team_full_text.split()[1:]) if len(team_full_text.split()) > 1 else team_full_text
                    
                    wins = columns[5].text.strip()
                    losses = columns[6].text.strip()
                    points_for = columns[7].text.strip()
                    points_against = columns[8].text.strip()
                    win_pct = columns[3].text.strip() if len(columns) > 8 else ""

                    total_games = int(wins) + int(losses)
                    avg_points_for = round(float(points_for) / total_games, 1) if total_games > 0 else 0
                    avg_points_against = round(float(points_against) / total_games, 1) if total_games > 0 else 0

                    abbr = get_team_abbr(team_name)

                    team_data = {
                        "team": team_name,
                        "position": position.zfill(2),
                        "wins": wins,
                        "losses": losses,
                        "points_for": str(avg_points_for),
                        "points_against": str(avg_points_against),
                        "win_percentage": win_pct,
                        "logo_url": NBA_TEAM_LOGOS.get(abbr, "")
                    }

                    standings[conference_name].append(team_data)

                except Exception as e:
                    continue

            print(f"[OK] {conference_name}: {len(standings[conference_name])} equipos extraidos")

        save_json_data(standings, "nba_standings.json")

    except Exception as e:
        print(f"[ERROR] Error: {str(e)}")
        save_json_data(standings, "nba_standings.json")

def fetch_nba_games(driver):
    print("\n=== Extrayendo calendario de juegos ===")
    games_data = []
    
    try:
        # Usar FlashScore que tiene los próximos partidos
        driver.get("https://www.flashscore.com/basketball/usa/nba/fixtures/")
        time.sleep(12)
        
        # Cerrar posibles popups
        try:
            close_btn = driver.find_element(By.CSS_SELECTOR, "#onetrust-reject-all-handler, .close-button")
            close_btn.click()
            time.sleep(1)
        except:
            pass
        
        # Scroll para cargar más partidos
        driver.execute_script("window.scrollTo(0, 1000);")
        time.sleep(3)
        
        # Buscar todos los partidos (divs de eventos)
        events = driver.find_elements(By.CSS_SELECTOR, ".event__match, [class*='event']")
        
        print(f"[INFO] Buscando partidos en FlashScore...")
        
        partido_count = 0
        
        # Extraer del body text si no hay elementos específicos
        body_text = driver.find_element(By.TAG_NAME, "body").text
        lines = body_text.split("\n")
        
        i = 0
        while i < len(lines) and partido_count < 15:
            line = lines[i].strip()
            
            # Buscar patrón de hora (formato: "19.02. 19:00")
            if re.search(r"\d{2}\.\d{2}\.\s+\d{2}:\d{2}", line):
                hora = line
                
                # Los siguientes 2 líneas suelen ser los equipos
                if i + 2 < len(lines):
                    equipo1 = lines[i + 1].strip()
                    equipo2 = lines[i + 2].strip()
                    
                    # Filtrar líneas que no son nombres de equipos
                    if (len(equipo1) > 3 and len(equipo2) > 3 and 
                        equipo1 != "--" and equipo2 != "--" and
                        not equipo1.isdigit() and not equipo2.isdigit()):
                        
                        # Convertir a abreviaturas
                        equipo1_abbr = get_team_abbr(equipo1)
                        equipo2_abbr = get_team_abbr(equipo2)
                        
                        game = {
                            "hora": hora,
                            "emparejamiento": f"{equipo1_abbr} @ {equipo2_abbr}",
                            "resultado": "vs",
                            "ubicacion": ""
                        }
                        games_data.append(game)
                        partido_count += 1
                        
                        i += 2  # Saltar las líneas de equipos ya procesadas
            
            i += 1
        
        # Si FlashScore falla, intentar con ESPN
        if not games_data:
            print("[INFO] Intentando con ESPN...")
            driver.get("https://www.espn.com/nba/schedule")
            time.sleep(10)
            
            # Buscar secciones de fechas futuras
            date_sections = driver.find_elements(By.CSS_SELECTOR, ".ScheduleTables, .ResponsiveTable")
            
            for section in date_sections[:3]:  # Primeros 3 días
                try:
                    rows = section.find_elements(By.CSS_SELECTOR, "tbody tr")
                    
                    for row in rows[:10]:
                        try:
                            teams = row.find_elements(By.CSS_SELECTOR, ".Table__Team")
                            time_elem = row.find_elements(By.CSS_SELECTOR, ".date__col, .ScoreCell__Time")
                            
                            if len(teams) >= 2:
                                team1 = teams[0].text.strip()
                                team2 = teams[1].text.strip()
                                hora = time_elem[0].text.strip() if time_elem else ""
                                
                                team1_abbr = get_team_abbr(team1)
                                team2_abbr = get_team_abbr(team2)
                                
                                game = {
                                    "hora": hora,
                                    "emparejamiento": f"{team1_abbr} @ {team2_abbr}",
                                    "resultado": "vs",
                                    "ubicacion": ""
                                }
                                games_data.append(game)
                        except:
                            continue
                except:
                    continue
        
        # Si aún no hay datos, usar TyC Sports
        if not games_data:
            print("[INFO] Intentando con TyC Sports...")
            driver.get("https://www.tycsports.com/estadisticas/estados-unidos/nba/calendario.html")
            time.sleep(10)
            
            # Buscar próximos partidos
            body_text = driver.find_element(By.TAG_NAME, "body").text
            lines = body_text.split("\n")
            
            for i, line in enumerate(lines):
                if " vs " in line.lower() or "@" in line:
                    if len(line) < 100 and len(games_data) < 15:
                        # Buscar hora en líneas anteriores
                        hora = ""
                        for j in range(max(0, i-3), i):
                            if re.search(r"\d{1,2}:\d{2}", lines[j]):
                                hora = lines[j].strip()
                                break
                        
                        emparejamiento = line
                        for name, abbr in TEAM_NAME_TO_ABBR.items():
                            emparejamiento = emparejamiento.replace(name, abbr)
                        
                        game = {
                            "hora": hora,
                            "emparejamiento": emparejamiento,
                            "resultado": "vs",
                            "ubicacion": ""
                        }
                        games_data.append(game)
        
        if games_data:
            print(f"[OK] {len(games_data)} juegos proximos extraidos")
        else:
            print("[INFO] No se encontraron juegos proximos (posible All-Star Break)")
        
        save_json_data(games_data, "nba_games.json")
        
    except Exception as e:
        print(f"[ERROR] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        save_json_data([], "nba_games.json")

def update_all_data():
    driver = None
    start_time = time.time()
    
    print("=" * 60)
    print("NBA SCRAPER")
    print("=" * 60)
    
    try:
        driver = setup_chrome_driver()
        print("[OK] WebDriver iniciado")
        
        fetch_nba_standings(driver)
        fetch_nba_player_stats(driver)
        fetch_nba_games(driver)
        
        elapsed = time.time() - start_time
        print(f"\n{'=' * 60}")
        print(f"[OK] COMPLETADO EN {elapsed:.1f}s")
        print("=" * 60)
            
    except Exception as e:
        print(f"\n[ERROR] ERROR: {str(e)}")
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass

if __name__ == "__main__":
    update_all_data()
