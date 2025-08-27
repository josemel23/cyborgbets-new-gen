// Nombre clave para almacenamiento en localStorage
const STORAGE_KEY = 'seccionesDesbloqueadas';

// CÓDIGOS INTEGRADOS - Agrega más códigos aquí manualmente
const CODIGOS_SECCIONES = {
"ligas": [
"ygJbnHl2l",
"yj3OpRgg2",
"xVThQ61lG",
"ZKJwkZPqt",
"Z2PBVWEVi",
"YFmLOQIkZ",
"YCt0kVUf3",
"XlRHZGaCK",
"XHRotLP6q",
"WrGaFaVwq",
"WHmwZ5hXx",
"VIotasFKv",
"QyDyTJDCh",
"MD4YJyYJa",
"MYeTg4BdY",
"KFZn94KjS",
"KBYeTDyOk",
"JOOhSh0eZ",
"GHNwiO9Xg",
"FJ7NCL2Jo",
"FB1amKGiH",
"DZwOBfDaH",
"BUk3R3l6H",
"ADeRW8QLc",
"A1ihkVc2o",
"8J3gD5ebB",
"6Bx4VKv66",
"5ozo9ZqdJ",
"4H8ejazMV",
"3IH9x2CTY",
"2bTY52zPh",
"05Zz3TqNv",
"lywha3BLC",
"p6hd7WqKG",
"p3keqNl47",
"fWd5p2zlR",
"csz3Vh4s9",
"cni5oU8oL",
"cA2o8vmWH",
"bkHDQNevz",
"acHZZUIDE"
  ],
"CyborgMatch": [
"x4QMFlkyx",
"vb8Cme7Y9",
"tqyIFAuPh",
"tUWj2Nkrt",
"sYDvmk1ng",
"s6YrWiTvO",
"r7N78TOmZ",
"qRkTo3k96",
"lK8dtVmjY",
"l90HlYd6n",
"jf8sM6EsU",
"fxQ2lHb5Z",
"ek9EmUTBf",
"bkaiIok8U",
"bh4A1AGLH",
"a9qymNO3A",
"ZruNcyddx",
"ZeignpNvV",
"Zc7A3lTDJ",
"ZBBOucHMG",
"YVaSgZEgR",
"YDs8IcpjH",
"WIv3QbhgH",
"Va0YEIAc9",
"QF6jHcyf0",
"Nzf9nyXks",
"M8eg4fKdi",
"LeKXLEkcR",
"KzIELKcus",
"IBzDP7ghC",
"FELncw3W7",
"F6HgYmK6z",
"DL2e1yDOP",
"AYNuRMBLW",
"A2ZtHmA7i",
"8O2GLlp97",
"5AT42j6Jx",
"3hw3oApQo",
"2PyZAuoVf"
  ],
 "radar": [
"vpuJBVupx",
"vRTjeQuLg",
"ssRG1Wj22",
"pwplPdBiZ",
"prksMcvwl",
"gisqxYZ0u",
"fGe6QupEE",
"f8yBhKOZg",
"eutakjNor",
"eOGMckWta",
"bSqjIWunA",
"bGALSASso",
"YbJv6DARb",
"YOuUzdh35",
"YGCN7FeX7",
"XSsaoghSg",
"WyUxvLjMA",
"Vh4zkCKVn",
"VPbQX5q9W",
"V48LEofzO",
"UMJkn5f6a",
"TmifWt2xu",
"TEpSTpfPA",
"MZZCXEycc",
"LyULjpopw",
"L8rsvRGMj",
"GF2ZbYtq7",
"FRCn0kIP5",
"BcLiQlWju",
"B6HhIa2zg",
"AutrgAKKk",
"AjPK1E3VJ",
"ALPaRfEYf",
"8fvyerK8n",
"8W3QsxLYS",
"7CireCvJH",
"5GxxSPNRe",
"2Qc95pFEm",
"2EWkSuqdk"
  ],
"estadisticas": [
"zbIp9gH2f",
"xupKFHrsf",
"xA4LuczWH",
"wpCcTGIuN",
"uWWcgxcAN",
"uLbmwTWpX",
"tKOjNmjUk",
"ru7LHOSNq",
"rshNuKDkb",
"od7LRNO8j",
"nvuIChBgT",
"mzFtSHd8A",
"mTyQYuuyG",
"kWt6rfuaJ",
"iMyD4vOtN",
"iEplPiiV4",
"hR3gIDhac",
"h1NrnS1Lc",
"gmv0bcstT",
"e8ja3aGWA",
"dDI1TgVny",
"ciXP0QhtM",
"ZDP3Z1lq5",
"V4XNDlM7E",
"UYJjo1jEy",
"UG4lvxKt0",
"R8H7et3aI",
"P2FuM693B",
"LjPdMDUQG",
"Kus0sXUOw",
"GtKzrPAWz",
"EWRaywtGg",
"E8REW3ZuE",
"DeOVAd2ur",
"7yy4ArK8M",
"6NJ8tBUkH",
"4nBTsPv9J",
"45wmVCIwu",
"1HvuJTs24"
  ],
  "nba": [
"zs3Qil154",
"ydclvhmVk",
"szDrPxGuw",
"sw8agys6X",
"qZjwCbRlm",
"p7TcJjR1N",
"mhmrtwQVN",
"lcvC09LpA",
"kyLtDZhJS",
"i5aefoEMz",
"hulJjysXn",
"gxbTKOHj5",
"gHIo37VEr",
"cu5pdAjYn",
"cpOtuquy1",
"bIdXBhbRd",
"VlBuR4nsa",
"TozwK34Hr",
"TQteSEL86",
"ReQ5KbPi6",
"Ranfa2qfa",
"Od3Mp6UJ7",
"NoXHuH07t",
"MwwgYLTUe",
"MQLmtPwFt",
"JjuP8pUhQ",
"H8pe2Nk7Y",
"H7A00TJch",
"GiMACfwve",
"G1CPETFfA",
"AgAeCs7Tn",
"9yKUVKTR5",
"8N6fb99mF",
"8BAS4bIXe",
"7XBJ7bEoH",
"6UeJNKIQX",
"3gBnZHnwq",
"2Id0SMxkB",
"2I6kWXJ5O",
"22Uy1orCc",
"1bd0jnL4Z"
  ],
  "SmartLine": [
"AL9pM2qR1",
"BF3vN8xW2",
"CY6bP4sK3",
"DQ1rD5zL4",
"EH7cG2oA5",
"FB4eT9yU6",
"GV8kS1nD7",
"HW3jF7mC8",
"IX5lH9pB9",
"JZ2tR4vG1",
"KN6dK3qJ2",
"LM9fL5oS3",
"MA1gT8yH4",
"NE4hU2jK5",
"OD7iV5mN6",
"PC3oW8pQ7",
"QF6pX9rS8",
"RG2qY1tU9",
"SH5rZ4wV1",
"TJ8sA7xY2",
"UK1tB9zL3",
"VL4uC2vM4",
"WM7vD3wN5",
"XN2wE6xO6",
"YO5xF9yP7",
"ZP8yG2zQ8",
"AQ3zH5rT9",
"BR6sI8uV1",
"CS9tJ1wX2",
"DT2uK4yZ3",
"EU5vL7zA4",
"FV8wM2oB5",
"GW1xN5pC6",
"HX4yO8qD7",
"IY7zP1rE8",
"JZ2aQ4sF9",
"KA5bR9tG1",
"LB8cS2uH2",
"MC3dT5vJ3",
"ND6eU8wK4",
"OE9fV1xL5",
"PF4gW4yM6",
"QG7hX7zN7",
"RH2iY2oP8",
"SI5jZ5qR9",
"TJ8kA8sT1",
"UK3lB1uV2",
"VL6mC4wX3",
"WM9nD7yZ4",
"XN2oP5qR5"
]

};

