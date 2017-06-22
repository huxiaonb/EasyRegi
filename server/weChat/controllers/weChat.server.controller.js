'use strict';
var mongoose = require('mongoose');
var CompanyInfoSegment = mongoose.model('CompanyInfoSegment');
var CompanyTemplate = mongoose.model('CompanyTemplate');
var Company = mongoose.model('Company');
var Dictionary = mongoose.model('Dictionary');
var _ = require('lodash');
var request = require('request');
var wechatUtil = require('../utils/wechat.util');
var Applicant = mongoose.model('Applicant');
var fs = require('fs'),
    path = require('path');

exports.companyIndex = function (req, res) {
  Dictionary.find({'category': '公司信息类型'}).then(function (types) {
    CompanyTemplate.find({}).then(function (companyTemplates) {
      var urlMaps = [];
      _.forEach(types, function (type) {
        var companyTemplate = _.find(companyTemplates, {'type': type.value});
        var urlMap = {
          'type': type.value
        };
        if (!_.isEmpty(companyTemplate)) {
          urlMap.url = companyTemplate.url;
        } else {
          urlMap.url = '/weChat/company/'+type.value;
        }
        urlMaps.push(urlMap);
      });
      res.render('server/weChat/views/companyIndex', {'urlMaps':urlMaps});
    });
  });
  /*CompanyTemplate.find({},function(err, companyTemplates){
   var url = {};
   var companyTemplate = _.find(companyTemplates,{'type':'companyIntroduction'});
   if(!_.isEmpty(companyTemplate)){
   url.companyIntroduction = companyTemplate.url;
   }else{
   url.companyIntroduction = '/weChat/company/companyIntroduction';
   }

   companyTemplate = _.find(companyTemplates,{'type':'companyEnvironment'});
   if(!_.isEmpty(companyTemplate)){
   url.companyEnvironment = companyTemplate.url;
   }else{
   url.companyEnvironment = '/weChat/company/companyEnvironment';
   }

   companyTemplate = _.find(companyTemplates,{'type':'companyActivities'});
   if(!_.isEmpty(companyTemplate)){
   url.companyActivities = companyTemplate.url;
   }else{
   url.companyActivities = '/weChat/company/companyActivities';
   }

   companyTemplate = _.find(companyTemplates,{'type':'companyWelfare'});
   if(!_.isEmpty(companyTemplate)){
   url.companyWelfare = companyTemplate.url;
   }else{
   url.companyWelfare = '/weChat/company/companyWelfare';
   }

   companyTemplate = _.find(companyTemplates,{'type':'promotionIntroduction'});
   if(!_.isEmpty(companyTemplate)){
   url.promotionIntroduction = companyTemplate.url;
   }else{
   url.promotionIntroduction = '/weChat/company/promotionIntroduction';
   }

   res.render('server/weChat/views/companyIndex',url);
   });*/
};

exports.companyIntroduction = function (req, res) {
  if (!_.isEmpty(req.params.segmentType)) {
    CompanyInfoSegment.find({'type': req.params.segmentType}, null, {'sort': {'sequence': 1}}, function (err, companyInfoSegments) {
      res.render('server/weChat/views/companyIntroduction', {
        segmentType : req.params.segmentType,
        companyInfoSegments: companyInfoSegments,
        isFlow: _.result(_.first(companyInfoSegments), 'isFlow')
      });
    });
  } else {
    res.status(404).render('server/core/views/404');
  }
};

exports.homePage = function (req, res) {
  console.log('getWechatOpenId');
  console.log(req.query.code);
  if(!req.query.code){
    console.log('no code exist in requset.');
    CompanyTemplate.find({'type': '招聘行程'}, function (err, companyTemplates) {
      res.render('server/weChat/views/homePage', {recruitmentProcessUrl: _.result(_.first(companyTemplates), 'url')});
    });
  } else{
    console.log('wechat code exists');
    request.get({
      url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxf81a6447d41fe23b&secret=16082848595de5763ab6fbc4385047a2&code=' + req.query.code + '&grant_type=authorization_code',
      json: true
    },function(error, response, body){
      if(!error && response.statusCode == 200 && !!body){
        var access_token = body.access_token;
        var openId = body.openid;
        console.log('access_token is:' + access_token);
        console.log('openId is: ' + openId);
        if(!!openId){
          if(!req.session.openId){
            req.session.openId = openId;
          }
        }
        renderHomePage(req, res);
      } else{
        renderHomePage(req, res);
      }
    });
  }
};

