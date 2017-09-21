var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    crypto = require('crypto'),
    request = require('request');
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');
var mongoose = require('mongoose');
var Company = mongoose.model('Company');
var Applicant = mongoose.model('Applicant');
var Session = mongoose.model('Session');
var Position = mongoose.model('Position');
var EmailUtil = require('../utils/email.util.js');
var config = require('../../../config/config');

exports.companyUserLogin = companyUserLogin;
exports.upsertCompany = upsertCompany;
exports.updateCompanyInfo = updateCompanyInfo
exports.registerCompany = registerCompany;
exports.resetPassword = resetPassword;
exports.getPositionsAndApplicantsNum = getPositionsAndApplicantsNum;
exports.getApplicantsByCompanyId = getApplicantsByCompanyId;
exports.getPositionsByCompanyId = getPositionsByCompanyId;
exports.searchApplicants = searchApplicants;
exports.login = login;
exports.logout = logout;
exports.getCompanyInfo = getCompanyInfo;
exports.createPositionForCompany = createPositionForCompany;
exports.searchPositions = searchPositions;
exports.deletePositionForCompany = deletePositionForCompany;
exports.updatePosition = updatePosition;
exports.validateEmail = validateEmail;
exports.resetPwd = resetPwd;
exports.testSendEmail = testSendEmail;
exports.activeEmail = activeEmail;
exports.activeSuccess = activeSuccess;
exports.commonErr = commonErr;
exports.getCaptchaCode = getCaptchaCode;
exports.resetPasswordByCaptcha = resetPasswordByCaptcha

function companyUserLogin(req, res, next){
    var email = _.get(req, ['body', 'account'], ''),
        pwd = _.get(req, ['body', 'pwd'], '');
    if(_.isEmpty(email) || _.isEmpty(pwd)){
        logger.info('login id and pwd are required');
        res.status(500).send({success: false, errmsg: 'login id and pwd are required'});
    } else {
        login(email, pwd, function(error, companyItem){
            if(error){
                logger.info('Error in finding an account', email, error);
                res.status(500).send({success: false, errmsg: '用户名或密码错误', isAccountValid: false, isAccountActive: false});
            }
            else {
                res.header('Access-Control-Expose-Headers', 'access-token');
                var result = {};
                result.success = false;
                result.errmsg = '';
                result.company = {};
                if(!_.isEmpty(companyItem)){
                    if(companyItem.active){
                        result.success = true;
                        companyItem.activeTokenExpires = '';
                        result.company = companyItem;
                        var current = new Date(),
                            timestamp = current.getTime() + 24 * 60 * 60 * 1000;
                        var expiresDate = new Date(timestamp);
                        var companyInfo = {
                            companyId: companyItem._id,
                            expires: expiresDate.toString()
                        }
                        req.session.companyInfo = JSON.stringify(companyInfo);
                        res.header('access-token', req.sessionID);
                        res.json(result);
                    } else {
                        var currentTimeStamp = Date.now();
                        if(_.isUndefined(companyItem.activeTokenExpires) || (!_.isUndefined(companyItem.activeTokenExpires) && Number.parseInt(companyItem.activeTokenExpires) < currentTimeStamp)){
                            generateVerificationEmail(email, function(err1, sendEmailResult){
                                if(err1) logger.info('Error in generate verification email', email, err1);
                                else logger.info('resend verification email successfully');
                                res.status(500).send({success: false, errmsg: '账户未激活', isAccountValid: true, isAccountActive: false});                                        
                            });
                        } else {
                            res.status(500).send({success: false, errmsg: '账户未激活', isAccountValid: true, isAccountActive: false});    
                        }
                    }
                } else {
                    logger.info('cannot find an account with email %s and pwd %s', email, pwd);
                    res.status(500).send({success: false, errmsg: '用户名或密码错误', isAccountValid: false, isAccountActive: false});
                }
            }
        })
    }
}

function login(email, pwd, callback){
    Company.findOne({email: email, password: pwd}, function(error, companyItem){
        if(error) {
            logger.error('Error in finding company by login id: %s %s', email, error);
            return callback('Error in finding company', null);
        } else {
            if(_.isEmpty(companyItem)){
                return callback(null, {});
            } else {
                var clonedCompany = {
                    _id: companyItem._id,
                    companyName: companyItem.companyName,
                    alias: companyItem.alias,
                    companyAddress: companyItem.companyAddress,
                    companyType : companyItem.companyType,
                    companyScale: companyItem.companyScale,
                    phoneNumber: companyItem.phoneNumber,
                    contactPersonName: companyItem.contactPersonName,
                    email: companyItem.email,
                    description: companyItem.description,
                    positions: companyItem.positions,
                    active: _.get(companyItem, ['active'], false),
                    activeTokenExpires: _.get(companyItem, ['activeTokenExpires'], '')
                };
                
                
                logger.info(clonedCompany);
                return callback(null, clonedCompany);
            }
        }

    });
}

function logout(req, res, next){
    var sessionId = _.get(req, ['headers', 'access-token'], '');
    Session.remove({_id: sessionId}, function(sesErr, sessionItem){
        req.session = null;
        req.sessionID = null;
        // res.render('server/weChat/views/index');
        res.json({success: true, errmsg: '', isLogin: false});
    });
}

