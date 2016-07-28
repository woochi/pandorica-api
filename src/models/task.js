var mongoose = require('mongoose');
var _ = require('lodash');
import {code, generateCode} from './fields/code';
import points from './fields/points';

var TaskSchema = new mongoose.Schema({
  code: code,
  points: points
});

TaskSchema.set('toJSON', {
  transform: function(task, data, options) {
    return _.pick(task, ['_id', 'points']);
  }
});

mongoose.model('Task', TaskSchema);
