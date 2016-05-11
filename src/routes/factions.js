var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
import {factions} from '../app/models/faction';

router.route('/')
  .get(function(req, res, next) {
    res.json(factions);
  });

router.route('/:id')
  .get(function(req, res, next, id) {
    res.json(factions[id]);
  });

router.route('/:id/users')
  .get(function(req, res, next, id) {
    return User.find({faction: id}).sort({points: -1}).limit(10)
      .then(function(users) {
        res.json(users);
      });
  });

module.exports = router;

