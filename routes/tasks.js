var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Task = mongoose.model('Task');
var _ = require('lodash');
var qr = require('qr-image');

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
    Task.find()
      .then(function(tasks) {
        res.send(tasks);
      })
      .catch(function(error) {
        res.json(error);
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
    tasks.findByIdAndRemove(req.body.id)
      .then(function() {
        res.json({});
      })
      .catch(function(error) {
        res.json(error);
      });
  });

router.route('/:id/qr')
  .get(function(req, res, next) {
    try {
      const image = qr.image(String(req.task._id), { type: 'svg' });
      res.writeHead(200, {'Content-Type': 'image/svg+xml'});
      image.pipe(res);
    } catch (e) {
      res.writeHead(414, {'Content-Type': 'text/html'});
      res.end('<h1>414 Request-URI Too Large</h1>');
    }
  });

module.exports = router;