function getCompanyInfo(req, res, next){
    var sessionId = _.get(req, ['headers', 'access-token'], '');
    Session.findOne({_id: sessionId}, function(sesErr, sessionItem){
        if(sesErr) {
            logger.info('Error in finding session', sesErr);
            res.status(500).send({success: false, errmsg: 'Error in finding session'});
        } else {
            if(_.isEmpty(sessionItem)){
                res.status(500).send({success: false, errmsg: 'no session found by access-token', company: {}});
            } else {
                var session = JSON.parse(_.get(sessionItem, ['session']), '{}');
                var companyInfoStr = _.get(session, ['companyInfo'], '{}');
                var companyInfo = JSON.parse(companyInfoStr);
                if(_.isEmpty(companyInfo)){
                    logger.info('not login');
                    res.render('server/weChat/views/index');
                } else {
                    var expiresDateStr = _.get(companyInfo, ['expires'], ''),
                        companyId = _.get(companyInfo, ['companyId'], '');
                    var expiresDate = new Date(expiresDateStr),
                        current = new Date();
                    if(current.getTime() > expiresDate.getTime()){
                        logger.info('login session expires, please login again');
                        res.render('server/weChat/views/index');
                    } else {
                        if(_.isEmpty(companyId)){
                            res.status(500).send({success: false, errmsg: 'no company id found in session'});
                        } else {
                            Company.findOne({_id: companyId}, function(error, companyItem){
                                if(error) {
                                    logger.info('Error in getCompanyInfo', error);
                                    res.status(500).send({success: false, errmsg: error});
                                } else {
                                    if(_.isEmpty(companyItem)){
                                        res.status(500).send({success: false, errmsg: 'no company found by id'});
                                    } else {
                                        var clonedCompany = {
                                            _id: companyItem._id,
                                            companyName: companyItem.companyName,
                                            alias: companyItem.alias,
                                            companyAddress: companyItem.companyAddress,
                                            companyScale: companyItem.companyScale,
                                            companyType: companyItem.companyType,
                                            phoneNumber: companyItem.phoneNumber,
                                            contactPersonName: companyItem.contactPersonName,
                                            email: companyItem.email,
                                            description: companyItem.description,
                                            positions: companyItem.positions
                                        };
                                        var result = {
                                            success: true,
                                            isLogin: true,
                                            errmsg: '',
                                            company: {}
                                        };
                                        result.company = clonedCompany;
                                        res.json(result);
                                    }
                                }
                            });
                        }
                    }
                }

            }
        }
    });
}

function upsertCompany(req, res, next){
    var companyItem = _.get(req, ['body'], {}),
        email = _.get(companyItem, ['email'], ''),
        pwd = _.get(companyItem, ['password'], '');
    var upsertResult = {
        success: false,
        errmsg: ''
    };
    logger.info(companyItem);
    if(_.isEmpty(email)){
        logger.error('no email found in req body');
        res.status(500).send({success: false, errmsg: 'no email found in req body'});
    } else {
        Company.findOne({email: email}, function(error, foundCompany){
            if(error) {
                logger.error('Error in finding company by email', email, error);
                res.status(500).send({success: false, errmsg: 'Error in finding company by email'});
            } else {
                if(_.isEmpty(foundCompany)){
                    //save
                    if(_.isEmpty(pwd)){
                        logger.info('Password is required');
                        res.status(500).send({success: false, errmsg: 'Password is required'});
                    } else {
                        var companyEntity = new Company(companyItem);
                        logger.info(companyEntity)
                        companyEntity.save(function(error, data){
                            if(error) {
                                logger.info('Error in saving company', error)
                                upsertResult.errmsg = 'Error in saving company';
                                res.json(upsertResult);
                            } else {
                                upsertResult.success = true;
                                upsertResult.errmsg = '';
                                upsertResult.company = data;
                                res.json(upsertResult);
                            }
                        })
                    }
                } else {
                    //update
                    Company.update({email: email}, {$set: companyItem}, {upsert: false}, function(error, updateResult){
                        if(error) {
                            logger.info('Error in updating company', error);
                            upsertResult.errmsg = 'Error in updating company';
                            res.json(upsertResult);
                        } else {
                            Company.findOne({email: email}, function(err, updatedCompany){
                                if(err) {
                                    logger.info('Error in finding company', err);
                                    upsertResult.errmsg = 'Error in finding company';
                                    res.json(upsertResult);
                                } else {
                                    upsertResult.success = true;
                                    upsertResult.company = {
                                        companyName: updatedCompany.companyName,
                                        companyAddress: updatedCompany.companyAddress,
                                        companyType: updatedCompany.companyType,
                                        companyScale: updatedCompany.companyScale,
                                        alias: updatedCompany.alias,
                                        email: updatedCompany.email,
                                        contactPersonName: updatedCompany.contactPersonName,
                                        phoneNumber: updatedCompany.phoneNumber,
                                        description: updatedCompany.description,
                                        positions: updatedCompany.positions
                                    };
                                    res.json(upsertResult);
                                }
                            })
                        }
                    });
                }
            }
        });
    }

}

