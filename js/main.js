const filters = document.querySelectorAll('.filters li');
const todo = document.querySelector('.all-tasks');
const inprogress = document.querySelector('.in-progress');
const done = document.querySelector('.done');
const addBtn = document.querySelector('#add-btn');
const modalWrapper = document.querySelector('.modal-wrapper');

filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(function (li) {
            li.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

const myModal = () => {
    modalWrapper.style.display = 'flex';
    modalWrapper.addEventListener('click', (event) => {
        // условие, чтобы modal не закрывался при нажатии на сам modal
        if (event.target === modalWrapper) {
            modalWrapper.style.display = 'none';
        }
    });

}

addBtn.addEventListener('click', () => {
    myModal();
})

