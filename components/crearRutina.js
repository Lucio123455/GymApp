import { enviarRutinaALaBaseDeDatos } from "../firebase/firestore.js";
import { alertaSwet } from "./alertas.js";
/* No poner nombre del dia sino, indicar que musculos se entrenaran*/
const user = localStorage.getItem('User');

const rutina = {
    Nombre: "",
    CantidadDeDias: 0,
    Dias: []
}

const dia = {
    Nombre: '',
    CantidadDeEjercicios: 0,
    Ejercicios: []
}

export async function BotonCrearRutina() {
    const crearRutinaButton = document.querySelector("#crear-rutina");

    crearRutinaButton.addEventListener("click", () => {
        CrearRutina();
        document.body.style.overflow = 'hidden';
    });
}

export function CrearRutina() {
    CrearFormularioRutina();
    const contenedor = document.getElementById("contenedor-formulario");
    contenedor.style.display = 'block';

    let dias = [];

    const botonConfirmar = document.getElementById("modal-confirmar");
    botonConfirmar.addEventListener("click", () => {
        confirmarNombreYDiasRutina();
        try {
            crearDias(dias, rutina.CantidadDeDias);
            mostrarUnicamenteElPrimerDia();

            const confirmarRutina = document.getElementById("confirmar-rutina");
            confirmarRutina.addEventListener('click', () => {
                obtenerDatosDelDia();
                contenedor.style.display = 'none';
            });
        } catch (error) {
            console.log("se cancelo la carga de la rutina")
        }

    });

    const botonCancelar = document.getElementById("modal-cancelar");
    botonCancelar.addEventListener("click", () => {
        const contenedor = document.getElementById("contenedor-formulario");
        contenedor.innerHTML = "";
        contenedor.style.display = 'none';
    });
}

function crearDias(dias, length) {
    for (let indice = 0; indice < length; indice++) {
        CrearFormularioDias(indice, rutina.CantidadDeDias);
        dias.push(dia);
        console.log(dias)
    }
}

function mostrarUnicamenteElPrimerDia() {
    const modalDia = document.getElementById(`modal-dia-0`)
    modalDia.style.display = 'block';
}

function obtenerDatosDeLosEjercicios(ejercicios, indice) {
    let j = 1;
    while (true) {
        const nombreEjercicio = document.getElementById(`nombre-ejercicio-${j}-del-dia-${indice}`);
        const cantidadSeriesx = document.getElementById(`cantidad-series-${j}-del-dia-${indice}`);

        if (!nombreEjercicio || !cantidadSeriesx || !nombreEjercicio.value || !cantidadSeriesx.value) {
            break;
        }

        const series = [];
        for (let i = 0; i < parseInt(cantidadSeriesx.value); i++) {
            series.push({
                Peso: 0,          // Valor inicial
                Repeticiones: 0   // Valor inicial
            });
        }

        console.log("Estas son las series", series);
        const ejercicio = {
            Nombre: nombreEjercicio.value,
            Series: series
        };

        ejercicios.push(ejercicio);
        j++;
    }

    return ejercicios;
}

function obtenerDatosDelDia() {
    let dias = [];
    for (let indice = 0; indice < rutina.CantidadDeDias; indice++) {
        const dia = {};

        dia.Nombre = document.getElementById(`nombre-dia-${indice}`).value;
        let ejercicios = [];
        ejercicios = obtenerDatosDeLosEjercicios(ejercicios, indice);

        dia.Ejercicios = ejercicios;
        dias.push(dia);
        console.log("día ", indice);
    }

    rutina.Dias = dias;
    console.log(rutina);
    alertaSwet("Rutina creada exitosamente", 1000)
    enviarRutinaALaBaseDeDatos(user, rutina);
}

let indiceDias = 1;

function mostrarDiaSiguiente() {
    const modalSiguiente = document.getElementById(`modal-dia-${indiceDias}`)
    modalSiguiente.style.display = 'block';
    const modalAnterior = document.getElementById(`modal-dia-${indiceDias - 1}`)
    modalAnterior.style.display = 'none';
    indiceDias++;
}

const indiceSup = {
    indices: []
};

