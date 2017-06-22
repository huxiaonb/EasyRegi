/**
 * Created by HUGO on 6/30/2016.
 */
'use strict';
var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('Loginuser'),
    passport = require('passport'),
    Session = mongoose.model('Session'),
    errorHandler = require(path.resolve('./server/core/controllers/errors.server.controller'));


module.exports.findForLogin = function (req, res,next) {
    var user = req.body;
    //ldap auth
    User.findOne({userid: user.username.toLowerCase().replace(/(^\s*)|(\s*$)/g,"")}).exec(function (err, doc) {
        if (err || !doc) {
            return res.status(400).send({
                message: 'your domain can not access the system!'
            });
        } else {
            var accountType = doc.accountType;
            if('ldap'===accountType){
                passport.authenticate('ldapauth', function (err, domain, info) {
                    if (err) {
                        return res.status(400).send({
                            message: '服务器繁忙，请等待!'
                        });
                    }
                   if(info){
                        return res.status(400).send(
                            info
                        );
                    }else{
                       var userInfo = {};
                       userInfo.userid = doc.userid;
                       userInfo.role = doc.role;
                       req.session.userInfo = JSON.stringify(userInfo);
                       req.session.isDeleted = 'false';
                       res.json(userInfo);
                   }
                } )(req, res, next);
            }else{
                if(doc.authenticate(user.password)){
                    var userInfo = {};
                    userInfo.userid = doc.userid;
                    userInfo.role = doc.role;
                    req.session.userInfo = JSON.stringify(userInfo);
                    req.session.isDeleted = 'false';
                    return res.status(200).json(userInfo);
                }else{
                    return res.status(400).json(err);
                }
            }

        }
    });
};

module.exports.logout = function (req, res,next) {
    var result;  
    if (req.session.userInfo) {
        delete req.session.userInfo;
        var id = req.session.id;
        Session.remove({_id: id}, function (err, doc) {
            result = {status: "success"};
            req.session = null;
            req.sessionID = null;
            res.redirect('/');
        });

    } else {
        result = {status: "not login"};
        res.redirect('/');
    }
};

/**
 * Create a User
 */
exports.create = function (req, res, next) {
    var userModel = req.body;
    userModel.userid = userModel.userid.toLowerCase().replace(/(^\s*)|(\s*$)/g,"");

    var query = User.findOne({userid:userModel.userid});
    var user = new User(req.body);

    //var user = new User(userModel);
    query.exec(function (err, orginalUser) {
        if (err) {
            return next(err);
        } else if (!orginalUser) {
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(user);
                }
            });
        } else {
            var _id = orginalUser._id;
            if (user.password) {
                user.password = user.hashPassword(user.password);
            }
            User.findByIdAndUpdate(_id, {
                $set: user
            }, function (err, doc) {
                if (err) {
                    return res.status(400).json({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(doc);
                }
            });
        }
    });
};
exports.userFieldValidation = function (req, res) {
    var userid = req.body.userid;
    User.findOne({userid:userid}, function (err, user) {
        if (err) {
            return res.status(400).json({
                message: errorHandler.getErrorMessage(err)
            });
        } else if (!user) {
            res.json({status: 'success', user: {}});
        } else {
            res.json({status: 'fail', user: {}});
        }
    });
};