function updateCompanyInfo(req, res, next){
    var companyItem = _.get(req, ['body'], {}),
        email = _.get(companyItem, ['email'], '');
    if(_.isEmpty(email)){
        logger.error('no email found in req body');
        res.status(500).send({success: false, errmsg: 'no email found in req body'});
    } else {
        var companyEntity = {
            companyName: _.get(companyItem, ['companyName'], ''),
            companyAddress: _.get(companyItem, ['companyAddress'], ''),
            companyType: _.get(companyItem, ['companyType'], ''),
            companyScale: _.get(companyItem, ['companyScale'], ''),
            alias: _.get(companyItem, ['alias'], ''),
            contactPersonName: _.get(companyItem, ['contactPersonName'], ''),
            phoneNumber: _.get(companyItem, ['phoneNumber'], ''),
            description: _.get(companyItem, ['description'], '')
        };
        var qqLocationApi = _.get(config, ['qqapi', 'geocoderApi'], '')
            apiKey = _.get(config, ['qqmapKey'], ''),
            addrStr = _.get(companyItem, ['companyAddress'], ''),
            completeAddr = addrStr.replace(/,/g, '');
        locationUrl = qqLocationApi + '?address=' + encodeURI(completeAddr) + '&key=' + apiKey;

        request.get({
            url: locationUrl,
            json: true
        }, function(error, response, locationResult) {
            logger.info(locationResult);

            if (!error && _.get(response, ['statusCode'], 0) === 200 && _.get(locationResult, ['status']) == 0) {
                var addrArr = addrStr.split(','),
                    province = _.get(locationResult, ['result', 'address_components', 'province'], ''),
                    latLng = _.get(locationResult, ['result', 'location'], {});
                if (addrArr.length > 0 && addrArr[0] == province && !_.isEmpty(latLng)) {
                    companyEntity.lat = latLng.lat;
                    companyEntity.lng = latLng.lng;
                }
            }
            logger.info(companyEntity);
            Company.update({email: email}, {$set: companyEntity}, {upsert: false}, function(err1, updateResult){
                if(err1) {
                    logger.info('Error in updating company', email, err1);
                    res.status(500).send({success: false, errmsg: 'Error in updating company'});
                } else {
                    Company.findOne({email: email}, function(err2, dbCompany){
                        if(err2){
                            logger.info('Error in finding company', email, err1);
                            res.status(500).send({success: false, errmsg: 'Error in finding company'});
                        } else if(_.isEmpty(dbCompany)){
                            logger.info('company for %s does not exists', email);
                            res.status(500).send({success: false, errmsg: 'company does not exists'});
                        } else {
                            dbCompany.password = '';
                            var clonedCompany = {
                                _id: dbCompany._id,
                                companyName: dbCompany.companyName,
                                alias: dbCompany.alias,
                                companyAddress: dbCompany.companyAddress,
                                companyScale: dbCompany.companyScale,
                                companyType: dbCompany.companyType,
                                phoneNumber: dbCompany.phoneNumber,
                                contactPersonName: dbCompany.contactPersonName,
                                email: dbCompany.email,
                                description: dbCompany.description,
                                positions: dbCompany.positions
                            };
                            res.status(200).send({success: true, errmsg: '', company: clonedCompany});
                        }
                    });
                }
            });
        });
    }
}

function registerCompany(req, res, next){
    var companyItem = _.get(req, ['body'], {}),
        email = _.get(req, ['body', 'email'], ''),
        pwd = _.get(req, ['body', 'password'], '');
    if(_.isEmpty(email) || _.isEmpty(pwd)){
        res.status(500).send({success: false, errmsg: '邮箱及密码是必填的'});
    } else {
        var queryCriteria = {$or: []};
        queryCriteria.$or.push({email: email});
        var companyName = _.get(req, ['body', 'companyName'], '');
        // logger.info(companyName)
        if(!_.isEmpty(companyName))
            queryCriteria.$or.push({companyName: companyName});
        Company.findOne(queryCriteria, function(err1, dbCompany){
            if(err1) {
                logger.info('Error in finding company by email', email, err1);
                res.status(500).send({success: false, errmsg: '未知错误请联系管理员！'});
            } else if(_.isEmpty(dbCompany)){
                logger.info('no comany found, system will create new account for company');
                var companyEntity = new Company(companyItem);
                // logger.info(companyEntity);
                companyItem.active = false;
                var qqLocationApi = _.get(config, ['qqapi', 'geocoderApi'], '')
                    apiKey = _.get(config, ['qqmapKey'], ''),
                    addrStr = _.get(companyItem, ['companyAddress'], ''),
                    completeAddr = addrStr.replace(/,/g, '');
                    locationUrl = qqLocationApi + '?address=' + encodeURI(completeAddr) + '&key=' + apiKey;

                request.get({
                    url: locationUrl,
                    json: true
                }, function(error, response, locationResult){
                    if(!error && _.get(response, ['statusCode'], 0) === 200 && _.get(locationResult, ['status']) == 0){
                        var addrArr = addrStr.split(','),
                            province = _.get(locationResult, ['result', 'address_components', 'province'], ''),
                            latLng = _.get(locationResult, ['result', 'location'], {});
                        if(addrArr.length > 0 && addrArr[0] == province && !_.isEmpty(latLng)){
                            companyItem.lat = latLng.lat;
                            companyItem.lng = latLng.lng;
                        }
                    }
                    logger.info(JSON.stringify(companyItem));
                    Company.update({email: email},{$set: companyItem},{upsert: true},function(error, updResult){
                        if(error) {
                            logger.info('Error in saving company', error)
                            res.status(500).send({success: false, errmsg: '未知错误请联系管理员！'});
                        } else {
                            Company.findOne({email: email}, function(err2, data){
                                crypto.randomBytes(20, function(err3, buf){
                                    var activeToken = data._id + buf.toString('hex'),
                                    verificationInfo = {
                                        activeToken: activeToken,
                                        active: false,
                                        activeTokenExpires: Date.now() + 24 * 3600 * 1000
                                    },
                                    // verificationLink = 'http://localhost:3000/account/verification?account=' + email + '&activeToken=' + activeToken;
                                    // verificationLink = 'http://maaaace.nat200.top/account/verification?account=' + email + '&activeToken=' + activeToken;
                                    verificationLink = 'http://www.mfca.com.cn/account/verification?account=' + email + '&activeToken=' + activeToken;
                                    var verificationHtmlTemplate = _.get(config, ['emailConfig', 'verificationHtmlTemplate'], '');
                                    var emailOpt = {
                                        from: _.get(config, ['emailConfig', 'adminEmailBanner'], ''),
                                        subject: _.get(config, ['emailConfig', 'verificationSubject'], ''),
                                        to: email
                                    };
                                    var verificationEmailContent = verificationHtmlTemplate.replace(/\[Registered_Email\]/i, email).replace(/\[Verification_Link\]/ig, verificationLink);
                                    emailOpt.html = verificationEmailContent;
                                    sendVerificationEmail(emailOpt, function(err4, emailResult){
                                        if(err4) {
                                            logger.info('Error in sending verification email', err4);
                                            res.status(500).send({success: false, errmsg: '未知错误请联系管理员！'});
                                        } else {
                                            Company.update({email: email}, {$set: verificationInfo}, {upsert: false}, function(err5, updResult2){
                                                if(err5) {
                                                    logger.info('Error in update verification info', err5);
                                                } else
                                                    logger.info('update verification info');
                                                    res.status(200).send({success: true, errmsg: '', redirect: true});
                                            });
                                        }
                                    })

                                });
                            });

                        }
                    });
                });
            } else {
                logger.info('Company already exists');
                if(dbCompany.email == email)
                    res.status(500).send({success: false, errmsg: '邮箱已经被注册'});
                else 
                    res.status(500).send({success: false, errmsg: '公司名称已存在'});
            }
        });

    }
}

