var mongoose = require('mongoose');
var User = mongoose.model('User');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(app) {
  passport.use(new GoogleStrategy({
      consumerKey: '985911037607-kfgtnojith46255qv7ov4t6aibjo8oqf.apps.googleusercontent.com',
      consumerSecret: 'fKcYLE52yWvL4UJttBynMF2_'
    },
    function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ));
}