// Configuración de mensajes de bienvenida por sección
const MENSAJES_BIENVENIDA = {
  "ligas": {
    titulo: "¡Bienvenido a Ligas!",
    mensaje: "Has desbloqueado el acceso completo a la sección de Ligas. Disfruta de todas las estadísticas y análisis disponibles.",
    icono: "⚽",
    color: "#28a745"
  },
  "CyborgMatch": {
    titulo: "¡CyborgMatch Activado!",
    mensaje: "Sistema de análisis avanzado desbloqueado. Accede a predicciones y análisis de última generación.",
    icono: "🤖",
    color: "#17a2b8"
  },
  "radar": {
    titulo: "¡Radar Desbloqueado!",
    mensaje: "Has activado el sistema Radar. Explora análisis detallados y seguimiento en tiempo real.",
    icono: "📡",
    color: "#ffc107"
  },
  "estadisticas": {
    titulo: "¡Estadísticas Avanzadas!",
    mensaje: "Acceso completo a estadísticas profesionales. Analiza datos con herramientas de élite.",
    icono: "📊",
    color: "#6f42c1"
  },
  "nba": {
    titulo: "¡NBA Zone Activa!",
    mensaje: "Bienvenido a la experiencia NBA completa. Accede a estadísticas, análisis y predicciones exclusivas.",
    icono: "🏀",
    color: "#fd7e14"
  },
  "SmartLine": {
    titulo: "¡SmartLine Conectado!",
    mensaje: "Sistema inteligente de líneas activado. Disfruta de análisis predictivos avanzados.",
    icono: "🎯",
    color: "#dc3545"
  }
};

