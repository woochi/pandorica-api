var mongoose = require('mongoose');
var qr = require('qr-image');
var randomstring = require('randomstring');
var _ = require('lodash');

export const TASK = 'task';

const NOTIFICATION_TYPES = [TASK];

var NotificationSchema = new mongoose.Schema({
  type: {type: String, required: true, enum: NOTIFICATION_TYPES},
  title: {type: String, required: true},
  message: {type: String, required: true},
  task: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
});

mongoose.model('Notification', NotificationSchema);
