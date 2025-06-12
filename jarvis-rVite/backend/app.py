from flask import Flask, request, jsonify
from flask_cors import CORS
import pyautogui
import time
import os
import re
import unicodedata
import string
from datetime import datetime
import pygetwindow as gw

app = Flask(__name__)
CORS(app)

# --- Diccionario de programas ---
PROGRAMAS = {
    "edge": {"open": "msedge", "kill": "msedge.exe", "ventana": "edge"},
    "navegador": {"open": "msedge", "kill": "msedge.exe", "ventana": "edge"},
    "spotify": {"open": "spotify", "kill": "spotify.exe", "ventana": "spotify"},
    "discord": {"open": "discord", "kill": "discord.exe", "ventana": "discord"},
    "paint": {"open": "mspaint", "kill": "mspaint.exe", "ventana": "paint"},
    "bloc": {"open": "notepad", "kill": "notepad.exe", "ventana": "notepad"},
    "notas": {"open": "notepad", "kill": "notepad.exe", "ventana": "notepad"},
    "notepad": {"open": "notepad", "kill": "notepad.exe", "ventana": "notepad"},
    "brave": {"open": "brave", "kill": "brave.exe", "ventana": "brave"},
    "vscode": {"open": "code", "kill": "Code.exe", "ventana": "visual studio code"},
    "visual studio code": {"open": "code", "kill": "Code.exe", "ventana": "visual studio code"},
}


# --- Función para quitar acentos ---
def quitar_acentos(texto):
    texto_normalizado = unicodedata.normalize('NFD', texto)
    texto_sin_acentos = ''.join(
        c for c in texto_normalizado
        if unicodedata.category(c) != 'Mn'
    )
    return texto_sin_acentos

def normalizar_lista(lista):
    return [quitar_acentos(palabra.lower()) for palabra in lista]

# --- Listas de palabras clave normalizadas ---
palabras_relleno = normalizar_lista([
    "por favor", "porfa", "puedes", "podrias", "quiero que",
    "me gustaria que", "jarvis"
])

abrir_keywords = normalizar_lista([
    "abrir", "abre", "inicia", "ejecuta", "lanza", "abras"
])

cerrar_keywords = normalizar_lista([
    "cerrar", "cierra", "deten", "termina", "apaga", "cierres"
])

musica_keywords = normalizar_lista([
    "busca", "buscar", "reproduce", "escuchar",
    "quiero escuchar", "pon", "poner", "play"
])

plataformas_musica = normalizar_lista([
    "spotify", "youtube", "yt", "deezer", "apple music"
])

hora_keywords = normalizar_lista([
    "hora es", "dime la hora", "que hora tienes", "sabes la hora", "que horas son"
])

despedidas = normalizar_lista([
    "adios", "hasta luego", "nos vemos", "chao", "hasta pronto", "camara"
])

saludos = normalizar_lista([
    "hola", "buenos dias", "buenas tardes", "buenas noches", "saludos"
])

cambiar_cancion_keywords = [
    "cambia de cancion",
    "cambiale de cancion",
    "cambia cancion",
    "cambiar cancion",
    "siguiente cancion",
    "pasa cancion",
    "siguiente",
    "cambiale nada mas",
    "cambia nada mas",
]

minimizar_keywords = normalizar_lista(["minimiza", "minimizar", "minimiza ventana"])
maximizar_keywords = normalizar_lista(["maximiza", "maximizar", "maximiza ventana"])

#funciones para controlar ventanas

def maximizar_ventana(nombre_programa):
    if nombre_programa not in PROGRAMAS:
        print(f"El programa '{nombre_programa}' no está en el diccionario.")
        return False

    ventana_objetivo = PROGRAMAS[nombre_programa]["ventana"].lower()
    for ventana in gw.getAllWindows():
        if ventana_objetivo in ventana.title.lower():
            ventana.maximize()
            print(f"Ventana maximizada: {ventana.title}")
            return True

    print(f"No se encontró ventana que contenga: '{ventana_objetivo}'")
    return False

