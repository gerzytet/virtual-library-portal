import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ejs from 'ejs';
import { User, Book, checkCredentials, getUser } from './data_interface.mjs'
import { get } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = '127.0.0.1';
const port = 3000;

var server = express();
//server.get('/', (req, res) => {
//  res.send('Hello World');
//});

server.set('view engine', 'ejs');
server.engine('html', ejs.renderFile);

server.use(bodyParser.urlencoded({ extended: true }));

server.use('/', (req, res, next) => {
  console.log('Request Type:', req.method)
  console.log("body: ", req.body)
  console.log("path: ", req.path)
  next()
})

//books.push(books[0])

server.get('/book-info.html', (req, res, next) => {
  res.render(__dirname + '/Web/book-info.html', {books: getUser("username").getBookCollection()});
})

server.get('/', (req, res, next) => {
  res.render(__dirname + '/Web/index.html', {login_failed: false});
})

server.get('/index.html', (req, res, next) => {
  res.render(__dirname + '/Web/index.html', {login_failed: false});
})

server.post('/index.html', (req, res, next) => {
  if (checkCredentials(req.body.username, req.body.password)) {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    res.sendFile(__dirname + '/Web/homepage.html');
  } else {
    res.render(__dirname + '/Web/index.html', {login_failed: true});
  }
})

server.post("/add-confirmation.html", (req, res, next) => {
  let book = new Book(
    req.body.addBookName,
    req.body.addBookAuthor,
    req.body.addBookPublisher,
    req.body.addBookYear,
    req.body.addBookISBN,
    req.body.addBookCategory
  )
  getUser("username").addBook(book)
  res.sendFile(__dirname + '/Web/homepage.html');
})

server.use(express.static('Web'));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
