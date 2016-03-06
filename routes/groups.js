var express = require('express');
var router = express.Router();

/* GET group listing. */
router.get('/', function(req, res, next) {
  res.json([]);
});

router.get('/:id/users', function(req, res, next) {
  res.json([]);
});

module.exports = router;

