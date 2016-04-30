var mongo = require('mongodb');
var _ = require('lodash');
var randomstring = require('randomstring');

var initialTasks = [
  {
    name: "Test",
    description: "Lorem ipsum",
    points: 200
  },
  {
    name: "Test 2",
    description: "Lorem ipsum 2",
    points: 300
  }
];

exports.up = function(db, next) {
  var tasks = db.collection('tasks');
  initialTasks.map(function(task) {
    return _.extend(task, {
      code: randomstring.generate({
        length: 6,
        charset: 'alphabetic',
        capitalization: 'lowercase'
      })
    });
  });
  tasks.insert(initialTasks, next);
}

exports.down = function(db, next) {
  var tasks = db.collection('tasks');
  tasks.remove({}, next);
}
