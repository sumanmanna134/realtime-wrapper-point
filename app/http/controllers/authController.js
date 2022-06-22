const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
  return {
    login(req, res) {
      res.render('auth/login');
    },
    register(req, res) {
      res.render('auth/register');
    },

    async postRegister(req, res) {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return throwError(req, res, '/register', 'All fields are required!');
      }
      User.exists({ email: email }, (err, user) => {
        if (err) throw new Error('something went wrong!');
        if (user) {
          throwError(req, res, '/register', 'User already exist!');
        }
      });
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      //create a user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      user
        .save()
        .then(() => {
          res.redirect('/');
        })
        .catch((err) => {
          throwError(req, res, '/register', 'Something Went Wrong!');
        });
    },

    async postLogin(req, res, next) {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }

        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/login?info=' + user);
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }

          return res.redirect('/');
        });
      })(req, res, next);
    },

    logout(req, res) {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/login');
      });
    },
  };
}

function throwError(req, res, redirectUrl, errorMessage) {
  req.flash('error', errorMessage);
  req.flash('name', req.body.name);
  req.flash('email', req.body.email);
  return res.redirect(redirectUrl);
}
module.exports = authController;
