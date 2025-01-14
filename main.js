import { mostrarRutinas } from "./components/rutinas.js";
import { BotonCrearRutina } from "./components/crearRutina.js";

import './firebase/config.js'
import { MostrarMenuRegistro } from "./components/registro.js";
import { Comentarios } from "./components/comentarios.js";


//BotonCrearRutina()

const botonMostrarRutinas = document.getElementById('mostrar-rutinas-button');
botonMostrarRutinas.addEventListener('click', () => {
    mostrarRutinas()
});

const botonMostrarRegistro = document.getElementById('mostrar-registro-button');
botonMostrarRegistro.addEventListener('click', () => {
    MostrarMenuRegistro()
});

const botonComentarios = document.getElementById('enviar-comentarios');
botonComentarios.addEventListener('click', ()=>{
    Comentarios()
});

const toggleButton = document.getElementById("toggle-button");
const audioPlayer = document.getElementById("audio-player");
const play = document.getElementById('play')
const pause = document.getElementById('pause')
toggleButton.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        play.style.display = 'none'
        pause.style.display = 'block'
    } else {
        audioPlayer.pause();
        play.style.display = 'block'
        pause.style.display = 'none'
    }
});

const userValue = localStorage.getItem('User');
const iniciarSesionBoton = document.getElementById('iniciar-sesion');

if (userValue) {
    // Si existe un valor, ocultar el botón
    iniciarSesionBoton.style.display = 'none';
    const bienvenida = document.getElementById('bienvenida');
    bienvenida.textContent = `Bienvenido ${userValue}`
} else {
    // Si no existe un valor, agregar el evento al botón
    iniciarSesionBoton.addEventListener('click', () => {
        const contenedorLogin = document.getElementById('contenedor-login');
        contenedorLogin.style.display = 'block';
    });
}


const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', (event) => {
    const usuario = document.getElementById('usuario').value;
    console.log(`Usuario ingresado: ${usuario}`);
    
    localStorage.setItem('User', usuario);

    alert(`Bienvenido ${usuario}`);
});




