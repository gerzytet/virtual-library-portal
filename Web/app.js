const logoutButton = document.getElementById('logoutButton');

document.addEventListener('DOMContentLoaded', () => {
	const addBooksButton = document.getElementById('addBooks');
	addBooksButton.addEventListener('click', () => {
	if (addFormContainer) {
		addFormContainer.innerHTML = '';
		searchFormContainer.innerHTML = '';
		const addFormHTML = `
		<div class = form-container>
			<h2>Add a Book!</h2>
			<p> Must enter a title to add a book </p>
			<hr>
			<div class=space> </div>
			<div class=space> </div>
				<form id="addForm" method="POST">
				<div class="form-group">
					<input type="text" id="addBookName" name="addBookName" placeholder="Book Name" maxlength="35" required>
				</div>
				<div class="form-group">
					<input type="text" id="addBookAuthor" name="addBookAuthor" placeholder="Author" maxlength="35">
				</div>
				<div class="form-group">				
					<input type="text" id="addBookPublisher" name="addBookPublisher" placeholder="Publisher" maxlength="35">
				</div>
				<div class="form-group">
					<input type="text" pattern="\d*" id="addBookYear" name="addBookYear" placeholder="Year Published" maxlength="4" minlength="4">
				</div>
				<div class="form-group">
					<input type="text" id="addBookISBN" name="addBookISBN" placeholder="ISBN" pattern="\d{3}-\d{10}">
				</div>
				<div class="form-group">
					<input type="text" id="addBookCategory" name="addBookCategory" placeholder="Category" maxlength="25">
				</div>
				<div class="form-group">
					<button id="submitBook" type="submit">Add!</button>
				</div>
				</form>
		</div>`
		addFormContainer.innerHTML = addFormHTML;
	}
	

	});
});
document.addEventListener('DOMContentLoaded', () => {
    const searchBooksButton = document.getElementById('searchBooks');

    searchBooksButton.addEventListener('click', () => {
        const searchFormContainer = document.getElementById('searchFormContainer');
        if (searchFormContainer) {
            searchFormContainer.innerHTML = '';
			addFormContainer.innerHTML = '';

            const searchFormHTML = `
			<div class=form-container>
				<h2>Search For a Book!</h2>
				<p> Can search for books using any field </p>
				<hr>
				<div class=space> </div>
				<div class=space> </div>
				<form id="searchForm" method="POST">
					<div class="form-group">
						<input type="text" id="addBookName" name="addBookName" placeholder="Book Name" maxlength="35">
					</div>
					<div class="form-group">
						<input type="text" id="addBookAuthor" name="addBookAuthor" placeholder="Author" maxlength="35">
					</div>
					<div class="form-group">
						<input type="text" id="addBookPublisher" name="addBookPublisher" placeholder="Publisher" maxlength="35">
					</div>
					<div class="form-group">	
						<input type="text" pattern="\d*" id="addBookYear" name="addBookYear" placeholder="Year Published" maxlength="4" minlength="4">
					</div>	
					<div class="form-group">
						<input type="text" id="addBookISBN" name="addBookISBN" placeholder="ISBN" maxlength="13" minlength="13">
					</div>
					<div class="form-group">	
						<input type="text" id="addBookCategory" name="addBookCategory" placeholder="Category" maxlength="25">
					</div>
					<div class="form-group">
						<button id="searchBook" type="submit">Search!</button>
					</div>
				</form>
			</div>
            `;

            searchFormContainer.innerHTML = searchFormHTML;
        }
    });
});


logoutButton.addEventListener('click', () => {
	window.location.href = 'index.html';
});

