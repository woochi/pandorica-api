var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json([]);
});

router.get('/:id', function(req, res, next) {
  res.json({});
});

module.exports = router;
