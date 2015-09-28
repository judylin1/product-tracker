var express = require('express');
var path = require('path');
require('dotenv').load();
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var products = require('./routes/products');
var categories = require('./routes/categories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('trust proxy', 1);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieSession({ keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2, process.env.SESSION_KEY3] }))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
  if (req.session) {
    res.locals.userId = req.session.username
  }
  next();
})

app.use('/', routes);
app.use('/', auth);
app.use('/categories', categories);

app.use('/users/:id', function(req, res, next){
  res.locals.userId = req.params.id;
  next();
}, users);

app.use('/users/:id/products', function(req, res, next){
  res.locals.userId = req.params.id;
  next();
}, products);

// redirect to main page for unknown url
app.all('*', function(req, res) {
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
