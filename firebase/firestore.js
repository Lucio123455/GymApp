import { getFirestore, collection, getDocs, updateDoc ,doc, getDoc, setDoc, addDoc  } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

import app from "./config.js";
import { alertaSwet } from "../components/alertas.js";

const db = getFirestore(app);

async function fetchAllDocuments(collectionName) {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const documents = [];
        querySnapshot.forEach(doc => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        return documents;
    } catch (error) {
        console.error("Error fetching documents: ", error);
        throw error;
    }
}

export async function getDocuments(collection) {
    try {
        const documents = await fetchAllDocuments(collection);
        return documents; // You can return or store it in another variable
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function actualizarSerie(rutaEjercicio, idSerie, indice, pesoActual, repeticionesActuales, user) {
    try {

        // Crear el formulario dinámico
        const formulario = document.createElement('div');
        formulario.innerHTML = `
            <form id="formActualizarSerie" style="display: flex; flex-direction: column; gap: 10px;">
                <label>
                    Peso:
                    <input type="number" id="nuevoPeso" placeholder="Ingrese el nuevo peso" required>
                </label>
                <label>
                    Repeticiones:
                    <input type="number" id="nuevasRepeticiones" placeholder="Ingrese las nuevas repeticiones" required>
                </label>
                <button type="submit">Actualizar Serie</button>
                <button type="button" id="cancelarActualizar">Cancelar</button>
            </form>
        `;
        
        formulario.classList.add('modal-formulario');
        document.body.appendChild(formulario);

        // Manejar el envío del formulario
        const form = document.getElementById('formActualizarSerie');
        const cancelarBtn = document.getElementById('cancelarActualizar');

        // Cancelar actualización
        cancelarBtn.addEventListener('click', () => {
            formulario.remove();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar recarga de página

            // Obtener los valores del formulario
            const nuevoPeso = document.getElementById('nuevoPeso').value;
            const nuevasRepeticiones = document.getElementById('nuevasRepeticiones').value;

            if (!nuevoPeso || !nuevasRepeticiones) {
                alert("Por favor, complete ambos campos.");
                return;
            }

            // Ruta completa a la serie específica
            const rutaSerie = `${rutaEjercicio}/Series/${idSerie}`;
            const serieRef = doc(db, rutaSerie); // Crear referencia al documento

            // Actualizar en Firestore
            await updateDoc(serieRef, {
                Peso: nuevoPeso,
                Repeticiones: nuevasRepeticiones
            });

            // Actualizar dinámicamente el DOM
            const serieElemento = document.querySelector(`#serie-${idSerie}`);
            if (serieElemento) {
                const pesoElemento = serieElemento.querySelector('.peso');
                const repeticionesElemento = serieElemento.querySelector('.repeticiones');
                console.log(indice);
                if (indice === 0) {
                    enviarRegistroDeLaPrimeraSerie(pesoActual, repeticionesActuales,rutaEjercicio, user)
                }
                pesoElemento.textContent = `Peso: ${nuevoPeso}`;
                repeticionesElemento.textContent = `Repeticiones: ${nuevasRepeticiones}`;
            }

            alertaSwet("Se actualizo correctamente")
            formulario.remove(); // Eliminar el formulario tras la actualización
        });
    } catch (error) {
        console.error("Error al actualizar la serie:", error);
        alert("Hubo un error al actualizar la serie.");
    }
}

async function enviarRegistroDeLaPrimeraSerie(peso, repeticiones, rutaEjercicio, user) {
    try {
        rutaEjercicio = String(rutaEjercicio);  

        console.log("Ruta de ejercicio:", rutaEjercicio);
        
        const nombreDelEjercicio = rutaEjercicio.substring(rutaEjercicio.lastIndexOf('/') + 1);
        console.log("Nombre del ejercicio:", nombreDelEjercicio);

        const ejercicioRef = collection(db, `users/${user}/Ejercicios/${nombreDelEjercicio}/Registros`);
        
        const docRef = await addDoc(ejercicioRef, {
            Peso: peso,
            Repeticiones: repeticiones,
            Fecha: new Date(),  // Fecha actual
        });

        console.log("Registro de la primera serie guardado exitosamente en el documento con ID:", docRef.id);
    } catch (error) {
        console.log("Error al enviar registros:", error);
    }
}


export async function enviarRutinaALaBaseDeDatos(user,rutina) {
    try {
        // 1. Crear el documento de la rutina en la colección de rutinas
        const rutinaRef = doc(collection(db, `users/${user}/Rutinas`), rutina.Nombre);  // Usamos el nombre de la rutina como ID
        await setDoc(rutinaRef, {
            Nombre: rutina.Nombre,
            CantidadDias: rutina.CantidadDeDias,  // Usamos CantidadDeDias si es necesario
        });
        
        // 2. Crear los días en la subcolección de cada rutina
        for (let i = 0; i < rutina.CantidadDeDias; i++) {
            const dia = rutina.Dias[i];  // Día actual

            // Crear un documento para el día usando su nombre como ID
            const diaRef = doc(collection(rutinaRef, "Dias"), dia.Nombre);  // Usamos el nombre del día como ID
            await setDoc(diaRef, {
                Nombre: dia.Nombre, // Guardamos el nombre del día
            });

            // 3. Crear los ejercicios para cada día
            for (let j = 0; j < dia.Ejercicios.length; j++) {
                const ejercicio = dia.Ejercicios[j];

                // Crear la subcolección de ejercicios dentro del día usando el nombre del ejercicio como ID
                const ejercicioRef = doc(collection(diaRef, "Ejercicios"), ejercicio.Nombre);  // Usamos el nombre del ejercicio como ID
                await setDoc(ejercicioRef, {
                    Nombre: ejercicio.Nombre, // Guardamos el nombre del ejercicio
                });

                const ejercicioRefUsuario = doc(collection(db, `users/${user}/Ejercicios`), ejercicio.Nombre);
                const ejercicioDoc = await getDoc(ejercicioRefUsuario);

                if (!ejercicioDoc.exists()) {
                    // Crear el ejercicio en la colección de ejercicios del usuario si no existe
                    await setDoc(ejercicioRefUsuario, {
                        Nombre: ejercicio.Nombre, // Guardamos el nombre del ejercicio
                    });
                }
                // 4. Crear las series para cada ejercicio
                for (let k = 0; k < ejercicio.Series.length; k++) {
                    const serie = ejercicio.Series[k];

                    // Crear un documento para cada serie en la subcolección "Series"
                    const serieRef = doc(collection(ejercicioRef, "Series")); // Firestore genera un ID único
                    await setDoc(serieRef, {
                        Peso: serie.Peso, // Guardamos el peso de la serie
                        Repeticiones: serie.Repeticiones, // Guardamos las repeticiones de la serie
                        Indice: k,
                    });
                }
            }
        }

        console.log('Rutina guardada con éxito');
        window.location.reload(true);
    } catch (error) {
        console.error('Error al guardar la rutina: ', error);
    }
}

export async function EnviarComentarios(comentario) {
    try {
        // Enviar el comentario a Firestore
        await addDoc(collection(db, "Comentarios"), {
            comentario: comentario,
            timestamp: new Date() // Agregar la fecha y hora
        });

        alert('Comentario enviado con éxito.');
    } catch (error) {
        console.error("Error al enviar el comentario: ", error);
        alert('Hubo un error al enviar tu comentario. Intenta de nuevo.');
    }
}

export async function TraerComentarios() {
    try {
        // Realizar la consulta a la colección de Comentarios
        const querySnapshot = await getDocs(collection(db, 'Comentarios'));

        // Crear un array para almacenar los comentarios
        const comentarios = [];

        // Recorrer los documentos obtenidos
        querySnapshot.forEach((doc) => {
            // Acceder a los datos del documento y agregarlo al array
            comentarios.push({
                id: doc.id, // ID del documento
                ...doc.data() // Los datos del comentario (puedes añadir más propiedades si lo necesitas)
            });
        });

        // Retornar el array con los comentarios
        return comentarios;

    } catch (error) {
        console.error("Error al obtener los comentarios: ", error);
        throw new Error("Error al traer los comentarios");
    }
}

export default db;