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

const deleteIcon = '<svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.42857 23.1111C1.42857 24.7 2.71429 26 4.28571 26H15.7143C17.2857 26 18.5714 24.7 18.5714 23.1111V5.77778H1.42857V23.1111ZM4.28571 8.66667H15.7143V23.1111H4.28571V8.66667ZM15 1.44444L13.5714 0H6.42857L5 1.44444H0V4.33333H20V1.44444H15Z" fill="#FF5A5A" /></svg>';

const taskStatus = {
    ACTIVE: "ACTIVE",
    DONE: "DONE"
}

let currentFilter = undefined;

let tasks = [];

const getNextId = () => {
    if (tasks.length === 0) {
        return 1;
    }
    return tasks.reduce((acc, curr) => acc.id > curr.id ? acc : curr).id + 1;
}

const clearTaskList = () => {
    const listItems = taskList.querySelectorAll('li');
    const listArray = Array.from(listItems);
    listArray.forEach(function (li) {
        li.remove();
    });
}

// Переключение фильтров
filters.forEach(filter => {
    filter.addEventListener('click', function (event) {
        filters.forEach(function (li) {
            li.classList.remove('selected');
        });
        this.classList.add('selected');
        clearTaskList();
        if (event.target.innerText === 'Активные') {
            currentFilter = taskStatus.ACTIVE;
        } else if (event.target.innerText === 'Выполненные') {
            currentFilter = taskStatus.DONE;
        } else {
            currentFilter = undefined;
        }
        showTasks(currentFilter)
    });
});


taskList.addEventListener('click', function (event) {
    const clickedLi = event.target.closest('li');
    const taskId = parseInt(clickedLi.dataset.id);
    const accordionButton = event.target.closest('.accordion');
    // Раскрытие описания
    if (accordionButton && accordionButton === event.target) {
        console.log(clickedLi.closest('.panel'))
        accordionButton.classList.toggle("active");
        const panel = clickedLi.querySelector('.panel');
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    }
    const checkSpan = event.target.closest('span');
    // отметка выполнения
    if (checkSpan && checkSpan === event.target) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.status = task.status === taskStatus.ACTIVE ? taskStatus.DONE : taskStatus.ACTIVE;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            clearTaskList();
            showTasks(currentFilter);
        }
    }
    const deleteButton = event.target.closest('.delete');
    // удаление таски
    if (deleteButton && deleteButton.contains(event.target)) {
        console.log(deleteButton)
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        clearTaskList();
        showTasks(currentFilter);
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

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.insertAdjacentHTML('afterbegin', deleteIcon);
    taskHTML.append(deleteButton);

    const panelDiv = document.createElement('div');
    panelDiv.classList.add('panel');

    const descriptionP = document.createElement('p');
    descriptionP.innerText = task.description;
    panelDiv.append(descriptionP);

    taskHTML.append(panelDiv);

    addBtn.before(taskHTML);
    // taskList = document.querySelectorAll('.tasks li');
}

const showTasks = (status = undefined) => {
    let filteredTasks;
    if (status) {
        filteredTasks = tasks.filter(task => task.status === status);
    } else {
        filteredTasks = tasks;
    }
    for (let i = 0; i < filteredTasks.length; i++) {
        showTask(filteredTasks[i]);
    }
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
    showTasks();
})
