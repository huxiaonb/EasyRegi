'use strict';
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');
var mongoose = require('mongoose');
var Company = mongoose.model('Company');
var _ = require('lodash');
var request = require('request');
var wechatUtil = require('../utils/wechat.util');
var Applicant = mongoose.model('Applicant');
var Position = mongoose.model('Position');
var parseString = require('xml2js').parseString;
var moment = require('moment');
var EmailUtil = require('../../maintaining/utils/email.util.js');
var fs = require('fs'),
    path = require('path');

exports.getAllCompanyNames = getAllCompanyNames;


exports.basicInfo = function(req, res) {
  logger.info('render basic info page with open id', _.get(req, ['session', 'openId'], ''));
  res.render('server/weChat/views/basic', {openId: _.get(req, ['session', 'openId'], '')});
}

exports.saveBasicInfo = function(req, res) {
    req.session.openId = 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
    var openId = _.get(req, ['session', 'openId'], ''),
        clonedApplicant = _.clone(_.get(req, ['body'], {}));
    if(_.isEmpty(openId)){
        logger.info('open id does not exist');
        res.status(500).send({success: false, errmsg: '保存失败'});
    } else if (_.isEmpty(clonedApplicant)){
        logger.info('req body is empty');
        res.status(500).send({success: false, errmsg: '保存失败'});
    } else {
        Applicant.find({wechatOpenId: openId}).then(applicants => {
            if(_.isEmpty(applicants)){
                clonedApplicant.wechatOpenId = openId;
            }
            Applicant.update({wechatOpenId: openId}, {$set: clonedApplicant}, {upsert: true})
            .exec(function(error, result){
                if(error) {
                    logger.error('Error in updating basic information', type, error);
                    res.status(500).send({success: false, errmsg: '保存失败'});
                } else {
                    logger.info('Updating basic information successfully for wechat open id %s', openId);
                    res.json({success: true, message: '保存成功'});
                }
            });
        }).catch(e => {
            logger.error('Error in finding applicant by openId', openId, e);
            res.status(500).send({success: false, errmsg: '查找用户出错'});
        });
    }
}

exports.register = function(req, res) {
  logger.info('render register page with open id', _.get(req, ['session', 'openId'], ''));
  res.render('server/weChat/views/register', {openId: _.get(req, ['session', 'openId'], '')});
}

exports.maintain = function(req, res) {
  res.render('server/weChat/views/index');
}

exports.positions = function(req, res) {
  res.render('server/weChat/views/positions');
}

exports.checkIfNeedPay = function(req, res){
    var openId = _.get(req, ['body', 'openId'], ''),
        selectCompanyId = _.get(req, ['body', 'selectCompanyId', '0']);
    logger.info('check if need pay', openId, selectCompanyId);
    if(_.isEmpty(openId) || _.isEmpty(selectCompanyId)){
        console.log('缺少所需参数');
        res.json({success: false, errmsg: '缺少所需参数'});
    } else {
        Applicant.find({
            wechatOpenId : openId
        }).then(applicants => {
            console.log(JSON.stringify(applicants));
            if(_.isEmpty(applicants)){
                res.status(500).send({success: false, errmsg: '查找用户出错'});
            } else {
                var applicant = _.get(applicants, ['0'], {}),
                    registeredCops = _.get(applicant, ['registeredCompanies'], []),
                    cop = _.find(registeredCops, {'companyId': selectCompanyId});
                if(_.isEmpty(cop)){
                    console.log('not registered, need pay.');
                    res.json({success: true, needPay: true});
                } else {
                    var paymentDate = _.get(cop, ['paymentDate']);
                    if(_.isUndefined(paymentDate) || !_.isDate(paymentDate)){
                        console.log('payment date does not exist, need pay');
                        res.json({success: true, needPay: true});
                    } else {
                        var current = new Date(),
                            payDate = new Date(paymentDate);
                        if (current.getTime() - payDate.getTime() > 1000 * 60 * 60 * 24 * 30){
                            res.json({success: true, needPay: true});
                        } else {
                            res.json({success: true, needPay: false});
                        }
                    }
                }
            }
        }).catch(e => {
            logger.error('Error in finding applicant by openId', openId, e);
            res.status(500).send({success: false, errmsg: '查找用户出错'});
        });
    }
}

