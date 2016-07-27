var mongoose = require('mongoose');
var _ = require('lodash');
import {ORDER, NEUTRAL, CHAOS} from './faction';

const FACTIONS = [ORDER, NEUTRAL, CHAOS];

var MessageSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  faction: {type: String, enum: FACTIONS, required: true},
  content: {type: String, required: true}
}, {
  timestamps: true
});

mongoose.model('Message', MessageSchema);
