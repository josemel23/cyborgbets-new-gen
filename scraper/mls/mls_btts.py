from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json
import os

def configurar_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("--disable-popup-blocking")
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def esperar_y_encontrar_tabla(driver, timeout=20):
    try:
        wait = WebDriverWait(driver, timeout)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table")))
        return True
    except Exception as e:
        return False

def extraer_datos_btts(driver):
    try:
        if not esperar_y_encontrar_tabla(driver):
            return None

        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        if not rows:
            return None

        btts_stats = []
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, "td")
            if columns and len(columns) >= 5:
                try:
                    team_data = {
                        "team": columns[1].text.strip(),
                        "btts": {
                            "Yes": columns[4].text.strip()
                        }
                    }
                    if team_data["team"]:
                        btts_stats.append(team_data)
                except Exception as e:
                    continue
        return btts_stats

    except Exception as e:
        return None

def actualizar_json(datos, nombre_archivo):
    existing_data = {"teams": []}
    if os.path.exists(nombre_archivo):
        with open(nombre_archivo, "r", encoding="utf-8") as f:
            existing_data = json.load(f)

    # Actualizar los datos existentes con los nuevos datos
    for new_team_data in datos:
        team_name = new_team_data["team"]
        existing_team = next((team for team in existing_data["teams"] if team["team"] == team_name), None)
        if existing_team:
            existing_team.update(new_team_data)
        else:
            existing_data["teams"].append(new_team_data)

    with open(nombre_archivo, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)

def main():
    driver = configurar_driver()
    driver.get("https://www.apwin.com/league/usa/mls/standings/btts/")
    btts_stats = extraer_datos_btts(driver)
    driver.quit()
    if btts_stats:
        actualizar_json(btts_stats, "public/static/mls_usa_data.json")

if __name__ == "__main__":
    main()
