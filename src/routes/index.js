var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
import error from 'http-errors';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',
  passport.authenticate('local', {session: false}), (req, res, next) => {
    return res.json(req.user);
  });

router.post('/signup',
  function(req, res, next) {
    const email = req.body.email;
    User.findOne({'email': email}, (err, user) => {
      if (err) { return next(err); }
      if (user) {
        return next(error(400, 'Email already taken'));
      }

      const newUser = new User(req.body);
      newUser.save(function(err, user) {
        if (err) {
          return next(err);
        };
        return res.json(user);
      });
    });
  });

module.exports = router;
