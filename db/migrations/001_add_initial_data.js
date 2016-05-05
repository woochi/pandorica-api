var mongo = require('mongodb');
var _ = require('lodash');
var randomstring = require('randomstring');

var TASK = 'task';

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

var initialNotifications = [
  {
    type: TASK,
    title: 'The Mystics of Nepal',
    message: 'The mystics of Nepal. Listen to the lecture in the auditorium and collect your completion code after the event from the lecturer.'
  },
  {
    type: TASK,
    title: 'Songs of the Harpies',
    message: 'Listen to the performance of the Harpies on the main stage beginning at 14.00. Collect completion code after the event from the performers.'
  },
  {
    type: TASK,
    title: 'Secrets in the Air',
    message: '"Did you hear that? The strange beeping noice continued to fill the air in unnervingly equal intervals." Find the source of the sound and collect your points with the completion code.'
  },
  {
    type: TASK,
    title: 'A Hidden Treasure',
    message: 'There\'s an ancient Ropecon treasure lurking in a secret corner of the fair. It is said to reside in the darkest corner of the Main Plaza. Find the treasure and collect points with the completion code.'
  },
  {
    type: TASK,
    title: 'Catch the Treasure Goblin',
    message: 'An elusive Treasure Goblin has been spotted on the grounds of Ropecon. The creature is said to have a large sack of gold on his back. Catch the goblin and loot the completion code.'
  },
  {
    type: TASK,
    title: 'The Mystics of Nepal',
    message: 'The mystics of Nepal. Listen to the lecture in the auditorium and collect your completion code after the event from the lecturer.'
  },
  {
    type: TASK,
    title: 'Secrets in the Air',
    message: '"Did you hear that? The strange beeping noice continued to fill the air in unnervingly equal intervals." Find the source of the sound and collect your points with the completion code.'
  },
  {
    type: TASK,
    title: 'A Hidden Treasure',
    message: 'There\'s an ancient Ropecon treasure lurking in a secret corner of the fair. It is said to reside in the darkest corner of the Main Plaza. Find the treasure and collect points with the completion code.'
  }
]

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

  tasks.findOne().then((task) => {
    var notifications = db.collection('notifications');
    notifications.insert(initialNotifications.map((notification) => {
      return _.extend({}, notification, {task: task._id});
    }));
  });
}

exports.down = function(db, next) {
  var tasks = db.collection('tasks');
  var notifications = db.collection('notifications');

  tasks.remove({}).then(function() {
    notifications.remove({}, next);
  }, next);
}
