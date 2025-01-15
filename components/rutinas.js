import { getDocuments , actualizarSerie} from "../firebase/firestore.js";
const userActual = localStorage.getItem('User');
import { CrearRutina } from "./crearRutina.js";
import { mostrarCargando } from "./loading.js";
const rutaUsuarioARutinas = `users/${userActual}/Rutinas`;
const contenedorPrincipal = document.getElementById('mis-rutinas');
const home = document.getElementById('home');
const seccionRutinas = document.querySelector('#lista-de-rutinas');
const seccionDias = document.querySelector('#lista-dias');
const seccionEjercicios = document.querySelector('#lista-ejercicios');


function crearBotonVolverAtras(){
    const volverAtras = document.createElement('button');
    volverAtras.classList.add('volver-atras');
    volverAtras.textContent = '<';
    seccionRutinas.appendChild(volverAtras);
    
    volverAtras.addEventListener('click',() => {
        seccionRutinas.style.display = 'none';
        home.style.display = 'flex';
    });
}

function crearBotonCrearRutina() {
    const crearRutina = document.createElement('button');
    const h1 = document.createElement('h1');
    h1.textContent = 'Agregar Rutina';

    crearRutina.classList.add('rutina-card');
    crearRutina.id = 'crear-rutina'; 

    crearRutina.appendChild(h1);

    crearRutina.addEventListener('click', () => {
        CrearRutina()
    })
    return crearRutina;
}
// Función principal
export async function mostrarRutinas() {
    try {
        contenedorPrincipal.style.display = 'block'
        home.style.display = 'none';
        const rutinas = await getDocuments(rutaUsuarioARutinas);
        limpiarYMostrarSecciones(seccionDias,seccionRutinas)
        crearBotonVolverAtras()
        rutinas.forEach(rutina => {
            const rutinaCard = crearRutinaCard(rutina);
            seccionRutinas.appendChild(rutinaCard);
        });
        
        seccionRutinas.appendChild(crearBotonCrearRutina());

    } catch (error) {
        console.error("Error al mostrar las rutinas:", error);
    }
}

// Función para mostrar los días de una rutina
async function mostrarDiasDeLaRutina(rutina) {
    try {
        const rutaDias = `users/${userActual}/Rutinas/${rutina.id}/Dias`;
        const dias = await getDocuments(rutaDias);
        console.log("Días:", dias);
        limpiarYMostrarSecciones(seccionRutinas,seccionDias)

        seccionDias.appendChild(botonVolverAtras(seccionDias,seccionRutinas));

        dias.forEach(dia => {
            const diaCard = crearDiaCard(dia, rutina.id);
            seccionDias.appendChild(diaCard);
        });
    } catch (error) {
        console.error("Error al obtener los días:", error);
    }
}

// Función para crear la tarjeta de una rutina
function crearRutinaCard(rutina) {
    const rutinaCard = document.createElement('button');
    rutinaCard.classList.add('rutina-card');

    const h1 = document.createElement('h1');
    h1.textContent = `${rutina.Nombre}`;

    rutinaCard.addEventListener('click', () => mostrarDiasDeLaRutina(rutina));

    rutinaCard.appendChild(h1);

    return rutinaCard;
}

// Función para crear la tarjeta de un día
function crearDiaCard(dia, IdRutina) {
    const diaCard = document.createElement('button');
    diaCard.classList.add('dia-card');

    const tituloDia = document.createElement('h2');
    tituloDia.textContent = dia.Nombre || "Día sin nombre"; // Por si el nombre no existe

    diaCard.addEventListener('click', () => mostrarEjerciciosPorDia(dia, IdRutina));

    diaCard.appendChild(tituloDia);
 
    return diaCard;
}

