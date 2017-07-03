var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');
var mongoose = require('mongoose');
var Company = mongoose.model('Company');
var Applicant = mongoose.model('Applicant');

exports.companyUserLogin = companyUserLogin;
exports.upsertCompany = upsertCompany;
exports.getPositionsAndApplicantsNum = getPositionsAndApplicantsNum;
exports.getApplicantsByCompanyId = getApplicantsByCompanyId;
exports.getPositionsByCompanyId = getPositionsByCompanyId;
exports.searchApplicants = searchApplicants;
exports.login = login;

function companyUserLogin(req, res, next){
    var email = _.get(req, ['body', 'account'], ''),
        pwd = _.get(req, ['body', 'pwd'], '');
    if(_.isEmpty(email) || _.isEmpty(pwd)){
        console.log('login id and pwd are required');
        res.status(500).send({error: 'login id and pwd are required'});
    } else {
        login(email, pwd, function(error, companyItem){
            if(error)
                res.status(500).send({error: error});
            else {
                var result = {};
                result.success = false;
                result.company = {};
                if(!_.isEmpty(companyItem)){
                    result.success = true;
                    result.company = companyItem;
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
        res.status(500).send({error: 'no email found in req body'});
    } else {
        Company.findOne({email: email}, function(error, foundCompany){
            if(error) {
                console.error('Error in finding company by email', email, error);
                res.status(500).send({error: 'Error in finding company by email'});
            } else {
                if(_.isEmpty(foundCompany)){
                    //save
                    if(_.isEmpty(pwd)){
                        console.log('Password is required');
                        res.status(500).send({error: 'Password is required'});
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

function getPositionsAndApplicantsNum(req, res, next){
    var countResult = {
        positionNumber: 0,
        applicantNumber: 0
    }
    var companyId = _.get(req, ['params', 'companyId'], '');
    console.log(companyId);
    if(_.isEmpty(companyId)){
        res.status(500).send({error: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllPublishedPositionsByCompanyId(companyId));
        tasks.push(getAllApplicantsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                console.log('Error in getPositionsAndApplicantsNum', companyId, error);
                countResult.errmsg = 'Error in getPositionsAndApplicantsNum' + error;
            } else {
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
        res.status(500).send({error: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllApplicantsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                console.log('Error in finding all applicants by companyId', companyId, error);
                res.json([]);
            } else {
                var applicants = [];
                if(!_.isEmpty(_.get(result, ['0']))){
                    applicants = _.get(result, ['0']);
                }
                res.json(applicants);
            }

        });
    }
}

function getPositionsByCompanyId(req, res, next){
    var companyId = _.get(req, ['params', 'companyId'], '');
    console.log(companyId);
    if(_.isEmpty(companyId)){
        res.status(500).send({error: 'company id is required'});
    } else {
        var tasks = [];
        tasks.push(getAllPublishedPositionsByCompanyId(companyId));
        async.parallel(tasks, function(error, result){
            if(error){
                console.log('Error in finding all positions by companyId', companyId, error);
                res.json([]);
            } else {
                var positions = [];
                if(!_.isEmpty(_.get(result, ['0']))){
                    positions = _.get(result, ['0']);
                }
                res.json(positions);
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
        res.status(500).send({error: 'company id is required'});
    } else {
        var queryCriteria = {$and: []};
        queryCriteria.$and.push({'registeredCompanies.companyId': companyId});
        
        if(!_.isEmpty(applicantName))
            queryCriteria.$and.push({'name': applicantName});
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
                res.json([]);
            } else {
                console.log(applicants);
                res.json(applicants);
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