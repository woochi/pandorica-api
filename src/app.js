var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');
import compression from 'compression';

var routes = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var me = require('./routes/me');
import notifications from './routes/notifications';

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// Authentication
passport.use(new BasicStrategy({
    usernameField: 'email'
  },
  function(email, password, next) {
    User.findOne({email: email}, '+hashedPassword +salt', function(err, user) {
      if (err) { return next(err); }
      if (!user) {
        var error = new Error('User not found');
        error.status = 403;
        return next(error);
      }
      if (!user.authenticate(password)) {
        error.status = 403;
        var error = new Error('Invalid credentials');
        return next(error);
      }
      return next(null, user);
    });
  }));

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, cb) {
    User.findOne({email: email}, '+hashedPassword +salt', function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (!user.authenticate(password)) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use('/', routes);
app.use('/users', passport.authenticate('basic', {session: false}), users);
app.use('/tasks', passport.authenticate('basic', {session: false}), tasks);
app.use('/me', passport.authenticate('basic', {session: false}), me);
app.use('/notifications', passport.authenticate('basic', {session: false}), notifications);

app.use(passport.initialize());
app.use(passport.session());

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
    console.log(err);
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;