const ejercicios = [
    { id: 1, nombre: "Sentadillas" },
    { id: 2, nombre: "Press de banca" },
    { id: 3, nombre: "Peso muerto" },
    { id: 4, nombre: "Dominadas" },
    { id: 5, nombre: "Remo con barra" },
    { id: 6, nombre: "Zancadas" },
    { id: 7, nombre: "Curl de bíceps" },
    { id: 8, nombre: "Press militar" },
    { id: 9, nombre: "Abdominales" },
    { id: 10, nombre: "Extensiones de piernas" },
    { id: 11, nombre: "Flexiones de pecho" },
    { id: 12, nombre: "Press de hombros con mancuernas" },
    { id: 13, nombre: "Peso muerto rumano" },
    { id: 14, nombre: "Elevaciones laterales" },
    { id: 15, nombre: "Fondos en paralelas" },
    { id: 16, nombre: "Pull-over con mancuernas" },
    { id: 17, nombre: "Sentadilla búlgara" },
    { id: 18, nombre: "Face pull" },
    { id: 19, nombre: "Remo con mancuerna" },
    { id: 20, nombre: "Press de banca inclinado" },
    { id: 21, nombre: "Extensiones de tríceps en polea" },
    { id: 22, nombre: "Curl de bíceps martillo" },
    { id: 23, nombre: "Press Arnold" },
    { id: 24, nombre: "Plancha abdominal" },
    { id: 25, nombre: "Elevaciones de talones" },
    { id: 26, nombre: "Press francés" },
    { id: 27, nombre: "Hip thrust" },
    { id: 28, nombre: "Pull-ups asistidos" },
    { id: 29, nombre: "Remo invertido" },
    { id: 30, nombre: "Mountain climbers" },
    { id: 31, nombre: "Burpees" },
    { id: 32, nombre: "Escaladores laterales" },
    { id: 33, nombre: "Levantamiento de pierna colgado" },
    { id: 34, nombre: "Push press" },
    { id: 35, nombre: "Clean and press" },
    { id: 36, nombre: "Farmer's walk" },
    { id: 37, nombre: "Goblet squat" },
    { id: 38, nombre: "Plank con giro" },
    { id: 39, nombre: "Step-ups con peso" },
    { id: 40, nombre: "Russian twists" },
    { id: 41, nombre: "Battle ropes" },
    { id: 42, nombre: "Snatch con kettlebell" },
    { id: 43, nombre: "Swing con kettlebell" },
    { id: 44, nombre: "Clean con kettlebell" },
    { id: 45, nombre: "Pistol squats" },
    { id: 46, nombre: "Skater jumps" },
    { id: 47, nombre: "Tijeras con mancuernas" },
    { id: 48, nombre: "Pull-ups neutros" },
    { id: 49, nombre: "Press inclinado con mancuernas" },
    { id: 50, nombre: "Elevaciones frontales con mancuerna" }
];


function agregarEjercicio(indice) {
    if (!indiceSup.indices[indice]) {
        indiceSup.indices[indice] = 0;
    }

    indiceSup.indices[indice]++;

    const opcionesEjercicios = ejercicios.map(
        (ejercicio) => `<option value="${ejercicio.nombre}">${ejercicio.nombre}</option>`
    ).join("");
    const formDia = document.getElementById(`form-dia-${indice}`);

    // Crear un contenedor para el nuevo ejercicio
    const contenedorEjercicio = document.createElement('div');
    contenedorEjercicio.setAttribute('id', `contenedor-ejercicio-${indiceSup.indices[indice]}-del-dia-${indice}`);

    contenedorEjercicio.innerHTML = `
        <label for="nombre-ejercicio-${indiceSup.indices[indice]}-del-dia-${indice}">Nombre del ejercicio:</label>
        <input 
            type="text" 
            id="nombre-ejercicio-${indiceSup.indices[indice]}-del-dia-${indice}" 
            name="nombreEjercicio" 
            list="ejercicios-lista" 
            required 
            placeholder="Selecciona o escribe un ejercicio"
        />
        <datalist id="ejercicios-lista">
            ${opcionesEjercicios}
        </datalist>

        <label for="cantidad-series-${indiceSup.indices[indice]}-del-dia-${indice}">Series:</label>
        <input 
            type="number" 
            id="cantidad-series-${indiceSup.indices[indice]}-del-dia-${indice}" 
            name="cantidadSeries" 
            min="1" 
            required 
        />
    `;

    // Si no es el primer ejercicio, oculta el anterior
    if (indiceSup.indices[indice] > 1) {
        const contenedorEjercicioAnterior = document.getElementById(
            `contenedor-ejercicio-${indiceSup.indices[indice] - 1}-del-dia-${indice}`
        );
        alertaSwet("Se agrego el erjcicio", 400)
        if (contenedorEjercicioAnterior) {
            contenedorEjercicioAnterior.style.display = 'none';
        }
    }

    formDia.appendChild(contenedorEjercicio);
}

