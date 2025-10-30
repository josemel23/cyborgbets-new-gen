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
    "Raptors": "TOR", "Jazz": "UTA", "Wizards": "WAS"
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
    options.add_argument("--lang=es")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-gpu")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
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
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        count = len(data) if isinstance(data, list) else len(data.get("players", []))
        print(f"✓ Guardado: {filepath} ({count} elementos)")
        return True
    except Exception as e:
        print(f"✗ Error guardando {filename}: {str(e)}")
        return False

def save_debug_html(driver, filename):
    pass  # Desactivado

def get_team_abbr(team_name):
    for name, abbr in TEAM_NAME_TO_ABBR.items():
        if name.lower() in team_name.lower():
            return abbr
    return team_name[:3].upper()

def extract_team_name(combined_text):
    lines = [line.strip() for line in combined_text.split("\n") if line.strip()]
    if len(lines) >= 2:
        team_parts = lines[1:]
        team_name = " ".join(team_parts)
        return team_name
    return combined_text

def is_valid_stat(value):
    """Verifica si un valor parece ser una estadística válida"""
    try:
        if not value or value == "--" or value == "":
            return False
        # Estadísticas típicas: números enteros o decimales
        float(value)
        return True
    except:
        return False

def clean_player_name(name):
    """Limpia el nombre del jugador eliminando saltos de línea y espacios extra"""
    if not name:
        return ""
    # Eliminar saltos de línea y espacios múltiples
    cleaned = " ".join(name.split())
    return cleaned

