var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

router.route('/')
  .get(function(req, res, next) {
    res.json({});
  });

module.exports = router;
