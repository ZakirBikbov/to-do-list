// Фильтры
const filters = document.querySelectorAll('.filters li');

// Список задач
const taskList = document.querySelector('.tasks');

// Кнопка открытия модалки
const addBtn = document.querySelector('#add-btn');

// Модалка
const modalWrapper = document.querySelector('.modal-wrapper');

// Инпуты с модалки
const taskTitle = document.querySelector('.task-title');
const taskDescription = document.querySelector('.task-description');
const saveBtn = document.querySelector('.modal-btn');

// Иконка для кнопки удаления
const deleteIcon = '<svg width="20" height="26" viewBox="0 0 20 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.42857 23.1111C1.42857 24.7 2.71429 26 4.28571 26H15.7143C17.2857 26 18.5714 24.7 18.5714 23.1111V5.77778H1.42857V23.1111ZM4.28571 8.66667H15.7143V23.1111H4.28571V8.66667ZM15 1.44444L13.5714 0H6.42857L5 1.44444H0V4.33333H20V1.44444H15Z" fill="#FF5A5A" /></svg>';

// Статусы задач
const taskStatus = {
    ACTIVE: "ACTIVE",
    DONE: "DONE"
}

// Текущий фильтр
let currentFilter = undefined;

// Отображаемые задачи
let tasks = [];

// Автоинкремент для id задач
const getNextId = () => {
    if (tasks.length === 0) {
        return 1;
    }
    return tasks.reduce((acc, curr) => acc.id > curr.id ? acc : curr).id + 1;
}

// Очищение списка
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

// Взаимодействие со списком
taskList.addEventListener('click', function (event) {
    const clickedLi = event.target.closest('li');
    const taskId = parseInt(clickedLi.dataset.id);
    const accordionButton = event.target.closest('.accordion');
    // Раскрытие описания
    if (accordionButton && accordionButton === event.target) {
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
    // удаление задачи
    if (deleteButton && deleteButton.contains(event.target)) {
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        clearTaskList();
        showTasks(currentFilter);
    }
});

// Отображение задач
const showTask = (task) => {
    // Создаем html элемент таск
    const taskHTML = document.createElement('li');
    if (task.status === taskStatus.DONE) {
        taskHTML.classList.add('selected');
    }
    taskHTML.dataset.id = task.id;

    // Создаем элемент для смены статуса задачи
    const checkSpan = document.createElement('span');
    taskHTML.append(checkSpan);

    // Создаем элемент с названием таска
    const accordionButton = document.createElement('button');
    accordionButton.classList.add('accordion');
    accordionButton.innerText = task.title;
    taskHTML.append(accordionButton);

    // Создаем кнопку удаления
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.insertAdjacentHTML('afterbegin', deleteIcon);
    taskHTML.append(deleteButton);

    // Создаем элемент с описанием
    const panelDiv = document.createElement('div');
    panelDiv.classList.add('panel');

    const descriptionP = document.createElement('p');
    descriptionP.innerText = task.description;
    panelDiv.append(descriptionP);

    taskHTML.append(panelDiv);

    addBtn.before(taskHTML);
}

// Отображение задач с учетом текущего фильтра
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

// Подгружаем сохраненные задачи из localStorage
document.addEventListener('DOMContentLoaded', () => {
    const lsTasks = localStorage.getItem('tasks');
    if (!lsTasks) {
        return;
    }
    tasks.push(...JSON.parse(lsTasks));
    showTasks();
})