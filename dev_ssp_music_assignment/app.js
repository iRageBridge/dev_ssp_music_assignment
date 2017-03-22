var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var admin = require('./routes/admin');

var app = express();
var session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var expressSession={
  secret:'mySecret',
  resave:'false',
  saveUninitialized: false
}
app.use(session(expressSession));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var loggedIn=function(req,res,next){
  if(!req.session.username){
    res.redirect('/login');
  }
  else{
    next();
  }
};

app.use('/admin',loggedIn);
app.use('/admin',admin);
app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