function CrearFormularioDias(indice, cantidadTotal) {
    const contenedor = document.getElementById("contenedor-formulario");

    // Crear el modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.id = "modal-overlay";

    // Crear el contenedor principal del formulario
    const modalFormulario = document.createElement("div");
    modalFormulario.classList.add("modal-formulario");
    modalFormulario.id = `modal-dia-${indice}`;
    modalFormulario.style.display = "none";

    // Crear el encabezado
    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const headerTitle = document.createElement("h3");
    headerTitle.textContent = `Día ${indice + 1}`;
    modalHeader.appendChild(headerTitle);

    // Crear el cuerpo del formulario
    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    const form = document.createElement("form");
    form.id = `form-dia-${indice}`;

    const label = document.createElement("label");
    label.setAttribute("for", `nombre-dia-${indice}`);
    label.textContent = `¿Qué día de la semana será el día ${indice + 1}?`;

    const select = document.createElement("select");
    select.id = `nombre-dia-${indice}`;
    select.name = "nombreDia";
    select.required = true;

    const dias = ["Selecciona un día", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    dias.forEach((dia, i) => {
        const option = document.createElement("option");
        option.value = i === 0 ? "" : dia; // Primera opción deshabilitada
        option.textContent = dia;
        if (i === 0) {
            option.disabled = true;
            option.selected = true;
        }
        select.appendChild(option);
    });

    form.appendChild(label);
    form.appendChild(select);
    modalBody.appendChild(form);

    // Crear el pie del formulario
    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const agregarEjercicioButton = document.createElement("button");
    agregarEjercicioButton.id = "agregar-ejercicio";
    agregarEjercicioButton.textContent = "Agregar Ejercicio";
    agregarEjercicioButton.addEventListener("click", () => agregarEjercicio(indice));

    modalFooter.appendChild(agregarEjercicioButton);

    const confirmarButton = document.createElement("button");
    if (indice === cantidadTotal - 1) {
        confirmarButton.id = "confirmar-rutina";
        confirmarButton.textContent = "Confirmar Día";
    } else {
        confirmarButton.id = "mostrar-dia-siguiente";
        confirmarButton.textContent = "Confirmar Día";
        confirmarButton.addEventListener("click", () => mostrarDiaSiguiente());
    }

    modalFooter.appendChild(confirmarButton);

    // Armar la estructura del modal
    modalFormulario.appendChild(modalHeader);
    modalFormulario.appendChild(modalBody);
    modalFormulario.appendChild(modalFooter);

    // Agregar el modal y el overlay al contenedor
    contenedor.appendChild(modalOverlay);
    contenedor.appendChild(modalFormulario);
}


function confirmarNombreYDiasRutina() {
    rutina.Nombre = document.getElementById("nombre-rutina").value;
    rutina.CantidadDeDias = document.getElementById("cantidad-dias").value;
    const form = document.getElementById("form-rutina");

    if (!form.checkValidity()) {
        // Mostrar mensajes de validación nativos del navegador
        form.reportValidity();
        return;
    }

    console.log("Nombre de la rutina:", rutina.Nombre);
    console.log("Cantidad de días:", rutina.CantidadDeDias);

    const contenedor = document.getElementById("contenedor-formulario");
    contenedor.innerHTML = "";
}

function CrearFormularioRutina() {
    const contenedor = document.getElementById("contenedor-formulario");

    // Contenido del modal con el formulario
    const formularioHTML = `
    <div class="modal-overlay" id="modal-overlay"></div>
    <div class="modal-formulario">
        <div class="modal-header">
            <h3>Crear Rutina</h3>
        </div>
        <div class="modal-body">
            <form id="form-rutina">
                <label for="nombre-rutina">Nombre de la rutina:</label>
                <input type="text" id="nombre-rutina" name="nombreRutina" required />

                <label for="cantidad-dias">Cantidad de días:</label>
                <input type="number" id="cantidad-dias" name="cantidadDias" min="1" required />
            </form>
        </div>
        <div class="modal-footer">
            <button id="modal-cancelar">Cancelar</button>
            <button id="modal-confirmar">Confirmar</button>
        </div>
    </div>
`;

    contenedor.innerHTML = formularioHTML;
}






