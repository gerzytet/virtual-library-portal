const logoutButton = document.getElementById('logoutButton');
const displayBooks = document.getElementById('displayBooks');
const addBooks = document.getElementById('addBooks');
const searchBooks = document.getElementById('searchBooks');
const removeBooks = document.getElementById('removeBooks');


removeBooks.addEventListener('click', () => {
	window.location.href = 'removeBooks.html';
});

addBooks.addEventListener('click', () => {
	window.location.href = 'addBook.html';
});

searchBooks.addEventListener('click', () => {
	window.location.href = 'searchBooks.html';
});

displayBooks.addEventListener('click', () => {
	window.location.href = 'book-info.html';
});

logoutButton.addEventListener('click', () => {
	window.location.href = 'index.html';
});





