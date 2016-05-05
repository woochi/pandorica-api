var express = require('express');
var router = express.Router();
import mongoose from 'mongoose';
const passport = require('passport');
const Task = mongoose.model('Task');
import _ from 'lodash';
import {factions} from '../app/models/faction';

router.route('/')
  .get(function(req, res, next) {
    res.json(req.user);
  });

router.route('/tasks')
  .get(function(req, res, next) {
    res.json(req.user.completedTasks);
  })
  .post(function(req, res, next) {
    var code = req.body.code;
    Task.findOne({code: req.body.code})
      .then(function(task) {
        var error;
        if (!task) {
          return next(new Error('The code was wrong. Check for typos or find a correct code.'));
        } else if (_.find(req.user.completedTasks, task._id)) {
          return next(new Error('You have already completed this task. Pick a new one from the notifications list.'));
        }

        //req.user.completedTasks.push(task._id);
        req.user.points = req.user.points + task.points;

        var faction = factions[req.user.faction];
        faction.points = faction.points + task.points;

        req.user.save().then(function() {
          res.json(200, task);
        });
      }, function(err) {
        res.json(err);
      })
  });

module.exports = router;