def minimizar_ventana(nombre_programa):
    if nombre_programa not in PROGRAMAS:
        print(f"El programa '{nombre_programa}' no está en el diccionario.")
        return False

    ventana_objetivo = PROGRAMAS[nombre_programa]["ventana"].lower()
    for ventana in gw.getAllWindows():
        if ventana_objetivo in ventana.title.lower():
            ventana.minimize()
            print(f"Ventana minimizada: {ventana.title}")
            return True

    print(f"No se encontró ventana que contenga: '{ventana_objetivo}'")
    return False
# --- Funciones Auxiliares ---

def limpiar_comando(texto):
    texto = texto.lower()
    texto = quitar_acentos(texto)
    # Quitar signos de puntuación comunes
    texto = texto.translate(str.maketrans('', '', string.punctuation))
    # Quitar palabras relleno
    for palabra in palabras_relleno:
        texto = texto.replace(palabra, "")
    # Quitar espacios extras
    texto = re.sub(r'\s+', ' ', texto).strip()
    return texto

def construir_patron_musica():
    keywords_escaped = [re.escape(kw) for kw in musica_keywords]
    relleno_escaped = [re.escape(pr) for pr in palabras_relleno]
    plataformas_escaped = [re.escape(pl) for pl in plataformas_musica]
    
    return re.compile(
        r"(?:" + "|".join(keywords_escaped) + r")" +      # Keywords música
        r"(?:[\s,]*(?:" + "|".join(relleno_escaped) + r")*)*[\s,]*" +  # Palabras relleno
        r"([^,]+?)\s*" +                                  # Término búsqueda (grupo 1)
        r"(?:en\s+(" + "|".join(plataformas_escaped) + r"))?" +  # Plataforma (grupo 2)
        r"$",
        re.IGNORECASE
    )

patron_musica = construir_patron_musica()

def buscar_en_spotify(busqueda):
    try:
        os.startfile("spotify")
        time.sleep(3)
        pyautogui.hotkey('ctrl', 'k')
        time.sleep(1)
        pyautogui.write(busqueda, interval=0.05)
        pyautogui.press('enter')
        return True
    except Exception as e:
        print(f"Error al buscar en Spotify: {e}")
        return False

def cambiar_cancion_spotify():
    try:
        os.startfile("spotify")
        time.sleep(3)
        pyautogui.hotkey("ctrl", "right")  # Cambiar a la siguiente canción
        return True
    except Exception as e:
        print(f"Error al cambiar canción en Spotify: {e}")
        return False

def abrir_programa(programa):
    programa = quitar_acentos(programa)
    if programa in PROGRAMAS:
        try:
            os.startfile(PROGRAMAS[programa]["open"])
        except Exception as e:
            print(f"Error al abrir {programa}: {e}")

def cerrar_programa(programa):
    programa = quitar_acentos(programa)
    if programa in PROGRAMAS:
        try:
            os.system(f'taskkill /f /im {PROGRAMAS[programa]["kill"]}')
        except Exception as e:
            print(f"Error al cerrar {programa}: {e}")

def subir_volumen():
    for _ in range(10):
        pyautogui.press('volumeup')

def bajar_volumen():
    for _ in range(10):
        pyautogui.press('volumedown')

