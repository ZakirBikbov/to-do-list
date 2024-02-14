const filters = document.querySelectorAll('.filters li');
const taskListHtml = document.querySelector('.tasks');
const todo = document.querySelector('.all-tasks');
const inProgress = document.querySelector('.in-progress');
const done = document.querySelector('.done');
const addBtn = document.querySelector('#add-btn');
const modalWrapper = document.querySelector('.modal-wrapper');
const saveBtn = document.querySelector('.modal-btn');
const taskTitle = document.querySelector('.task-title');
const taskDescription = document.querySelector('.task-description');

const taskStatus = {
    ACTIVE: "ACTIVE",
    DONE: "DONE"
}

const tasks = [];

const getNextId = () => {
    if (tasks.length === 0) {
        return 1;
    }
    return tasks.reduce((acc, curr) => acc.id > curr.id ? acc : curr).id;
}

// Переключение фильтров
filters.forEach(filter => {
    filter.addEventListener('click', function () {
        filters.forEach(function (li) {
            li.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

// Отображение тасков
const showTask = (task) => {
    // Создаем html элемент таск
    const taskHTML = document.createElement('li');
    if (task.status === taskStatus.DONE) {
        taskHTML.classList.add('selected');
    }
    taskHTML.dataset.id = task.id;
    console.log(task.title)
    taskHTML.innerText = task.title;
    addBtn.before(taskHTML);
}


// Открытие модалки для добавления таски
addBtn.addEventListener('click', () => {
    modalWrapper.style.display = 'flex';
    modalWrapper.addEventListener('mousedown', (event) => {
        // условие, чтобы modal не закрывался при нажатии на сам modal
        if (event.target === modalWrapper) {
            modalWrapper.style.display = 'none';
        }
    });
})

saveBtn.addEventListener('click', () => {
    if (taskTitle.value.trim() === '' ||
        taskDescription.value.trim() === '') {
        return;
    }
    const task = {
        id: getNextId(),
        title: taskTitle.value,
        description: taskDescription.value,
        status: taskStatus.ACTIVE
    }
    tasks.push(task);
    showTask(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    modalWrapper.style.display = 'none';
})

document.addEventListener('DOMContentLoaded', () => {
    const lsTasks = localStorage.getItem('tasks');
    if (!lsTasks) {
        return;
    }
    tasks.push(...JSON.parse(lsTasks));
    console.log('tasks: ', tasks);
    for (let i = 0; i < tasks.length; i++) {
        showTask(tasks[i]);
    }
})
