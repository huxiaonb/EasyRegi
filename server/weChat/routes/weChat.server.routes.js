'use strict';

module.exports = function (app) {
    var weChatController = require('../controllers/weChat.server.controller');

    /* // Define error pages
     app.route('/server-error').get(weChatController.renderServerError);

     // Return a 404 for all undefined api, module or lib routes
     app.route('/:url(api|modules|lib)/!*').get(weChatController.renderNotFound);*/

    // Define application route
    //app.route('/weChat/companyIntroduction').get(weChatController.companyIntroduction);
    app.use(weChatController.getOpenIdAndAuthAccessToken);
    app.route('/register').get(weChatController.register);
    app.route('/basic').get(weChatController.basicInfo);
    app.route('/details').get(weChatController.detailPosition);
    app.route('/saveBasicInfo').post(weChatController.saveBasicInfo);
    app.route('/weChat/applicant/findApplicantByOpenId').get(weChatController.findApplicantByOpenId);
    app.route('/weChat/applicant/personalInfo/submit').post(weChatController.submitRegisterInformation);
    app.route('/weChat/applicant/registerForm/submit/:openId').post(weChatController.submitRegisterForm);
    app.route('/registerCompany').get(weChatController.renderRegisterCompanyPage);
    app.route('/weChat/applicant/submitRegisterCompany').post(weChatController.submitRegisterCompany);
    app.route('/weChat/getAllCompanyNames').get(weChatController.getAllCompanyNames);
    app.route('/maintain').get(weChatController.maintain);
    app.route('/positions').get(weChatController.positions);
    app.route('/weChat/pay').post(weChatController.createUnifiedOrder);
    app.route('/weChat/checkIfNeedPay').post(weChatController.checkIfNeedPay);
    app.route('/weChat/position/findNearbyPositions').post(weChatController.findNearbyPositions);
    app.route('/weChat/position/findAllPositions').get(weChatController.findAllPositions);
    app.route('/weChat/position/loadPosition').post(weChatController.loadPosition);
};