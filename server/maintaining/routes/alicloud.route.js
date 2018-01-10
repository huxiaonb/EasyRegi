var alicloudController = require('../controllers/alicloud.controller');

module.exports = function (app) {
    app.route('/aliCloud/sendCaptchaCode')
        .get(alicloudController.sendCaptchaCode);
    app.route('/aliCloud/verifyCaptchaCode')
        .get(alicloudController.verifyCaptchaCode);
};