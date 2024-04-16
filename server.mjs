import express from 'express'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostname = '127.0.0.1';
const port = 3000;

var server = express();
//server.get('/', (req, res) => {
//  res.send('Hello World');
//});

server.use(bodyParser.urlencoded({ extended: true }));

server.use('/', (req, res, next) => {
  console.log('Request Type:', req.method)
  console.log("body: ", req.body)
  console.log("path: ", req.path)
  next()
})

server.post('/index.html', (req, res, next) => {
  if (req.body.username !== undefined && req.body.password !== undefined) {
    console.log('Username: ' + req.body.username);
    console.log('Password: ' + req.body.password);
    res.sendFile(__dirname + '/Web/homepage.html');
  } else {
    next()
  }
})
server.use(express.static('Web'));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
