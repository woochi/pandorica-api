var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login',
  passport.authenticate('local', {session: false}),
  (req, res, next) => {
    return res.send(200, req.user);
  });

router.post('/signup',
  function(req, res, next) {
    const email = req.body.email;
    User.findOne({'email': email}, (err, user) => {
      if (err) { return next(err); }
      if (user) {
        return res.json(400, {error: 'Email already taken'});
      }

      const newUser = new User(req.body);
      newUser.save(function(err, user) {
        if (err) {
          return next(err);
        };
        return res.json(200, user);
      });
    });
  });

module.exports = router;
