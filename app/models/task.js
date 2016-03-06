var mongoose = require('mongoose');
var qr = require('qr-image');

var TaskSchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  image: {type: Buffer},
  nextTask: {type: mongoose.Schema.Types.ObjectId}
});

TaskSchema.pre('save',  function(task, next) {
  task.image = qr.imageSync(task._id, {type: 'svg'});
  next();
});

mongoose.model('Task', TaskSchema);
