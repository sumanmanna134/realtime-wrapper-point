const User = require('../models/user');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
function init(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        console.log(email);
        const user = await User.findOne({ email: email });
        if (!user)
          return done(null, false, { message: 'No User with this email!' });
        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (!match) {
              return done(null, false, { message: 'Wrong Credentials!' });
            }
            return done(null, user, { message: 'Logged in Successfully!' });
          })
          .catch((err) => {
            return done(null, false, { message: 'Something went wrong!' });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