exports.createUnifiedOrder = function(req, res) {
//1.统一下单API 中  trade_type 默认为Native 用于源生扫码支付  公众号网页调用要使用JSAPI 并传openid
//2.前端吊起支付需要后端生成好timeStamp并重新用md5加密为paySign返回给前端  timeStamp只能是10位  超过报错
  var opts = {
      appid: 'wx54e94ab2ab199342',
      body : '办理入职手续',
      mch_id: '1481782312',
      nonce_str: wechatUtil.generateNonceString(),
      notify_url: 'http://www.mfca.com.cn/registerCompany/',
      openid : _.get(req, ['session', 'openId'], ''),
      out_trade_no :  Date.now().toString() + Math.random().toString().substr(2, 10),
      product_id: 'AA1234567890',
      spbill_create_ip : '39.108.136.90',
      total_fee : 100,
      trade_type: 'JSAPI',
  }
  opts.sign = wechatUtil.sign(opts);
  //logger.info(wechatUtil.buildXML(opts));
  //logger.info(opts);
  request({
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		method: 'POST',
		body: wechatUtil.buildXML(opts),
	}, function(err, response, body){
      // logger.info('-----------1-------------');
      // logger.info(err);
      // logger.info('-----------2-------------');
      //logger.info(response);
      // logger.info('-----------3-------------');
      // logger.info(body);
      // logger.info('-----------4-------------');
      parseString(body,{ trim:true, explicitArray:false, explicitRoot:false }, function (err, result) {
        if(err){
          logger.info(err);
          res.send(err).end()
        }else if(result.return_code === 'SUCCESS'){
          //logger.info(result);
          let objtoSign = {
            appId: result. appid,
            nonceStr:result.nonce_str,
            package:"prepay_id=" + result.prepay_id, 
            signType:'MD5',
            timeStamp:Date.now().toString().substr(0,10)
          }
          result.paySign = wechatUtil.sign(objtoSign);
          result.timeStamp = objtoSign.timeStamp;
          res.json(result);
        }
      });
		  
      // logger.info(fn)
      // if(fn.return_code === 'SUCCESS'){
      //   res.json(fn);
      // }
	});
}


