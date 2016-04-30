var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Task = mongoose.model('Task');
var _ = require('lodash');

// SPEC
// INDEX - Always return the current task
// POST (task id) - Get user's current task, check if sent id matches current task's id
//  -> Success: Increment faction points, increment user points, assign next task for user, send next task
//  -> Failure: Send error

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
    req.user.getCurrentTask().then(function(task) {
      if (!task) {
        var error = new Error('Could not find current task for user.');
        error.status = 400;
        return next(error);
      }
      res.json(task);
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
  })
  .delete((req, res, next) => {
    const query = Task.findOne({_id: {$gt: req.user.currentTask}}).sort({_id: 1}).limit(1);
    query.exec((err, nextTask) => {
      if (err) { return next(err); }
      if (!nextTask) {
        return res.status(404).json({error: 'No further tasks available at this moment'});
      }
      req.user.update({currentTask: nextTask._id}, (err) => {
        if (err) { return next(err); }
        res.status(200).json(nextTask);
      });
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    res.json(req.task);
  })
  .post(function(req, res, next) {
    // TODO: validate that right nextTask ObjectId has been sent, add points, send results and next task
    if (req.task.code === req.body.code) {
      res.status(200).json(_.extend(req.task.toObject(), {
        completed: true,
        points: req.task.points
      }));
    } else {
      var error = new Error('The completion code you provided is wrong for this task. Check the code for typos or find the correct code.');
      error.status = 400;
      next(error);
    }
  });

module.exports = router;