function renderHomePage(req, res) {
  CompanyTemplate.find({'type': '招聘行程'}, function (err, companyTemplates) {
    res.render('server/weChat/views/homePage', {recruitmentProcessUrl: _.result(_.first(companyTemplates), 'url')});
  });
}

exports.register = function(req, res) {
  console.log('render register page with open id', _.get(req, ['session', 'openId'], ''));
  res.render('server/weChat/views/register', {openId: _.get(req, ['session', 'openId'], '')});
}

exports.maintainn = function(req, res) {
  res.render('server/weChat/views/index');
}


exports.getOpenIdAndAuthAccessToken = function(req, res, next){
  // return function(req, res, next){
    console.log('getWechatOpenId');
    // req.session.openId = '';
    var wechatCode = _.get(req, ['query', 'code'], '');
    console.log(wechatCode);
    var openId = _.get(req, ['session', 'openId'], '');
    if(!_.isEmpty(openId)){
        console.log('openId exists');
        return next();
    } else if(_.isEmpty(wechatCode)){
        req.session.openId = 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
        //redirect to register page or next page as submit also need check this
        //return next();
        console.log('wechat code does not exist');
        return next();
    } else {
        console.log('wechat code exists');
        wechatUtil.getOpenIdAndAuthAccessTokenByCode(wechatCode, function(error, result){
            if(error) {
                return next();
            } else {
                if(_.isEmpty(_.get(req, ['session', 'openId'], ''))){
                    req.session.openId = _.get(result, ['openId'], '');
                    req.session.accessToken = _.get(result, ['accessToken'], '');
                }
                console.log(req.session.openId, req.session.accessToken);
                return next();
            }
        });
    }
  // }
}

exports.findApplicantByOpenId = function(req, res, next){
  var openId = _.get(req, ['session', 'openId'], '');
  if(_.isEmpty(openId)){
    res.end();
  } else {
    Applicant.find({
      wechatOpenId : openId
    }).then(applicants => {
      res.json(applicants);
    });
  }
}

exports.submitRegisterInformation = function(req, res, next){
  var openId = _.get(req, ['params', 'openId'], '');
  var files = _.get(req, ['files']);
  console.log(openId);
  console.log(files);
  var fileSize = 0;
  var relativePhotoPath = '';
  if(!_.isEmpty(files)
  &&!_.isEmpty(files.file)) {
      fileSize = files.file.size;
      relativePhotoPath = files.file.path;
  }
  console.log(relativePhotoPath, fileSize);
  if (!fileSize) {
    if (relativePhotoPath) {
      try {
        fs.unlink(path.join(process.cwd(), relativePhotoPath))
      } catch(e) {
        console.log(e);
      }
    }
  }
  var separatedPath = relativePhotoPath.split(path.sep);
  var photoName = separatedPath[separatedPath.length - 1];
  // var applicantName = req.body.name;
  // console.log(applicantName);

  // res.end();
  if(_.isEmpty(openId)){
    console.log('no open id');
    return res.end();
  } else {
    console.log('open id exists');
    Applicant.find({wechatOpenId: openId}).then(applicants => {
      console.log(applicants);
      if(!_.isEmpty(applicants)){
        var dbApplicant = applicants[0],
            clonedApplicant = _.clone(req.body);
        if(fileSize !== 0){
          if(!_.isEmpty(_.get(clonedApplicant, ['wechatOpenId'])))
            clonedApplicant.photoName = photoName;
          else {
            clonedApplicant = _.clone(dbApplicant);
            delete clonedApplicant._id;
            clonedApplicant.photoName = photoName;
          }
        }
        var registeredCompanies = _.get(dbApplicant, ['registeredCompanies'], []);
        if(!_.isEmpty(registeredCompanies)){
          clonedApplicant.registeredCompanies = registeredCompanies;
        }

        Applicant.update({wechatOpenId: clonedApplicant.wechatOpenId}, {$set: clonedApplicant}, {upsert: true})
        .exec(function(error, result){
          if(error) {
            console.error('Error in upsert applicant', error);
            return next(error);
          } else {
            console.log('Applicant update successfully for wechat open id', openId);
            res.end();
          }
        });
      } else {
        var clonedApplicant = {
          wechatOpenId: openId
        };
        if(fileSize !== 0){
          clonedApplicant.photoName = photoName;
        }
        var applicantEntity = new Applicant(clonedApplicant);
        applicantEntity.save().then(persistedObj => {
          console.log(persistedObj);
          res.end();
        }).catch(function(error){
          console.error('Error in saving applicant of wechat open id', openId, error);
          return next(error);
        });
      }
    }).catch(function(err){
      console.error('Error in find applicant by wechat open id', openId, err);
      return next(err);
    });
  }
}