exports.getOpenIdAndAuthAccessToken = function(req, res, next){
  // return function(req, res, next){
    // req.session.openId = '';
    var wechatCode = _.get(req, ['query', 'code'], '');
    logger.info('getWechatOpenId', wechatCode, req.sessionID);
    var openId = _.get(req, ['session', 'openId'], '');
    if(!_.isEmpty(openId)){
        logger.info('openId exists');
        return next();
    } else {
        if(_.isEmpty(wechatCode)){
            // req.session.openId = 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
            //redirect to register page or next page as submit also need check this
            //return next();
            logger.info('wechat code does not exist');
            return next();
        } else {
            logger.info('wechat code exists');
            wechatUtil.getOpenIdAndAuthAccessTokenByCode(wechatCode, function(error, result){
                if(error) {
                    return next();
                } else {
                    if(_.isEmpty(_.get(req, ['session', 'openId'], ''))){
                        req.session.openId = _.get(result, ['openId'], '');
                        req.session.accessToken = _.get(result, ['accessToken'], '');
                    }
                    logger.info(req.session.openId, req.session.accessToken);
                    return next();
                }
            });
        }
    }
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
  var openId = _.get(req, ['query', 'id'], ''),
      type = _.get(req, ['query', 'type'], '');
  var files = _.get(req, ['files']);
  logger.info('----111111---');
  //logger.info(req);
  logger.info(type);
  logger.info(files);
  logger.info('-------');
        //logger.info('-------');
  var fileSize = 0;
  var relativePhotoPath = '';
  if(!_.isEmpty(files)
  &&!_.isEmpty(files.file)) {
      fileSize = files.file.size;
      relativePhotoPath = files.file.path;
  }
  logger.info(relativePhotoPath, fileSize);
  if (!fileSize) {
    if (relativePhotoPath) {
      try {
        fs.unlink(path.join(process.cwd(), relativePhotoPath))
      } catch(e) {
        logger.info(e);
      }
    }
  }
  var separatedPath = relativePhotoPath.split(path.sep);
  var photoName = separatedPath[separatedPath.length - 1];
  // var applicantName = req.body.name;
  // logger.info(applicantName);

  // res.end();
  if(_.isEmpty(openId) || _.isEmpty(type)){
    logger.info('no open id or type');
    return res.end();
  } else {
    logger.info('open id exists');
    Applicant.find({wechatOpenId: openId}).then(applicants => {
      logger.info(applicants);
      if(!_.isEmpty(applicants)){
        var dbApplicant = applicants[0],
            clonedApplicant = _.clone(req.body);
        if(fileSize !== 0){
          if(_.isEmpty(_.get(clonedApplicant, ['wechatOpenId']))){
            clonedApplicant = _.clone(dbApplicant);
            delete clonedApplicant._id;
          }
          if(type == 'photo')
            clonedApplicant.photoName = photoName;
          else if(type == 'idfront')
            clonedApplicant.idCardFrontPhotoName = photoName;
          else if(type == 'idback')
            clonedApplicant.idCardBackPhotoName = photoName;
          else if(type == 'other')
            clonedApplicant.otherCredentialPhotoName = photoName;
      }
        var registeredCompanies = _.get(dbApplicant, ['registeredCompanies'], []);
        if(!_.isEmpty(registeredCompanies)){
          clonedApplicant.registeredCompanies = registeredCompanies;
        }
        logger.info('--111--');
        logger.info(clonedApplicant);
        logger.info('--111--');
        Applicant.update({wechatOpenId: clonedApplicant.wechatOpenId}, {$set: clonedApplicant}, {upsert: true})
        .exec(function(error, result){
          if(error) {
            logger.error('Error in upsert applicant', error);
            return next(error);
          } else {
            logger.info('Applicant update successfully for wechat open id', openId);
            res.end();
          }
        });
      } else {
        var clonedApplicant = {
          wechatOpenId: openId
        };
        if(fileSize !== 0){
            if(type == 'photo')
                clonedApplicant.photoName = photoName;
            else if(type == 'idfront')
                clonedApplicant.idCardFrontPhotoName = photoName;
            else if(type == 'idback')
                clonedApplicant.idCardBackPhotoName = photoName;
            else if(type == 'other')
                clonedApplicant.otherCredentialPhotoName = photoName;
        }
        Applicant.update({wechatOpenId: clonedApplicant.wechatOpenId}, {$set: clonedApplicant}, {upsert: true})
        .exec(function(error, result){
            if(error) {
                logger.error('Error in uploading photo type', type, error);
                return next(error);
            } else {
                logger.info('Uploading photo type %s successfully for wechat open id %s', type,openId);
                res.end();
            }
        });
      }
    }).catch(function(err){
      logger.error('Error in find applicant by wechat open id', openId, err);
      return next(err);
    });
  }
}

exports.renderRegisterCompanyPage = function(req, res){
  var openId = _.get(req, ['session', 'openId'], '');
  if(_.isEmpty(openId)){
    logger.info('openId does not exist, cannot access register company page');
    res.end();
  } else {
    Applicant.find({
      wechatOpenId : openId
    }).then(applicants => {
      if(_.isEmpty(applicants)){
        logger.info('Applicant does not exist, and need submit personal information for applicant');
        res.render('server/weChat/views/register', {openId: _.get(req, ['session', 'openId'], '')});
      } else {
        logger.info('Applicant has already submit personal information');
        res.render('server/weChat/views/company', {openId: _.get(req, ['session', 'openId'], '')});
      }
    });
  }
}

