const fetch = require('node-fetch'); // Import the 'node-fetch' library for making HTTP requests


function handleHomeButtonClick() {
    window.location.href = 'homepage.html';
}



const homeButton = document.getElementById('homeButton');
homeButton.addEventListener('click', handleHomeButtonClick);

class Book {
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
const books = [
    new Book('JavaScript: The Good Parts', 'Douglas Crockford', 'O\'Reilly Media', 2008, '978-0596517748', 'Programming'),
    new Book('Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Prentice Hall', 2008, '978-0132350884', 'Programming'),
    new Book('The Hitchhiker\'s Guide to the Galaxy', 'Douglas Adams', 'Pan Books', 1979, '978-0330258647', 'Science Fiction'),
    // Add more books as needed
];



function displayBooks() {
    const bookContainer = document.getElementById('bookContainer');

    bookContainer.innerHTML = '';

    books.forEach(book => {
        const bookInfoElement = document.createElement('div');
        bookInfoElement.classList.add('book-info'); // Add the "book-info" class
        const bookDataString = `
            <p><strong>Title:</strong> ${book.title}</p>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Publisher:</strong> ${book.publisher}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <hr>
        `;

        bookInfoElement.innerHTML = bookDataString;

        bookContainer.appendChild(bookInfoElement);
    });
}

//const fetch = require('node-fetch'); // Import the 'node-fetch' library for making HTTP requests

// Define the book data
const bookData = {
    addBookName: 'Example Book',
    addBookAuthor: 'John Doe',
    addBookPublisher: 'Example Publisher',
    addBookYear: 2024,
    addBookISBN: '1234567890',
    addBookCategory: 'Fiction'
};

// Define the URL of the server
const serverUrl = 'http://localhost:3000'; // Assuming the server is running locally on port 3000

// Define the request parameters
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData) // Convert bookData to JSON format and send it in the request body
};

// Send the POST request
fetch(`${serverUrl}/add-confirmation.html`, requestOptions)
    .then(response => {
        if (response.ok) {
            console.log('Book added successfully!');
        } else {
            console.error('Failed to add book:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
