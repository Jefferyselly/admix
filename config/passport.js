const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        console.log(1)
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
          console.log('not user')
        }

        // Match password
        bcrypt.compare(password.toString(), user.password, (err, isMatch) => {
           if (err) console.log(err);
          if (isMatch) {
            return done(null, user);
          } else {
            console.log('no match pass')
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
