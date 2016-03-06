var mongo = require('mongodb');
var _ = require('lodash');
var qr = require('qr-image');

var initialTasks = [
  {
    name: "Test",
    description: "Lorem ipsum"
  },
  {
    name: "Test 2",
    description: "Lorem ipsum 2"
  }
];

exports.up = function(db, next) {
  var tasks = db.collection('tasks');
  initialTasks.map(function(task) {
    var image = qr.imageSync(task.name, {type: 'svg'});
    return _.extend(task, {image: image});
  });
  tasks.insert(initialTasks, next);
}

exports.down = function(db, next) {
  var tasks = db.collection('tasks');
  tasks.remove({}, next);
}
