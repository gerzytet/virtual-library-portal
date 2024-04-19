import fs from 'fs';
import pkg from 'pg';
const { Client } = pkg;

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
export async function checkCredentials(username, password) {
    let result = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password])
    return result.rowCount > 0;
    return username === 'username' && password === 'password';
}

var client;

export function initDatabaseConnection(successCallback, failureCallback) {
    var credentials = JSON.parse(fs.readFileSync('db_credentials.json', 'utf8'));

  // Create a new PostgreSQL client instance
  client = new Client({
    user: credentials.user, // Your PostgreSQL username
    host: 'localhost', // Use localhost to connect to the PostgreSQL server running on the same machine
    database: 'test', // Your PostgreSQL database name
    password: credentials.password, // Your PostgreSQL password
    port: 5432 // Your PostgreSQL port
  });

  // Connect to the PostgreSQL database
  client.connect()
    .then(successCallback)
    .catch(err => {console.error('Error connecting to the database', err); failureCallback();})
    .finally(() => {
  });
}
