import e from 'express';
import fs from 'fs';
import pkg from 'pg';
import bcrypt from 'bcrypt';
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
    constructor(username){
        this.username = username;
    }
    async getBookCollection() {
        try {
            // Get user ID by querying the database with username and password
            const userIdResult = await client.query('SELECT userid FROM users WHERE username = $1', [this.username]);
            const userId = userIdResult.rows[0].userid;

            // Retrieve books associated with the user ID
            const booksResult = await client.query('SELECT * FROM Books WHERE userid = $1', [userId]);
            const books = booksResult.rows.map(row => {
                let book = new Book(row.title, row.author, row.publisher, row.yearpublished, row.isbn, row.category);
                book.id = row.bookid;
                return book;
            });

            console.log('Books for user', this.username, ':', books);
            return books
        } catch (error) {
            console.error('Error displaying books:', error);
        }
    }

    async searchBookCollection(book) {
        try {
            let query = 'SELECT * FROM books WHERE 1=1'; // Start with a base query
            const { title, author, publisher, year, isbn, category } = book;
            let query_params = [];
            let param_counter = 1;
            // Check each field of the book struct and add conditions to the query as necessary
            if (title !== '') {
                query += ' AND title ILIKE $' + (param_counter++);
                query_params.push('%' + title + '%');
            }
            if (author !== '') {
                query += ' AND author ILIKE $' + (param_counter++);
                query_params.push('%' + author + '%');
            }
            if (publisher !== '') {
                query += ' AND publisher ILIKE $' + (param_counter++);
                query_params.push('%' + publisher + '%');
            }
            if (year !== '') {
                query += ' AND yearPublished = $' + (param_counter++);
                query_params.push(year);
            }
            if (isbn !== '') {
                query += ' AND isbn ILIKE $' + (param_counter++);
                query_params.push('%' + isbn + '%');
            }
            if (category !== '') {
                query += ' AND category ILIKE $' + (param_counter++);
                query_params.push('%' + category + '%');
            }

            console.log(query)

            // Execute the query with appropriate parameters
            const result = await client.query(query, query_params);
            const books = result.rows.map(row => {
                let book = new Book(row.title, row.author, row.publisher, row.yearpublished, row.isbn, row.category);
                book.id = row.bookid;
                return book;
            });

            // Return the search results
            return books;
        } catch (error) {
            console.error('Error searching for book:', error);
            throw error; // Rethrow the error for handling in the caller function
        }
    }

    async addBook(book) {
        try {
            // Get user ID by querying the database with username and password
            const userIdResult = await client.query('SELECT userid FROM users WHERE username = $1', [this.username]);
            const userId = userIdResult.rows[0].userid;

            // Insert book into the database with user ID
            const result = await client.query('INSERT INTO books (title, author, publisher, yearPublished, isbn, category, userid) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [book.title, book.author, book.publisher, book.year === '' ? null : book.year, book.isbn, book.category, userId]);

            console.log("row count: ", result.rowCount)

            console.log('Book added successfully12:', result.rows[0]);
        } catch (error) {
            console.error('Error adding book:', error);
        }
    }

    async removeById(bookId) {
        try {
            // Remove book from the database by book ID
            const result = await client.query('DELETE FROM books WHERE bookid = $1', [bookId]);
            console.log('Book removed successfully:', result.rows[0]);
        } catch (error) {
            console.error('Error removing book:', error);
        }
    }

    async setPassword(password) {
        try {
            // Update password in the database with username
            const hashword = await bcrypt.hash(password, 9);
            const result = await client.query('UPDATE users SET password = $1 WHERE username = $2', [hashword, this.username]);
            console.log('Password updated successfully:', result.rows[0]);
        } catch (error) {
            console.error('Error updating password:', error);
        }
    }

    async editBook(bookId, newBook) {
        try {
            await this.addBook(newBook);
            await this.removeById(bookId);
        } catch (error) {
            console.log('Error editing book:', error);
        }
    }
}

function isNull(value) {
    return value === null || value === undefined;
}

export function validateBook(book){
    if(book.title){
        if(book.title.length > 100){
            return false;
        }
    }else{
        return false;
    }

    if(!isNull(book.author)){
        if(book.author.length > 100){
            return false;
        }
    }else{
        return false;
    }


    if(!isNull(book.publisher)){
        if(book.publisher.length > 100){
            return false;
        }
    }else{
        return false;
    }

    if(isNull(book.year)){
        return false;
    }else{
    for(let i = 0; i < book.year.length; i++){
        if(!(book.year[i] >= '0' && book.year[i] <= '9')){
            return false;
        }
    }
    }


    if(!isNull(book.category)){
        if(book.category.length > 50){
            return false;
        }
    }else{
        return false;
    }


    const isbnRegex = /^[0-9]{3}-[0-9]{10}$/;
    const isValidISBN = book.isbn === '' || isbnRegex.test(book.isbn);

    if (!isValidISBN) {
        return false;
    }
    return true;
}

//return a User object for the given username
export function getUser(username) {
    return new User(username);
}

export async function isUsernameAvailable(username) {
    for (let user of pendingUsers) {
        if (user.username === username) {
            return false;
        }
    }
    let result = await client.query('SELECT * FROM users WHERE username = $1', [username])
    return result.rowCount === 0;
}

export function validateUserData(username, email, password) {
    return username && email && password &&
        username.length > 0 && email.length > 0 && password.length > 0 &&
        email.includes('@') && email.includes('.');
}

export async function createUser(username, email, password) {
    const hashword = await bcrypt.hash(password, 9);
    let result = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashword])
    return result.rowCount > 0;
}

//return true if the given username and password are valid credentials
export async function checkCredentials(username, password) {
    let result = await client.query('SELECT * FROM users WHERE username = $1', [username])
    if (result.rowCount === 0) {
        return false;
    }
    const hashword = result.rows[0].password;
    return await bcrypt.compare(password, hashword);
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

var pendingUsers = [];

export function addPendingUser(username, email, password) {
    pendingUsers.push({username, email, password});
}

export async function confirmRegistration(username) {
    var user = pendingUsers.find(user => user.username === username);
    if (user) {
        await createUser(user.username, user.email, user.password);
        pendingUsers = pendingUsers.filter(user => user.username !== username);
    }
}

export async function findUsernameByEmail(email) {
    let result = await client.query('SELECT username FROM users WHERE email = $1', [email])
    if (result.rowCount === 0) {
        return null;
    }
    return result.rows[0].username;
}

export function getClient() {
    return client;
}
