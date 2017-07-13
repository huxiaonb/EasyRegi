var nodemailer = require('nodemailer'),
    _ = require('lodash');
var config = require('../../../config/config');

var emailConfig = {
    host: _.get(config, ['emailConfig', 'smtp'], ''),
    port: _.get(config, ['emailConfig', 'port']),
    auth: {
        user: _.get(config, ['emailConfig', 'auth', 'user'], ''),
        pass: _.get(config, ['emailConfig', 'auth', 'pass'], '')
    },
    secure: _.get(config, ['emailConfig', 'secure'])
};

var transporter = nodemailer.createTransport(emailConfig);

exports.sendEmail = sendEmail;
exports.generateCaptcha = generateCaptcha;

var mailTemplate = {
    from: '入职易<easyregitest@126.com>',
    subject: '请验证您在入职易的注册邮箱',
    to: 'fireman88.ok@163.com',
    test: '您好！test\n入职易收到了邮箱fireman88.ok@163.com的注册申请，请点击一下链接完成注册：\n\nhttp://www.baidu.com \n如果邮箱中不能打开链接，您也可以将它复制到浏览器地址栏中打开。'
}

function sendEmail(mail, callback){
    transporter.sendMail(mail, function(error, info){
        if(error) return callback(error, null);
        return callback(null, info);
    });
}

function generateCaptcha(num){
    var numberOfCaptcha = 6;
    if(!_.isNumber(num) && num > 0){
        numberOfCaptcha = num;
    }
    return Math.random().toString(36).substr(2, numberOfCaptcha);
}