// Datos simulados para el escaneo de seguridad
const DATOS_SIMULADOS = {
  ips: [
    "192.168.1.105", "10.0.0.234", "172.16.0.89", "192.168.0.156",
    "10.10.10.67", "172.31.0.145", "192.168.2.78", "10.1.1.199",
    "172.16.5.123", "192.168.100.45", "10.0.5.167", "172.20.0.88"
  ],
  dispositivos: [
    "Android 14 - Samsung Galaxy", "iOS 17.2 - iPhone 15", "Windows 11 - Chrome",
    "macOS Sonoma - Safari", "Linux Ubuntu - Firefox", "Android 13 - Pixel 7",
    "iOS 16.7 - iPad Pro", "Windows 10 - Edge", "Android 12 - OnePlus",
    "macOS Ventura - Chrome", "iOS 17.1 - iPhone 14", "Linux Mint - Chromium"
  ],
  codigos: [
    "AC7F9B2E", "D4K8P1X9", "M2N7Q5R8", "T6Y3W1Z4", "H9L4S6F2",
    "P8X2V5N7", "R1K9M3Q6", "Z4T7Y2W5", "F6H3L8S1", "V5N2P9X4",
    "Q7R1K6M8", "W3Z9T4Y2", "S8F6H1L3", "X4V7N5P2", "M6Q8R9K1"
  ],
  vulnerabilidades: [
    "Buffer overflow detectado", "SQL injection attempt", "Cross-site scripting",
    "Authentication bypass", "Directory traversal", "Command injection",
    "Session hijacking attempt", "Privilege escalation", "Memory corruption",
    "Race condition exploit", "Integer overflow", "Format string attack"
  ]
};

