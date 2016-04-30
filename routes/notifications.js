var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Notification = mongoose.model('Notification');

router.param('id', function(req, res, next, id) {
  Notification.findOneById(id).then(function(notification) {
    if (!notification) {
      next(new Error('Could not find the selected notification.'));
    }
    req.task = task;
    next();
  }, next);
});

router.route('/')
  .get(function(req, res, next) {
    Notification.find({}).limit(40).then(function(tasks) {
      res.json(tasks);
    }, next);
  });

router.route('/:id')
  .get(function(req, res, next) {
    res.json(req.task);
  });

module.exports = router;
