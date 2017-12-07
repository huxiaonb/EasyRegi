var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    crypto = require('crypto'),
    request = require('request');

var mongoose = require('mongoose');
var Session = mongoose.model('Session');

exports.login = function(req, res){
     var username = _.get(req, ['body', 'account'], '');
     var password = _.get(req, ['body', 'pwd'], '');
     if(username === '123' && password === '123'){
          res.header('Access-Control-Expose-Headers', 'access-token');
          var result = {};
          result.success = true;
          var current = new Date();
          var timestamp = current.getTime() + 24 * 60 * 60 * 1000;
          var expiresDate = new Date(timestamp);
          var sessionInfo = {
            username : '123',  
            expires: expiresDate.toString()
          }
          req.session.sessionInfo = JSON.stringify(sessionInfo);
          
          res.header('access-token', req.sessionID);
          res.json(result);
     }else{
          res.status(500).send({success: false, errmsg: '用户名或密码错误'});
     }
    
}
exports.logout = function(req, res) {
    var sessionId = _.get(req, ['body', 'access-token'], '');
    Session.remove({_id: sessionId}, function(sesErr, sessionItem){
        req.session = null;
        req.sessionID = null;
        // res.render('server/weChat/views/index');
        res.json({success: true, errmsg: '', isLogin: false});
    });
}
exports.getCurrentUser = function(req, res) {
    var sessionId = _.get(req, ['body', 'access-token'], '');
    
    if(sessionId && sessionId!==''){
        Session.findOne({_id: sessionId}, function(sesErr, sessionItem){
        if(sesErr) {
            logger.info('Error in finding session', sesErr);
            res.status(500).send({success: false, errmsg: 'Error in finding session'});
        } else {
            var session = JSON.parse(_.get(sessionItem, ['session']), '{}');
            var sessionInfoStr = _.get(session, ['sessionInfo'], '{}');
            var sessionInfo = JSON.parse(sessionInfoStr);
            
          var expiresDateStr = _.get(sessionInfo, ['expires'], '');
            var expiresDate = new Date(expiresDateStr),
                current = new Date();
            if(current.getTime() > expiresDate.getTime()){
                // logger.info('login session expires, please login again');
                res.status(500).send({success: false, errmsg: 'expires'});
            } else {
                 var result = {
                     success: true,
                     isLogin: true,
                     errmsg: '',
                 };
                 res.json(result)
            }
        }
        })
    }else{
        res.status(401).send({success: false, errmsg: 'not login'});
    }
}