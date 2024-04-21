import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ejs from 'ejs';
import { User, Book, checkCredentials, getUser, initDatabaseConnection, isUsernameAvailable, createUser, validateUserData } from './data_interface.mjs'
import jwt from 'jsonwebtoken'
import { randomInt } from 'crypto';
import cookieParser from 'cookie-parser';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
/*const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || 'key-yourkeyhere'});
mg.messages.create('sandbox-123.mailgun.org', {
	from: "Excited User <mailgun@sandbox-123.mailgun.org>",
	to: ["test@example.com"],
	subject: "Hello",
	text: "Testing some Mailgun awesomeness!",
	html: "<h1>Testing some Mailgun awesomeness!</h1>"
})*/



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = '127.0.0.1';
const port = 3000;

var server = express();
//server.get('/', (req, res) => {
//  res.send('Hello World');
//});

server.use(cookieParser())

var jwt_secret = ""
for (let i = 0; i < 64; i++) {
  jwt_secret += String.fromCharCode(randomInt(48, 58));
}
//console.log("jwt_secret: ", jwt_secret)

server.set('view engine', 'ejs');
server.engine('html', ejs.renderFile);

server.use(bodyParser.urlencoded({ extended: true }));

server.get('/index.html', (req, res, next) => {
  res.render(__dirname + '/Web/index.html', {login_failed: false});
})

//css files
server.get('/style.css', (req, res, next) => {
  res.sendFile(__dirname + '/Web/style.css');
})

server.post('/index.html', async (req, res, next) => {
  if (await checkCredentials(req.body.username, req.body.password)) {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    res.cookie("token", jwt.sign({username: req.body.username}, jwt_secret, {expiresIn: "4h"}), {httpOnly: true, sameSite: 'strict'})
    res.sendFile(__dirname + '/Web/homepage.html');
  } else {
    res.render(__dirname + '/Web/index.html', {login_failed: true});
  }
})

server.get('/Signup.html', (req, res, next) => {
  res.sendFile(__dirname + '/Web/Signup.html');
})

server.post('/Signup.html', async (req, res, next) => {
  let newUsername = req.body.newUsername
  let newEmail = req.body.email
  let newPassword = req.body.newPassword
  console.log("newUsername: ", newUsername)
  console.log("newEmail: ", newEmail)
  console.log("newPassword: ", newPassword)
  if (validateUserData(newUsername, newEmail, newPassword) && await isUsernameAvailable(newUsername)) {
    await createUser(newUsername, newEmail, newPassword)
    res.render(__dirname + '/Web/index.html', {login_failed: false});
  } else {
    res.sendFile(__dirname + '/Web/Signup.html');
  }
})
//server authentication wall.
//any route after this will require a valid jwt token
server.use('/', (req, res, next) => {
  console.log('Request Type:', req.method)
  console.log("body: ", req.body)
  console.log("path: ", req.path)
  //console.log("cookies: ", req.cookies.token)
  try {
    let token_decoded = jwt.verify(req.cookies.token, jwt_secret)
    req.username = token_decoded.username
    next()
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      res.render(__dirname + '/Web/index.html', {login_failed: false});
    } else {
      throw err
    }
  }
})

//books.push(books[0])

server.get('/book-info.html', async (req, res, next) => {
  res.render(__dirname + '/Web/book-info.html', {books: await getUser(req.username).getBookCollection()});
})

server.get('/', (req, res, next) => {
  res.render(__dirname + '/Web/index.html', {login_failed: false});
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
  getUser(req.username).addBook(book);
  res.sendFile(__dirname + '/Web/homepage.html');
})

server.post("/removeBooks.html", (req, res, next) => {
  let isbn = req.body.removeBookISBN
  getUser().removeByISBN(isbn)
  res.sendFile(__dirname + '/Web/homepage.html');
})

server.use(express.static('Web'));

server.listen(port, hostname, () => {
  initDatabaseConnection(
  () => {
    console.log('Server running at http://' + hostname + ':' + port + '/');
  }
  ,() => {
    console.log('Failed to connect to the database');
    server.close();
  })
});
