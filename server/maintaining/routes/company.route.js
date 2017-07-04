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
     app.route('/api/company/getBasicInfo/:companyId')
        .get(companyController.getPositionsAndApplicantsNum);
     app.route('/api/company/getApplicantsByCompanyId/:companyId')
        .get(companyController.getApplicantsByCompanyId);
     app.route('/api/company/getPositionsByCompanyId/:companyId')
        .get(companyController.getPositionsByCompanyId);
     app.route('/api/company/searchApplicants')
        .post(companyController.searchApplicants);
     app.route('/api/company/logout')
        .post(companyController.logout);
     app.route('/api/company/getCompanyInfo')
        .post(companyController.getCompanyInfo);
};
