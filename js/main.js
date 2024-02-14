const filters = document.querySelectorAll('.filters li');
const todo = document.querySelector('.all-tasks');
const inprogress = document.querySelector('.in-progress');
const done = document.querySelector('.done');
const addBtn = document.querySelector('#add-btn');

filters.forEach(filter => {
    filter.addEventListener('click', function () {
        filters.forEach(function (li) {
            li.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});