// FUNCIÓN PRINCIPAL: Mostrar escaneo de seguridad (SIEMPRE SE EJECUTA)
function mostrarEscaneoSeguridad() {
  return new Promise((resolve) => {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%);
      z-index: 20000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
      animation: fadeIn 0.5s ease-out;
    `;

    // Crear contenedor del scanner
    const scanner = document.createElement('div');
    scanner.style.cssText = `
      background: rgba(0, 20, 0, 0.95);
      border: 2px solid #00ff00;
      border-radius: 15px;
      padding: 40px;
      max-width: 600px;
      width: 90%;
      color: #00ff00;
      box-shadow: 
        0 0 30px rgba(0, 255, 0, 0.3),
        inset 0 0 20px rgba(0, 255, 0, 0.1);
      position: relative;
      overflow: hidden;
    `;

    // Crear contenido del scanner
    scanner.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 2rem; margin-bottom: 10px; animation: glow 2s infinite;">
          🔍 SCANNER
        </div>
        <div style="font-size: 0.9rem; color: #88ff88; margin-bottom: 20px;">
         Inicializando Escaneo...
        </div>
        <div style="
          width: 100%; 
          height: 4px; 
          background: #003300; 
          border-radius: 2px; 
          overflow: hidden;
          margin-bottom: 20px;
        ">
          <div id="progressBar" style="
            width: 0%; 
            height: 100%; 
            background: linear-gradient(90deg, #00ff00, #88ff88); 
            transition: width 0.1s linear;
          "></div>
        </div>
        <div id="statusText" style="font-size: 1rem; margin-bottom: 20px; color: #ffff00;">
          Activando módulos de protección avanzada...
        </div>
      </div>
      
      <div id="scanResults" style="
        max-height: 300px; 
        overflow-y: auto; 
        font-size: 0.85rem; 
        line-height: 1.4;
        background: rgba(0, 0, 0, 0.5);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #004400;
      ">
        <div style="color: #00ff00; font-weight: bold; margin-bottom: 10px;">
          === INICIANDO ESCANEO DE SEGURIDAD ===
        </div>
      </div>
      
      <div id="finalActions" style="text-align: center; margin-top: 20px; display: none;">
        <div style="color: #00ff00; font-weight: bold; margin-bottom: 15px;">
          ✅ SISTEMA BLINDADO - ACCESO ESTABLECIDO
        </div>
        <button id="continuarApp" style="
          background: linear-gradient(135deg, #00aa00, #008800);
          color: white;
          border: 2px solid #00ff00;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
          font-family: 'Courier New', monospace;
        " 
        onmouseover="this.style.background='linear-gradient(135deg, #00cc00, #00aa00)'; this.style.boxShadow='0 0 25px rgba(0, 255, 0, 0.5)';"
        onmouseout="this.style.background='linear-gradient(135deg, #00aa00, #008800)'; this.style.boxShadow='0 0 15px rgba(0, 255, 0, 0.3)';">
          ACCEDER A LA APLICACIÓN
        </button>
        <div style="margin-top: 10px; font-size: 0.8rem; color: #88ff88;">
          Escaneo completado en ${Math.random() * 3 + 2 | 0}.${Math.random() * 9 + 1 | 0}s
        </div>
      </div>
    `;

    // Agregar efectos CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes glow {
        0%, 100% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00; }
        50% { text-shadow: 0 0 15px #00ff00, 0 0 30px #00ff00, 0 0 40px #00ff00; }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
    `;

    overlay.appendChild(scanner);
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Elementos del DOM
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('statusText');
    const scanResults = document.getElementById('scanResults');
    const finalActions = document.getElementById('finalActions');

    // Función para agregar línea al log
    function agregarLog(mensaje, tipo = 'info') {
      const colores = {
        info: '#00ff00',
        warning: '#ffff00',
        error: '#00ff00',
        success: '#88ff88'
      };
      
      const linea = document.createElement('div');
      linea.style.color = colores[tipo];
      linea.innerHTML = `[${new Date().toLocaleTimeString()}] ${mensaje}`;
      scanResults.appendChild(linea);
      scanResults.scrollTop = scanResults.scrollHeight;
    }

    // Función para obtener elemento aleatorio de un array
    function obtenerAleatorio(array) {
      return array[Math.floor(Math.random() * array.length)];
    }

    // Función para simular el escaneo
    async function ejecutarEscaneo() {
      const etapas = [
  {
    nombre: "Inicializando módulos de defensa...",
    progreso: 18,
    tiempo: 300,
    acciones: () => {
      agregarLog("Cargando módulos de protección avanzada...", 'info');
      agregarLog("Activando escudos perimetrales...", 'info');
      agregarLog("Configurando filtros de contenido...", 'info');
      setTimeout(() => {
        agregarLog("✅ Módulos de defensa: OPERATIVOS", 'success');
      }, 650);
    }
  },
  {
    nombre: "Auditando conexiones entrantes...",
    progreso: 40,
    tiempo: 400,
    acciones: () => {
      agregarLog("Monitoreando puertos de acceso...", 'info');
      for(let i = 0; i < 4; i++) {
        setTimeout(() => {
          agregarLog(`Puerto ${27000 + Math.floor(Math.random() * 1000)}: ${obtenerAleatorio(DATOS_SIMULADOS.ips)} - AUDITANDO`, 'warning');
        }, i * 220);
      }
      setTimeout(() => {
        agregarLog("✅ Todas las conexiones auditadas - AUTORIZADAS", 'success');
      }, 850);
    }
  },
  {
    nombre: "Validando certificados digitales...",
    progreso: 62,
    tiempo: 350,
    acciones: () => {
      agregarLog("Verificando cadena de confianza SSL/TLS...", 'info');
      for(let i = 0; i < 3; i++) {
        setTimeout(() => {
          agregarLog(`Certificado #${i + 1}: SHA-256 ${obtenerAleatorio(DATOS_SIMULADOS.codigos)} - VÁLIDO`, 'info');
        }, i * 280);
      }
      setTimeout(() => {
        agregarLog("✅ Certificados verificados y confiables", 'success');
      }, 800);
    }
  },
  {
    nombre: "Ejecutando análisis heurístico...",
    progreso: 78,
    tiempo: 400,
    acciones: () => {
      agregarLog("Procesando patrones de comportamiento...", 'info');
      agregarLog("Analizando entropía de datos...", 'info');
      for(let i = 0; i < 2; i++) {
        setTimeout(() => {
          agregarLog(`Patrón sospechoso detectado: ${obtenerAleatorio(DATOS_SIMULADOS.vulnerabilidades)}`, 'error');
        }, i * 400);
        setTimeout(() => {
          agregarLog(`🔒 Patrón bloqueado por IA defensiva`, 'success');
        }, (i * 400) + 250);
      }
      setTimeout(() => {
        agregarLog("✅ Análisis heurístico completado", 'success');
      }, 950);
    }
  },
  {
    nombre: "Sincronizando base de datos global...",
    progreso: 94,
    tiempo: 250,
    acciones: () => {
      agregarLog("Conectando con centros de inteligencia...", 'info');
      agregarLog("Descargando definiciones actualizadas...", 'info');
      setTimeout(() => {
        agregarLog(`Sincronización completa: ${Math.floor(Math.random() * 50000 + 150000)} definiciones`, 'info');
        agregarLog("✅ Base de datos actualizada", 'success');
      }, 500);
    }
  },
  {
    nombre: "Generando reporte de seguridad...",
    progreso: 100,
    tiempo: 200,
    acciones: () => {
      agregarLog("Compilando métricas de protección...", 'info');
      setTimeout(() => {
        agregarLog("=== REPORTE DE SEGURIDAD GENERADO ===", 'success');
        agregarLog("✅ Firewall: ACTIVO", 'success');
        agregarLog("✅ Protección: MÁXIMA", 'success');
        agregarLog("✅ Amenazas: NEUTRALIZADAS", 'success');
        agregarLog("✅ Sistema: BLINDADO", 'success');
        agregarLog("🚀 Acceso seguro establecido", 'success');
      }, 250);
    }
  }
];

      for (const etapa of etapas) {
        statusText.textContent = etapa.nombre;
        etapa.acciones();
        
        // Animar progreso
        await new Promise(resolve => {
          const inicio = parseInt(progressBar.style.width) || 0;
          const objetivo = etapa.progreso;
          const duracion = etapa.tiempo;
          const incremento = (objetivo - inicio) / (duracion / 10);
          
          let actual = inicio;
          const intervalo = setInterval(() => {
            actual += incremento;
            if (actual >= objetivo) {
              actual = objetivo;
              progressBar.style.width = actual + '%';
              clearInterval(intervalo);
              setTimeout(resolve, 200);
            } else {
              progressBar.style.width = actual + '%';
            }
          }, 10);
        });
      }

      // Mostrar acciones finales
      statusText.textContent = "Protocolo de seguridad completado - Sistema listo";
      finalActions.style.display = 'block';
    }

    // Event listener para continuar
    document.getElementById('continuarApp').addEventListener('click', () => {
      overlay.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
          document.head.removeChild(style);
        }
        resolve();
      }, 500);
    });

    // Iniciar el escaneo después de un pequeño delay
    setTimeout(ejecutarEscaneo, 500);

    // Auto-continuar después de 12 segundos en la pantalla final
    setTimeout(() => {
      if (finalActions.style.display === 'block' && document.body.contains(overlay)) {
        document.getElementById('continuarApp').click();
      }
    }, 4000);
  });
}

