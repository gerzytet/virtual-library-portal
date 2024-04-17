export class Book {
    constructor(title, author, publisher, year, isbn, category) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.year = year;
        this.isbn = isbn;
        this.category = category;
    }
  }

// Create an array of books
var defaultBooks = [
    new Book('JavaScript: The Good Parts', 'Douglas Crockford', 'O\'Reilly Media', 2008, '978-0596517748', 'Programming'),
    new Book('Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 2008, '978-0132350884', 'Programming'),
    new Book('The Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 'Pan Books', 1979, '978-0330258647', 'Science Fiction'),
    // Add more books as needed
];

export class User {
    getBookCollection() {
        return defaultBooks;
    }

    addBook(book) {
        defaultBooks.push(book);
    }

    removeByISBN(isbn) {
        defaultBooks = defaultBooks.filter(book => book.isbn !== isbn);
    }
}

//return a User object for the given username
export function getUser(username) {
    return new User();
}

//return true if the given username and password are valid credentials
export function checkCredentials(username, password) {
    return username === 'username' && password === 'password';
}
