'use strict';
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var path = require('path');
var app = module.exports = loopback();
var baseContext = require('./middleware/context-baseContext');
var currentUser = require('./middleware/context-currentUser');
var helmet = require('helmet');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('trust proxy', true);

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: true }));

let sessionStore = new MySQLStore({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME
});

app.use(session({
  store: sessionStore,
  saveUninitialized: true,
  secret: process.env.COOKIE_SECRET,
  resave: false,
  cookie: {
    maxAge: 60 * 60 * 1000
  }
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(loopback.token({
  model: app.models.AccessToken,
  searchDefaultTokenKeys: false,
  currentUserLiteral: 'me',
  cookies: ['access_token'],
  headers: ['access_token', 'X-Access-Token'],
  params: ['access_token']
}));

app.use(baseContext());
app.use(currentUser());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
