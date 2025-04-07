
import { Task } from './Task.js';

// Array para almacenar las tareas
let tasksList = [];

// referencias de elementos DOM
const inputTaks = document.getElementById('addTask');
const addButton = document.getElementById('btnagregar');
const taskList = document.getElementById('tasksList');
const taskListDone = document.getElementById('donetasks');
const taskListPending = document.getElementById('pendingtasks');
const allTask = document.getElementById('alltasks');


// Alertas
function showAlerts(icon, title, text=""){
    Swal.fire({icon, title, text});
}

// guardo tareas en el localstorage
function saveCheckboxStatus(){
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
}

function addTask() {
    // obtengo el nombre de la tarea
    const taskName = inputTaks.value.trim(); // leer valores y quitar espacios al inicio

    if (taskName === "") {
        showAlerts("error", "Oops...","Campo vacio, debes ingresar el nombre de la tarea")
        return; // detengo la ejecucion y no dejo que agregue
    } else {
        // agrego la tarea a la lista
        const task = new Task(inputTaks.value);
        tasksList.push(task);

        // guardo tarea en el localstorage
        saveCheckboxStatus();
        // seteo el input despues de agregar
        inputTaks.value = "";
        showAlerts("success", "Tarea registrada correctamente")
        showTask();
    }
}

// capturo el clic el boton agregar
addButton.addEventListener('click', addTask);

function showTask(taskToShow = tasksList) {
    // limpio el contenido
    taskList.innerHTML = "";

    if (taskToShow.length === 0 ){
        taskList.innerHTML =
        `
        <tr>
        <th scope="row"></th>
            <td class="viewtasks_description viewtasks_description--empty">
                <p class="viewtasks_description--text">Tu lista esta vacia</p>
            </td>
        <td></td>
        </tr>`;
        return;  // no hay tareas
    }

    let containHTML = "";

    // recorrer lista y pintarlo en el DOM
    taskToShow.forEach((task) => {

        let classRow = task.status ? "table-success" : "table-warning";

        containHTML +=
        `
        <tr id="task-row-${task.id}" class="${classRow}">
        <th scope="row" class="viewtasks_check">
            <input class="form-check-input viewtasks_check--task" type="checkbox" id="taskscheck-${task.id}" data-id="${task.id}">
        </th>
        <td class="viewtasks_description">
            <p class="viewtasks_description--text">${task.name}</p>
        </td>
        <td class="viewtasks_delete">
            <button class="btn btn-danger viewtasks_delete--btn" id="deletetask-${task.id}" data-id="${task.id}">
                <i class="bi bi-trash"></i>
            </button>
        </td>
        </tr>`
    });

    taskList.innerHTML = containHTML;

    // mantener estilos de las tareas completadas
    taskToShow.forEach((task) => {
        let rowTask = document.getElementById(`task-row-${task.id}`);
        let checkboxTask = document.getElementById(`taskscheck-${task.id}`);

        if (task.status === true) {
            checkboxTask.checked = true; // lo sigue marcando como completada
            rowTask.classList.add('table-success');
        }
    });

    // se dispone de los events - chekbox y eliminar
    eventsTaskControl();
    // eventsTaskControl();
}

// control de events
function eventsTaskControl() {
    // Marcar tarea completada
    document.querySelectorAll(".viewtasks_check--task").forEach(checkbox => {

        let taskID = checkbox.dataset.id; // obtengo el indice de la tarea
        let rowTask = document.getElementById(`task-row-${taskID}`);

        checkbox.addEventListener('change', function() {
            // actualizo el status de la tarea para cada item
            const task = tasksList.find(t => t.id === parseInt(taskID));
            task.uptateStatusTask();

            // actualizo el cambio en el localStorage
            saveCheckboxStatus();

            if (this.checked) {
                // modifica el front
                rowTask.classList.remove("table-warning");
                rowTask.classList.add("table-success");

                showAlerts("success", "Tarea marcada como completada")

            } else {
                // quitar el estilo marcado completado
                rowTask.classList.remove("table-success");
                rowTask.classList.add("table-warning");
                showAlerts("info", "Tarea marcada como pendiente")
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
                confirmButtonText: "Si",
                denyButtonText: `No`
            }).then((result) => {
                if (result.isConfirmed) {
                    const taskToDelete = tasksList.find(t => t.id === parseInt(btnDelete));

                    if (taskToDelete.status == true) {
                        deleteTask(btnDelete);
                        showAlerts("success","Tarea eliminada!")
                    } else {
                        showAlerts("warning","No se pueden eliminar tareas pendientes")
                    }
                } else if (result.isDenied) {
                    return;
                }
            });
        });
    });
}

function deleteTask(idTask){
    // cre un nuevo array con las tareas excepto la que se va a eliminar
    tasksList = tasksList.filter((task) => task.id !== parseInt(idTask));
    // actualizo el cambio en el localStorage
    saveCheckboxStatus();
    showTask();
}

function eventsFilterButtons(){
     // filtrar tareas
    // Tareas completadas
    taskListDone.addEventListener('click', () => {
        const tasksDone = tasksList.filter(t => t.status === true);
        showTask(tasksDone);
    })
    // Tareas pendientes
    taskListPending.addEventListener('click', () => {
        const tasksPending = tasksList.filter(t=> t.status === false);
        showTask(tasksPending);
    })
    // Todas las tareas
    allTask.addEventListener('click', () => {
        showTask(tasksList);
    })
}

// renderizo la pagina con la informacion del local storage
document.addEventListener("DOMContentLoaded", () => {
    const tasksSaved = localStorage.getItem("tasksList");
    if (tasksSaved) {
        const recoverTasks = JSON.parse(tasksSaved);
        tasksList = recoverTasks;
        tasksList.map(t=> {
            const task = new Task(t.name);
            task.id = t.id;
            task.status = t.status;
            return task
        })

        // actualizo contador
        if (tasksList.length > 0) {
            const lastID = Math.max(...tasksList.map(t => t.id), 0);
            Task.counterID = lastID + 1;
        }
    }
    eventsFilterButtons();
    showTask();
});