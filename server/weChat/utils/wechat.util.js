'use strict'

var request = require('request'),
    _ = require('lodash'),
    async = require('async');
    
var config = require('../../../config/config');
var md5 = require('MD5');
var xml2js = require('xml2js');
var sha1 = require('sha1');

exports.getAccessToken = getAccessToken;
exports.getJsApiTicket = getJsApiTicket;
exports.getOpenIdAndAuthAccessTokenByCode = getOpenIdAndAuthAccessTokenByCode;
//wechat pay util
exports.sign = sign;
exports.buildXML = buildXML;
exports.generateNonceString = generateNonceString;
exports.getSignature = getSignature;

console.log('appId:', config.wechat.appId, '====appSecret:', config.wechat.appSecret)
function getAccessToken(){
    console.log('try to obtain access token from wechat api');
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ _.get(config, ['wechat', 'appId'], '') +'&secret=' + _.get(config, ['wechat', 'appSecret'], '');
    request.get({
        url: url,
        json: true
    }, function(error, response, result){
        if(!error && _.get(response, ['statusCode'], 0) == 200 && !_.isEmpty(result) && _.isEmpty(result.errmsg)){
            console.log('Access Token returned:', result);
            var accessToken = _.get(result, ['access_token'], '');
            console.log('Access_token: ' + accessToken);
            if(!_.isEmpty(accessToken)){
                global.accessToken = accessToken;
                getJsApiTicket(accessToken);
            }
        } else {
            var errmsg = {errmsg: _.get(result, ['errmsg'], ''), error: error, statusCode: _.get(response, ['statusCode'], 0)};
            console.log('cannot obtain access token as:', JSON.stringify(errmsg));
        }
    });
}

function getJsApiTicket(accessToken){
    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + accessToken + '&type=jsapi';
    request.get({
        url: url,
        json: true
    }, function(error, response, result){
        if(!error && _.get(response, ['statusCode'], 0) == 200 && !_.isEmpty(result) && result.errmsg == 'ok'){
            console.log('jsapi_ticket returned ' + JSON.stringify(result));
            var jsApiTicket = _.get(result, ['ticket'], '');
            if(!_.isEmpty(jsApiTicket))
                global.jsApiTicket = jsApiTicket;
        } else {
            var errmsg = {errmsg: _.get(result, ['errmsg'], ''), error: error, statusCode: _.get(response, ['statusCode'], 0)};
            console.log('cannot obtain js api ticket as:', JSON.stringify(errmsg));
        }
    });
}

function getOpenIdAndAuthAccessTokenByCode(code, callback){
    if(_.isEmpty(code)){
        return callback(null, null);
    } else {
        var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + _.get(config, ['wechat', 'appId'], '') + 
            '&secret=' + _.get(config, ['wechat', 'appSecret'], '') +'&code='+ code +'&grant_type=authorization_code';
        request.get({
            url: url,
            json: true
        }, function(error, response, body){
            if(!error && _.get(response, ['statusCode'], 0) == 200 && !_.isEmpty(body) && _.isEmpty(body.errmsg)){
                var auth_access_token = _.get(body, ['access_token'], ''),
                    openId = _.get(body, ['openid'], '');
                console.log('access token:', auth_access_token);
                console.log('openId:', openId);
                var result = {
                    accessToken: auth_access_token,
                    openId: openId
                }
                return callback(null, result);
            } else {
                var errmsg = {errmsg: _.get(result, ['errmsg'], ''), error: error, statusCode: _.get(response, ['statusCode'], 0), body: body};
                console.log('cannot obtain access token as:', JSON.stringify(errmsg));
                return callback(JSON.stringify(errmsg), null);
            }
        });
    }
}


//wechat pay util
function sign(param){
	var querystring = Object.keys(param).filter(function(key){
		return param[key] !== undefined && param[key] !== '';
	}).sort().map(function(key){
		return key + '=' + param[key];
	}).join("&") + "&key=0460396E987005E331054DA275E5FC67";
	console.log(querystring);
	return md5(querystring).toUpperCase();
};
function buildXML(json){
	var builder = new xml2js.Builder();
	return builder.buildObject(json);
};
function generateNonceString(length){
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var maxPos = chars.length;
	var noceStr = "";
	for (var i = 0; i < (length || 32); i++) {
		noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return noceStr;
};

function getSignature(url){
    var ticket = _.get(global, ['jsApiTicket'], '');
    console.log('js_api_ticket: ' + ticket);
    var noncestr = generateNonceString(),
        timestamp = Date.now().toString().substr(0,10);
    var str1 = "jsapi_ticket=" + ticket +
        "&noncestr=" + noncestr +
        "&timestamp=" + timestamp +
        "&url=" + url;
    var signature = sha1(str1);
    return {
        noncestr: noncestr,
        timestamp: timestamp,
        url: url,
        signature: signature
    };
}