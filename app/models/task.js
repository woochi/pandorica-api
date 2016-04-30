var mongoose = require('mongoose');
var qr = require('qr-image');
var randomstring = require('randomstring');
var _ = require('lodash');

var TaskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  image: {type: Buffer},
  code: {type: String, required: true, index: true, unique: true},
  points: {type: Number, required: true}
});

TaskSchema.pre('save',  function(task, next) {
  task.image = qr.imageSync(task._id, {type: 'svg'});
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
