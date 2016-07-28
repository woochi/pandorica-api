var mongoose = require('mongoose');
var qr = require('qr-image');
var randomstring = require('randomstring');
var _ = require('lodash');
import {code, generateCode} from './fields/code';
import points from './fields/points';
import faction from './fields/faction';

var QuestSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  code: code,
  points: points,
  faction: faction
});

mongoose.model('Quest', QuestSchema);