function resetPassword(req, res, next){
    var email = _.get(req, ['body', 'email'], ''),
        oldPwd = _.get(req, ['body', 'oldPwd'], ''),
        newPwd = _.get(req, ['body', 'newPwd'], '');
    if(_.isEmpty(email) || _.isEmpty(oldPwd) || _.isEmpty(newPwd)){
        res.status(500).send({success: false, errmsg: 'email and password are required'});
    } else {
        Company.findOne({email: email, password: oldPwd}, function(err1, dbCompany){
            if(err1) {
                logger.info('error in finding company by email', email, err1);
                res.status(500).send({success: false, errmsg: 'Error in finding company by company email'});
            } else if(_.isEmpty(dbCompany)){
                logger.info('email or password is not correct');
                res.status(500).send({success: false, errmsg: 'email or password is not correct'});
            } else {
                Company.update({email: email, password: oldPwd}, {$set: {password: newPwd}}, {upsert: false}, function(err2, updateResult){
                    if(err2){
                        logger.info('Error in updating password for company', email, err2);
                        res.status(500).send({success: false, errmsg: 'Error in updating company by company email'});
                    } else {
                        res.status(200).send({success: true, errmsg: ''});
                    }
                });
            }
        });
    }
}

function getPositionsAndApplicantsNum(req, res, next){
    var countResult = {
        success: false,
        errmsg: '',
        positionNumber: 0,
        applicantNumber: 0
    }
    var companyId = _.get(req, ['params', 'companyId'], '');
    // logger.info(companyId);
    if(_.isEmpty(companyId)){
        countResult.errmsg = 'company id is required';
        res.status(500).send(countResult);
    } else {
        var tasks = [];
        tasks.push(getAllPublishedPositionsByCompanyId(companyId));
        tasks.push(getAllApplicantsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                logger.info('Error in getPositionsAndApplicantsNum', companyId, error);
                countResult.errmsg = 'Error in getPositionsAndApplicantsNum' + error;
            } else {
                countResult.success = true;
                if(!_.isEmpty(_.get(result, ['0'])))
                    countResult.positionNumber = result[0].length;
                if(!_.isEmpty(_.get(result, ['1'])))
                    countResult.applicantNumber = result[1].length;
            }
            res.json(countResult);
        });
    }
}

function getApplicantsByCompanyId(req, res, next){
    var companyId = _.get(req, ['params', 'companyId'], '');
    // logger.info(companyId);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllApplicantsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                logger.info('Error in finding all applicants by companyId', companyId, error);
                res.status(500).send({success: false, errmsg: 'Error in finding all applicants by companyId', applicants: []});
            } else {
                var applicants = [];
                if(!_.isEmpty(_.get(result, ['0']))){
                    applicants = _.get(result, ['0']);
                }
                var result = {
                    success: true,
                    errmsg: '',
                    applicants: applicants
                };
                res.json(result);
            }

        });
    }
}

function getPositionsByCompanyId(req, res, next){
    var companyId = _.get(req, ['params', 'companyId'], '');
    // logger.info(companyId);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllPublishedPositionsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                logger.info('Error in finding all positions by companyId', companyId, error);
                res.status(500).send({success: false, errmsg: 'Error in finding all applicants by companyId', positions: []});
            } else {
                var positions = [];
                if(!_.isEmpty(_.get(result, ['0']))){
                    positions = _.get(result, ['0']);
                }
                var result = {
                    success: true,
                    errmsg: '',
                    positions: positions
                };
                res.json(result);
            }
        });
    }
}

function getAllPublishedPositionsByCompanyId(companyId){
    return function(callback){
        Company.findOne({_id: companyId}, function(error, companyItem){
            if(error) {
                return callback(error, null);
            } else {
                if(_.isEmpty(companyItem)){
                    return callback(null, null);
                } else {
                    var positions = _.get(companyItem, ['positions'], []);
                    return callback(null, positions);
                }
            }
        }); 
    }
}

