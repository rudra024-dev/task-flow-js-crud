// script.js

// DOM Elements - LO7
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Data Structures - LO5
let tasks = []; // Array to hold task objects

// Custom Function to generate a unique ID - LO6
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to create a task object - LO5, LO6
function createTaskObject(text) {
    return {
        id: generateId(),
        text: text,
        completed: false // LO4 (usage of a boolean value)
    };
}

// Function to render the task list - LO6, LO7
function renderTasks() {
    taskList.innerHTML = ''; // Clear the list

    // LO4 (Loop - for...of loop)
    for (const task of tasks) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // LO7 (DOM Manipulation - modifying innerHTML, className)
        taskList.appendChild(li);
    }
}

// Function to add a task - LO6, LO8
function addTask(event) {
    event.preventDefault(); // Prevent form submission

    const inputValue = taskInput.value.trim();

    // LO4 (Comparison operator, Logical operator, Branching)
    if (inputValue === '' || inputValue.length < 3) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid task (at least 3 characters).'
        });
        return;
    }

    const newTask = createTaskObject(inputValue);
    tasks.push(newTask); // LO5 (Adding to an array)
    renderTasks();
    taskInput.value = ''; // Clear the input
    saveTasksToLocalStorage(); // Simulate saving data

    // Success SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Task Added',
        text: 'Your task was successfully added!',
        timer: 1500,
        showConfirmButton: false
    });
}

// Function to handle clicks on the task list (Event Delegation) - LO8
function handleTaskActions(event) {
    const target = event.target;
    const taskItem = target.closest('.task-item');
    const taskId = taskItem.dataset.id;

    // LO4 (Branching - if/else if)
    if (target.classList.contains('delete-btn')) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            // SweetAlert confirm before delete
            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    tasks.splice(taskIndex, 1); // LO5 (Removing from an array)
                    renderTasks();
                    saveTasksToLocalStorage();
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your task has been deleted.",
                        icon: "success"
                    });
                }
            });
        }
    } else if (target.classList.contains('edit-btn')) {
        const task = tasks.find(task => task.id === taskId); // LO5 (Finding in an array)

        // SweetAlert input prompt for editing
        Swal.fire({
            title: 'Edit your task',
            input: 'text',
            inputLabel: 'Task:',
            inputValue: task.text,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value || value.trim().length < 3) {
                    return 'Please enter at least 3 characters.';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                task.text = result.value.trim();
                renderTasks();
                saveTasksToLocalStorage();

                Swal.fire({
                    icon: 'success',
                    title: 'Task Updated',
                    text: 'Your task was successfully updated!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    } else if (target.tagName === 'SPAN') {
        const task = tasks.find(task => task.id === taskId);
        task.completed = !task.completed; // LO4 (Logical NOT operator)
        renderTasks();
        saveTasksToLocalStorage();
    }
}

// Event Listeners - LO8
taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskActions);

// --- Asynchronous Operations & AJAX Simulation ---

// LO10, LO11, LO12: Simulating API calls with setTimeout and fetch

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        Promise.resolve(JSON.parse(storedTasks))
            .then(data => {
                tasks = data;
                renderTasks();
            });
    }
}

async function demonstrateAPICalls() {
    try {
        const getResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const getData = await getResponse.json();
        console.log('GET Request Demo - Fetched Post:', getData);

        const postResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: 'My TaskFlow Demo',
                body: 'This is a demonstration of a POST request from my CRUD app.',
                userId: 1,
            }),
        });
        const postData = await postResponse.json();
        console.log('POST Request Demo - Created Post:', postData);

    } catch (error) {
        console.error('Error demonstrating API calls:', error);
    }
}

function processTaskCount(taskArray) {
    return taskArray.length;
}

function displayTaskCount(countFunction, taskArray) {
    const count = countFunction(taskArray);
    console.log(`Total number of tasks: ${count}`);
}

// Initialize the app
function init() {
    loadTasksFromLocalStorage();
    demonstrateAPICalls();
    displayTaskCount(processTaskCount, tasks);
}

init();


