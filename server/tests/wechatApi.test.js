var request=  require('request'),
    _ = require('lodash'),
    appid = 'wx54e94ab2ab199342',
    appsecret = 'd5e42e98caebab277fb8cc0c6ee5a797',
    code = '02128KHQ01Hejb2I4WGQ05TsHQ028KHI';

describe('test wechat API', function(){
    describe('test get openID and access token', function(){
        it('access token', function(done){
            var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + appid + 
            '&secret=' + appsecret +'&code='+ code +'&grant_type=authorization_code';
            request.get({
                url: url,
                json: true
            }, function(error, response, body){
                console.log(body);
                if(!error && _.get(response, ['statusCode'], 0) == 200 && !_.isEmpty(body) && _.isEmpty(body.errmsg)){
                    var auth_access_token = _.get(body, ['access_token'], ''),
                        openId = _.get(body, ['openid'], '');
                    console.log('access token:', auth_access_token);
                    console.log('openId:', openId);
                    var result = {
                        accessToken: auth_access_token,
                        openId: openId
                    }
                    // return callback(null, result);
                } else {
                    var errmsg = {errmsg: _.get(result, ['errmsg'], ''), error: error, statusCode: _.get(response, ['statusCode'], 0)};
                    console.log('cannot obtain access token as:', JSON.stringify(errmsg));
                    // return callback(JSON.stringify(errmsg), null);
                }
                done();
            });
        })
    });

    describe.only('api to save basic info', function(){
        var url = 'http://localhost/saveBasicInfo';
        var basicInfo = {tele: '1234567'};
        it('#saveBasicInfo', function (done) {
            request.post({
                url: url,
                body: basicInfo,
                json: true
            }, function(error, response, body){
               console.log(error, _.get(response, ['statusCode'], ''), body);
               done();
            });
        });
    });

})