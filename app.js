
// Array para almacenar las tareas
let listaTareas = [];

// referencias de elementos DOM
const inputTarea = document.getElementById('agregartarea');
const botonAgregar = document.getElementById('btnagregar');
const listarTareasCompletadas = document.getElementById('donetasks');
const listarTareasPendientes = document.getElementById('pendingtasks');
const listarTareas = document.getElementById('listatareas');
const marcarTareasCompletadas = document.getElementById('taskscheck');
const eliminarTarea = document.getElementById('deletetask');

class Tarea {
    constructor(nombre) {
        this.id = Date.now(); // id único
        this.nombre = nombre;
        this.estado = false;
    }

    actualizarEstadoTarea () {
        this.estado = !this.estado; // marcar completada
    }
}

function agregarTarea() {
    // obtengo el nombre de la tarea
    const tarea = inputTarea.value.trim(); // leer valores y quitar espacios al inicio

    if (tarea === "") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Campo vacio, debes ingresar el nombre de la tarea",
        });
        return; // detengo la ejecucio y no dejo que agregue
    
    } else {
        // agrego la tarea a la lista
        const tarea = new Tarea(inputTarea.value);
        listaTareas.push(tarea);

        Swal.fire({
        icon: "success",
        title: "Tarea registrada correctamente",
        draggable: true
        });

        // seteo el input despues de agregar
        inputTarea.value = "";
    }
    mostrarTarea();
}

// capturo el clic el boton agregar
botonAgregar.addEventListener('click', agregarTarea);


function mostrarTarea() {
    // limpio el contenido
    //listarTareas.innerHTML = "";

    if (listaTareas.length > 0) {
        let contenidoHTML = "";

        // recorrer lista y pintarlo en el DOM
        listaTareas.forEach(tarea => {
            contenidoHTML =
            `<th scope="row" class="viewtasks_check">
                <input class="form-check-input viewtasks_check--task" type="checkbox" value="" id="taskscheck">
            </th>
            <td class="viewtasks_description">
                <p class="viewtasks_description--text">${tarea.nombre}</p>
            </td>
            <td class="viewtasks_delete">
                <button class="btn btn-danger viewtasks_delete--btn" data="isdeleted" id="deletetask">
                    <i class="bi bi-trash"></i>
                </button>
            </td>`
        });

        listarTareas.innerHTML += contenidoHTML;

    } else {
        listarTareas.innerHTML =
        `
        <th scope="row"></th>
        <td class="viewtasks_description viewtasks_description--empty">
            <p class="viewtasks_description--text">Tu lista esta vacia</p>
        </td>
        <td></td>`;
    }
}
// Pinto mensaje inicial al cargar la pagina
mostrarTarea();
