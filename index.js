
let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task)); 
        updateTasksLists();
        updateStats();
    }
});

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput'); 
    const text = taskInput.value.trim();
    const priority = priorityInput.value;

    if (text) {
        tasks.push({ text: text, completed: false, priority: priority });
        updateTasksLists();
        updateStats();
        taskInput.value = ""; 
        priorityInput.value = "Medium"; 
        saveTasks(); 
    }
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksLists();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksLists();
    updateStats();
    saveTasks();
};

const deleteCompletedTasks = () => {
    tasks = tasks.filter(task => !task.completed);
    updateTasksLists();
    updateStats();
    saveTasks();
};

document.getElementById('deleteComplete').addEventListener('click', deleteCompletedTasks);

const deleteAllTasks = () => {
    tasks = [];
    updateTasksLists();
    updateStats();
    saveTasks();
};
document.getElementById('deleteAllButton').addEventListener('click', deleteAllTasks);


const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    const priorityInput = document.getElementById('priorityInput');
    taskInput.value = tasks[index].text;
    priorityInput.value = tasks[index].priority;
    tasks.splice(index, 1);
    updateTasksLists();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completeTasks / totalTasks) * 100;
    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;

    document.getElementById('numbers').innerText = `${completeTasks}/${totalTasks}`;

    if (totalTasks > 0 && completeTasks === totalTasks) {
        blastConfetti();
    }
};

const updateTasksLists = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";

    tasks.sort((a, b) => {
        const priorities = { "High": 1, "Medium": 2, "Low": 3 };
        return priorities[a.priority] - priorities[b.priority];
    });

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskComplete(${index})"/>
                    <p>${task.text} - <strong>${task.priority} Priority</strong></p>
                </div>
                <div>
                    <img src="./icons8-modifier-128.png" alt="Edit" onclick="editTask(${index})">
                    <img src="./corbeille.png" alt="Delete" onclick="deleteTask(${index})">
                </div>
            </div>`;
        taskList.append(listItem);
    });
};



document.getElementById('taskForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});

const blastConfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
