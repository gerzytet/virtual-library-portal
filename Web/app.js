const logoutButton = document.getElementById('logoutButton');

function displayEditForm() {
	if (editFormContainer) {

		addFormContainer.innerHTML = '';
		searchFormContainer.innerHTML = '';
		editFormContainer.innerHTML = '';
		const editFormHTML = `
		<div class = form-container>
			<h2>Edit Book Information!</h2>
			<p> Can edit any fields </p>
			<hr>
			<div class=space> </div>
			<div class=space> </div>
				<form id="editForm" method="POST" action="edit_book">
				<div class="form-group">
					<input type="text" id="editBookName" name="editBookName" placeholder="Book Name" maxlength="35" required>
				</div>
				<div class="form-group">
					<input type="text" id="editBookAuthor" name="editBookAuthor" placeholder="Author" maxlength="35">
				</div>
				<div class="form-group">
					<input type="text" id="editBookPublisher" name="editBookPublisher" placeholder="Publisher" maxlength="35">
				</div>
				<div class="form-group">
					<input type="text" pattern="\\d*" id="editBookYear" name="editBookYear" placeholder="Year Published" maxlength="4" minlength="4">
				</div>
				<div class="form-group">
					<input type="text" id="editBookISBN" name="editBookISBN" placeholder="ISBN" pattern="\\d{3}-\\d{10}">
				</div>
				<div class="form-group">
					<input type="text" id="editBookCategory" name="editBookCategory" placeholder="Category" maxlength="25">
				</div>
				<div class="form-group">
					<input type="text" id="editBookId" name="editBookId" style="display:none">
				</div>
				<div class="form-group">
					<button id="submitBook" type="submit">Confirm Changes!</button>
				</div>
				</form>
		</div>`
		editFormContainer.innerHTML = editFormHTML;
	}
}



document.addEventListener('DOMContentLoaded', () => {
	const addBooksButton = document.getElementById('addBooks');
	addBooksButton.addEventListener('click', () => {
	if (addFormContainer) {
		addFormContainer.innerHTML = '';
		editFormContainer.innerHTML = '';
		searchFormContainer.innerHTML = '';
		const addFormHTML = `
		<div class = form-container>
			<h2>Add a Book!</h2>
			<p> Must enter a title to add a book </p>
			<hr>
			<div class=space> </div>
			<div class=space> </div>
				<form id="addForm" method="POST" action="add_book">
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
					<input type="text" pattern="\\d*" id="addBookYear" name="addBookYear" placeholder="Year Published" maxlength="4" minlength="4">
				</div>
				<div class="form-group">
					<input type="text" id="addBookISBN" name="addBookISBN" placeholder="ISBN" pattern="\\d{3}-\\d{10}">
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
			editFormContainer.innerHTML = '';

            const searchFormHTML = `
			<div class=form-container>
				<h2>Search For a Book!</h2>
				<p> Can search for books using any field </p>
				<hr>
				<div class=space> </div>
				<div class=space> </div>
				<form id="searchForm" method="GET">
					<div class="form-group">
						<input type="text" id="searchBookName" name="searchBookName" placeholder="Book Name" maxlength="35">
					</div>
					<div class="form-group">
						<input type="text" id="searchBookAuthor" name="searchBookAuthor" placeholder="Author" maxlength="35">
					</div>
					<div class="form-group">
						<input type="text" id="searchBookPublisher" name="searchBookPublisher" placeholder="Publisher" maxlength="35">
					</div>
					<div class="form-group">
						<input type="text" pattern="\\d*" id="searchBookYear" name="searchBookYear" placeholder="Year Published" maxlength="4" minlength="4">
					</div>
					<div class="form-group">
						<input type="text" id="searchBookISBN" name="searchBookISBN" placeholder="ISBN" maxlength="13" minlength="13">
					</div>
					<div class="form-group">
						<input type="text" id="searchBookCategory" name="searchBookCategory" placeholder="Category" maxlength="25">
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
	window.location.href = 'logout.html';
});

function deleteBook(bookId) {
	let data = new URLSearchParams();
	data.append("deleteBookId", bookId);

	fetch("/delete_book", {
		body: data,
		method: "post"
	}).then(response => {
		if (response.ok) {
			window.location.reload();
		}
	});
}


function editBook(bookId) {
	displayEditForm();
	let fieldIDs = ["title", "author", "publisher", "year", "ISBN", "category"];
	let formIDs = ["editBookName", "editBookAuthor", "editBookPublisher", "editBookYear", "editBookISBN", "editBookCategory"];

	for (let i = 0; i < fieldIDs.length; i++) {
		let field = document.getElementById(fieldIDs[i] + bookId);
		if (!field) {
			continue;
		}
		let form = document.getElementById(formIDs[i]);
		console.log(form)
		form.value = field.innerText;
	}
	document.getElementById("editBookId").value = bookId;
}
