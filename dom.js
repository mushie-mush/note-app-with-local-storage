const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnOpenModal = document.querySelector(".add-book");
const modalForm = document.querySelector(".modal-form");

const alertBox = document.querySelector(".alert");
const btnCloseAlert = document.querySelector(".close-alert");

const title = document.querySelector("#title");
const author = document.querySelector("#author");
const year = document.querySelector("#year");
const isComplete = document.querySelector("#complete");
const dataIndex = document.querySelector("#index");
const dataID = document.querySelector("#id");

const mainEL = document.querySelector("main");
const bookLists = document.querySelectorAll(".book-list");
const completedList = document.querySelector(".list-complete");
const readingList = document.querySelector(".list-read");

const category = document.querySelector(".categories");
const categoryItems = document.querySelectorAll(".category-item");
const completedNumber = document.querySelector(".completed-number");
const unCompletedNumber = document.querySelector(".uncompleted-number");

const search = document.querySelector("#search");
const searchForm = document.querySelector(".search-form");

const loadEvents = function () {
    btnOpenModal.addEventListener("click", openModal);
    btnCloseModal.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
    modalForm.addEventListener("submit", formSubmit);
    mainEL.addEventListener("click", bookActions);
    category.addEventListener("click", selectCategory);
    searchForm.addEventListener("submit", searchBook);
    btnCloseAlert.addEventListener("click", closeAlert);
};

const openModal = function (
    e,
    id = null,
    titleValue = "",
    authorValue = "",
    yearValue = "",
    isCompleteValue = false,
    idx = null
) {
    title.value = titleValue;
    author.value = authorValue;
    year.value = yearValue;
    isComplete.checked = isCompleteValue;
    dataIndex.value = idx;
    dataID.value = id;

    document.querySelector(".modal-title").textContent = idx ?
        "Edit buku" :
        "Tambah buku";
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

const openAlert = function (id) {
    const confirm = document.querySelector("#confirmDelete");
    const cancel = document.querySelector("#cancelDelete");

    confirm.addEventListener("click", () => {
        removeBook(id);
        closeAlert();
    });
    cancel.addEventListener("click", closeAlert);

    alertBox.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeAlert = function () {
    alertBox.classList.add("hidden");
    overlay.classList.add("hidden");
};

const selectCategory = function (e) {
    const clicked = e.target.closest(".category-item");

    if (!clicked) {
        return;
    }

    categoryItems.forEach((e) => e.classList.remove("active"));
    bookLists.forEach((e) => e.classList.add("hidden"));

    clicked.classList.add("active");

    document.querySelector(`.list-${clicked.dataset.category}`).classList.remove("hidden");
};

const formSubmit = function (e) {
    e.preventDefault();

    const titleValue = title.value;
    const authorValue = author.value;
    const yearValue = Number(year.value);
    const isCompleteValue = isComplete.checked;
    const idx = dataIndex.value;
    const id = Number(dataID.value);

    const book = {
        id: idx ? id : Date.now(),
        title: titleValue,
        author: authorValue,
        year: yearValue,
        isComplete: isCompleteValue,
    };

    if (idx) {
        books[idx] = book;
    } else {
        books.push(book);
    }

    saveData();
    showBooks();
    closeModal();
};

const addBook = function (book) {
    const html = `
        <div class="book" id="${book.id}">
            <div class="book-details">
                <h2 class="book-title">${book.title}</h2>
                <div class="book-detail">
                    <div class="year">
                        <img src="./assets/year.svg" alt=""> ${book.year}
                    </div>
                    <div class="author">
                        <img src="./assets/author.svg" alt=""> ${book.author}
                    </div>
                </div>
            </div>
            <div class="book-actions">
                <div class="book-action">
                    <button class="delete"></button>
                    <button class="edit"></button>
                </div>
                <div>
                <button class="toggle-cat">
                    ${book.isComplete ? `Belum selesai` : `Selesai dibaca`}
                </button>
                </div>
            </div>
        </div>
    `;

    if (book.isComplete) {
        completedList.insertAdjacentHTML("beforeend", html);
    } else {
        readingList.insertAdjacentHTML("beforeend", html);
    }
};

const showBooks = function (data = books) {
    const completed = data.filter((book) => book.isComplete === true);
    const uncompleted = data.filter((book) => book.isComplete === false);

    completedNumber.textContent = completed.length;
    unCompletedNumber.textContent = uncompleted.length;

    completedList.innerHTML = "";
    readingList.innerHTML = "";
    data.forEach((book) => {
        addBook(book);
    });
};

const removeBook = function (id) {
    books = books.filter((book) => book.id != id);
    saveData();
    showBooks();
};

const editBook = function (id) {
    const book = books.filter((book) => book.id == id);
    const index = books.findIndex((book) => book.id == id);

    openModal(
        null,
        id,
        book[0].title,
        book[0].author,
        book[0].year,
        book[0].isComplete,
        index
    );
};

const moveBook = function (id) {
    const index = books.findIndex((book) => book.id == id);
    books[index].isComplete = !books[index].isComplete;
    saveData();
    showBooks();
};

const bookActions = function (e) {
    const element = e.target.parentElement.parentElement.parentElement;
    const elementID = element.id;
    if (e.target.className === "delete") openAlert(elementID);
    if (e.target.className === "edit") editBook(elementID);
    if (e.target.className === "toggle-cat") moveBook(elementID);
};

const searchBook = function (e) {
    e.preventDefault();
    const query = search.value;
    const searchBook = books.filter((book) =>
        book.title.toLowerCase().includes(query)
    );
    showBooks(searchBook);
};