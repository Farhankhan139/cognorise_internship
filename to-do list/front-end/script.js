document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const incompleteTasks = document.getElementById('incompleteTasks');
const completedTasks = document.getElementById('completedTasks');
const message = document.getElementById('message');
const errorMessage = document.getElementById('errorMessage');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditButton = document.getElementById('saveEditButton');

addTaskButton.addEventListener('click', addTask);
saveEditButton.addEventListener('click', saveTask);

async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    // Check for duplicate task
    const existingTasks = Array.from(document.querySelectorAll('.task-list li span')).map(span => span.textContent);
    if (existingTasks.includes(taskText)) {
        showError();
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });

    renderTask(task);
    taskInput.value = '';
    showMessage();
    openTab('incomplete');
}

async function loadTasks() {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    tasks.forEach(task => renderTask(task));
}

function renderTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.id})">
        <span>${task.text}</span>
        <span>
            <i class='bx bx-edit edit' onclick="editTask(${task.id})"></i>
            <i class='bx bx-trash delete' onclick="deleteTask(${task.id})"></i>
        </span>
    `;
    if (task.completed) {
        completedTasks.appendChild(li);
    } else {
        incompleteTasks.appendChild(li);
    }
}

async function toggleTaskCompletion(taskId) {
    const taskElement = document.querySelector(`[data-id='${taskId}']`);
    const checkbox = taskElement.querySelector('.checkbox');
    const updatedTask = {
        id: taskId,
        text: taskElement.querySelector('span').textContent,
        completed: checkbox.checked
    };

    await fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });

    taskElement.remove();
    renderTask(updatedTask);

    if (completedTasks.childElementCount > 0) {
        openTab('completed');
    }
    if (incompleteTasks.childElementCount === 0) {
        incompleteTasks.classList.remove('open');
    }
}

function showMessage() {
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

function showError() {
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 3000);
}

function closeEditModal() {
    editModal.style.display = 'none';
}

async function editTask(taskId) {
    const taskElement = document.querySelector(`[data-id='${taskId}']`);
    const taskText = taskElement.querySelector('span').textContent;

    editTaskInput.value = taskText;
    editModal.setAttribute('data-id', taskId);
    editModal.style.display = 'block';
}

async function saveTask() {
    const taskId = parseInt(editModal.getAttribute('data-id'));
    const taskText = editTaskInput.value.trim();
    if (taskText === '') return;

    const updatedTask = {
        id: taskId,
        text: taskText,
        completed: document.querySelector(`[data-id='${taskId}'] .checkbox`).checked
    };

    await fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
    });

    document.querySelector(`[data-id='${taskId}']`).remove();
    renderTask(updatedTask);
    closeEditModal();
}

async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    });

    document.querySelector(`[data-id='${taskId}']`).remove();
    if (completedTasks.childElementCount === 0) {
        completedTasks.classList.remove('open');
    }
    if (incompleteTasks.childElementCount === 0) {
        incompleteTasks.classList.remove('open');
    }
}

function toggleTab(tabName) {
    const tabContent = document.getElementById(tabName + 'Tasks');
    tabContent.classList.toggle('open');
}

function openTab(tabName) {
    const tabContent = document.getElementById(tabName + 'Tasks');
    tabContent.classList.add('open');
}
