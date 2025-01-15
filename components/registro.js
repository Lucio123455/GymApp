import { mostrarCargando } from "./loading.js";
const contenedorPrincipal = document.getElementById('registro');

export function MostrarMenuRegistro() {
    const contenedorRegistro = document.getElementById('menu');
    const contenedorHome = document.getElementById('home');
    
    
    organizarRegistroPrincipal(contenedorRegistro, contenedorHome,contenedorPrincipal);

}

function organizarRegistroPrincipal(contenedorRegistro, contenedorHome,contenedorPrincipal){
    contenedorRegistro.innerHTML = '';
    contenedorRegistro.style.display = 'flex';
    contenedorPrincipal.style.display = 'block';
    contenedorHome.style.display = 'none';
    const botonVolverAtras = CrearbotonVolverAtras(contenedorRegistro,contenedorHome)
    const registroEjerciciosButton = CrearBotonRegistrosEjercicios(contenedorRegistro);

    contenedorRegistro.appendChild(registroEjerciciosButton)
    contenedorRegistro.appendChild(botonVolverAtras)
}

function CrearBotonRegistrosEjercicios(contenedorRegistro) {
    const registroEjercicios = document.createElement('button');
    const h1 = document.createElement('h1');
    h1.textContent = 'Registro ejercicios';

    registroEjercicios.classList.add('registro-card');
    registroEjercicios.id = 'mostrar-registro-ejercicios';

    registroEjercicios.appendChild(h1);

    registroEjercicios.addEventListener('click', () => {
        MostrarRegistroEjercicios(contenedorRegistro)
    })
    return registroEjercicios;
}

function MostrarRegistroEjercicios(contenedorRegistro){
    window.location.href = './pages/registros.html'
}

function CrearbotonVolverAtras(seccionDias,seccionRutinas, overflow){
    const volverAtras = document.createElement('button');
    volverAtras.classList.add('volver-atras')
    volverAtras.addEventListener('click', () => VolverAtras(seccionDias, seccionRutinas, overflow));
    volverAtras.textContent = '<'
    return volverAtras
}

function VolverAtras(seccionActual, seccionAnterior, overflow){
    seccionActual.style.display = 'none';
    seccionAnterior.style.display = 'flex'
    console.log(overflow)
    if (overflow === 1)   {
        document.body.style.overflow = 'hidden'
    }

    contenedorPrincipal.style.display = 'none'

    mostrarCargando();
}
