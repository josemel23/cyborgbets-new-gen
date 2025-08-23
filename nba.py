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

# Diccionario de logos de equipos NBA
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

def setup_chrome_driver():
    """Configurar y retornar Chrome WebDriver con las opciones necesarias"""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--lang=es")
    options.add_argument("--window-size=1920,1080")
    options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=options)

def save_json_data(data, filename):
    """Guardar datos en archivo JSON en la carpeta public"""
    os.makedirs('public/static', exist_ok=True)
    filepath = os.path.join('public/static', filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"Datos guardados en: {filepath}")

def extract_game_data(driver):
    """Extraer datos de juegos de la página de calendario NBA"""
    datos = []
    try:
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "table")))
        time.sleep(2)
        
        tabla = driver.find_element(By.TAG_NAME, "table")
        filas = tabla.find_elements(By.TAG_NAME, "tr")[1:]
        
        for fila in filas:
            try:
                columnas = fila.find_elements(By.TAG_NAME, "td")
                if len(columnas) >= 4:
                    juego = {
                        "hora": columnas[0].text.strip(),
                        "emparejamiento": columnas[1].text.strip(),
                        "resultado": columnas[2].text.strip(),
                        "ubicacion": columnas[3].text.strip(),
                    }
                    if any(juego.values()):
                        datos.append(juego)
            except Exception as e:
                print(f"Error procesando fila: {str(e)}")
                continue
                
    except Exception as e:
        print(f"Error extrayendo datos: {str(e)}")
        
    return datos

def fetch_nba_standings(driver):
    """Obtener datos de clasificación NBA"""
    standings = {'Eastern Conference': [], 'Western Conference': []}
    
    try:
        driver.get("https://es.global.nba.com/standings/")
        time.sleep(5)
        
        tables = driver.find_elements(By.TAG_NAME, 'table')
        
        for conf_idx, conference in enumerate(['Eastern Conference', 'Western Conference']):
            rows = tables[conf_idx].find_elements(By.TAG_NAME, 'tr')[1:]
            
            for row in rows:
                columns = row.find_elements(By.TAG_NAME, 'td')
                if columns and len(columns) >= 15:
                    team_name = columns[2].text.strip()
                    team_data = {
                        'team': team_name,
                        'position': columns[0].text.strip(),
                        'wins': columns[4].text.strip(),
                        'losses': columns[5].text.strip(),
                        'points_for': columns[13].text.strip(),
                        'points_against': columns[14].text.strip(),
                        'win_percentage': columns[6].text.strip(),
                        'logo_url': NBA_TEAM_LOGOS.get(team_name, '')
                    }
                    standings[conference].append(team_data)
        
        save_json_data(standings, 'nba_standings.json')
        
    except Exception as e:
        print(f"Error obteniendo clasificación: {e}")

def fetch_nba_player_stats(driver):
    """Obtener estadísticas de jugadores NBA"""
    player_stats = {'players': []}
    
    try:
        driver.get("https://es.global.nba.com/statistics/")
        WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.TAG_NAME, 'table')))
        time.sleep(5)
        
        table = driver.find_elements(By.TAG_NAME, 'table')[0]
        rows = table.find_elements(By.TAG_NAME, 'tr')[1:]
        
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, 'td')
            if columns and len(columns) >= 8:
                team_name = columns[2].text.strip()
                player_data = {
                    'nombre': columns[1].text.strip(),
                    'equipo': team_name,
                    'posicion': columns[3].text.strip(),
                    'partidos': columns[4].text.strip(),
                    'puntos': columns[5].text.strip(),
                    'rebotes': columns[6].text.strip(),
                    'asistencias': columns[7].text.strip(),
                    'team_logo': NBA_TEAM_LOGOS.get(team_name, '')
                }
                player_stats['players'].append(player_data)
        
        save_json_data(player_stats, 'nba_player_stats.json')
        
    except Exception as e:
        print(f"Error obteniendo estadísticas de jugadores: {e}")

def update_all_data():
    """Actualizar todos los datos NBA usando una sola instancia de WebDriver"""
    driver = None
    try:
        driver = setup_chrome_driver()
        
        # Obtener clasificación
        fetch_nba_standings(driver)
        
        # Obtener estadísticas de jugadores
        fetch_nba_player_stats(driver)
        
        # Obtener juegos
        driver.get("https://es.global.nba.com/schedule/")
        games_data = extract_game_data(driver)
        if games_data:
            save_json_data(games_data, 'nba_games.json')
            
        print("Todos los datos han sido actualizados exitosamente")
            
    except Exception as e:
        print(f"Error actualizando datos: {e}")
    finally:
        if driver:
            driver.quit()

if __name__ == '__main__':
    update_all_data()