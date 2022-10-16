let books = [];

const storage = "bookList";

function saveData() {
    const data = JSON.stringify(books);
    localStorage.setItem(storage, data);
}

function loadData() {
    const data = localStorage.getItem(storage);

    if (data) {
        const parsed = JSON.parse(data);
        books = parsed;
    }
}