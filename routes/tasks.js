var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Task = mongoose.model('Task');

router.param('id', function(req, res, next, id) {
  Task.findById(id)
    .then(function(task) {
      req.task = task;
      next();
    }, function(err) {
      next(err)
    });
});

router.route('/')
  .get(function(req, res, next) {
    Task.find({}).then(function(tasks) {
      res.json(tasks);
    });
  })
  .post(function(req, res, next) {
    var task = new Task(req.body);
    task.save()
      .then(function(createdTask) {
        res.json(createdTask);
      })
      .catch(function(error) {
        res.json(error);
      });
  });

router.route('/:id')
  .get(function(req, res, next) {
    res.json(req.task);
  })
  .post(function(req, res, next) {
    // TODO: validate that right nextTask ObjectId has been sent, add points, send results and next task
    next();
  });

module.exports = router;
