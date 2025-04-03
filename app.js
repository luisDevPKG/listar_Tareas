
// Array para almacenar las tareas
let listaTareas = [];

// referencias de elementos DOM
const inputTarea = document.getElementById('agregartarea');
const botonAgregar = document.getElementById('btnagregar');
const listarTareas = document.getElementById('listatareas');
const listarTareasCompletadas = document.getElementById('donetasks');
const listarTareasPendientes = document.getElementById('pendingtasks');

class Tarea {
    static contadorID = 1; // control IDs
    constructor(nombre) {
        this.id = Tarea.contadorID++; // id único
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
        return; // detengo la ejecucion y no dejo que agregue
    } else {
        // agrego la tarea a la lista
        const tarea = new Tarea(inputTarea.value);
        listaTareas.push(tarea);

        Swal.fire({
          icon: "success",
          title: "Tarea registrada correctamente"
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
    listarTareas.innerHTML = "";

    if (listaTareas.length > 0) {
        let contenidoHTML = "";

        // recorrer lista y pintarlo en el DOM
        listaTareas.forEach((tarea) => {
            contenidoHTML +=
            `
            <tr id="task-row-${tarea.id}">
            <th scope="row" class="viewtasks_check">
                <input class="form-check-input viewtasks_check--task" type="checkbox" id="taskscheck-${tarea.id}" data-id="${tarea.id}">
            </th>
            <td class="viewtasks_description">
                <p class="viewtasks_description--text">${tarea.nombre}</p>
            </td>
            <td class="viewtasks_delete">
                <button class="btn btn-danger viewtasks_delete--btn" id="deletetask-${tarea.id}" data-id="${tarea.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
            </tr>`
        });

        listarTareas.innerHTML = contenidoHTML;

        // Marcar tarea completada
        document.querySelectorAll(".viewtasks_check--task").forEach(checkbox => {

            let tareaID = checkbox.dataset.id; // obtengo el indice de la tarea
            let rowTask = document.getElementById(`task-row-${tareaID}`);

            checkbox.addEventListener('change', function() {
                // actualizo el estado de la tarea para cada item
                const tarea = listaTareas.find(t => t.id === parseInt(tareaID));
                tarea.actualizarEstadoTarea();

                if (this.checked) {
                    // modifica el front
                    rowTask.classList.add("table-success");
                    Swal.fire({
                        icon: "success",
                        title: "Tarea completada"
                    });
                } else {
                    // quitar el estilo marcado completado
                    rowTask.classList.remove("table-success");
                    Swal.fire({
                        icon: "info",
                        title: "Tarea marcada pendiente"
                    });
                }
            });
        });

        // Eliminar tarea
        document.querySelectorAll(".viewtasks_delete--btn").forEach(deleteBtn => {
            let btnDelete = deleteBtn.dataset.id; // obtengo el indice del boton eliminar
            deleteBtn.addEventListener('click', () => {

                Swal.fire({
                    title: "Deseas eliminar la tarea?",
                    showDenyButton: true,
                    //showCancelButton: true,
                    confirmButtonText: "Si",
                    denyButtonText: `No`
                  }).then((result) => {

                    if (result.isConfirmed) {
                        const tareaAEliminar = listaTareas.find(t => t.id === parseInt(btnDelete));
                        if (tareaAEliminar.estado == true) {
                            Swal.fire({
                                icon: "warning",
                                title: "No se pueden eliminar tareas pendientes"
                            });
                        } else {
                            eliminarTarea(btnDelete);
                            Swal.fire("Tarea eliminada!", "", "success");
                        }
                    } else if (result.isDenied) {
                      return;
                    }
                  });
            });
        });

    } else {
        listarTareas.innerHTML =
        `
        <tr>
        <th scope="row"></th>
        <td class="viewtasks_description viewtasks_description--empty">
            <p class="viewtasks_description--text">Tu lista esta vacia</p>
        </td>
        <td></td>
        </tr>`;
    }
}
// Pinto mensaje inicial al cargar la pagina
mostrarTarea();

function eliminarTarea(idTask){
    // cre un nuevo array con las tareas excepto la que se va a eliminar
    listaTareas = listaTareas.filter((tarea) => tarea.id !== parseInt(idTask));
    mostrarTarea();
}