exports.renderRegisterCompanyPage = function(req, res){
  var openId = _.get(req, ['session', 'openId'], '');
  if(_.isEmpty(openId)){
    console.log('openId does not exist, cannot access register company page');
    res.end();
  } else {
    Applicant.find({
      wechatOpenId : openId
    }).then(applicants => {
      if(_.isEmpty(applicants)){
        console.log('Applicant does not exist, and need submit personal information for applicant');
        res.render('server/weChat/views/register', {openId: _.get(req, ['session', 'openId'], '')});
      } else {
        console.log('Applicant has already submit personal information');
        res.render('server/weChat/views/company', {openId: _.get(req, ['session', 'openId'], '')});
      }
    });
  }
}

exports.submitRegisterCompany = function(req, res){
  var openId = _.get(req, ['session', 'openId'], ''),
      companyId = _.get(req, ['body', 'companyId'], '');
  var current = new Date();
  if(_.isEmpty(openId)){
    console.log('openId does not exist, cannot submit register company');
    res.end();
  } else if(_.isEmpty(companyId)){
    console.log('companyId does not exist, cannot submit register company');
    res.end();
  } else {
    Applicant.find({
      wechatOpenId : openId
    }).then(applicants => {
      if(_.isEmpty(applicants)){
        console.log('Applicant does not exist, cannot register company');
        res.end();
      } else {
        console.log('applicant exitst, ready to select company');
        var dbApplicant = applicants[0];
        Company.find({_id: companyId}).then(companies => {
          if(!_.isEmpty(companies)){
            var dbCompany = companies[0],
                registeredCompanies = _.get(dbApplicant, ['registeredCompanies'], []),
                dbRegisteredCompany = _.find(registeredCompanies, {'companyId': companyId});
            if(_.isEmpty(dbRegisteredCompany)){
              var registeredCompany = {
                companyName: _.get(dbCompany, ['companyName'], ''),
                companyId: _.get(dbCompany, ['_id'], ''),
                companyAlias: _.get(dbCompany, ['alias'], ''),
                registerDate: current
              };
              registeredCompanies.push(registeredCompany);
              dbApplicant.registeredCompanies = registeredCompanies;
            } else {
              dbRegisteredCompany.companyName = _.get(dbCompany, ['companyName'], '');
              dbRegisteredCompany.companyAlias = _.get(dbCompany, ['alias'], '');
              dbRegisteredCompany.registerDate = current;
            }
            console.log(dbApplicant.registeredCompanies);
            Applicant.update({wechatOpenId : openId}, {$set: {registeredCompanies: dbApplicant.registeredCompanies}}, {upsert: true})
            .exec(function(error, persistedObj){
              if(error) {
                console.log('Error in updating applicant', error);
                res.end();
              } else {
                console.log(persistedObj);
                res.end();
              }
            })


          } else {
            console.log('cannot find company with company id', companyId);
            res.end();
          }
        });
        res.render('server/weChat/views/company', {openId: _.get(req, ['session', 'openId'], '')});
        // res.end();
      }
    }).catch(function(error){
      console.log('Error in finding applicant by open id', openId, error);
      res.end();
    });
  }
}

exports.submitRegisterForm = function(req, res){
  var openId = _.get(req, ['params', 'openId'], '');

  if(_.isEmpty(openId)){
    console.log('open id does not exists');
    res.end();
  } else {
    console.log('open id exists');
    Applicant.find({wechatOpenId: openId}).then(applicants => {
      var clonedApplicant = _.clone(_.get(req, ['body'], {}));
      if(!_.isEmpty(applicants)){
        var dbApplicant = applicants[0];
        if(_.isEmpty(clonedApplicant))
          res.end();
        else {
          if(!_.isEmpty(dbApplicant.photoName) && _.isEmpty(clonedApplicant.photoName))
            clonedApplicant.photoName = dbApplicant.photoName;
          if(!_.isEmpty(dbApplicant.registeredCompanies) && _.isEmpty(clonedApplicant.registeredCompanies))
            clonedApplicant.registeredCompanies = dbApplicant.registeredCompanies;
        }
      }
      Applicant.update({wechatOpenId: clonedApplicant.wechatOpenId}, {$set: clonedApplicant}, {upsert: true})
      .exec(function(error, result){
        if(error) {
          console.error('Error in upsert applicant', error);
          return next(error);
        } else {
          console.log('Applicant update successfully for wechat open id', openId);
          res.end();
        }
      });
    });
  }
}