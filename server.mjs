import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ejs from 'ejs';
import { validateBook, findUsernameByEmail, addPendingUser, confirmRegistration, User, Book, checkCredentials, getUser, initDatabaseConnection, isUsernameAvailable, createUser, validateUserData } from './data_interface.mjs'
import jwt from 'jsonwebtoken'
import { randomInt } from 'crypto';
import cookieParser from 'cookie-parser';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { readFileSync } from 'fs';
const mailgun = new Mailgun(formData);
const mailgun_key = readFileSync('mailgun_key.txt', 'utf8').trim();

const mg = mailgun.client({username: 'api', key: mailgun_key});

var emails_left = 20; //limit emails to 20 per day to prevent spamming in a primitive way
function sendVerificationEmail(email, url) {
  if (emails_left-- <= 0) {
    return;
  }
  mg.messages.create('virtual-library-portal.tech', {
    from: "Virtual Library Portal <registration@virtual-library-portal.tech>",
    to: [email],
    subject: "Verify your account",
    text: "Your vertification link is:" + url,
    html: "Your vertification link is:" + url
  })
}

function sendForgotPasswordEmail(email, url) {
  if (emails_left-- <= 0) {
    return;
  }
  mg.messages.create('virtual-library-portal.tech', {
    from: "Virtual Library Portal <registration@virtual-library-portal.tech>",
    to: [email],
    subject: "Reset your password",
    text: "Your password reset link is:" + url,
    html: "Your password reset link is:" + url
  })
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = '127.0.0.1';
const port = 3000;

var server = express();
server.use(cookieParser());

var jwt_secret = "";
for (let i = 0; i < 64; i++) {
  jwt_secret += String.fromCharCode(randomInt(48, 58));
}
//console.log("jwt_secret: ", jwt_secret)

server.set('view engine', 'ejs');
server.engine('html', ejs.renderFile);

server.use(bodyParser.urlencoded({ extended: true }));

server.get('/index.html', (req, res, next) => {
  res.render(__dirname + '/Web/index.html', {status: ""});
})

server.get("/icon.png", (req, res, next) => {
  res.sendFile(__dirname + '/Web/icon.png');
})

//css file for login screen doesn't need authentication
server.get('/style.css', (req, res, next) => {
  res.sendFile(__dirname + '/Web/style.css');
})

//neither does the logo
server.get('/logo.png', (req, res, next) => {
  res.sendFile(__dirname + '/Web/logo.png');
})

server.post('/index.html', async (req, res, next) => {
  if (await checkCredentials(req.body.username, req.body.password)) {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    res.cookie("token", jwt.sign({username: req.body.username}, jwt_secret, {expiresIn: "4h"}), {httpOnly: true, sameSite: 'strict'})
    res.redirect('/homepage.html');
  } else {
    res.render(__dirname + '/Web/index.html', {status: "login_failed"});
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
    //await createUser(newUsername, newEmail, newPassword)
    addPendingUser(newUsername, newEmail, newPassword)
    let token = jwt.sign({register_username: newUsername}, jwt_secret, {expiresIn: "12h"})
    let urlEncodedToken = encodeURIComponent(token)
    let url = `https://virtual-library-portal.tech/confirm-registration.html?token=${urlEncodedToken}`
    console.log("url: ", url)
    sendVerificationEmail(newEmail, url)
    res.render(__dirname + '/Web/EmailVerification.html', {email: newEmail});
  } else {
    res.redirect('/index.html');
  }
})

server.get('/confirm-registration.html', (req, res, next) => {
  let token = req.query.token
  if (token === undefined) {
    res.render(__dirname + '/Web/index.html', {status: "registration_failed"})
  } else {
    try {
      let token_decoded = jwt.verify(token, jwt_secret)
      let newUsername = token_decoded.register_username
      confirmRegistration(newUsername)
      res.sendFile(__dirname + '/Web/confirm-registration.html');
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        res.render(__dirname + '/Web/index.html', {status: "registration_failed"}, (err, html) => {
          res.location('/index.html')
          res.send(html)
        })
      } else {
        throw err
      }
    }
  }
})

server.post('/forgot_password', async (req, res, next) => {
  let email = req.body.email;
  if (email) {
    let username = await findUsernameByEmail(email);
    if (username) {
      let forgot_token = jwt.sign({forgotPasswordEmail: email}, jwt_secret, {expiresIn: "1h"})
      let urlEncodedToken = encodeURIComponent(forgot_token)
      sendForgotPasswordEmail(email, `https://virtual-library-portal.tech/reset-password.html?token=${urlEncodedToken}`)
      //console.log(`http://localhost:3000/reset-password.html?token=${urlEncodedToken}`)
    }
  }
  res.redirect('/forgot-password-sent.html');
});

