var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
const validator = require('validator');
const crypto = require('crypto');
const _ = require('lodash');
var Deferred = require("promised-io/promise").Deferred;
var Task = mongoose.model('Task');
import faction from './fields/faction';

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
  admin: {type: Boolean, default: false}
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
  }
}

mongoose.model('User', UserSchema);