function getAllApplicantsByCompanyId(companyId){
    return function(callback){
        Applicant.find({'registeredCompanies.companyId': companyId}, function(error, applicants){
            if(error){
                return callback(error, null);
            } else {
                if(_.isEmpty(applicants)){
                    return callback(null, null);
                } else {
                    return callback(null, applicants);
                }
            }
        });
    }
}

function searchApplicants(req, res, next){
    var companyId = _.get(req, ['body', 'companyId'], ''),
        applicantName = _.get(req, ['body', 'applicantName'], ''),
        startedAt = _.get(req, ['body', 'startedAt'], ''),
        endedAt = _.get(req, ['body', 'endedAt'], '');
    // logger.info(companyId, applicantName, startedAt, endedAt);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required'});
    } else {
        var queryCriteria = {$and: []};
        queryCriteria.$and.push({'registeredCompanies.companyId': companyId});
        
        if(!_.isEmpty(applicantName))
            queryCriteria.$and.push({'name': {'$regex':applicantName, '$options':"$i"}});
            // queryCriteria.$and.push({'name': applicantName});
        if(!_.isEmpty(startedAt)){
            var startDateStr = startedAt + ' 00:00:00.000';
            var startDate = new Date(startDateStr);
            logger.info(startDate);
            if(_.isDate(startDate))
                queryCriteria.$and.push({'registeredCompanies.registerDate':{$gt: startDate}});
        }

        if(!_.isEmpty(endedAt)){
            var endDateStr = endedAt + ' 23:59:59.999';
            var endDate = new Date(endDateStr);
            logger.info(endDate);
            if(_.isDate(endDate))
                queryCriteria.$and.push({'registeredCompanies.registerDate':{$lt: endDate}});
        }

        Applicant.find(queryCriteria, function(error, applicants){
            if(error) {
                logger.info('Error in finding applicants', error);
                res.status(500).send({success: false, errmsg: 'Error in finding applicants', applicants: []});
            } else {
                // logger.info(applicants);
                var result = {
                    success: true,
                    errmsg: '',
                    applicants: applicants
                };
                res.json(result);
            }
        });
    }
}

function convertDateStrToGmtDate(dateStr){
    if(_.isEmpty(dateStr)){
        return null;
    } else {
        var newDateStr = dateStr + ' 00:00:00.000';
        var date = new Date(newDateStr);
        return date;
    }
}

function createPositionForCompany(req, res, next){
    var companyId = _.get(req, ['body', 'companyId'], ''),
        positionObj = _.get(req, ['body', 'position'], {});
    if(_.isEmpty(companyId)){
        logger.info('company id is required');
        res.status(500).send({success: false, errmsg: 'company id is required', position: {}});
    } else {
        if(_.isEmpty(positionObj)){
            logger.info('position object is empty');
            res.status(500).send({success: false, errmsg: 'position object is empty', position: {}});
        } else {
            Company.findOne({_id: companyId}, function(error, dbCompany){
                if(error) {
                    logger.info('Error in finding company by id', companyId, error);
                    res.status(500).send({success: false, errmsg: 'Error in finding company by id', position: {}});
                } else if(_.isEmpty(dbCompany)){
                    logger.info('no company found by id');
                    res.status(500).send({success: false, errmsg: 'no company found by id', position: {}});
                } else {
                    var positionItem = {
                        name: _.get(positionObj, ['name'], ''),
                        companyId: companyId,
                        phoneNumber: _.get(positionObj, ['phoneNumber'], ''),
                        totalRecruiters: _.get(positionObj, ['totalRecruiters'],''),
                        salary: _.get(positionObj, ['salary'], ''),
                        welfares: _.get(positionObj, ['welfares'], []),
                        positionDesc: _.get(positionObj, ['positionDesc'], ''),
                        jobRequire:_.get(positionObj, ['jobRequire'], '')
                    }
                    var positionEntity = new Position(positionItem);
                    positionEntity.save(function(saveErr, persistedObj){
                        if(saveErr) {
                            logger.info('Error in saving position', saveErr);
                            res.status(500).send({success: false, errmsg: 'Error in saving position', position: {}});
                        } else {
                            var _id = _.get(persistedObj, ['_id'], ''),
                                positionName = _.get(persistedObj, ['name'], '');
                            if(_.isEmpty(_id)){
                                logger.info('Failed in saving position');
                                res.status(500).send({success: false, errmsg: 'Failed in saving position', position: {}});
                            } else {
                                var companyPosition = {
                                    positionId: _id,
                                    positionName: positionName
                                };
                                var dbPositions = _.get(dbCompany, ['positions'], []);
                                dbPositions.push(companyPosition);
                                Company.update({_id: companyId}, {$set: {positions: dbPositions}}, {upsert: false}, function(err, result){
                                    if(err) {
                                        logger.info('Error in updating company', err);
                                        res.status(500).send({success: false, errmsg: 'Error in updating company', position: {}});
                                    } else {
                                        var updateResult = {
                                            success: true,
                                            errmsg: '',
                                            position: positionObj
                                        };
                                        res.json(updateResult);
                                    }
                                })
                            }
                        }
                    });
                }
            });
        }
    }
}

