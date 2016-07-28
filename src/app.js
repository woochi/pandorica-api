var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const crypto = require('crypto');
import compression from 'compression';
import errorHandler from 'api-error-handler';

export function createApp() {
  return express();
}

export function configureApp(app, socket) {
  var User = mongoose.model('User');
  var routes = require('./routes/index');
  var users = require('./routes/users');
  var tasks = require('./routes/tasks');
  var me = require('./routes/me');
  var factions = require('./routes/factions');
  var quests = require('./routes/quests');

  app.use(logger('dev'));
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compression());

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
  app.use('/quests', passport.authenticate('basic', {session: false}), quests);
  app.use('/factions', passport.authenticate('basic', {session: false}), factions(socket));

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
  app.use(errorHandler());
}
