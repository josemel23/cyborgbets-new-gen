from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import json
import os
import time

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

def esperar_y_encontrar_tabla(driver, timeout=30):
    try:
        wait = WebDriverWait(driver, timeout)
        # Esperar a que la tabla esté completamente cargada
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table tbody tr")))
        time.sleep(3)  # Tiempo adicional para que se carguen todos los datos
        return True
    except Exception as e:
        print(f"Error esperando tabla: {e}")
        return False

def extraer_datos_goles_completos(driver):
    try:
        if not esperar_y_encontrar_tabla(driver):
            print("No se pudo encontrar la tabla")
            return None

        # Buscar todas las filas de la tabla
        rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
        if not rows:
            print("No se encontraron filas en la tabla")
            return None

        print(f"Se encontraron {len(rows)} filas")
        goals_stats = []
        
        for i, row in enumerate(rows):
            try:
                columns = row.find_elements(By.TAG_NAME, "td")
                if not columns or len(columns) < 4:
                    print(f"Fila {i}: Número insuficiente de columnas ({len(columns)})")
                    continue
                
                # Extraer el nombre del equipo (normalmente en la columna 1 o 2)
                team_name = ""
                for col_idx in [1, 2]:
                    if col_idx < len(columns):
                        potential_name = columns[col_idx].text.strip()
                        if potential_name and not potential_name.isdigit() and '%' not in potential_name:
                            team_name = potential_name
                            break
                
                if not team_name:
                    print(f"Fila {i}: No se pudo extraer el nombre del equipo")
                    continue
                
                # Extraer datos de porcentajes
                percentages = []
                for col in columns:
                    text = col.text.strip()
                    if text and '%' in text:
                        percentages.append(text)
                
                print(f"Equipo: {team_name}")
                print(f"Porcentajes encontrados: {percentages}")
                
                # Necesitamos al menos 3 valores para General, Hogar y Lejos
                if len(percentages) >= 3:
                    # Extraer valores numéricos para ordenar
                    values_with_text = []
                    for perc in percentages[:3]:  # Solo los primeros 3
                        try:
                            # Extraer el número del porcentaje
                            num_value = float(perc.replace('%', '').strip())
                            values_with_text.append((num_value, perc))
                        except ValueError:
                            values_with_text.append((0, perc))
                    
                    # Ordenar de forma descendente por valor numérico
                    values_with_text.sort(key=lambda x: x[0], reverse=True)
                    
                    # Asignar los valores ordenados
                    team_data = {
                        "team": team_name,
                        "goals": {
                            "1.5": values_with_text[0][1],  # Mayor porcentaje
                            "2.5": values_with_text[1][1],  # Porcentaje medio
                            "3.5": values_with_text[2][1]   # Menor porcentaje
                        }
                    }
                    
                    print(f"Datos ordenados: 1.5={values_with_text[0][1]}, 2.5={values_with_text[1][1]}, 3.5={values_with_text[2][1]}")
                    
                else:
                    # Fallback: usar el método original si no hay suficientes datos
                    team_data = {
                        "team": team_name,
                        "goals": {
                            "1.5": percentages[0] if len(percentages) > 0 else "N/A",
                            "2.5": "N/A",
                            "3.5": "N/A"
                        }
                    }
                    print(f"Datos insuficientes, usando fallback")
                
                goals_stats.append(team_data)
                print(f"Datos agregados para {team_name}")
                
            except Exception as e:
                print(f"Error procesando fila {i}: {e}")
                continue
        
        return goals_stats
        
    except Exception as e:
        print(f"Error general extrayendo datos: {e}")
        return None

def extraer_con_multiples_urls(driver):
    """
    Intenta extraer de diferentes URLs que podrían tener los datos
    """
    urls = [
        "https://www.apwin.com/league/usa/mls/standings/over-under-goals/",
        "https://www.apwin.com/league/usa/mls/statistics/over-under-goals/",
        "https://www.apwin.com/league/usa/mls/stats/goals/"
    ]
    
    for url in urls:
        try:
            print(f"Intentando URL: {url}")
            driver.get(url)
            time.sleep(5)
            
            # Buscar diferentes selectores de tabla
            table_selectors = [
                "table tbody tr",
                ".table tbody tr",
                "[data-table] tbody tr",
                ".standings-table tbody tr"
            ]
            
            for selector in table_selectors:
                try:
                    rows = driver.find_elements(By.CSS_SELECTOR, selector)
                    if rows:
                        print(f"Encontrada tabla con selector: {selector}")
                        print(f"Número de filas: {len(rows)}")
                        
                        # Imprimir estructura de la primera fila para debug
                        if rows:
                            first_row_cols = rows[0].find_elements(By.TAG_NAME, "td")
                            print(f"Primera fila tiene {len(first_row_cols)} columnas:")
                            for j, col in enumerate(first_row_cols[:10]):  # Solo las primeras 10
                                print(f"  Columna {j}: '{col.text.strip()}'")
                        
                        return extraer_datos_goles_completos(driver)
                except:
                    continue
                    
        except Exception as e:
            print(f"Error con URL {url}: {e}")
            continue
    
    return None

def actualizar_json(datos, nombre_archivo):
    if not datos:
        print("No hay datos para actualizar")
        return
    
    existing_data = {"teams": []}
    if os.path.exists(nombre_archivo):
        try:
            with open(nombre_archivo, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except:
            existing_data = {"teams": []}
    
    for new_team_data in datos:
        team_name = new_team_data["team"]
        existing_team = next((team for team in existing_data["teams"] if team["team"] == team_name), None)
        if existing_team:
            existing_team.update(new_team_data)
        else:
            existing_data["teams"].append(new_team_data)
    
    with open(nombre_archivo, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=4)
    
    print(f"Datos guardados en {nombre_archivo}")

def main():
    driver = configurar_driver()
    
    try:
        print("Iniciando extracción de datos...")
        goals_stats = extraer_con_multiples_urls(driver)
        
        if goals_stats:
            print(f"Se extrajeron datos de {len(goals_stats)} equipos")
            actualizar_json(goals_stats, "public/static/mls_usa_data.json")
            
            # Mostrar ejemplo de los datos extraídos
            if goals_stats:
                print("\nEjemplo de datos extraídos:")
                print(json.dumps(goals_stats[0], ensure_ascii=False, indent=2))
                
                # Mostrar todos los equipos con sus estadísticas ordenadas
                print("\nTodos los equipos extraídos:")
                for team in goals_stats:
                    print(f"{team['team']}: 1.5={team['goals']['1.5']}, 2.5={team['goals']['2.5']}, 3.5={team['goals']['3.5']}")
        else:
            print("No se pudieron extraer datos. Intentando debug...")
            
            # Debug: intentar la URL original
            driver.get("https://www.apwin.com/league/usa/mls/standings/over-under-goals/")
            time.sleep(5)
            
            # Imprimir HTML de la página para debug
            print("HTML de la página (primeros 2000 caracteres):")
            print(driver.page_source[:2000])
            
    except Exception as e:
        print(f"Error en main: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    main()