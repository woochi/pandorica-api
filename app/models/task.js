var mongoose = require('mongoose');
var randomstring = require('randomstring');
var _ = require('lodash');

var TaskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  code: {type: String, required: true, index: true, unique: true},
  points: {type: Number, required: true}
});

TaskSchema.pre('save',  function(task, next) {
  task.code = randomstring.generate({
    length: 5,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  });
  next();
});

TaskSchema.set('toJSON', {
  transform: function(task, data, options) {
    return _.pick(task, ['_id', 'name', 'description']);
  }
});

mongoose.model('Task', TaskSchema);
