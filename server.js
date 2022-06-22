const express = require('express');
const Config = require('./app/config/config');
const expressLayout = require('express-ejs-layouts');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');
const app = express();
require('dotenv').config();
const config = new Config();
config.load();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection
  .once('open', () => {
    console.log('database connected..');
  })
  .on('error', function (err) {
    console.log(err);
  });

//session store
//session config

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      client: connection.getClient(),
      collectionName: 'sessions',
      dbName: 'wrap',
      stringify: false,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hrs
  })
);
//passport config
const passportInit = require('./app/config/passport');
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(
  express.urlencoded({
    extended: false,
  })
);
//layout config
app.use(express.json());
app.use(express.static('public'));
// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});

app.use(expressLayout);
app.set('views', path.join(__dirname, 'resources/views'));
app.set('view engine', 'ejs');
require('./routes/web')(app);
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