exports.submitRegisterCompany = function(req, res){
  var openId = _.get(req, ['session', 'openId'], ''),
      companyId = _.get(req, ['body', 'companyId', '0'], ''),
      payDate = _.get(req, ['body', 'payDate']);
  var current = new Date();
  console.log('payDate:', payDate);
  if(_.isEmpty(openId)){
    //logger.info('openId does not exist, cannot submit register company');
    res.status(500).send({success: false, errmsg: '用户代码为空'});
  } else if(_.isEmpty(companyId)){
    //logger.info('companyId does not exist, cannot submit register company');
    res.status(500).send({success: false, errmsg: '公司代码为空'});
  } else {
    Applicant.find({
      wechatOpenId : openId
    }).then(applicants => {
      if(_.isEmpty(applicants)){
        //logger.info('Applicant does not exist, cannot register company');
        res.status(500).send({success: false, errmsg: '用户不存在，不能提交简历'});
      } else {
        //logger.info('applicant exitst, ready to select company');
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
              if(!_.isEmpty(payDate)){
                  registeredCompany.paymentDate = new Date(payDate);
              }
              registeredCompanies.push(registeredCompany);
              dbApplicant.registeredCompanies = registeredCompanies;
            } else {
              dbRegisteredCompany.companyName = _.get(dbCompany, ['companyName'], '');
              dbRegisteredCompany.companyAlias = _.get(dbCompany, ['alias'], '');
              dbRegisteredCompany.registerDate = current;
              if(!_.isEmpty(payDate)){
                  dbRegisteredCompany.paymentDate = new Date(payDate);
              }
            }
            logger.info(JSON.stringify(dbApplicant.registeredCompanies));
            Applicant.update({wechatOpenId : openId}, {$set: {registeredCompanies: dbApplicant.registeredCompanies}}, {upsert: true})
            .exec(function(error, persistedObj){
              if(error) {
                //logger.info('Error in updating applicant', error);
                res.status(500).send({success: false, errmsg: '更新用户提交简历到公司失败'});
              } else {
                //logger.info(persistedObj);
                sendNotificationEmail(dbCompany, function(emailErr, sendEmailResult){
                    if(emailErr) {
                        logger.info('Error in sending notification email', email, emailErr);
                    } else {
                        logger.info('send notification email successfully');
                    }
                    res.json({success: true, registeredCompanies: dbApplicant.registeredCompanies});
                });
              }
            })


          } else {
            //logger.info('cannot find company with company id', companyId);
            res.status(500).send({success: false, errmsg: '找不到指定公司'});
          }
        });
      }
    }).catch(function(error){
        logger.info('Error in finding applicant by open id', openId, error);
        res.status(500).send({success: false, errmsg: '查找用户出现错误'});
    });
  }
}

function sendNotificationEmail(dbCompany, callback){
    if(_.isEmpty(dbCompany)){
        return callback('company is empty', null);
    }
    var adminEmailBanner = _.get(config, ['emailConfig', 'adminEmailBanner'], ''),
        companyEmail = _.get(dbCompany, ['email'], ''),
        companyPassword = _.get(dbCompany, ['password'], ''),
        domainUrl = _.get(config, ['domainUrl'], ''),
        notificationSubject = _.get(config, ['emailConfig', 'applyPositionNotificationSubject'], ''),
        notificationHtmlTemplate = _.get(config, ['emailConfig', 'applyPositionNotificationHtmlTemplate'], ''),
        dateStr = moment().format('YYYY年MM月DD日');
    var notificationEmailContent = notificationHtmlTemplate.replace(/\[Domain_Url\]/ig, domainUrl).replace(/\[Login_Username\]/i, companyEmail).replace(/\[Login_Password\]/i, companyPassword).replace(/\[Date_Str\]/i, dateStr);
    var emailOpt = {
        from: adminEmailBanner,
        subject: notificationSubject,
        to: companyEmail,
        html: notificationEmailContent
    };
    EmailUtil.sendEmail(emailOpt, function(error, info){
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

exports.submitRegisterForm = function(req, res){
  var openId = _.get(req, ['params', 'openId'], '');

  if(_.isEmpty(openId)){
    logger.info('open id does not exists');
    res.end();
  } else {
    logger.info('open id exists');
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
          logger.error('Error in upsert applicant', error);
          return next(error);
        } else {
          logger.info('Applicant update successfully for wechat open id', openId);
          res.end();
        }
      });
    });
  }
}

