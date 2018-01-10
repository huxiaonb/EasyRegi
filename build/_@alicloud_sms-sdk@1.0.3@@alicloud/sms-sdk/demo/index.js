'use strict';

/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */

var SMSClient = require('./../index');

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
var accessKeyId = 'yourAccessKeyId';
var secretAccessKey = 'yourAccessKeySecret';

//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
var queueName = 'Alicom-Queue-1092397003988387-';

//初始化sms_client
var smsClient = new SMSClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey });

//短信回执报告
smsClient.receiveMsg(0, queueName).then(function (res) {
    //消息体需要base64解码
    var code = res.code,
        body = res.body;

    if (code === 200) {
        //处理消息体,messagebody
        console.log(body);
    }
}, function (err) {
    console.log(err);
});

//短信上行报告
smsClient.receiveMsg(1, queueName).then(function (res) {
    //消息体需要base64解码
    var code = res.code,
        body = res.body;

    if (code === 200) {
        //处理消息体,messagebody
        console.log(body);
    }
}, function (err) {
    console.log(err);
});

//查询短信发送详情
smsClient.queryDetail({
    PhoneNumber: '1500000000',
    SendDate: '20170731',
    PageSize: '10',
    CurrentPage: "1"
}).then(function (res) {
    var Code = res.Code,
        SmsSendDetailDTOs = res.SmsSendDetailDTOs;

    if (Code === 'OK') {
        //处理发送详情内容
        console.log(SmsSendDetailDTOs);
    }
}, function (err) {
    //处理错误
    console.log(err);
});

//发送短信
smsClient.sendSMS({
    PhoneNumbers: '1500000000',
    SignName: '云通信产品',
    TemplateCode: 'SMS_000000',
    TemplateParam: '{"code":"12345","product":"云通信"}'
}).then(function (res) {
    var Code = res.Code;

    if (Code === 'OK') {
        //处理返回参数
        console.log(res);
    }
}, function (err) {
    console.log(err);
});
//# sourceMappingURL=index.js.map