def fetch_nba_player_stats(driver):
    print("\n=== Extrayendo estadísticas de jugadores NBA ===")
    player_stats = {"players": []}
    
    try:
        # Usar NBA.com directamente - tiene mejor estructura y datos completos
        urls_to_try = [
            "https://www.nba.com/stats/players/traditional"
        ]
        
        for url_idx, url in enumerate(urls_to_try):
            driver.get(url)
            time.sleep(15)
            
            driver.execute_script("window.scrollTo(0, 1000);")
            time.sleep(3)
            
            save_debug_html(driver, f"debug_players_attempt_{url_idx + 1}.html")
            
            # Buscar todas las tablas
            tables = driver.find_elements(By.TAG_NAME, "table")
            
            if not tables:
                continue
            
            # Intentar diferentes estrategias de extracción
            for table_idx, table in enumerate(tables):
                
                try:
                    rows = table.find_elements(By.TAG_NAME, "tr")
                    
                    if len(rows) < 5:
                        continue
                    
                    # Analizar headers
                    header_row = rows[0]
                    headers = header_row.find_elements(By.TAG_NAME, "th")
                    if not headers:
                        headers = header_row.find_elements(By.TAG_NAME, "td")
                    
                    header_texts = [h.text.strip() for h in headers]
                    
                    # Intentar múltiples patrones de extracción
                    extracted_count = 0
                    
                    # MODO DEBUG: Comentar estas líneas cuando funcione
                    # print(f"\n  DEBUG - Primeras 3 filas de tabla con {len(rows)} filas:")
                    # for debug_idx in range(1, min(4, len(rows))):
                    #     cols = [col.text.strip() for col in rows[debug_idx].find_elements(By.TAG_NAME, "td")]
                    #     print(f"\n  Fila {debug_idx} ({len(cols)} columnas):")
                    #     for i, col_text in enumerate(cols):
                    #         print(f"    [{i}] = '{col_text}'")
                    # print("\n  COPIA ESTO Y COMPARTELO ↑↑↑\n")
                    
                    # ESTRATEGIA 1: Buscar patrón Nombre-Equipo-Posición-Stats
                    for row_idx in range(1, min(len(rows), 51)):
                        try:
                            columns = [col.text.strip() for col in rows[row_idx].find_elements(By.TAG_NAME, "td")]
                            
                            if len(columns) < 5:
                                continue
                            
                            # Buscar el nombre del jugador (usualmente texto largo, no número)
                            nombre_idx = -1
                            for i, col in enumerate(columns[:5]):
                                if col and not col.isdigit() and len(col) > 3 and not is_valid_stat(col):
                                    # Verificar que no sea un header repetido
                                    if "PLAYER" not in col.upper() and "JUGADOR" not in col.upper():
                                        nombre_idx = i
                                        break
                            
                            if nombre_idx == -1:
                                continue
                            
                            nombre = clean_player_name(columns[nombre_idx])
                            
                            # El equipo suele estar después del nombre (3 letras)
                            equipo = ""
                            if nombre_idx + 1 < len(columns):
                                test_team = columns[nombre_idx + 1]
                                if len(test_team) == 3 and test_team.isupper():
                                    equipo = test_team
                            
                            # Estructura REAL de NBA.com (confirmada con debug):
                            # [0]=Rank, [1]=PLAYER, [2]=TEAM, [3]=AGE, [4]=GP, [5]=W, [6]=L, [7]=MIN, 
                            # [8]=PTS ✓, [9-19]=otras stats, [20]=REB ✓, [21]=AST ✓
                            
                            # Extraer todas las columnas como lista
                            all_cols = columns
                            
                            # Verificar que tenemos suficientes columnas
                            if len(all_cols) < 22:
                                continue
                            
                            # Calcular offsets desde el nombre
                            offset = nombre_idx  # Si nombre está en [1], offset=1
                            
                            # Extraer datos con índices CORRECTOS
                            posicion = ""  # No disponible en esta tabla
                            partidos = all_cols[offset + 3] if offset + 3 < len(all_cols) else ""       # GP = [4]
                            puntos = all_cols[offset + 7] if offset + 7 < len(all_cols) else ""         # PTS = [8]
                            rebotes = all_cols[offset + 19] if offset + 19 < len(all_cols) else ""      # REB = [20]
                            asistencias = all_cols[offset + 20] if offset + 20 < len(all_cols) else ""  # AST = [21]
                            
                            # Necesitamos al menos nombre y puntos
                            if nombre and puntos and is_valid_stat(puntos):
                                player_data = {
                                    "nombre": nombre,
                                    "equipo": equipo,
                                    "posicion": posicion if posicion and len(posicion) <= 2 else "",
                                    "partidos": partidos if is_valid_stat(partidos) else "",
                                    "puntos": puntos,
                                    "rebotes": rebotes if is_valid_stat(rebotes) else "",
                                    "asistencias": asistencias if is_valid_stat(asistencias) else "",
                                    "team_logo": NBA_TEAM_LOGOS.get(equipo, "")
                                }
                                
                                # Validar datos mínimos y agregar
                                player_stats["players"].append(player_data)
                                extracted_count += 1
                        
                        except Exception as e:
                            continue
                    
                    if extracted_count > 0:
                        break
                
                except Exception as e:
                    continue
            
            # Si ya tenemos datos, no probar más URLs
            if player_stats["players"]:
                break
        
        if player_stats["players"]:
            print(f"✓ {len(player_stats['players'])} jugadores extraídos")
            save_json_data(player_stats, "nba_player_stats.json")
        else:
            print("✗ No se pudieron extraer jugadores")
            save_json_data(player_stats, "nba_player_stats.json")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        save_json_data({"players": []}, "nba_player_stats.json")

def fetch_nba_standings(driver):
    print("\n=== Extrayendo clasificación NBA ===")
    standings = {"Eastern Conference": [], "Western Conference": []}
    
    try:
        driver.get("https://www.espn.com.co/basquetbol/nba/posiciones")
        time.sleep(10)
        
        tables = driver.find_elements(By.TAG_NAME, "table")
        
        if len(tables) < 2:
            return
        
        for conf_idx, conference in enumerate(["Eastern Conference", "Western Conference"]):
            rows = tables[conf_idx].find_elements(By.TAG_NAME, "tr")[1:]
            
            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    
                    if columns and len(columns) >= 13:
                        combined_text = columns[0].text.strip()
                        team_name = extract_team_name(combined_text)
                        
                        position_match = re.match(r"(\d+)", combined_text)
                        position = position_match.group(1).zfill(2) if position_match else "00"
                        
                        team_abbr = get_team_abbr(team_name)
                        
                        win_pct = columns[3].text.strip()
                        if win_pct and win_pct != "--":
                            try:
                                if win_pct.startswith("."):
                                    win_pct = str(float(win_pct) * 100)
                                elif win_pct == "1.000":
                                    win_pct = "100.0"
                            except:
                                pass
                        
                        team_data = {
                            "team": team_name,
                            "position": position,
                            "wins": columns[1].text.strip(),
                            "losses": columns[2].text.strip(),
                            "points_for": "",
                            "points_against": "",
                            "win_percentage": win_pct,
                            "logo_url": NBA_TEAM_LOGOS.get(team_abbr, "")
                        }
                        
                        try:
                            decimal_values = []
                            for i in range(len(columns)):
                                text = columns[i].text.strip()
                                if re.match(r"^\d{2,3}\.\d$", text):
                                    decimal_values.append(text)
                            
                            if len(decimal_values) >= 2:
                                team_data["points_for"] = decimal_values[-2]
                                team_data["points_against"] = decimal_values[-1]
                        except:
                            pass
                        
                        standings[conference].append(team_data)
                        
                except Exception as e:
                    continue
            
            print(f"✓ {conference}: {len(standings[conference])} equipos")
        
        save_json_data(standings, "nba_standings.json")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")