// Mostrar términos y condiciones
function mostrarTerminosCondiciones() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(5px);
      z-index: 15000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 15px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      animation: slideInScale 0.4s ease-out;
      border: 2px solid #007bff;
    `;

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="font-size: 3rem; margin-bottom: 15px;"></div>
        <h2 style="color: #2c3e50; margin: 0; font-size: 1.8rem; font-weight: 700;">
          Términos y Condiciones 
        </h2>
      </div>
      
      <div style="color: #495057; line-height: 1.6; font-size: 0.95rem; margin-bottom: 25px;">
       <p><strong>Usted acepta los siguientes términos:</strong></p>

<p>• <strong>Prevención de Ludopatía:</strong> Esta aplicación es solo para entretenimiento.</p>

<p>• <strong>Uso Responsable:</strong> Las predicciones son orientativos y no garantizan resultados.</p>

<p>• <strong>Advertencia:</strong> El juego puede causar adicción. Juega con responsabilidad.</p>


<p style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
  <strong>⚠️ AVISO IMPORTANTE:</strong> Esta aplicación está prohibida para menores de 18 años.
</p>

      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button id="aceptarTerminos" style="
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        ">Acepto los Términos</button>
        
        <button id="rechazarTerminos" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Rechazar</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const cerrar = (aceptado) => {
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      modal.style.animation = 'slideOutScale 0.3s ease-out';
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        resolve(aceptado);
      }, 300);
    };

    document.getElementById('aceptarTerminos').addEventListener('click', () => cerrar(true));
    document.getElementById('rechazarTerminos').addEventListener('click', () => {
      alert('Debe aceptar los términos para continuar.');
      cerrar(false);
    });
  });
}

// Crear y mostrar modal de bienvenida profesional
function mostrarMensajeBienvenida(seccion) {
  const config = MENSAJES_BIENVENIDA[seccion];
  if (!config) return;

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
  `;

  // Crear modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-radius: 20px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    position: relative;
    animation: slideInScale 0.4s ease-out;
    border: 3px solid ${config.color};
  `;

  // Crear contenido del modal
  modal.innerHTML = `
    <div style="font-size: 4rem; margin-bottom: 20px; animation: bounce 0.6s ease-out 0.2s both;">
      ${config.icono}
    </div>
    <div style="
      width: 60px; 
      height: 4px; 
      background: linear-gradient(90deg, ${config.color}, ${config.color}aa); 
      margin: 0 auto 25px; 
      border-radius: 2px;
      animation: expandBar 0.5s ease-out 0.4s both;
    "></div>
    <h2 style="
      color: #2c3e50; 
      margin: 0 0 15px 0; 
      font-size: 2rem; 
      font-weight: 700;
      animation: fadeInUp 0.5s ease-out 0.3s both;
    ">
      ${config.titulo}
    </h2>
    <p style="
      color: #6c757d; 
      font-size: 1.1rem; 
      line-height: 1.6; 
      margin: 0 0 30px 0;
      animation: fadeInUp 0.5s ease-out 0.4s both;
    ">
      ${config.mensaje}
    </p>
    <div style="
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 10px; 
      margin-bottom: 25px;
      animation: fadeInUp 0.5s ease-out 0.5s both;
    ">
      <div style="
        width: 12px; 
        height: 12px; 
        background: ${config.color}; 
        border-radius: 50%; 
        animation: pulse 2s infinite;
      "></div>
      <span style="color: ${config.color}; font-weight: 600; font-size: 0.95rem;">
        CÓDIGO VERIFICADO ✓
      </span>
    </div>
    <button id="continuarBtn" style="
      background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 8px 25px ${config.color}40;
      animation: fadeInUp 0.5s ease-out 0.6s both;
    " 
    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 12px 35px ${config.color}60';"
    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px ${config.color}40';">
      Continuar al Contenido
    </button>
    <button id="cerrarModal" style="
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #adb5bd;
      cursor: pointer;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    " 
    onmouseover="this.style.background='#e9ecef'; this.style.color='#495057';"
    onmouseout="this.style.background='none'; this.style.color='#adb5bd';">
      ×
    </button>
  `;

  // Agregar animaciones CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideInScale {
      from { transform: translateY(-50px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes fadeInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0, -15px, 0); }
      70% { transform: translate3d(0, -7px, 0); }
      90% { transform: translate3d(0, -2px, 0); }
    }
    @keyframes expandBar {
      from { width: 0; }
      to { width: 60px; }
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideOutScale {
      from { transform: translateY(0) scale(1); opacity: 1; }
      to { transform: translateY(-30px) scale(0.95); opacity: 0; }
    }
  `;

  overlay.appendChild(modal);
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // Event listeners para cerrar
  const cerrarModal = () => {
    overlay.style.animation = 'fadeOut 0.3s ease-out';
    modal.style.animation = 'slideOutScale 0.3s ease-out';
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
      }
    }, 300);
  };

  document.getElementById('continuarBtn').addEventListener('click', cerrarModal);
  document.getElementById('cerrarModal').addEventListener('click', cerrarModal);
  
  // Cerrar con ESC
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Auto-cerrar después de 10 segundos
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      cerrarModal();
    }
  }, 10000);
}

