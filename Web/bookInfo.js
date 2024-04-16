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

/*function addNewBooks() {

	const searchParams = new URLSearchParams(window.location.search);
	if(searchParams.has('addBookName')){
		books.push(new Book(
		searchParams.get('addBookName'), 
		searchParams.get('addBookAuthor'), 
		searchParams.get('addBookPublisher'), 
		searchParams.get('addBookYear'), 
		searchParams.get('addBookISBN'), 
		searchParams.get('addBookCategory')));
	}
}
*/

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

//addNewBooks();
displayBooks();





