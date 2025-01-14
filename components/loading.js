export function mostrarCargando() {
    const loadingOverlay = document.getElementById('loading');

    // Mostrar el símbolo de carga
    loadingOverlay.style.display = 'flex';

    // Después de 1 segundo, ocultar el símbolo de carga
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 300); // 1000 milisegundos = 1 segundo
}