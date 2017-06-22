'use strict';

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('server/core/views/index');
};
/**
 * Render the login page
 */
exports.renderLogin = function (req, res) {
    res.render('server/core/views/login');
};
/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  // res.status(500).render('server/core/views/500', {
  //   error: 'Oops! Something went wrong...'
  // });
  res.sendFile(require('path').join(process.cwd(),'public/error.html'))
};

exports.renderAuthError = function (req, res) {
  res.status(400).render('modules/core/server/views/400', {
    error: 'You don\'t have access to this page, plz contact ur admin or login in first.'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('server/core/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};
