const logoutButton = document.getElementById('logoutButton');
const displayBooks = document.getElementById('displayBooks');
displayBooks.addEventListener('click', () => {
	window.location.href = 'book-info.html';
});

logoutButton.addEventListener('click', () => {
	window.location.href = 'index.html';
});






