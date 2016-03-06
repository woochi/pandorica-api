var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Notification = mongoose.model('Notification');

router.param('id', function(req, res, next, id) {
  Notification.findById(id)
    .then(function(task) {
      req.task = task;
      next();
    }, function(err) {
      next(err)
    });
});

router.route('/')
  .get(function(req, res, next) {
    Notification.find({}).then(function(tasks) {
      res.json(tasks);
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    res.json(req.task);
  });

module.exports = router;
