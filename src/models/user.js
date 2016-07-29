var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
const validator = require('validator');
const crypto = require('crypto');
const _ = require('lodash');
var Deferred = require("promised-io/promise").Deferred;
var Task = mongoose.model('Task');
var Faction = mongoose.model('Faction');
import faction from './fields/faction';
import error from 'http-errors';
import {NEUTRAL} from './faction';

function validatePresenceOf(value) {
  return value && value.length;
}

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  faction: faction,
  hashedPassword: {type: String, select: false, required: true},
  salt: {type: String, select: false, required: true},
  usedCodes: {type: Array, default: []},
  admin: {type: Boolean, default: false},
  points: {type: Number, required: true, default: 0}
});

UserSchema.plugin(findOrCreate);

UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}).get(function() {
  return this._password;
});

UserSchema.path('email').validate(function(email) {
  console.log('VALIDATE EMAIL', email);
  return validator.isEmail(email);
}, 'Invalid email');

UserSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next();
  }
  if (!validatePresenceOf(this.password)) {
    return next(new Error('Invalid password'));
  }
  return next();
});

UserSchema.set('toJSON', {
  transform: function(user, data, options) {
    return _.pick(user, ['_id', 'name', 'email', 'faction', 'admin']);
  }
});

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  encryptPassword: function(password) {
    if (!password) {
      return "";
    }

    try {
      return crypto.createHmac("sha512", this.salt).update(password).digest("hex");
    } catch (err) {
      return "";
    }
  },
  complete: function(mission, next) {
    if (mission.faction && mission.faction !== NEUTRAL && mission.faction !== this.faction) {
      return next(error(400, 'This quest is not for your faction.'), null);
    }
    if (this.usedCodes.includes(mission.code)) {
      return next(error(400, 'You have already completed this quest.'), null);
    }

    // Looks OK
    this.usedCodes.push(mission.code);
    this.points = this.points + mission.points;

    Faction.update({name: this.faction}, {$inc: {points: mission.points}}, (err, faction) => {
      if (err) {
        return next(err, null);
      }
      this.save(next);
    });
  }
}

mongoose.model('User', UserSchema);
