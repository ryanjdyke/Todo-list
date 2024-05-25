const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");
const usernameInput = document.getElementById("username-input");
const usernameForm = document.getElementById("username-form");
const taskForm = document.getElementById("task-form");

let USERS = JSON.parse(localStorage.getItem("USERS")) || {};
let currentUser = null;

const CHECK = "checked";
const UNCHECK = "unchecked";
const LINE_THROUGH = "lineThrough";

usernameForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        currentUser = username;
        if (!USERS[currentUser]) {
            USERS[currentUser] = [];
        }
        loadToDoList();
        usernameForm.style.display = "none";
        taskForm.style.display = "block";
    }
});

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const toDo = input.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;
    if (toDo) {
        addToDoToList(toDo, priority, dueDate);
        input.value = "";
        priorityInput.value = "Low";
        dueDateInput.value = "";
    }
});

function loadToDoList() {
    list.innerHTML = "";
    const todoList = USERS[currentUser];
    todoList.forEach(function (item) {
        addToDoDOM(item.name, item.id, item.done, item.trash, item.priority, item.dueDate);
    });
    localStorage.setItem("USERS", JSON.stringify(USERS));
}

function addToDoToList(toDo, priority, dueDate) {
    const id = USERS[currentUser].length;
    const task = { name: toDo, id: id, done: false, trash: false, priority: priority, dueDate: dueDate };
    USERS[currentUser].push(task);
    addToDoDOM(toDo, id, false, false, priority, dueDate);
    localStorage.setItem("USERS", JSON.stringify(USERS));
}

function addToDoDOM(toDo, id, done, trash, priority, dueDate) {
    if (trash) return;
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const priorityClass = priority.toLowerCase();

    const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString("en-US", { month: 'numeric', day: 'numeric' }) : '';

    const text = `<li class="item ${DONE}" job="complete" id="${id}">
        <span class="priority-circle priority-${priorityClass}" job="complete"></span>
        <p class="text ${LINE}" job="update"> ${toDo} </p>
        <p class="due-date" job="complete">${formattedDate}</p>
        <span class="delete" job="delete">\u00D7</span>
    </li>`;

    const position = "beforeend";
    list.insertAdjacentHTML(position, text);
}

function completeToDo(element) {
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.querySelector(".text").classList.toggle(LINE_THROUGH);

    const task = USERS[currentUser][element.id];
    task.done = !task.done;
    localStorage.setItem("USERS", JSON.stringify(USERS));
}

function removeToDo(element) {
    const listItem = element.closest('li');
    const task = USERS[currentUser][listItem.id];
    task.trash = true;
    listItem.remove();
    localStorage.setItem("USERS", JSON.stringify(USERS));
}

function updateToDoText(element, newText) {
    const listItem = element.closest('li');
    const id = listItem.id;
    USERS[currentUser][id].name = newText;
    localStorage.setItem("USERS", JSON.stringify(USERS));

    const pElement = document.createElement("p");
    pElement.classList.add("text");
    pElement.setAttribute("job", "update");
    pElement.textContent = newText;
    element.replaceWith(pElement);
}

function updateToDo(element) {
    const currentText = element.textContent.trim();
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = currentText;
    inputElement.classList.add("edit");
    element.replaceWith(inputElement);

    inputElement.addEventListener("keypress", function (e) {
        if (e.key === 'Enter') {
            updateToDoText(inputElement, inputElement.value.trim());
        }
    });

    inputElement.addEventListener("blur", function () {
        updateToDoText(inputElement, inputElement.value.trim());
    });

    inputElement.focus();
}

list.addEventListener("click", function(e) {
    let element = e.target;
    const elementClass = element.classList;
    if (elementClass.contains('priority-circle') || elementClass.contains('due-date')) {
        element = element.closest('li');
    }
    const elementJob = element.attributes.job.value;

    if (elementJob == "complete") {
        completeToDo(element);
    } else if (elementJob == "delete") {
        removeToDo(element);
    } else if (elementJob == "update") {
        updateToDo(element);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const toDo = input.value.trim();
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        if (toDo) {
            addToDoToList(toDo, priority, dueDate);
            input.value = "";
            priorityInput.value = "Low";
            dueDateInput.value = "";
        }
    });
});

const today = new Date();
const options = {
    weekday: "long",
    month: "short",
    day: "numeric"
};
dateElement.innerHTML = today.toLocaleDateString("en-US", options);