function getAllCompanyNames(req, res, next){
    Company.find({}, function(error, companies){
      if(error) {
        logger.error('Error in finding company names', error);
        res.end();
      } else {
        var companyNames = [];
        if(!_.isEmpty(companies)){
          _.forEach(companies, function(company){
            var _id = _.get(company, ['_id'], ''),
                alias = _.get(company, ['alias'], '');
            if(!_.isEmpty(_id) && !_.isEmpty(alias)){
              var nameObj = {
                label: alias,
                value: _id
              }
              companyNames.push(nameObj);
            }
          });
        }
        res.json(companyNames); 
      }
    });

}

function getShortDistance(lon1, lat1, lon2, lat2) {
        var DEF_PI = 3.14159265359; // PI
        var DEF_2PI = 6.28318530712; // 2*PI
        var DEF_PI180 = 0.01745329252; // PI/180.0
        var DEF_R = 6370693.5; // radius of earth
        var ew1, ns1, ew2, ns2;
        var dx, dy, dew;
        var distance;
        // 角度转换为弧度
        ew1 = lon1 * DEF_PI180;
        ns1 = lat1 * DEF_PI180;
        ew2 = lon2 * DEF_PI180;
        ns2 = lat2 * DEF_PI180;
        // 经度差
        dew = ew1 - ew2;
        // 若跨东经和西经180 度，进行调整
        if (dew > DEF_PI)
            dew = DEF_2PI - dew;
        else if (dew < -DEF_PI)
            dew = DEF_2PI + dew;
        dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
        dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
        // 勾股定理求斜边长
        distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
        // logger.info('----------1-----------');
        // logger.info(distance);
        // logger.info('---------2------------');
        return distance;
    }