function searchPositions(req, res, next){
    var companyId = _.get(req, ['body', 'companyId'], ''),
        positionName = _.get(req, ['body', 'positionName'], ''),
        startedAt = _.get(req, ['body', 'startedAt'], ''),
        endedAt = _.get(req, ['body', 'endedAt'], '');
    // logger.info(companyId, positionName, startedAt, endedAt);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required', positions: []});
    } else {
        Company.findOne({_id: companyId}, function(error, dbCompany){
            if(error || _.isEmpty(dbCompany)){
                logger.info('Error in finding company by id', companyId, error);
                res.status(500).send({success: false, errmsg: 'Error in finding company', positions: []});
            } else {
                var dbPositions = _.get(dbCompany, ['positions'], []),
                    selectPositions = [];
                if(!_.isEmpty(positionName)){
                    var reg = new RegExp(positionName, "i");
                    selectPositions = dbPositions.filter(function(item){
                        return reg.test(_.get(item, ['positionName'], ''));
                    });
                } else {
                    selectPositions = dbPositions;
                }
                var queryCriteria = {$and: []};
                if(_.isEmpty(selectPositions)){
                    var result = {
                        success: true,
                        errmsg: '',
                        positions: []
                    }
                    res.json(result);
                } else {
                    var inQuery = [];
                    _.forEach(selectPositions, function(pos){
                        inQuery.push(_.get(pos, ['positionId'], ''));
                    });
                    queryCriteria.$and.push({'_id': {$in: inQuery}});

                    if(!_.isEmpty(startedAt)){
                        var startDateStr = startedAt + ' 00:00:00.000';
                        var startDate = new Date(startDateStr);
                        logger.info(startDate);
                        if(_.isDate(startDate))
                            queryCriteria.$and.push({'createdAt':{$gt: startDate}});
                    }

                    if(!_.isEmpty(endedAt)){
                        var endDateStr = endedAt + ' 23:59:59.999';
                        var endDate = new Date(endDateStr);
                        logger.info(endDate);
                        if(_.isDate(endDate))
                            queryCriteria.$and.push({'createdAt':{$lt: endDate}});
                    }

                    Position.find(queryCriteria, function(err, positionItems){
                         if(err) {
                            logger.info('Error in finding positions', err);
                            res.status(500).send({success: false, errmsg: 'Error in finding positions', positions: []});
                        } else {
                            var result = {
                                success: true,
                                errmsg: '',
                                positions: positionItems
                            };
                            res.json(result);
                        }
                    });
                }
            }
        });
    }
}

function deletePositionForCompany(req, res, next){
    var companyId = _.get(req, ['body', 'companyId'], ''),
        positionId = _.get(req, ['body', 'positionId'], '');
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required', positions: []});
    } else {
        Company.findOne({_id: companyId}, function(error, dbCompany){
            if(error || _.isEmpty(dbCompany)){
                logger.info('Error in finding company by id', companyId, error);
                res.status(500).send({success: false, errmsg: 'Error in finding company', positions: []});
            } else {
                var dbPositions = _.get(dbCompany, ['positions'], []);
                var newPositions = dbPositions.filter(function(pos){
                    return pos.positionId !== positionId;
                });
                Company.update({_id: companyId}, {$set: {positions: newPositions}}, {upsert: false}, function(err, result){
                    if(err) {
                        logger.info('Error in updating company positions for company id', companyId, err);
                        res.status(500).send({success: false, errmsg: 'Error in updating company positions', positions: []});
                    } else {
                        Position.remove({_id: positionId}, function(removeErr, removeResult){
                            if(removeErr){
                                logger.info('Error in removing position for id', positionId, removeErr);
                                res.status(500).send({success: false, errmsg: 'Error in removing position for id', positions: []});
                            } else {
                                var returnedResult = {
                                    success: true,
                                    errmsg: '',
                                    removedPosition: positionId
                                };
                                res.json(returnedResult);
                            }
                        });
                    }
                });
            }
        })
    }
}

function updatePosition(req, res, next){
    var companyId = _.get(req, ['body', 'companyId'], ''),
        positionObj = _.get(req, ['body', 'position'], {}),
        positionId = _.get(positionObj, ['_id']);
    if(_.isEmpty(companyId) || _.isEmpty(positionId)){
        res.status(500).send({success: false, errmsg: 'company id and position id are required', positions: []});
    } else {
        var tasks = [];
        tasks.push(updatePositionModel(positionObj));
        tasks.push(updatePositionNameByCompanyId(companyId, positionObj));
        async.parallel(tasks, function(error, result){
            if(error) {
                logger.error('Error in update company position', error);
                res.status(500).send({success: false, errmsg: 'Error in update company position', positions: []});
            } else {
                var tasksResult = {
                    success: true,
                    errmsg: '',
                    positions: []
                };
                res.json(tasksResult);
            }
        });
    }
}

function updatePositionModel(positionObj){
    return function(callback){
        var positionEntity = {
            name: _.get(positionObj, ['name'], ''),
            phoneNumber: _.get(positionObj, ['phoneNumber'], ''),
            totalRecruiters: _.get(positionObj, ['totalRecruiters'], 0),
            salary: _.get(positionObj, ['salary'], ''),
            welfares: _.get(positionObj, ['welfares'], []),
            positionDesc: _.get(positionObj, ['positionDesc'], ''),
            jobRequire:_.get(positionObj, ['jobRequire'], '')
        },
        positionId = _.get(positionObj, ['_id'], '');
        if(_.isEmpty(positionId)){
            logger.info('no position id found, cannot update position');
            return callback(null, null);
        } else {
            Position.update({_id: positionId}, {$set: positionEntity}, {upsert: false}, function(error, updateResult){
                if(error){
                    logger.info('Error in updating position', error);
                    return callback(null, null);
                } else {
                    return callback(null, updateResult);
                }
            });

        }
    }
}

