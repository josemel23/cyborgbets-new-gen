// Mostrar overlay de carga
function mostrarCargando() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'flex';
  document.body.classList.add('loading');
}

// Ocultar overlay de carga
function ocultarCargando() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.classList.remove('loading');
}

// Asegura que el overlay esté oculto al cargar
document.addEventListener('DOMContentLoaded', () => {
  ocultarCargando();
});

// Al hacer clic en "Analizar"
document.getElementById('analyzeBtn')?.addEventListener('click', () => {
  const panel = document.getElementById('resultsPanel');
  if (!panel) return;

  panel.classList.remove('visible');
  panel.style.display = 'none';

  mostrarCargando();

  setTimeout(() => {
    ocultarCargando();
    panel.style.display = 'block';
    setTimeout(() => panel.classList.add('visible'), 50);
  }, 2000);
});

// Desde botón "Comenzar Análisis"
function comenzarAnalisis() {
  scrollToSection('predicciones');
  mostrarCargando();

  setTimeout(() => {
    ocultarCargando();
  }, 2000);
}
