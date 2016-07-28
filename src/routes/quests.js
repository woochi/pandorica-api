var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var Quest = mongoose.model('Quest');
import _ from 'lodash';
import {requireAdmin} from '../middleware/auth';
import error from 'http-errors';
import {NEUTRAL} from '../models/faction';

function getUserQuest(quest, user) {
  if (user.usedCodes.includes(quest.code)) {
    quest.completed = true;
  }
  return quest;
}

router.param('id', function(req, res, next, id) {
  Quest.findById(id).lean().then(function(quest) {
    if (!quest) {
      next(error(400, 'Could not find the selected quest'));
    }
    req.quest = getUserQuest(quest, req.user);
    next();
  }, next);
});

router.route('/')
  .get(function(req, res, next) {
    Quest.find({faction: {$in: [req.user.faction, NEUTRAL]}}).lean().then(function(quests) {
      const userQuests = quests.map((quest) => {
        return getUserQuest(quest, req.user);
      })
      res.json(userQuests);
    }, next);
  })
  .post(requireAdmin, function(req, res, next) {
    const quest = new Quest(req.body);
    quest.save((err) => {
      if (err) {
        next(error(400, err));
      }
      res.json(quest);
    });
  });

router.route('/:id')
  .get(function(req, res, next) {
    res.json(req.quest);
  })
  .post((req, res, next) => {
    if (req.body.code === req.quest.code) {
      req.user.complete(req.quest, (err, user) => {
        if (err) {
          return next(err)
        }
        res.json(getUserQuest(req.quest, user));
      });
    } else {
      next(error(400, 'Wrong quest code.'));
    }
  });

module.exports = router;
