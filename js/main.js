const filters = document.querySelectorAll('.filters li');
const taskList = document.querySelector('.tasks');
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
    return tasks.reduce((acc, curr) => acc.id > curr.id ? acc : curr).id + 1;
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

// Раскрытие описания
taskList.addEventListener('click', function (event) {
    const clickedLi = event.target.closest('li');
    if (clickedLi && taskList.contains(clickedLi)) {
        const accordionButton = clickedLi.children[1];
        accordionButton.classList.toggle("active"); // Исправлено здесь
        const panel = accordionButton.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
});



// Отображение тасков
const showTask = (task) => {
    // Создаем html элемент таск
    const taskHTML = document.createElement('li');
    if (task.status === taskStatus.DONE) {
        taskHTML.classList.add('selected');
    }
    taskHTML.dataset.id = task.id;

    const checkSpan = document.createElement('span');
    taskHTML.append(checkSpan);

    const accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion');
    accordionButton.innerText = task.title;
    taskHTML.append(accordionButton);

    const panelDiv = document.createElement('div');
    panelDiv.classList.add('panel');

    const descriptionP = document.createElement('p');
    descriptionP.innerText = task.description;
    panelDiv.append(descriptionP);

    taskHTML.append(panelDiv);

    addBtn.before(taskHTML);
    // taskList = document.querySelectorAll('.tasks li');
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

// Сохраняем новую задачу
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
    taskTitle.value = '';
    taskDescription.value = '';
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
    for (let i = 0; i < tasks.length; i++) {
        showTask(tasks[i]);
    }
})