server.get("/forgot-password-sent.html", (req, res, next) => {
  res.sendFile(__dirname + '/Web/forgot-password-sent.html');
});

server.get("/forgot-password.html", (req, res, next) => {
  res.sendFile(__dirname + '/Web/forgot-password.html');
});

server.get("/reset-password.html", (req, res, next) => {
  let token = req.query.token
  if (token === undefined) {
    res.render(__dirname + '/Web/index.html', {status: "reset_password_failed"})
  } else {
    try {
      let token_decoded = jwt.verify(token, jwt_secret)
      res.render(__dirname + '/Web/reset-password.html', {token: token})
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        res.render(__dirname + '/Web/index.html', {status: "reset_password_failed"}, (err, html) => {
          res.location('/index.html')
          res.send(html)
        })
      } else {
        throw err
      }
    }
  }
});

server.post("/reset-password", async (req, res, next) => {
  let token = req.body.token
  let password = req.body.newPassword
  if (token && password) {
    try {
      let token_decoded = jwt.verify(token, jwt_secret)
      let email = token_decoded.forgotPasswordEmail
      let username = await findUsernameByEmail(email)
      if (username) {
        await getUser(username).setPassword(password)
        res.redirect('/reset-password-success.html');
      }
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log(err)
        res.render(__dirname + '/Web/index.html', {status: "reset_password_failed"})
      } else {
        throw err
      }
    }
  }
});

server.get("/reset-password-success.html", (req, res, next) => {
  res.sendFile(__dirname + '/Web/reset-password-success.html');
});

server.get("/logout.html", (req, res, next) => {
  res.clearCookie("token")
  res.redirect('/index.html');
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
      res.redirect('/index.html');
    } else {
      throw err
    }
  }
})

//books.push(books[0])
server.get('/book-info.html', async (req, res, next) => {
  res.render(__dirname + '/Web/book-info.html', {books: await getUser(req.username).getBookCollection()});
})

server.get('/homepage.html', async (req, res, next) => {
  let search_params = [req.query.searchBookName,
    req.query.searchBookAuthor,
    req.query.searchBookPublisher,
    req.query.searchBookYear,
    req.query.searchBookISBN,
    req.query.searchBookCategory]
  if (containsNoUndefined(search_params)) {
    let search_criteria = new Book(
      req.query.searchBookName,
      req.query.searchBookAuthor,
      req.query.searchBookPublisher,
      req.query.searchBookYear,
      req.query.searchBookISBN,
      req.query.searchBookCategory
    );
    let search_results = await getUser(req.username).searchBookCollection(search_criteria);
    res.render(__dirname + '/Web/homepage.html', {books: search_results});
  } else {
    res.render(__dirname + '/Web/homepage.html', {books: await getUser(req.username).getBookCollection()});
  }
})

function containsNoUndefined(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === undefined) {
      return false
    }
  }
  return true
}

server.post('/add_book', async (req, res, next) => {
  var add_book_params = [req.body.addBookName,
    req.body.addBookAuthor,
    req.body.addBookPublisher,
    req.body.addBookYear,
    req.body.addBookISBN,
    req.body.addBookCategory]
    if (containsNoUndefined(add_book_params)) {
      let book = new Book(
        req.body.addBookName,
        req.body.addBookAuthor,
        req.body.addBookPublisher,
        req.body.addBookYear,
        req.body.addBookISBN,
        req.body.addBookCategory
      );
      await getUser(req.username).addBook(book);
      res.redirect('/homepage.html');
    }
  //console.log("add_book_params: ", add_book_params);
})

server.post("/delete_book", async (req, res, next) => {
  var delete_book_params = [req.body.deleteBookId]
  console.log(delete_book_params)
  if (containsNoUndefined(delete_book_params)) {
    await getUser(req.username).removeById(delete_book_params[0]);
    res.redirect('/homepage.html');
  }
})

server.post("/edit_book", async (req, res, next) => {
  console.log("edit_book_params: ", req.body)
  let newBook = new Book(
    req.body.editBookName,
    req.body.editBookAuthor,
    req.body.editBookPublisher,
    req.body.editBookYear,
    req.body.editBookISBN,
    req.body.editBookCategory
  );
  let valid = validateBook(newBook);
  console.log(valid)
  if (valid) {
    await getUser(req.username).editBook(req.body.editBookId, newBook);
  }

  res.redirect('/homepage.html');
})

server.get('/', (req, res, next) => {
  res.redirect('/index.html');
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
