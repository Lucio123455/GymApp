import { EnviarComentarios, TraerComentarios } from "../firebase/firestore.js";

const contenedorComentarios = document.getElementById('contenedor-comentarios');
const overlay = document.getElementById('overlay');

export function Comentarios() {
    // Función para desplegar el formulario
    contenedorComentarios.innerHTML = `
        <form id="form-comentarios">
            <label for="comentario">Escribe tu comentario:</label>
            <textarea id="comentario" name="comentario" required></textarea>
            <button type="submit" id="enviar-formulario">Enviar</button>
            <button type="click" id="cancelar-comentarios">Cancelar</button>
            <div id="comentarios"> </div>
        </form>
    `;
    contenedorComentarios.style.display = 'block';
    overlay.style.display = 'block';

    // Mostrar los comentarios
    mostrarComentarios();

    // Manejo del envío del formulario
    const formComentarios = document.getElementById('form-comentarios');
    formComentarios.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar recarga de página

        const comentario = document.getElementById('comentario').value;
        
        // Enviar comentario a Firebase
        await EnviarComentarios(comentario);

        // Limpiar el formulario y ocultar el contenedor
        contenedorComentarios.innerHTML = '';
        contenedorComentarios.style.display = 'none';
        overlay.style.display = 'none';
    });

    const cancelar = document.getElementById('cancelar-comentarios');
    cancelar.addEventListener('click', () => {
        contenedorComentarios.innerHTML = '';
        contenedorComentarios.style.display = 'none';
        overlay.style.display = 'none';
    })
}

async function mostrarComentarios() {
    // Obtener los comentarios de la base de datos
    let comentarios = await TraerComentarios();  // Esperamos a que la función asíncrona termine

    const contenedor = document.getElementById('comentarios');
    
    // Limpiar el contenedor de comentarios antes de agregar los nuevos
    contenedor.innerHTML = '';

    // Recorrer los comentarios y agregarlos al DOM
    comentarios.forEach(comentario => {
        const comentarioElemento = document.createElement('p');
        
        // Agregar el texto del comentario y la fecha
        comentarioElemento.textContent = `${comentario.comentario} - ${new Date(comentario.timestamp.seconds * 1000).toLocaleString()}`;
        
        // Agregar el comentario al contenedor
        contenedor.appendChild(comentarioElemento);
    });
}
