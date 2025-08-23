import os
import subprocess
import sys

def execute_scripts_in_order(root_folder, selected_leagues):
    # Orden específico de los scripts
    script_order = ["standings"]

    for league_folder in selected_leagues:
        league_path = os.path.join(root_folder, league_folder)

        if os.path.isdir(league_path):
            print(f"Ejecutando scripts en la liga: {league_folder}")

            # Obtener todos los archivos .py en la carpeta de la liga
            py_files = sorted([f for f in os.listdir(league_path) if f.endswith('.py')])

            # Ejecutar los scripts en el orden especificado
            for script in script_order:
                # Buscar un archivo que contenga el nombre del script
                for py_file in py_files:
                    if script in py_file:
                        script_path = os.path.join(league_path, py_file)
                        try:
                            subprocess.run([sys.executable, script_path], check=True)
                            print(f"Script {py_file} ejecutado correctamente.")
                        except subprocess.CalledProcessError as e:
                            print(f"Error al ejecutar el script {py_file}: {e}")
                        break
                else:
                    print(f"Script que contiene '{script}' no encontrado en {league_folder}")

def main():
    root_folder = "scraper"

    # Verificar que la ruta a scraper sea correcta
    if not os.path.isdir(root_folder):
        print(f"La carpeta {root_folder} no existe en el directorio actual.")
        return

    # Obtener la lista de ligas disponibles
    leagues = sorted([name for name in os.listdir(root_folder)
                      if os.path.isdir(os.path.join(root_folder, name))])

    if not leagues:
        print("No se encontraron ligas en la carpeta scraper.")
        return

    print("Ligas disponibles:")
    for i, league in enumerate(leagues, start=1):
        print(f"{i}. {league}")

    selections = input("Ingrese los números de las ligas que desea ejecutar, separados por comas: ")
    selected_indices = [int(idx.strip()) for idx in selections.split(",") if idx.strip().isdigit()]

    selected_leagues = [leagues[i-1] for i in selected_indices if 1 <= i <= len(leagues)]

    if not selected_leagues:
        print("Ninguna liga seleccionada.")
        return

    execute_scripts_in_order(root_folder, selected_leagues)

if __name__ == "__main__":
    main()
