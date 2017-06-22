'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  User = require('mongoose').model('Loginuser'),
  path = require('path'),
  config = require(path.resolve('./config/config'));

function initLoginUser(){
  var query = User.findOne({userid:'admin'});
  query.exec(function (err, orginalUser) {
    if (err) {
      return next(err);
    } else if (!orginalUser) {
      var userModel = {};
      userModel.userid = 'admin';
      userModel.accountType = 'local';
      userModel.role = 'admin';
      userModel.password =  'admin4';
      var user = new User(userModel);
      user.save(function (err) {
        if (err) {
          return console.log(err);
        } else {
          return console.log(user);
        }
      });
    }
  });
}

/**
 * Module init function.
 */
module.exports = function (app, db) {
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());

  initLoginUser();
};