exports.findNearbyPositions = function(req, res, next){
  // var addr = _.get(req, ['params', 'addressReg'], '');
  var locationInfo = _.get(req, ['body']);
  let addrArr = [], addr = '', latLngStr = '';
  if(locationInfo != null && locationInfo != undefined){
      if(locationInfo.province != null && locationInfo.province != undefined && locationInfo.province != '')
          addrArr.push(locationInfo.province);
      if(locationInfo.city != null && locationInfo.city != undefined && locationInfo.city != '')
          addrArr.push(locationInfo.city);
      // if(info.district != null && info.district != undefined && info.district != '')
      //     addrArr.push(info.district);
      if(locationInfo.lat != undefined && locationInfo.lng != undefined){
        latLngStr = locationInfo.lat + ',' + locationInfo.lng;
      }
  }
  addr = addrArr.join(',');
  logger.info(locationInfo);
  logger.info(latLngStr);
  logger.info(addr);
  if(_.isEmpty(addr)){
    Position.find({}, function(err, dbPositions){
      if(err) {
        logger.info('Error in getting positions', err);
        res.status(500).send({success: false, errmsg: '获取职位信息失败'});
      } else {
        res.json({success: true, positions: dbPositions});
      }
    });
  } else {
    Company.find({companyAddress:{$regex:addr}}, function(err1, dbCompanies){
        // logger.info('----------3-----------');
        // logger.info(dbCompanies);
        // logger.info('----------3-----------');
      if(err1) {
        logger.info('Error in getting company by address reg', err1);
        res.status(500).send({success: false, errmsg: '获取职位信息失败'});
      } else if(_.isEmpty(dbCompanies)) {
        logger.info('no companies found in that area');
        res.json({success: true, positions: []});
      } else {
        // logger.info(JSON.stringify(dbCompanies));
        var ids = [];
        var latLngArr = [];
        var latLngDistances = [];
        var _this = this;
        _.forEach(dbCompanies, function(cop){
          if(!_.isEmpty(cop) && !_.isEmpty(cop._id))
            ids.push(cop._id);
            // logger.info(cop._id);
          if(!_.isEmpty(_.get(cop, ['lat'])) && !_.isEmpty(_.get(cop, ['lng']))){
            latLngArr.push(_.get(cop, ['lat']) + ',' + _.get(cop, ['lng']));
            latLngDistances.push(parseInt(getShortDistance(locationInfo.lng,locationInfo.lat,_.get(cop, ['lng']),_.get(cop, ['lat'])))/1000);
          }
        });
        // logger.info('---------------------');
        // logger.info(latLngDistances);
        // logger.info('---------------------');
        
        logger.info(ids);
        logger.info(latLngArr);
        //getDistanceBetweenUserAndCompanies(latLngStr, latLngArr, function(err3, latLngDistances){
          Position.find({companyId:{$in:ids}}, function(err2, dbPositions){
              if(err2) {
                  logger.info('Error in finding positions per id', err2);
                  res.status(500).send({success: false, errmsg: '获取职位信息失败'});
              } else {
               
                  if(!_.isEmpty(dbPositions)){
                      var positionGroup = _.groupBy(dbPositions, 'companyId');
                      var sortedPositions = [],
                          unsortPositions = [];
                      _.forEach(latLngArr, function(latLntString, index){
                        var arr = latLntString.split(',');
                        var cop = _.find(dbCompanies, {'lat': arr[0], 'lng': arr[1]});
                        // logger.info(arr[0], arr[1], index, cop);
                        if(!_.isEmpty(cop)){
                            var copPositions = positionGroup[cop._id];
                            var tempPositions = [];
                            _.forEach(copPositions, function(posi){
                              
                              //let clonePosi = _.cloneDeep(posi);
                              let ageRangeStart = posi.ageRangeStart || '',
                                ageRangeEnd = posi.ageRangeEnd || '',
                                salaryStart = posi.salaryStart || '',
                                salaryEnd = posi.salaryEnd || '',
                                ageRange = '',
                                salaryRange = '';
                              if(!_.isEmpty(ageRangeStart) && !_.isEmpty(ageRangeEnd)) {
                                  ageRange = ageRangeStart + '~' + ageRangeEnd;
                              }
                              if(!_.isEmpty(salaryStart) && !_.isEmpty(salaryEnd)) {
                                  salaryRange = salaryStart + '~' + salaryEnd;
                              }
                              let clonePosi = {
                                name : posi.name,
                                ageRange : ageRange,
                                contactPerson : posi.contactPerson,
                                totalRecruiters : posi.totalRecruiters,
                                salary : salaryRange,
                                welfares : posi.welfares,
                                positionDesc : posi.positionDesc,
                                _id : posi._id,
                                companyId : posi.companyId,
                                phoneNumber : posi.phoneNumber,
                                companyName:cop.companyName,
                                alias:cop.alias,
                                distance:Math.floor(latLngDistances[index]),
                              };
                              var addr = _.get(cop, ['companyAddress'], ''),
                                   addrArr = addr.split(',');
                                clonePosi.city = findCompanyLocatedCity(addrArr);

                                //let clonePosi = Object.assign({},posi,{companyName : cop.alias, distance : latLngDistances[index]});
                                tempPositions.push(clonePosi);
                                // logger.info(cop.companyName, latLngDistances[index].distance, latLngDistances[index].duration, clonePosi);
                            });
                            sortedPositions = _.concat(sortedPositions, tempPositions);
                        }
                      });
                      _.forEach(dbCompanies, function(cop){
                        var copPositions = positionGroup[cop._id];
                        var tempPositions = [];
                        if(_.isEmpty(cop.lat) || _.isEmpty(cop.lng)){
                          _.forEach(copPositions, function(posi){
                              let ageRangeStart = posi.ageRangeStart || '',
                                  ageRangeEnd = posi.ageRangeEnd || '',
                                  salaryStart = posi.salaryStart || '',
                                  salaryEnd = posi.salaryEnd || '',
                                  ageRange = '',
                                  salaryRange = '';
                              if(!_.isEmpty(ageRangeStart) && !_.isEmpty(ageRangeEnd)) {
                                  ageRange = ageRangeStart + '~' + ageRangeEnd;
                              }
                              if(!_.isEmpty(salaryStart) && !_.isEmpty(salaryEnd)) {
                                  salaryRange = salaryStart + '~' + salaryEnd;
                              }
                              let clonePosi = {
                                  name : posi.name,
                                  contactPerson : posi.contactPerson,
                                  totalRecruiters : posi.totalRecruiters,
                                  ageRange : ageRange,
                                  salary : salaryRange,
                                  welfares : posi.welfares,
                                  positionDesc : posi.positionDesc,
                                  _id : posi._id,
                                  companyId : posi.companyId,
                                  phoneNumber : posi.phoneNumber,
                                  companyName:cop.companyName,
                                  alias:cop.alias,
                                  distance: '-'
                                  //no distance
                                };
                              var addr = _.get(cop, ['companyAddress'], ''),
                                  addrArr = addr.split(',');
                              clonePosi.city = findCompanyLocatedCity(addrArr);
                              // let clonePosi = _.clone(posi);
                              // clonePosi.companyName = cop.alias;
                              tempPositions.push(clonePosi);
                          });
                          unsortPositions = _.concat(unsortPositions, tempPositions);
                        }

                      });

                      sortedPositions.sort(function(b, c){
                        return b.distance > c.distance;
                      });
                      sortedPositions = _.concat(sortedPositions, unsortPositions);
                      logger.info(sortedPositions.length);
                      res.json({success: true, positions: sortedPositions});
                  } else {
                      res.json({success: true, positions: []});
                  }
              }
          });
       //});
      }
    });
    
  }
  
}

