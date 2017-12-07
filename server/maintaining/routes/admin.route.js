'use strict';

/**
 * Module dependencies
 */
var adminController = require('../controllers/admin.controller');

module.exports = function (app) {
     app.route('/api/v1/admin/login')
        .post(adminController.login);
     app.route('/api/v1/admin/getCurrentUser')
        .post(adminController.getCurrentUser);
     app.route('/api/v1/admin/logout')
        .post(adminController.logout);
};