function updatePositionNameByCompanyId(companyId, positionObj){
    return function(callback){
        var positionId = _.get(positionObj, ['_id'], '');
        if(_.isEmpty(positionId) || _.isEmpty(companyId)){
            logger.info('no position id or companyId found for update position under company');
            return callback(null, null)
        } else {
            Company.findOne({_id: companyId}, function(err1, dbCompany){
                if(err1 || _.isEmpty(dbCompany)){
                    logger.info('Error in finding dbcompany by company id', companyId, err1)
                    return callback(null, null);
                } else {
                    var dbPositions = _.get(dbCompany, ['positions'], []);
                    var targetPosition = _.find(dbPositions, {'positionId': positionId});
                    if(_.isEmpty(targetPosition))
                        return callback(null, null);
                    else {
                        targetPosition.positionName = _.get(positionObj, ['name'], '');
                        Company.update({_id: companyId}, {$set: {'positions': dbPositions}}, {upsert: false}, function(err2, updateResult){
                            if(err2){
                                logger.info('Error in updating positions under company for id', companyId, err2);
                                return callback(null, null);
                            } else {
                                return callback(null, updateResult);
                            }
                        });
                    }
                }
            });
        }
    }
}

function validateEmail(req, res, next){
    var activeToken = _.get(req, ['query', 'activeToken'], ''),
        email = _.get(req, ['query', 'account'], '');
    if(_.isEmpty(email) || _.isEmpty(activeToken)){
        res.render('server/weChat/views/error', {errSubject: '激活失败', errmsg: '激活失败，请重新登陆发送激活邮件'});
    } else {
        Company.findOne({email: email}, function(err1, dbCompany){
            if(err1 || _.isEmpty(dbCompany)) {
                logger.info('Error in finding company by email', email, err1);
                res.render('server/weChat/views/error', {errSubject: '激活失败', errmsg: '激活失败，请联系管理员'});
            } else {
                if(!_.isUndefined(dbCompany.active) && dbCompany.active){
                    return res.render('server/weChat/views/error', {errSubject: '激活失败', errmsg: '账号已经激活,请直接登陆'});
                }
                if(!_.isUndefined(dbCompany.activeToken) && dbCompany.activeToken != activeToken){
                    return res.render('server/weChat/views/error', {errSubject: '激活失败', errmsg: '激活链接错误，请使用最新激活邮件中的激活链接'});
                }
                var currentTimeStamp = Date.now();
                if(!_.isUndefined(dbCompany.activeTokenExpires) && Number.parseInt(dbCompany.activeTokenExpires) < currentTimeStamp){
                    return res.render('server/weChat/views/error', {errSubject: '激活失败', errmsg: '激活链接已过期，请重新登陆发送激活邮件'});
                }
                Company.update({email: email}, {$set: {active: true}}, {upsert: false}, function(err2, updResult){
                    if(err2) {
                        logger.info('Error in activating company account for email', email, err2);
                        res.render('server/weChat/views/error', {errmsg: '激活失败，请联系管理员'});
                    } else {
                        logger.info('Activating successfully for company account', email);
                        res.render('server/weChat/views/success');
                    }
                });
            }
        });
        
    }
}



function testSendEmail(req, res, next){
    var email = {
        from: '入职易<easyregitest@126.com>',
        subject: '请验证您在入职易的注册邮箱',
        to: 'fireman88.ok@163.com',
        // text: '您好！\n入职易收到了邮箱fireman88.ok@163.com的注册申请，请点击一下链接完成注册：\n\nhttp://www.baidu.com \n如果邮箱中不能打开链接，您也可以将它复制到浏览器地址栏中打开。',
        html: '<p>您好！</p><p>入职易收到了邮箱 fireman88.ok@163.com 的注册申请，请点击一下链接完成注册:</p><br><a href="http://www.baidu.com">http://www.baidu.com</a><br><p>如果邮箱中不能打开链接，您也可以将它复制到浏览器地址栏中打开。</p>'
    }
    EmailUtil.sendEmail(email, function(error, info){
        if(error) logger.info(error);
        else logger.info(info.response);
        res.json({success: true, errmsg: ''});
    });
}

function sendVerificationEmail(email, callback){
    EmailUtil.sendEmail(email, function(error, info){
        if(error) {
            logger.info(error);
            return callback(error, null);
        }
        else {
            logger.info(info.response);
            return callback(null, {success: true, errmsg: ''});
        }
    });
}

function activeEmail(req, res, next){
    res.render('server/weChat/views/active');
}
function activeSuccess(req, res, next){
    res.render('server/weChat/views/success');
}
function commonErr(req, res, next){
    res.render('server/weChat/views/error');
}
function resetPwd(req, res, next) {
    res.render('server/weChat/views/resetPwd');
}

