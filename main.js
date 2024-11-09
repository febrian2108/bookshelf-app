document.addEventListener('DOMContentLoaded', () => {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const bookForm = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');
    const searchBookTitle = document.getElementById('searchBookTitle');

    const BOOKS_KEY = 'BOOKSHELF_APPS';
    let books = [];

    function loadBooksFromStorage() {
        const serializedData = localStorage.getItem(BOOKS_KEY);
        if (serializedData) {
            books = JSON.parse(serializedData);
        } else {
            books = [
                {
                    id: 3657848524,
                    title: 'Harry Potter and the Philosopher\'s Stone',
                    author: 'J.K Rowling',
                    year: 1997,
                    isComplete: false,
                }
            ];
        }
        renderBooks();
    }

    function saveBooksToStorage() {
        const serializedData = JSON.stringify(books);
        localStorage.setItem(BOOKS_KEY, serializedData);
    }

    function createBookElement(book) {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-item');
        bookElement.style.border = "1px solid rgba(0,0,0,.5)";
        bookElement.style.padding = "8px";
        bookElement.style.marginTop = "12px";
        bookElement.style.borderRadius = "5px";

        const bookInfo = document.createElement('div');
        bookInfo.innerHTML = `<h3>${book.title}</h3>
                            <p>Penulis: ${book.author}</p>
                            <p>Tahun: ${book.year}</p>`;
        bookElement.appendChild(bookInfo);

        const bookActions = document.createElement('div');
        bookActions.classList.add('action');

        const switchButton = document.createElement('button');
        switchButton.innerText = book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
        switchButton.classList.add('green');
        switchButton.style.marginRight = '10px';
        switchButton.addEventListener('click', () => switchBookStatus(book.id));
        bookActions.appendChild(switchButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus Buku';
        deleteButton.classList.add('red');
        deleteButton.addEventListener('click', () => deleteBook(book.id));
        bookActions.appendChild(deleteButton);

        bookElement.appendChild(bookActions);
        return bookElement;
    }

    function renderBooks(filteredBooks = books) {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';
        for (const book of filteredBooks) {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookElement);
            } else {
                incompleteBookshelfList.appendChild(bookElement);
            }
        }
    }

    function addBook(book) {
        books.push(book);
        saveBooksToStorage();
        renderBooks();
    }

    function switchBookStatus(bookId) {
        const book = books.find(b => b.id === bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooksToStorage();
            renderBooks();
        }
    }

    function deleteBook(bookId) {
        books = books.filter(b => b.id !== bookId);
        saveBooksToStorage();
        renderBooks();
    }

    bookForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = parseInt(document.getElementById('inputBookYear').value);
        const isComplete = document.getElementById('inputBookIsComplete').checked;

        const newBook = {
            id: +new Date(),
            title,
            author,
            year,
            isComplete
        };
        addBook(newBook);
        bookForm.reset();
    });

    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const query = searchBookTitle.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
        renderBooks(filteredBooks);
    });

    loadBooksFromStorage();
});
