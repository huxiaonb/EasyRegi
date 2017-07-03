'use strict';

/**
 * Module dependencies
 */
var companyController = require('../controllers/company.controller');

module.exports = function (app) {
     app.route('/api/company/login')
        .post(companyController.companyUserLogin);
     app.route('/api/company/update')
        .post(companyController.upsertCompany);
};