function getCaptchaCode(req, res, next){
    var email = _.get(req, ['params', 'email']);
    if(_.isEmpty(email)){
        res.status(500).send({success: false, errmsg: '请输入正确的验证邮箱'});
    } else {
        Company.findOne({email: email}, function(err1, dbCompany){
            if(err1 || _.isEmpty(dbCompany)){
                logger.info('Error in finding company by email', email, err1);
                res.status(500).send({success: false, errmsg: '无效的验证邮箱'});
            } else {
                var currentTimeStamp = Date.now();
                if(!_.isEmpty(dbCompany.resetPwdTokenGeneratedTimeStamp) && Number.parseInt(dbCompany.resetPwdTokenGeneratedTimeStamp) + (60 * 1000) > currentTimeStamp){
                    logger.info(Number.parseInt(dbCompany.resetPwdTokenGeneratedTimeStamp) + (60 * 1000), currentTimeStamp);
                    logger.info(Number.parseInt(dbCompany.resetPwdTokenGeneratedTimeStamp) + (60 * 1000) > currentTimeStamp);
                    logger.info('the captcha does not expire');
                    res.status(500).send({success: false, errmsg: '验证码请求过于频繁，请查看邮箱获取验证码或者等待一分钟'});
                } else {
                    var code = EmailUtil.generateCaptcha(4);
                    var updInfo = {
                        resetPwdToken: code,
                        resetPwdTokenGeneratedTimeStamp: currentTimeStamp,
                        resetPwdTokenExpires: currentTimeStamp + 30 * 60 * 1000
                    };
                    Company.update({email: email}, {$set: updInfo}, {upsert: false}, function(err2, updResult){
                        if(err2) {
                            logger.info('Error in updating account', email, err2);
                            res.status(500).send({success: false, errmsg: '更新验证码失败'});
                        } else {
                            var resetPwdSubject = _.get(config, ['emailConfig', 'resetPwdSubject'], ''),
                                resetPwdHtmlTemplate = _.get(config, ['emailConfig', 'resetPwdHtmlTemplate'], ''),
                                adminEmailBanner = _.get(config, ['emailConfig', 'adminEmailBanner'], '');
                            resetPwdSubject = resetPwdSubject.replace(/\[Reset_Password_Captcha\]/i, code);
                            var resetPwdEmailContent = resetPwdHtmlTemplate.replace(/\[Reset_Password_Captcha\]/i, code);
                            var emailOpt = {
                                from: adminEmailBanner,
                                subject: resetPwdSubject,
                                to: email,
                                html: resetPwdEmailContent
                            };
                            sendVerificationEmail(emailOpt, function(err3, sendEmailResult){
                                if(err3) {
                                    logger.info('Error in sending captcha to email', email, err3);
                                    res.status(500).send({success: false, errmsg: '验证码邮件发送失败，请联系管理员'});
                                } else {
                                    logger.info('send captcha successfully');
                                    res.json({success: true, errmsg: ''});
                                }
                            });
                        }
                    });
                }
            }
        });
    }
}

function resetPasswordByCaptcha(req, res, next){
    var email = _.get(req, ['body', 'email'], ''),
        code = _.get(req, ['body', 'code'], ''),
        newPwd = _.get(req, ['body', 'newPwd'], '');
    logger.info(email, code, newPwd);
    if(_.isEmpty(email) || _.isEmpty(code) || _.isEmpty(newPwd)){
        logger.info('necessary info is required');
        res.status(500).send({success: false, errmsg: 'Please check all necessary information is passed'});
    } else {
        Company.findOne({email: email}, function(err1, dbCompany){
            if(err1 || _.isEmpty(dbCompany)){
                logger.info('Error in finding account by email', email, err1);
                res.status(500).send({success: false, errmsg: '无效的验证邮箱'});
            } else {
                if(!_.isUndefined(dbCompany.resetPwdToken) && dbCompany.resetPwdToken !== code){
                    return res.status(500).send({success: false, errmsg: '激活码错误'});
                }
                var currentTimeStamp = Date.now();
                if(!_.isUndefined(dbCompany.resetPwdTokenExpires) && Number.parseInt(dbCompany.resetPwdTokenExpires) < currentTimeStamp){
                    return res.status(500).send({success: false, errmsg: '激活码已过期，请重新获取激活码'});
                }
                Company.update({email: email}, {$set:{password: newPwd, resetPwdTokenExpires: currentTimeStamp}}, {upsert: false}, function(err2, updResult){
                    if(err2) {
                        logger.info('Error in updating company by email', email, err2);
                        res.status(500).send({success: false, errmsg: '更改密码失败'});
                    } else {
                        logger.info('reset password successfully');
                        res.json({success: true, errmsg: ''});
                    }
                });

            }
        });
    }
}

function generateVerificationEmail(email, callback){
    Company.findOne({email: email}, function(err2, data){
        if(err2) return callback(err2, null);
        else {
            crypto.randomBytes(20, function(err3, buf){
                var activeToken = data._id + buf.toString('hex'),
                verificationInfo = {
                    activeToken: activeToken,
                    active: false,
                    activeTokenExpires: Date.now() + 24 * 3600 * 1000
                },
                // verificationLink = 'http://localhost:3000/account/verification?account=' + email + '&activeToken=' + activeToken;
                // verificationLink = 'http://maaaace.nat200.top/account/verification?account=' + email + '&activeToken=' + activeToken;
                verificationLink = 'http://www.mfca.com.cn/account/verification?account=' + email + '&activeToken=' + activeToken;
                var verificationHtmlTemplate = _.get(config, ['emailConfig', 'verificationHtmlTemplate'], '');
                var emailOpt = {
                    from: _.get(config, ['emailConfig', 'adminEmailBanner'], ''),
                    subject: _.get(config, ['emailConfig', 'verificationSubject'], ''),
                    to: email
                };
                var verificationEmailContent = verificationHtmlTemplate.replace(/\[Registered_Email\]/i, email).replace(/\[Verification_Link\]/ig, verificationLink);
                emailOpt.html = verificationEmailContent;
                sendVerificationEmail(emailOpt, function(err4, emailResult){
                    if(err4) {
                        logger.info('Error in sending verification email', err4);
                        return callback('Error in sending verification email', null);
                    } else {
                        Company.update({email: email}, {$set: verificationInfo}, {upsert: false}, function(err5, updResult2){
                            if(err5) {
                                logger.info('Error in update verification info', err5);
                                return callback('Error in update verification info', null);
                            } else {
                                logger.info('update verification info');
                                return callback(null, null);
                            }
                        });
                    }
                })
            });

        }
    });
    
}