// Función para mostrar ejercicios por día
async function mostrarEjerciciosPorDia(dia, IdRutina) {
    try {
        document.body.style.overflow = 'auto'
        const rutaEjercicios = `users/${userActual}/Rutinas/${IdRutina}/Dias/${dia.id}/Ejercicios`;
        const ejercicios = await getDocuments(rutaEjercicios);
        console.log("Ejercicios del día:", ejercicios);
        console.log(seccionDias);
        
        limpiarYMostrarSecciones(seccionDias,seccionEjercicios)

        // Botón para volver atrás
        seccionEjercicios.appendChild(botonVolverAtras(seccionEjercicios,seccionDias, 1));

        // Usamos for...of para manejar las llamadas asíncronas
        for (const ejercicio of ejercicios) {
            const rutaEjercicio = `${rutaEjercicios}/${ejercicio.id}`;
            const seriesDelEjercicio = await getDocuments(`${rutaEjercicio}/Series`); // Esperamos a que se resuelva
            console.log(`Series del ejercicio ${ejercicio.id}:`, seriesDelEjercicio);

            const ejercicioCard = crearEjercicioCard(ejercicio, rutaEjercicio, seriesDelEjercicio);
            seccionEjercicios.appendChild(ejercicioCard);
        }
    } catch (error) {
        console.error("Error al obtener los ejercicios del día:", error);
    }
}

// Función para crear la tarjeta de un ejercicio
function crearEjercicioCard(ejercicio,ruta,series) {
    const ejercicioCard = document.createElement('div');
    ejercicioCard.classList.add('ejercicio-card');
    const pesoRepes = document.createElement('h3');
    pesoRepes.textContent = 'peso-repes';
    ejercicioCard.appendChild(mostrarNombreDelEjercicio(ejercicio));
    ejercicioCard.appendChild(pesoRepes);
    ejercicioCard.appendChild(ConstruirContenedorSeries(series,ruta)); 
    
    return ejercicioCard;
}

function mostrarNombreDelEjercicio(ejercicio){
    const nombreDelEjercicio = document.createElement('h2');
    nombreDelEjercicio.textContent = ejercicio.Nombre || "Ejercicio sin nombre"; // Ajusta al campo correcto
    return nombreDelEjercicio;
}

function ConstruirContenedorSeries(series, rutaEjercicio) {
    const contenedorSeries = document.createElement('div');
    contenedorSeries.classList.add('contenedor-series'); 
    let contador = 1;

    series.forEach((serie, index) => {
        const contenedorSerie = document.createElement('div');
        contenedorSerie.classList.add('serie-item');
        contenedorSerie.id = `serie-${serie.id}`; // Asignar un ID único

        const indice = document.createElement('p');
        indice.textContent = `${contador}`;

        const peso = document.createElement('p');
        peso.textContent = `${serie.Peso || '-'}`;
        peso.classList.add('peso'); // Clase para localizar este elemento

        const repeticiones = document.createElement('p');
        repeticiones.textContent = `${serie.Repeticiones || '-'}`;
        repeticiones.classList.add('repeticiones'); // Clase para localizar este elemento

        const botonActualizar = document.createElement('button');
        botonActualizar.textContent = 'Actualizar';
        botonActualizar.addEventListener('click', () => {
            actualizarSerie(rutaEjercicio, serie.id, index, userActual);
        });

        console.log(contador)

        contenedorSerie.appendChild(indice);
        contenedorSerie.appendChild(peso);
        contenedorSerie.appendChild(repeticiones);
        contenedorSerie.appendChild(botonActualizar);

        contenedorSeries.appendChild(contenedorSerie);
        contador++;
    });

    return contenedorSeries;
}


function botonVolverAtras(seccionDias,seccionRutinas, overflow){
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
        console.log(overflow)
        document.body.style.overflow = 'hidden'
    }

    mostrarCargando();
}

function limpiarYMostrarSecciones(seccionAnterior, seccionActual){
    seccionActual.innerHTML = ''; // Limpia la sección
    seccionAnterior.style.display = 'none';
    seccionActual.style.display = 'flex';
    mostrarCargando();
}
