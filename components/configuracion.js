import { getDocuments } from "../firebase/firestore.js";

export async function configuracionBoton() {
    const botonConfiguracion = document.querySelector("#boton-configuracion");
    const cerrar = document.querySelector('#boton-cerrar-configuracion');
    const lista = document.querySelector('#nombre-apellido');

    botonConfiguracion.addEventListener('click', async () => {  // Make this async to use await
        try {
            const users = await getDocuments('users');  // Wait for the promise to resolve
            
            const ul = document.createElement('ul');
            lista.appendChild(ul);
            
            const name = document.createElement('li');
            const lastName = document.createElement('li');
            
            lastName.textContent = users[0].Apellido;  // Now you can access the data
            name.textContent = users[0].Nombre;
            
            ul.appendChild(name);
            ul.appendChild(lastName);
            
            cerrar.style.display = 'block'
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    });
    
    cerrar.addEventListener('click', () => {
        cerrar.style.display = 'none'
        
        lista.innerHTML = ''
    })
}


