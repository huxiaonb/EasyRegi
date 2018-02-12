'use strict';

/**
 * Module dependencies
 */
var companyController = require('../controllers/company.controller');

module.exports = function (app) {
     app.route('/api/company/login')
        .post(companyController.companyUserLogin);
     app.route('/api/company/update')
        .post(companyController.updateCompanyInfo);
     app.route('/api/company/getBasicInfo/:companyId')
        .get(companyController.getPositionsAndApplicantsNum);
     app.route('/api/company/getApplicantsByCompanyId/:companyId')
        .get(companyController.getApplicantsByCompanyId);
     app.route('/api/company/getPositionsByCompanyId/:companyId')
        .get(companyController.getPositionsByCompanyId);
     app.route('/api/company/searchApplicants')
        .post(companyController.searchApplicants);
     app.route('/api/company/searchResumes')
        .post(companyController.searchResumes);
     app.route('/api/company/logout')
        .post(companyController.logout);
     app.route('/api/company/getCompanyInfo')
        .post(companyController.getCompanyInfo);
     app.route('/api/company/createPositionForCompany')
        .post(companyController.createPositionForCompany);
     app.route('/api/company/searchPositions')
        .post(companyController.searchPositions);
     app.route('/api/company/deletePositionForCompany')
        .post(companyController.deletePositionForCompany);
     app.route('/api/company/updatePosition')
        .post(companyController.updatePosition);
     app.route('/api/company/register')
        .post(companyController.registerCompany);
     app.route('/api/company/resetPassword')
        .post(companyController.resetPassword);
     app.route('/account/verification')
        .get(companyController.validateEmail);
     app.route('/account/reset/display')
        .get(companyController.resetPwd);
     app.route('/account/email/send/test')
        .get(companyController.testSendEmail);
     app.route('/register/active')
        .get(companyController.activeEmail);
     app.route('/account/success')
        .get(companyController.activeSuccess);
     app.route('/error')
        .get(companyController.commonErr);
     app.route('/resetPwd')
        .get(companyController.resetPwd);  
     app.route('/account/getCaptcha/:email')
        .get(companyController.getCaptchaCode);
     app.route('/account/resetByCode')
        .post(companyController.resetPasswordByCaptcha);
     app.route('/api/company/pulishPosition')
        .post(companyController.pulishPosition);
};