// Obtener array de secciones desbloqueadas desde localStorage (lógica original)
function obtenerSeccionesDesbloqueadas() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Guardar array actualizado de secciones desbloqueadas en localStorage (lógica original)
function guardarSeccionesDesbloqueadas(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// Verificar si una sección está desbloqueada (lógica original)
function estaDesbloqueada(seccion) {
  const desbloqueadas = obtenerSeccionesDesbloqueadas();
  return desbloqueadas.includes(seccion) && CODIGOS_SECCIONES[seccion];
}

// Desbloquear una sección (lógica original - solo guarda el nombre de la sección)
function desbloquearSeccion(seccion) {
  const desbloqueadas = obtenerSeccionesDesbloqueadas();
  if (!desbloqueadas.includes(seccion)) {
    desbloqueadas.push(seccion);
    guardarSeccionesDesbloqueadas(desbloqueadas);
  }
}

// Limpiar secciones que ya no existen en CODIGOS_SECCIONES
function limpiarSeccionesObsoletas() {
  const desbloqueadas = obtenerSeccionesDesbloqueadas();
  const seccionesValidas = desbloqueadas.filter(seccion => CODIGOS_SECCIONES[seccion]);
  
  if (seccionesValidas.length !== desbloqueadas.length) {
    guardarSeccionesDesbloqueadas(seccionesValidas);
  }
}

// Actualizar apariencia visual del menú
function actualizarAparienciaEnlaces() {
  document.querySelectorAll('.nav-link[data-locked="true"]').forEach(link => {
    const originalHref = link.getAttribute('data-original-href');
    const seccion = originalHref ? originalHref.substring(1) : '';
    
    if (estaDesbloqueada(seccion)) {
      link.classList.add('unlocked');
      link.title = 'Sección desbloqueada';
      link.setAttribute('href', originalHref);
    } else {
      link.classList.remove('unlocked');
      link.title = 'Sección bloqueada - requiere código';
      link.removeAttribute('href');
    }
  });
}

// Mostrar notificación de error profesional
function mostrarErrorCodigo() {
  // Crear notificación de error
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(220, 53, 69, 0.3);
    z-index: 9999;
    max-width: 350px;
    animation: slideInRight 0.4s ease-out;
    border-left: 4px solid #ffffff40;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="font-size: 1.5rem;">🚫</div>
      <div>
        <div style="font-weight: 600; margin-bottom: 5px;">Código Incorrecto</div>
        <div style="font-size: 0.9rem; opacity: 0.9;">El código ingresado no es válido. Verifica e intenta nuevamente.</div>
      </div>
    </div>
  `;

  // Agregar animación
  const errorStyle = document.createElement('style');
  errorStyle.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;

  document.head.appendChild(errorStyle);
  document.body.appendChild(notification);

  // Auto-remover después de 4 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.4s ease-out';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
        document.head.removeChild(errorStyle);
      }
    }, 400);
  }, 4000);
}

// Crear input modal profesional para código
function crearInputModal(seccion) {
  return new Promise((resolve) => {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    `;

    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 15px;
      padding: 40px;
      max-width: 450px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      animation: slideInScale 0.4s ease-out;
    `;

    const seccionNombre = seccion.charAt(0).toUpperCase() + seccion.slice(1);
    
    modal.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 20px;">🔐</div>
      <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 1.5rem; font-weight: 600;">
        Desbloquear ${seccionNombre}
      </h3>
      <p style="color: #6c757d; font-size: 1rem; margin: 0 0 25px 0;">
        Ingresa tu código de acceso para continuar
      </p>
      <input type="text" id="codigoInput" placeholder="Código de acceso" style="
        width: 100%;
        padding: 15px;
        border: 2px solid #e9ecef;
        border-radius: 10px;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 25px;
        transition: all 0.3s ease;
        font-family: monospace;
        letter-spacing: 2px;
      " />
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button id="verificarBtn" style="
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Verificar</button>
        <button id="cancelarBtn" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 30px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        ">Cancelar</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input = document.getElementById('codigoInput');
    const verificarBtn = document.getElementById('verificarBtn');
    const cancelarBtn = document.getElementById('cancelarBtn');

    // Enfocar input
    setTimeout(() => input.focus(), 100);

    // Estilo de input focus
    input.addEventListener('focus', () => {
      input.style.borderColor = '#007bff';
      input.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
    });

    input.addEventListener('blur', () => {
      input.style.borderColor = '#e9ecef';
      input.style.boxShadow = 'none';
    });

    // Event listeners
    const cerrar = (valor) => {
      overlay.style.animation = 'fadeOut 0.3s ease-out';
      modal.style.animation = 'slideOutScale 0.3s ease-out';
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        resolve(valor);
      }, 300);
    };

    verificarBtn.addEventListener('click', () => {
      cerrar(input.value.trim());
    });

    cancelarBtn.addEventListener('click', () => {
      cerrar(null);
    });

    // Enter para verificar, Escape para cancelar
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        cerrar(input.value.trim());
      } else if (e.key === 'Escape') {
        cerrar(null);
      }
    });
  });
}

// Bloquea el menú e implementa la lógica del prompt
function bloquearMenu() {
  document.querySelectorAll('.nav-link[data-locked="true"]').forEach(link => {
    const originalHref = link.getAttribute('href');
    if (!link.getAttribute('data-original-href')) {
      link.setAttribute('data-original-href', originalHref);
    }
    
    link.removeAttribute('href');
    link.style.cursor = 'pointer';
    
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const seccion = originalHref.substring(1);
      
      if (estaDesbloqueada(seccion)) {
        window.location.hash = seccion;
        return;
      }
      
      if (CODIGOS_SECCIONES[seccion] && Array.isArray(CODIGOS_SECCIONES[seccion])) {
        const input = await crearInputModal(seccion);
        
        if (input && CODIGOS_SECCIONES[seccion].includes(input)) {
          desbloquearSeccion(seccion);
          actualizarAparienciaEnlaces();
          
          // Mostrar mensaje de bienvenida antes de navegar
          mostrarMensajeBienvenida(seccion);
          
          // Pequeña pausa antes de navegar
          setTimeout(() => {
            window.location.hash = seccion;
          }, 500);
          
        } else if (input) {
          mostrarErrorCodigo();
        }
      } else {
        // Mostrar notificación de sección no disponible
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #ffc107, #e0a800);
          color: #212529;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
          z-index: 9999;
          max-width: 350px;
          animation: slideInRight 0.4s ease-out;
        `;

        notification.innerHTML = `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 1.5rem;">⚠️</div>
            <div>
              <div style="font-weight: 600; margin-bottom: 5px;">Sección No Disponible</div>
              <div style="font-size: 0.9rem; opacity: 0.8;">Esta sección ya no está disponible.</div>
            </div>
          </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 4000);
      }
    });
  });
  
  // Actualizar apariencia inicial
  actualizarAparienciaEnlaces();
}

// Resetear desbloqueos (útil para testing)
function resetearDesbloqueos() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// Función para agregar códigos fácilmente (útil para testing)
function agregarCodigo(seccion, codigo) {
  if (CODIGOS_SECCIONES[seccion]) {
    CODIGOS_SECCIONES[seccion].push(codigo);
    console.log(`Código "${codigo}" agregado a "${seccion}"`);
  } else {
    console.log(`La sección "${seccion}" no existe`);
  }
}

// Función para mostrar códigos disponibles (útil para debugging)
function mostrarCodigos() {
  console.log('Códigos disponibles:', CODIGOS_SECCIONES);
}

// Función para mostrar secciones desbloqueadas (útil para debugging)
function mostrarSeccionesDesbloqueadas() {
  const desbloqueadas = obtenerSeccionesDesbloqueadas();
  console.log('Secciones desbloqueadas:', desbloqueadas);
}

// Función para desbloquear todas las secciones (útil para testing)
function desbloquearTodas() {
  const todasLasSecciones = Object.keys(CODIGOS_SECCIONES);
  todasLasSecciones.forEach(seccion => {
    desbloquearSeccion(seccion);
  });
  actualizarAparienciaEnlaces();
  console.log('Todas las secciones desbloqueadas');
}

// Función para mostrar demo de mensaje de bienvenida (útil para testing)
function mostrarDemoBienvenida(seccion = 'ligas') {
  if (MENSAJES_BIENVENIDA[seccion]) {
    mostrarMensajeBienvenida(seccion);
  } else {
    console.log(`No hay mensaje configurado para la sección "${seccion}"`);
  }
}

// Función para mostrar demo del escaneo de seguridad (útil para testing)
function mostrarDemoEscaneo() {
  mostrarEscaneoSeguridad();
}

// Función para forzar el escaneo en cualquier momento
function ejecutarEscaneoManual() {
  mostrarEscaneoSeguridad().then(() => {
    console.log('Escaneo de seguridad completado manualmente');
  });
}

// INICIALIZACIÓN: El escaneo SIEMPRE se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  // Iniciar audio al cargar la página
const audio = new Audio('audio/new.wav');
audio.volume = 0.7;
audio.loop = true;
audio.play().catch(() => console.log('Audio bloqueado'));
  console.log('🔒 Iniciando protocolo de seguridad...');
  
  // ESCANEO OBLIGATORIO - Se ejecuta SIEMPRE
  await mostrarEscaneoSeguridad();

  // Mostrar términos y condiciones
  const terminosAceptados = await mostrarTerminosCondiciones();
  if (!terminosAceptados) {
    console.log('❌ Términos no aceptados - Cerrando aplicación');
    document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial; color: #6c757d;">Debe aceptar los términos para usar la aplicación.</div>';
    audio.pause();
    return;
  }
  
  console.log('✅ Términos y condiciones aceptados');
  
  console.log('✅ Firewall configurado correctamente');
  
  // Continuar con la inicialización normal
  limpiarSeccionesObsoletas();
  bloquearMenu();
  audio.pause(); // Detener audio cuando termine todo
  
  // Debug: mostrar información del sistema
  console.log('🔐 Sistema de códigos iniciado');
  console.log('📋 Funciones disponibles:');
  console.log('  - mostrarCodigos(): Ver todos los códigos');
  console.log('  - mostrarSeccionesDesbloqueadas(): Ver secciones activas');
  console.log('  - resetearDesbloqueos(): Limpiar todos los desbloqueos');
  console.log('  - desbloquearTodas(): Desbloquear todas las secciones');
  console.log('  - mostrarDemoBienvenida("seccion"): Probar mensaje de bienvenida');
  console.log('  - mostrarDemoEscaneo(): Probar escaneo de seguridad');
  console.log('  - ejecutarEscaneoManual(): Ejecutar escaneo en cualquier momento');
  console.log('  - agregarCodigo("seccion", "codigo"): Agregar nuevo código');
  
  mostrarSeccionesDesbloqueadas();
});