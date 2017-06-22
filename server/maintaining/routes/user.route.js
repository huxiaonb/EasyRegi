/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';

/**
 * Module dependencies
 */
var userController = require('../controllers/user.controller');

module.exports = function (app) {
    app.route('/api/user/login').post(userController.findForLogin);
    app.route('/api/user/logout').post(userController.logout);
    app.route('/api/user').post(userController.create);
    app.route('/api/user/validation').post(userController.userFieldValidation);
};