@app.route('/command', methods=['POST'])
def handle_command():
    data = request.get_json()
    if not data or "command" not in data:
        return jsonify({"message": "No se recibió un comando válido"}), 400

    command_original = data["command"]
    command = limpiar_comando(command_original)

    print(f"Comando limpio recibido: {command}")

    # Hora
    if any(hora in command for hora in hora_keywords):
        ahora = datetime.now().strftime("%H:%M")
        return jsonify({
            "message": f"Son las {ahora}",
            "es_hora": True
        })

    # Despedidas
    if any(despedida in command for despedida in despedidas):
        return jsonify({
            "message": "¡Hasta luego! Avísame si necesitas algo más.",
            "es_despedida": True
        })

    # Saludos
    hora_actual = datetime.now().hour
    saludo_temporal = "Buenos días" if 5 <= hora_actual < 12 else "Buenas tardes" if 12 <= hora_actual < 19 else "Buenas noches"
    if any(saludo in command for saludo in saludos):
        return jsonify({
            "message": f"¡{saludo_temporal}! ¿En qué puedo ayudarte?",
            "es_saludo": True
        })

    # Comando Música
    match = patron_musica.search(command)
    if match:
        busqueda = match.group(1).strip()
        plataforma = match.group(2).lower() if match.group(2) else "spotify"
        plataforma = quitar_acentos(plataforma)

        if plataforma == "yt":
            plataforma = "youtube"

        print(f"Búsqueda detectada: '{busqueda}'")
        print(f"Plataforma detectada: '{plataforma}'")

        if plataforma == "spotify":
            if buscar_en_spotify(busqueda):
                return jsonify({"message": f"Reproduciendo '{busqueda}' en Spotify..."})
            else:
                return jsonify({"message": "No pude buscar en Spotify."})
        else:
            return jsonify({"message": f"Plataforma '{plataforma}' no soportada aún"})

    # Comandos abrir/cerrar programas
    action = None
    for palabra in abrir_keywords:
        if re.search(rf"\b{palabra}\b", command):
            action = "open"
            break
    if not action:
        for palabra in cerrar_keywords:
            if re.search(rf"\b{palabra}\b", command):
                action = "kill"
                break

    program = None
    for key in PROGRAMAS:
        key_sin_acentos = quitar_acentos(key)
        if re.search(rf"\b{key_sin_acentos}\b", command):
            program = key
            break

    if action:
        if program:
            if action == "open":
                abrir_programa(program)
                return jsonify({"message": f"{program.capitalize()} abierto."})
            elif action == "kill":
                cerrar_programa(program)
                return jsonify({"message": f"{program.capitalize()} cerrado."})
        else:
            return jsonify({"message": "Acción detectada pero no encontré el programa. ¿Podrías intentar de nuevo?"})

    # Comandos para subir o bajar volumen
    if "sube volumen" in command or "subir volumen" in command or "aumenta volumen" in command or "subele" in command:
        subir_volumen()
        return jsonify({"message": "Volumen aumentado."})
    if "baja volumen" in command or "bajar volumen" in command or "disminuye volumen" in command or "bajale" in command:
        bajar_volumen()
        return jsonify({"message": "Volumen bajado."})
    
    # Detectar comando para cambiar canción
    if any(frase in command for frase in cambiar_cancion_keywords):
        if cambiar_cancion_spotify():
            return jsonify({"message": "Cambiando a la siguiente canción en Spotify..."})
        else:
            return jsonify({"message": "No pude cambiar la canción en Spotify."})\
    
    # Comando minimizar
    if any(palabra in command for palabra in minimizar_keywords):
        for programa in PROGRAMAS:
            if programa in command:
                if minimizar_ventana(programa):
                    return jsonify({"message": f"Minimizando {programa}..."})
                else:
                    return jsonify({"message": f"No se pudo minimizar {programa}."})
        return jsonify({"message": "¿Qué ventana quieres minimizar?"})

    # Comando maximizar
    if any(palabra in command for palabra in maximizar_keywords):
        for programa in PROGRAMAS:
            if programa in command:
                if maximizar_ventana(programa):
                    return jsonify({"message": f"Maximizando {programa}..."})
                else:
                    return jsonify({"message": f"No se pudo maximizar {programa}."})
        return jsonify({"message": "¿Qué ventana quieres maximizar?"})
        

 
    return jsonify({"message": "No entendí el comando, intenta reformularlo."})


if __name__ == '__main__':
    app.run(debug=True)