def fetch_nba_games(driver):
    print("\n=== Extrayendo calendario de juegos ===")
    games_data = []
    
    try:
        driver.get("https://es.global.nba.com/schedule/")
        time.sleep(15)
        
        body_text = driver.find_element(By.TAG_NAME, "body").text
        lines = body_text.split("\n")
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            score_pattern = r"([A-Za-z\s]+)\s+(\d+)\s+([A-Za-z\s]+)\s+(\d+)"
            match = re.search(score_pattern, line)
            
            if match:
                team1 = match.group(1).strip()
                score1 = match.group(2)
                team2 = match.group(3).strip()
                score2 = match.group(4)
                
                hora = ""
                ubicacion = ""
                for j in range(max(0, i-3), i):
                    prev_line = lines[j].strip()
                    if re.search(r"\d+:\d+", prev_line):
                        hora = prev_line
                        break
                
                for j in range(i+1, min(len(lines), i+5)):
                    next_line = lines[j].strip()
                    if "Arena" in next_line or "Center" in next_line or "Stadium" in next_line or "Fieldhouse" in next_line:
                        ubicacion = next_line
                        break
                
                team1_abbr = get_team_abbr(team1)
                team2_abbr = get_team_abbr(team2)
                
                game = {
                    "hora": hora,
                    "emparejamiento": f"{team1_abbr} @ {team2_abbr}",
                    "resultado": f"{score1} - {score2}",
                    "ubicacion": ubicacion
                }
                games_data.append(game)
                
            elif " @ " in line or " vs " in line.lower():
                if len(line) < 150:
                    hora = ""
                    ubicacion = ""
                    
                    for j in range(max(0, i-3), i):
                        prev_line = lines[j].strip()
                        if re.search(r"\d+:\d+", prev_line):
                            hora = prev_line
                            break
                    
                    for j in range(i+1, min(len(lines), i+5)):
                        next_line = lines[j].strip()
                        if "Arena" in next_line or "Center" in next_line or "Stadium" in next_line or "Fieldhouse" in next_line:
                            ubicacion = next_line
                            break
                    
                    emparejamiento = line
                    for name, abbr in TEAM_NAME_TO_ABBR.items():
                        emparejamiento = emparejamiento.replace(name, abbr)
                    
                    game = {
                        "hora": hora,
                        "emparejamiento": emparejamiento,
                        "resultado": "–",
                        "ubicacion": ubicacion
                    }
                    games_data.append(game)
            
            i += 1
            
            if len(games_data) >= 30:
                break
        
        if games_data:
            print(f"✓ {len(games_data)} juegos extraídos")
            save_json_data(games_data, "nba_games.json")
        else:
            print("✗ No se encontraron juegos")
            save_json_data([], "nba_games.json")
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        save_json_data([], "nba_games.json")

def update_all_data():
    driver = None
    start_time = time.time()
    
    print("=" * 60)
    print("NBA SCRAPER")
    print("=" * 60)
    
    try:
        driver = setup_chrome_driver()
        print("✓ WebDriver iniciado")
        
        fetch_nba_standings(driver)
        fetch_nba_player_stats(driver)
        fetch_nba_games(driver)
        
        elapsed = time.time() - start_time
        print(f"\n{'=' * 60}")
        print(f"✓ COMPLETADO EN {elapsed:.1f}s")
        print("=" * 60)
            
    except Exception as e:
        print(f"\n✗ ERROR: {str(e)}")
    finally:
        if driver:
            try:
                driver.quit()
            except:
                pass

if __name__ == "__main__":
    update_all_data()