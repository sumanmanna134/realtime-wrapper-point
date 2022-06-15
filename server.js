const express = require('express');
const Config = require('./app/config/config');
const expressLayout = require('express-ejs-layouts');
const ejs = require('ejs');
const path = require('path');
const app = express();
require('dotenv').config();
const config = new Config();
config.load();
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('home');
});
app.use(expressLayout);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');

const server = app.listen(config.port, () => {
  console.log(`listening on ${config.port}`);
});
//handel uncaught exception
process.on('uncaughtException', (err) => {
  console.log(`ERROR : ${err.message}`);
  console.log('Shutting down the server due to uncaughtException');

  server.close(() => {
    process.exit(1);
  });
});

// handel unhandledRejection
process.on('unhandledRejection', (err) => {
  console.log(`ERROR : ${err.message}`);
  console.log('Shutting down the server due to unhandledRejection');

  server.close(() => {
    process.exit(1);
  });
});
