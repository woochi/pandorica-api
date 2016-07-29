var express = require('express');
var router = express.Router();
import mongoose from 'mongoose';
const passport = require('passport');
const Task = mongoose.model('Task');
import _ from 'lodash';
import {factions, NEUTRAL} from '../models/faction';
import error from 'http-errors';

router.route('/')
  .get(function(req, res, next) {
    res.json({
      ...req.user.toJSON(),
      points: req.user.points,
      completedQuests: req.user.usedCodes.length
    });
  })
  .put((req, res, next) => {
    req.user.update(req.body).then(() => {
      return res.json({...req.user.toJSON(), ...req.body});
    }, next);
  });

router.route('/tasks')
  .post(function(req, res, next) {
    var code = req.body.code;

    if (code === '12345') {
      const introMission = {
        _id: '12345',
        code: '12345',
        points: 200,
        faction: NEUTRAL
      };
      req.user.complete(introMission, (err, user) => {
        if (err) {
          return next(err);
        }
        res.json({...introMission, completed: true});
      });
    } else {
      Task.findOne({code: req.body.code})
        .then(function(task) {
          var error;
          if (!task) {
            return next(error(403, 'The code was wrong.'));
          }

          req.user.complete(task, (err, user) => {
            if (err) {
              return next(err);
            }
            console.log('COMPLETED', task);
            res.json({...task.toJSON(), completed: true});
          });
        }, next);
    }
  });

module.exports = router;
