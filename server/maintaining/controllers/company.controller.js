let _ = require('lodash');
var mongoose = require('mongoose');
let Company = mongoose.model('Company');
let Applicant = mongoose.model('Applicant');

exports.companyUserLogin = companyUserLogin;
exports.upsertCompany = upsertCompany;
exports.login = login;

function companyUserLogin(req, res, next){
    let email = _.get(req, ['body', 'account'], ''),
        pwd = _.get(req, ['body', 'pwd'], '');
    if(_.isEmpty(email) || _.isEmpty(pwd)){
        console.log('login id and pwd are required');
        next('login id and pwd are required');
    } else {
        login(email, pwd, function(error, companyItem){
            if(error)
                next(error);
            else {
                let result = {};
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
                let clonedCompany = {
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
        upsertResult.errmsg = 'no email found in req body';
        res.json(upsertResult);
    } else {
        Company.findOne({email: email}, function(error, foundCompany){
            if(error) {
                console.error('Error in finding company by email', email, error);
                upsertResult.errmsg = 'Error in finding company by email';
                res.json(upsertResult);
            } else {
                if(_.isEmpty(foundCompany)){
                    //save
                    if(_.isEmpty(pwd)){
                        console.log('Password is required');
                        upsertResult.errmsg = 'Password is required';
                        res.json(upsertResult);
                    } else {
                        // var companyObj = {
                        //     companyName: companyItem.companyName,
                        //     password: companyItem.password,
                        //     alias: companyItem.alias,
                        //     companyAddress: companyItem.companyAddress,
                        //     companyType: companyItem.companyType,
                        //     companyScale: companyItem.companyScale,
                        //     phoneNumber: companyItem.phoneNumber,
                        //     contactPersonName: companyItem.contactPersonName,
                        //     email: companyItem.email,
                        //     description: companyItem.description,
                        //     positions: companyItem.positions
                        // }
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
                    Company.update({email: email}, {$set: companyItem}, {upsert: false}, function(error, company){
                        if(error) {
                            console.log('Error in updating company', error);
                            upsertResult.errmsg = 'Error in updating company';
                            res.json(upsertResult);
                        } else {
                            upsertResult.success = true;
                            upsertResult.company = company;
                            res.json(upsertResult);
                        }
                    });
                }
            }
        });
    }

}