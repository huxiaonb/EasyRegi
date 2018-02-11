var _ = require('lodash');
var SMSClient = require('@alicloud/sms-sdk');
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');
var EmailUtil = require('../utils/email.util.js');

exports.sendSMS = sendSMS;
exports.sendCaptchaCode = sendCaptchaCode;
exports.verifyCaptchaCode = verifyCaptchaCode;

var accessKey = {
    accessKeyId: config.aliCloud.SMS.accessKeyId,
    secretAccessKey: config.aliCloud.SMS.accessSecretKey
};

function sendSMS(captchaCode, phoneNumber, callback){
    if(_.isEmpty(captchaCode) || _.isEmpty(phoneNumber)){
        return callback('captchaCode or phoneNumber is required', null);
    }
    var smsClient = new SMSClient(accessKey);
    smsClient.sendSMS({
        PhoneNumbers: phoneNumber,
        SignName: config.aliCloud.SMS.signName,
        TemplateCode: config.aliCloud.SMS.templateCode,
        TemplateParam: JSON.stringify({'code': captchaCode})
    }).then(function(smsRes){
        var code = _.get(smsRes, ['Code'], '');
        if(code === 'OK'){
            return callback(null, smsRes);
        } else {
            return callback(smsRes, null);
        }
    }, function(err){
        return callback(err, null);
    });
}

function sendCaptchaCode(req, res, next){
    var phoneNumber = _.get(req, ['query', 'phoneNumber'], '');
    var captchaCode = EmailUtil.generateNumericCaptcha(4);
    req.session.captcha = captchaCode;
    console.log('sendCaptcha', captchaCode, phoneNumber, req.sessionID);
    sendSMS(captchaCode, phoneNumber, function (error, smsRes) {
       if(error){
           logger.info('send sms message failed as ', JSON.stringify(error));
           res.status(500).send({success: false, errmsg: '发送短信验证码失败'});
       } else {
           res.json({success: true, message: '发送短信验证码成功'});
       }
    });
}

function verifyCaptchaCode(req, res) {
    var captchaCode = _.get(req, ['session', 'captcha'], ''),
        captchaFromUI = _.get(req, ['query', 'captcha'], '');
    console.log(req.session.captcha);
    if(_.isEmpty(captchaCode) || _.isEmpty(captchaFromUI) || captchaCode !== captchaFromUI){
        res.status(500).send({success: false, errmsg: '验证码校验失败'});
    } else {
        res.json({success: true, message: '验证成功'});
    }
}

