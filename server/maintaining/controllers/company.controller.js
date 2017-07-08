var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');
var mongoose = require('mongoose');
var Company = mongoose.model('Company');
var Applicant = mongoose.model('Applicant');
var Session = mongoose.model('Session');
var Position = mongoose.model('Position');

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

function companyUserLogin(req, res, next){
    var email = _.get(req, ['body', 'account'], ''),
        pwd = _.get(req, ['body', 'pwd'], '');
    if(_.isEmpty(email) || _.isEmpty(pwd)){
        console.log('login id and pwd are required');
        res.status(500).send({success: false, errmsg: 'login id and pwd are required'});
    } else {
        login(email, pwd, function(error, companyItem){
            if(error)
                res.status(500).send({success: false, errmsg: error});
            else {
                res.header('Access-Control-Expose-Headers', 'access-token');
                var result = {};
                result.success = false;
                result.errmsg = '';
                result.company = {};
                if(!_.isEmpty(companyItem)){
                    result.success = true;
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
                }
                res.json(result);
            }
        })
    }
}

function login(email, pwd, callback){
    Company.findOne({email: email, password: pwd}, function(error, companyItem){
        if(error) {
            console.error('Error in finding company by login id: %s %s', email, error);
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
                    positions: companyItem.positions
                };
                
                
                console.log(clonedCompany);
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
            console.log('Error in finding session', sesErr);
            res.status(500).send({success: false, errmsg: 'Error in finding session'});
        } else {
            if(_.isEmpty(sessionItem)){
                res.status(500).send({success: false, errmsg: 'no session found by access-token', company: {}});
            } else {
                var session = JSON.parse(_.get(sessionItem, ['session']), '{}');
                var companyInfoStr = _.get(session, ['companyInfo'], '{}');
                var companyInfo = JSON.parse(companyInfoStr);
                if(_.isEmpty(companyInfo)){
                    console.log('not login');
                    res.render('server/weChat/views/index');
                } else {
                    var expiresDateStr = _.get(companyInfo, ['expires'], ''),
                        companyId = _.get(companyInfo, ['companyId'], '');
                    var expiresDate = new Date(expiresDateStr),
                        current = new Date();
                    if(current.getTime() > expiresDate.getTime()){
                        console.log('login session expires, please login again');
                        res.render('server/weChat/views/index');
                    } else {
                        if(_.isEmpty(companyId)){
                            res.status(500).send({success: false, errmsg: 'no company id found in session'});
                        } else {
                            Company.findOne({_id: companyId}, function(error, companyItem){
                                if(error) {
                                    console.log('Error in getCompanyInfo', error);
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
    console.log(companyItem);
    if(_.isEmpty(email)){
        console.error('no email found in req body');
        res.status(500).send({success: false, errmsg: 'no email found in req body'});
    } else {
        Company.findOne({email: email}, function(error, foundCompany){
            if(error) {
                console.error('Error in finding company by email', email, error);
                res.status(500).send({success: false, errmsg: 'Error in finding company by email'});
            } else {
                if(_.isEmpty(foundCompany)){
                    //save
                    if(_.isEmpty(pwd)){
                        console.log('Password is required');
                        res.status(500).send({success: false, errmsg: 'Password is required'});
                    } else {
                        var companyEntity = new Company(companyItem);
                        console.log(companyEntity)
                        companyEntity.save(function(error, data){
                            if(error) {
                                console.log('Error in saving company', error)
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
                            console.log('Error in updating company', error);
                            upsertResult.errmsg = 'Error in updating company';
                            res.json(upsertResult);
                        } else {
                            Company.findOne({email: email}, function(err, updatedCompany){
                                if(err) {
                                    console.log('Error in finding company', err);
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
        console.error('no email found in req body');
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
            description: _.get(companyItem, ['description'], ''),
            positions: _.get(companyItem, ['positions'], []),
        };
        Company.update({email: email}, {$set: companyEntity}, {upsert: false}, function(err1, updateResult){
            if(err1) {
                console.log('Error in updating company', email, err1);
                res.status(500).send({success: false, errmsg: 'Error in updating company'});
            } else {
                Company.findOne({email: email}, function(err2, dbCompany){
                    if(err2){
                        console.log('Error in finding company', email, err1);
                        res.status(500).send({success: false, errmsg: 'Error in finding company'});
                    } else if(_.isEmpty(dbCompany)){
                        console.log('company for %s does not exists', email);
                        res.status(500).send({success: false, errmsg: 'company does not exists'});
                    } else {
                        dbCompany.password = '';
                        res.status(200).send({success: true, errmsg: '', company: dbCompany});
                    }
                });
            }
        });
    }
}

function registerCompany(req, res, next){
    var companyItem = _.get(req, ['body'], {}),
        email = _.get(req, ['body', 'email'], ''),
        pwd = _.get(req, ['body', 'password'], '');
    if(_.isEmpty(email) || _.isEmpty(pwd)){
        res.status(500).send({success: false, errmsg: 'email and password are required'});
    } else {
        Company.findOne({email: email}, function(err1, dbCompany){
            if(err1) {
                console.log('Error in finding company by email', email, err1);
                res.status(500).send({success: false, errmsg: 'Error in find company by company email'});
            } else if(_.isEmpty(dbCompany)){
                console.log('no comany found, system will create new account for company');
                var companyEntity = new Company(companyItem);
                console.log(companyEntity);
                companyEntity.save(function(error, data){
                    if(error || _.isEmpty(data)) {
                        console.log('Error in saving company', error)
                        res.status(500).send({success: false, errmsg: 'Error in saving company'});
                    } else {
                        data.password = '';
                        var result = {
                            success: true,
                            errmsg: '',
                            company: data
                        };
                        res.json(result);
                    }
                });
            } else {
                console.log('Company already exists');
                res.status(500).send({success: false, errmsg: 'email has been registered'});
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
                console.log('error in finding company by email', email, err1);
                res.status(500).send({success: false, errmsg: 'Error in finding company by company email'});
            } else if(_.isEmpty(dbCompany)){
                console.log('email or password is not correct');
                res.status(500).send({success: false, errmsg: 'email or password is not correct'});
            } else {
                Company.update({email: email, password: oldPwd}, {$set: {password: newPwd}}, {upsert: false}, function(err2, updateResult){
                    if(err2){
                        console.log('Error in updating password for company', email, err2);
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
    console.log(companyId);
    if(_.isEmpty(companyId)){
        countResult.errmsg = 'company id is required';
        res.status(500).send(countResult);
    } else {
        var tasks = [];
        tasks.push(getAllPublishedPositionsByCompanyId(companyId));
        tasks.push(getAllApplicantsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                console.log('Error in getPositionsAndApplicantsNum', companyId, error);
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
    console.log(companyId);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllApplicantsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                console.log('Error in finding all applicants by companyId', companyId, error);
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
    console.log(companyId);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllPublishedPositionsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                console.log('Error in finding all positions by companyId', companyId, error);
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
    console.log(companyId, applicantName, startedAt, endedAt);
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
            console.log(startDate);
            if(_.isDate(startDate))
                queryCriteria.$and.push({'registeredCompanies.registerDate':{$gt: startDate}});
        }

        if(!_.isEmpty(endedAt)){
            var endDateStr = endedAt + ' 23:59:59.999';
            var endDate = new Date(endDateStr);
            console.log(endDate);
            if(_.isDate(endDate))
                queryCriteria.$and.push({'registeredCompanies.registerDate':{$lt: endDate}});
        }

        Applicant.find(queryCriteria, function(error, applicants){
            if(error) {
                console.log('Error in finding applicants', error);
                res.status(500).send({success: false, errmsg: 'Error in finding applicants', applicants: []});
            } else {
                console.log(applicants);
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
        console.log('company id is required');
        res.status(500).send({success: false, errmsg: 'company id is required', position: {}});
    } else {
        if(_.isEmpty(positionObj)){
            console.log('position object is empty');
            res.status(500).send({success: false, errmsg: 'position object is empty', position: {}});
        } else {
            Company.findOne({_id: companyId}, function(error, dbCompany){
                if(error) {
                    console.log('Error in finding company by id', companyId, error);
                    res.status(500).send({success: false, errmsg: 'Error in finding company by id', position: {}});
                } else if(_.isEmpty(dbCompany)){
                    console.log('no company found by id');
                    res.status(500).send({success: false, errmsg: 'no company found by id', position: {}});
                } else {
                    var positionItem = {
                        name: _.get(positionObj, ['name'], ''),
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
                            console.log('Error in saving position', saveErr);
                            res.status(500).send({success: false, errmsg: 'Error in saving position', position: {}});
                        } else {
                            var _id = _.get(persistedObj, ['_id'], ''),
                                positionName = _.get(persistedObj, ['name'], '');
                            if(_.isEmpty(_id)){
                                console.log('Failed in saving position');
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
                                        console.log('Error in updating company', err);
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
    console.log(companyId, positionName, startedAt, endedAt);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required', positions: []});
    } else {
        Company.findOne({_id: companyId}, function(error, dbCompany){
            if(error || _.isEmpty(dbCompany)){
                console.log('Error in finding company by id', companyId, error);
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
                        console.log(startDate);
                        if(_.isDate(startDate))
                            queryCriteria.$and.push({'createdAt':{$gt: startDate}});
                    }

                    if(!_.isEmpty(endedAt)){
                        var endDateStr = endedAt + ' 23:59:59.999';
                        var endDate = new Date(endDateStr);
                        console.log(endDate);
                        if(_.isDate(endDate))
                            queryCriteria.$and.push({'createdAt':{$lt: endDate}});
                    }

                    Position.find(queryCriteria, function(err, positionItems){
                         if(err) {
                            console.log('Error in finding positions', err);
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
                console.log('Error in finding company by id', companyId, error);
                res.status(500).send({success: false, errmsg: 'Error in finding company', positions: []});
            } else {
                var dbPositions = _.get(dbCompany, ['positions'], []);
                var newPositions = dbPositions.filter(function(pos){
                    return pos.positionId !== positionId;
                });
                Company.update({_id: companyId}, {$set: {positions: newPositions}}, {upsert: false}, function(err, result){
                    if(err) {
                        console.log('Error in updating company positions for company id', companyId, err);
                        res.status(500).send({success: false, errmsg: 'Error in updating company positions', positions: []});
                    } else {
                        Position.remove({_id: positionId}, function(removeErr, removeResult){
                            if(removeErr){
                                console.log('Error in removing position for id', positionId, removeErr);
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
                console.error('Error in update company position', error);
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
            console.log('no position id found, cannot update position');
            return callback(null, null);
        } else {
            Position.update({_id: positionId}, {$set: positionEntity}, {upsert: false}, function(error, updateResult){
                if(error){
                    console.log('Error in updating position', error);
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
            console.log('no position id or companyId found for update position under company');
            return callback(null, null)
        } else {
            Company.findOne({_id: companyId}, function(err1, dbCompany){
                if(err1 || _.isEmpty(dbCompany)){
                    console.log('Error in finding dbcompany by company id', companyId, err1)
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
                                console.log('Error in updating positions under company for id', companyId, err2);
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