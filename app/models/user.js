var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
const validator = require('validator');
const crypto = require('crypto');
const _ = require('lodash');

function validatePresenceOf(value) {
  return value && value.length;
}

const ALIGNMENTS = {
  values: 'neutral order chaos'.split(' '),
  message: 'Invalid alignment type `{VALUE}`'
};

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  alignment: {type: String, enum: ALIGNMENTS, required: true},
  hashedPassword: {type: String, select: false, required: true},
  salt: {type: String, select: false, required: true}
});

UserSchema.plugin(findOrCreate);

UserSchema.virtual('password').set(function(password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
}).get(() => {
  return this._password;
});

UserSchema.path('email').validate(function(email) {
  return validator.isEmail(email);
}, 'Invalid email');

UserSchema.path('hashedPassword').validate(function(hashedPassword) {
  return validator.isLength(hashedPassword, 4);
}, 'Password is too short');

UserSchema.pre('save', (next) => {
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
    return _.pick(user, ['name', 'email']);
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
