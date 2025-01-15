import { TraerEjericios, TraerRegistros} from "../firebase/firestore.js";

const user = localStorage.getItem('User');

async function mostrarEjercicios() {
    try {
        const ejercicios = await TraerEjericios(user);

        for (const ejercicio of ejercicios) {
            try {
                const registros = await TraerRegistros(ejercicio.Nombre, user);
                let fechas = [];
                let pesos = [];

                registros.forEach(registro => {
                    const fechaLegible = new Date(registro.Fecha.seconds * 1000).toLocaleDateString(); 
                    fechas.push(fechaLegible);
                    pesos.push(registro.Peso);
                });

                crearGrafico(ejercicio.id, fechas, pesos);
            } catch (error) {
                console.warn(`No se pudieron obtener los registros para el ejercicio "${ejercicio.Nombre}":`, error);
                continue; // Seguir con el siguiente ejercicio
            }
        }
    } catch (error) {
        console.error("Error al mostrar ejercicios:", error);
    }
}


function crearGrafico(id, fechas, pesos) {
    // Crear un elemento <canvas> dinámicamente
    const contenedor = document.getElementById('contenedorGraficos');
    const canvas = document.createElement('canvas');
    canvas.id = id; // Asignar un ID único al canvas
    contenedor.appendChild(canvas); // Agregar el canvas al contenedor

    // Crear el gráfico
    new Chart(canvas.getContext('2d'), {
        type: 'line', // Tipo de gráfico
        data: {
            labels: fechas, // Eje X (fechas)
            datasets: [{
                label: `Peso levantado (kg) - ${id}`, // Etiqueta
                data: pesos, // Eje Y (pesos)
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Relleno
                borderWidth: 2, // Grosor de la línea
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Fecha', // Etiqueta del eje X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Peso (kg)', // Etiqueta del eje Y
                    },
                    beginAtZero: true // Iniciar desde 0
                }
            }
        }
    });
}

mostrarEjercicios()