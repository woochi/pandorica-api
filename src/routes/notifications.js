var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Notification = mongoose.model('Notification');
import _ from 'lodash';
import {requireAdmin} from '../middleware/auth';
import error from 'http-errors';

function getUserTask(task, user) {
  if (_.find(user.completedTasks, task._id)) {
    task.completed = true;
  }
  return task;
}

router.param('id', function(req, res, next, id) {
  Notification.findById(id).populate('task').lean().then(function(notification) {
    if (!notification) {
      next(new Error('Could not find the selected notification.'));
    }
    if (notification.task) {
      notification.task = getUserTask(notification.task, req.user);
    }
    req.notification = notification;
    next();
  }, next);
});

router.route('/')
  .get(function(req, res, next) {
    Notification.find().populate('task').limit(40).lean().then(function(notifications) {
      notifications.forEach((notification) => {
        if (notification.task) {
          notification.task = getUserTask(notification.task, req.user);
        }
      })
      res.json(notifications);
    }, next);
  })
  .post(requireAdmin, function(req, res, next) {
    const notification = new Notification(req.body);
    notification.save((err) => {
      if (err) {
        next(error(400, err));
      }
      res.json(notification);
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    res.json(req.notification);
  });

module.exports = router;
