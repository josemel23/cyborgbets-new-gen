import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import os
import time
import logging
import warnings
import atexit

# Suprimir warnings
warnings.filterwarnings("ignore")

# Logging simple
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

driver_global = None

class BrasilScraper:
    
    def __init__(self):
        self.driver = None
        self.base_url = "https://www.apwin.com/league/france/ligue-1"
        self.output_file =  "public/static/ligue_1_data.json"
        self.data = {"teams": []}

    def configurar_driver(self):
        """Configuración SIMPLE del driver"""
        global driver_global
        try:
            # Solo opciones esenciales
            options = uc.ChromeOptions()
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage") 
            options.add_argument("--disable-logging")
            options.add_argument("--log-level=3")
            
            self.driver = uc.Chrome(options=options)
            driver_global = self.driver
            logger.info("Driver configurado exitosamente (modo simple)")
            return True
            
        except Exception as e:
            logger.error(f"Error configurando driver: {e}")
            return False

    def esperar_tabla(self, timeout=30):
        """Espera tabla - VERSIÓN ORIGINAL"""
        try:
            wait = WebDriverWait(self.driver, timeout)
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "table")))
            time.sleep(3)
            return True
        except:
            return False

    def navegar_y_esperar(self, url, descripcion=""):
        """Navegación - VERSIÓN ORIGINAL"""
        try:
            logger.info(f"Navegando a: {descripcion}")
            self.driver.get(url)
            time.sleep(5)
            return True
        except Exception as e:
            logger.error(f"Error navegando a {descripcion}: {e}")
            return False

    def extraer_standings(self):
        """VERSIÓN SIMPLIFICADA"""
        logger.info("🏆 Extrayendo datos de STANDINGS...")
        
        url = f"{self.base_url}/standings/"
        if not self.navegar_y_esperar(url, "Standings"):
            return False
            
        if not self.esperar_tabla():
            return False

        try:
            rows = self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
            if not rows:
                rows = self.driver.find_elements(By.CSS_SELECTOR, "table tr")
                
            logger.info(f"Encontradas {len(rows)} filas")
            processed_teams = set()
            
            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) < 10:
                        continue
                    
                    team_name = columns[1].text.strip()
                    if not team_name or team_name in processed_teams:
                        continue
                    
                    team_data = {
                        "team": team_name,
                        "position": columns[0].text.strip() or "0",
                        "matches_played": columns[2].text.strip() or "0",
                        "wins": columns[3].text.strip() or "0",
                        "draws": columns[4].text.strip() or "0",
                        "losses": columns[5].text.strip() or "0",
                        "goals_for": columns[6].text.strip() or "0",
                        "goals_against": columns[7].text.strip() or "0",
                        "goal_difference": columns[8].text.strip() or "0",
                        "points": columns[9].text.strip() or "0"
                    }
                    
                    self.actualizar_equipo(team_data)
                    processed_teams.add(team_name)
                    
                except Exception as e:
                    continue
                    
            logger.info(f"✅ Standings: {len(processed_teams)} equipos procesados")
            return True
            
        except Exception as e:
            logger.error(f"Error extrayendo standings: {e}")
            return False

    def extraer_btts(self):
        """VERSIÓN SIMPLIFICADA"""
        logger.info("⚽ Extrayendo datos de BTTS...")
        
        url = f"{self.base_url}/standings/btts/"
        if not self.navegar_y_esperar(url, "BTTS"):
            return False
            
        if not self.esperar_tabla():
            return False

        try:
            rows = self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
            if not rows:
                rows = self.driver.find_elements(By.CSS_SELECTOR, "table tr")
                
            processed = 0
            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) >= 5:
                        team = columns[1].text.strip()
                        btts = columns[4].text.strip()
                        
                        if team:
                            team_data = {
                                "team": team,
                                "btts": {"Yes": btts}
                            }
                            self.actualizar_equipo(team_data)
                            processed += 1
                            
                except Exception as e:
                    continue
                    
            logger.info(f"✅ BTTS: {processed} equipos procesados")
            return True
            
        except Exception as e:
            logger.error(f"Error extrayendo BTTS: {e}")
            return False

    def extraer_cards(self):
        """VERSIÓN SIMPLIFICADA"""
        logger.info("🟨 Extrayendo datos de CARDS...")
        
        url = f"{self.base_url}/standings/cards/"
        if not self.navegar_y_esperar(url, "Cards"):
            return False
            
        if not self.esperar_tabla():
            return False

        try:
            rows = self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
            if not rows:
                rows = self.driver.find_elements(By.CSS_SELECTOR, "table tr")
                
            processed = 0
            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) >= 6:
                        team_name = columns[1].text.strip()
                        
                        if team_name:
                            team_data = {
                                "team": team_name,
                                "cards": {
                                    "over_3_5": columns[3].text.strip() or "0%",
                                    "over_4_5": columns[4].text.strip() or "0%",
                                    "over_5_5": columns[5].text.strip() or "0%"
                                }
                            }
                            
                            self.actualizar_equipo(team_data)
                            processed += 1
                            
                except Exception as e:
                    continue
                    
            logger.info(f"✅ Cards: {processed} equipos procesados")
            return True
            
        except Exception as e:
            logger.error(f"Error extrayendo cards: {e}")
            return False

    def extraer_corners(self):
        """VERSIÓN SIMPLIFICADA"""
        logger.info("📐 Extrayendo datos de CORNERS...")
        
        url = f"{self.base_url}/standings/corners/"
        if not self.navegar_y_esperar(url, "Corners"):
            return False
            
        if not self.esperar_tabla():
            return False

        try:
            rows = self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
            if not rows:
                rows = self.driver.find_elements(By.CSS_SELECTOR, "table tr")
                
            processed = 0
            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) >= 11:
                        team = columns[1].text.strip()
                        
                        if team:
                            team_data = {
                                "team": team,
                                "corners": {
                                    "8.5": columns[4].text.strip() or "0%",
                                    "9.5": columns[5].text.strip() or "0%",
                                    "10.5": columns[6].text.strip() or "0%",
                                    "11.5": columns[7].text.strip() or "0%",
                                    "12.5": columns[8].text.strip() or "0%",
                                    "13.5": columns[9].text.strip() or "0%",
                                    "average": columns[10].text.strip() or "0"
                                }
                            }
                            self.actualizar_equipo(team_data)
                            processed += 1
                            
                except Exception as e:
                    continue
                    
            logger.info(f"✅ Corners: {processed} equipos procesados")
            return True
            
        except Exception as e:
            logger.error(f"Error extrayendo corners: {e}")
            return False

    def extraer_goals(self):
        """VERSIÓN CORREGIDA - ordena porcentajes correctamente"""
        logger.info("🥅 Extrayendo datos de GOALS...")
        
        url = f"{self.base_url}/standings/over-under-goals/"
        if not self.navegar_y_esperar(url, "Goals"):
            return False
            
        if not self.esperar_tabla(15):
            return False

        try:
            rows = self.driver.find_elements(By.CSS_SELECTOR, "table tbody tr")
            if not rows:
                rows = self.driver.find_elements(By.CSS_SELECTOR, "table tr")
                
            processed = 0
            for row in rows:
                try:
                    columns = row.find_elements(By.TAG_NAME, "td")
                    if len(columns) < 4:
                        continue
                    
                    team_name = columns[1].text.strip()
                    
                    if team_name:
                        # Buscar porcentajes y convertir a números para ordenar
                        percentages_with_values = []
                        for col in columns:
                            text = col.text.strip()
                            if text and '%' in text:
                                try:
                                    # Extraer valor numérico del porcentaje
                                    value = float(text.replace('%', '').strip())
                                    percentages_with_values.append((value, text))
                                except ValueError:
                                    continue
                        
                        if len(percentages_with_values) >= 3:
                            # Ordenar de MAYOR a MENOR (1.5 > 2.5 > 3.5)
                            percentages_with_values.sort(key=lambda x: x[0], reverse=True)
                            
                            team_data = {
                                "team": team_name,
                                "goals": {
                                    "1.5": percentages_with_values[0][1],  # Mayor porcentaje
                                    "2.5": percentages_with_values[1][1],  # Medio porcentaje
                                    "3.5": percentages_with_values[2][1]   # Menor porcentaje
                                }
                            }
                        else:
                            team_data = {
                                "team": team_name,
                                "goals": {
                                    "1.5": "N/A",
                                    "2.5": "N/A",
                                    "3.5": "N/A"
                                }
                            }
                        
                        self.actualizar_equipo(team_data)
                        processed += 1
                            
                except Exception as e:
                    continue
                    
            logger.info(f"✅ Goals: {processed} equipos procesados")
            return True
            
        except Exception as e:
            logger.error(f"Error extrayendo goals: {e}")
            return False

    def actualizar_equipo(self, team_data):
        """Actualiza o agrega datos de un equipo"""
        team_name = team_data["team"]
        
        existing_team = None
        for team in self.data["teams"]:
            if team["team"] == team_name:
                existing_team = team
                break
        
        if existing_team:
            existing_team.update(team_data)
        else:
            self.data["teams"].append(team_data)

    def guardar_datos(self):
        """Guarda todos los datos en el archivo JSON"""
        try:
            directorio = os.path.dirname(self.output_file)
            if directorio:
                os.makedirs(directorio, exist_ok=True)
            
            try:
                self.data["teams"].sort(key=lambda x: int(x.get("position", 999)))
            except:
                pass
            
            with open(self.output_file, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, indent=4)
                
            logger.info(f"📁 Datos guardados en {self.output_file}")
            return True
            
        except Exception as e:
            logger.error(f"Error guardando datos: {e}")
            return False

    def mostrar_resumen(self):
        """Resumen simple"""
        logger.info("=" * 50)
        logger.info(f"📊 Total de equipos: {len(self.data['teams'])}")
        logger.info("=" * 50)

    def ejecutar_scraping_completo(self):
        """Ejecución SIMPLE"""
        logger.info("🚀 INICIANDO SCRAPER BRASIL SIMPLE")
        logger.info("=" * 60)
        
        if not self.configurar_driver():
            return False
        
        try:
            extracciones = [
                ("Standings", self.extraer_standings),
                ("BTTS", self.extraer_btts),
                ("Cards", self.extraer_cards),
                ("Corners", self.extraer_corners),
                ("Goals", self.extraer_goals)
            ]
            
            exitosos = 0
            for nombre, funcion in extracciones:
                logger.info(f"\n--- {nombre} ---")
                try:
                    if funcion():
                        exitosos += 1
                    else:
                        logger.warning(f"⚠️ Falló {nombre}")
                except Exception as e:
                    logger.error(f"❌ Error en {nombre}: {e}")
            
            if self.data["teams"]:
                if self.guardar_datos():
                    self.mostrar_resumen()
                    logger.info(f"🎉 COMPLETADO: {exitosos}/5 módulos")
                    return True
                    
        except Exception as e:
            logger.error(f"❌ Error: {e}")
        finally:
            if self.driver:
                try:
                    self.driver.quit()
                except:
                    pass
                logger.info("🔒 Driver cerrado")
        
        return False

if __name__ == "__main__":
    scraper = BrasilScraper()
    scraper.ejecutar_scraping_completo()