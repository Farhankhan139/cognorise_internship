const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('front-end'));

const TASKS_FILE = 'tasks.json';

function loadTasks() {
    try {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading tasks from file:", err);
        return [];
    }
}


function saveTasks(tasks) {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
        console.log("Tasks successfully saved.");
    } catch (err) {
        console.error("Error saving tasks to file:", err);
    }
}

let tasks = loadTasks();

app.get('/tasks', (req, res) => {
    tasks = loadTasks(); 
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    saveTasks(tasks);
    res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    console.log(`Updating task with ID: ${taskId}`);
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            console.log("Task found and updated:", updatedTask);
            return updatedTask;
        }
        return task;
    });
    saveTasks(tasks);
    res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    console.log(`Deleting task with ID: ${taskId}`);
    tasks = tasks.filter(task => {
        if (task.id !== taskId) {
            return true;
        } else {
            console.log("Task found and deleted:", task);
            return false;
        }
    });
    saveTasks(tasks);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