function findCompanyLocatedCity(addrArr){
    if(addrArr.length > 0){
        var city = '';
        switch (addrArr[0]){
            case '香港特别行政区':
                city = '香港';
                break;
            case '澳门特别行政区':
                city = '澳门';
                break;
            case '台湾省':
                city = '台湾';
                break;
            case '北京市':
                city = '北京';
                break;
            case '天津市':
                city = '天津';
                break;
            case '重庆市':
                city = '重庆';
                break;
            case '上海市':
                city = '上海';
                break;
            default:
                city = _.get(addrArr, ['1'], '');
                break;
        }
        return city;
    } else {
        return '';
    }
}

    
function getDistanceBetweenUserAndCompanies(latLng, companyLatLngArr, callback){
  var distanceApi = config.qqapi.distanceApi,
      apikey = config.qqmapKey,
      distanceUrl = distanceApi + '?mode=driving&from=' + latLng + '&to=' + companyLatLngArr.join(';') + '&key=' + apikey,
      elements = [];
    logger.info(distanceUrl);
    request.get({
        url: distanceUrl,
        json: true
    }, function(error, response, distanceResult) {
        logger.info(JSON.stringify(distanceResult));
        if (!error && _.get(response, ['statusCode'], 0) === 200 && _.get(distanceResult, ['status']) == 0) {
          elements = _.get(distanceResult, ['result', 'elements'], []);
        } else {
          logger.info('Error in getting distance', error, _.get(response, ['statusCode'], 0), _.get(distanceResult, ['status']));
        }
        return callback(null, elements);
    });
}

exports.findAllPositions = function(req, res, next){
  Position.find({}, function(err, dbPositions){
    if(err) {
      logger.info('Error in finding all postions', err);
      res.status(500).send({success: false, errmsg: '获取职位信息失败', positions: []});
    } else {
      Company.find({}, function(err1, dbCompanies){
        if(err1) {
          logger.info('Error in finding all companies', err);
          res.status(500).send({success: false, errmsg: '获取职位信息失败', positions: []});
        } else {
          if(_.isEmpty(dbPositions)){
            res.json({success: true, positions: []});
          } else {
            var resultPositions = [];
            _.forEach(dbPositions, function(position){
              var companyId = _.get(position, ['companyId'], '');
              var cmps = _.filter(dbCompanies, function(cmp){
                return cmp._id == companyId;
              });
              if(!_.isEmpty(cmps)){
                var clonePosition = {
                  _id: _.get(position, ['_id'], ''),
                  name:　_.get(position, ['name'], ''),
                  companyName: _.get(cmps, ['0', 'companyName'], ''),
                  totalRecruiters: _.get(position, ['totalRecruiters'], ''),
                  salary: _.get(position, ['salary'], ''),
                  positionDesc: _.get(position, ['positionDesc'], ''),
                  phoneNumber: _.get(position, ['phoneNumber'], '')
                };
                resultPositions.push(clonePosition);
              }
            });
            logger.info(JSON.stringify(resultPositions));
            res.json({success: true, positions: resultPositions});
          }
        }
      });
    }
  })
}