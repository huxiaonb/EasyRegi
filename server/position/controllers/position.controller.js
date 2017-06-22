'use strict';
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var Position = mongoose.model('Position');
var Dictionary = mongoose.model('Dictionary');
var Applicant = mongoose.model('Applicant');

module.exports.index = function (req, res) {
  Dictionary.find({category : '职位类型'})
            .then(jobTypes => {
              var jobTypeMap = new Map();
              jobTypes.forEach(jobType => {
                jobTypeMap.set(jobType.value, jobType.icon);
              });
              return jobTypeMap;
            })
            .then(jobTypeMap => {
              Position.find({status : 'ACTIVE'})
                     .sort({order : 1})
                     .then(result => {
                       result.forEach(r => r.jobType = jobTypeMap.get(r.jobType))
                       res.render('./server/position/views/position', {
                         positions : result
                       });
                   });
            });

};

module.exports.history = function (req, res) {
  if (req.session.openId) {
    Applicant.find({
      wechatOpenId : req.session.openId
    }).then(applicants => {
      res.render('./server/position/views/history', {
        applicants : applicants
      });
    });
  } else {
    res.render('./server/position/views/history', {
      applicants : []
    });
  }
};

module.exports.detail = function (req, res) {
  if (! req.session.positions || ! ~req.session.positions.indexOf(req.params._id)) {
    if (! req.session.positions ) req.session.positions = [];
    req.session.positions.push(req.params._id);
    Position.update({_id : req.params._id}, {$inc : {browseCount : 1}}).exec();
  }
  // console.log(req.sessionID);
  Position.findOne({_id : req.params._id})
         .then(result => {
           res.render('./server/position/views/detail', {
             data : result
           });
         });
};

module.exports.applyPosition = function (req, res) {
  Position.findOne({_id : req.params._id})
         .then(result => {
            if(!!req.session.openId){
                Applicant.find({wechatOpenId: req.session.openId}).then(applicants => {
                    var applicant = null;
                    applicants.forEach(function(appliedUser){
                        if(applicant === null){
                            applicant = appliedUser;
                        } else if(applicant.updated < appliedUser.updated){
                            applicant = appliedUser;
                        }
                    });
                    if(null !== applicant){
                        result.appName = applicant.name;
                        result.phone = applicant.phone;
                        result.college = applicant.school;
                        result.educationalBackground = applicant.educationalBackground;
                        result.major = applicant.major;
                        var graduateDate = '';
                        if(null !== applicant.graduationDate && undefined !== applicant.graduationDate) {
                            var month = applicant.graduationDate.getMonth() < 10 ? '0' + applicant.graduationDate.getMonth() : applicant.graduationDate.getMonth();
                            graduateDate = applicant.graduationDate.getFullYear() + '-' + month;
                        }
                        result.graduationDate = graduateDate;
                        result.email = applicant.email;
                        result.QQ = applicant.qq;
                    }
                    res.render('./server/position/views/apply', {
                        data : result
                    });
                });
            } else {
                res.render('./server/position/views/apply', {
                    data : result
                });
            }
         });
};

module.exports.apply = function (req, res) {
    console.log(req.body);
    console.log(req.files);
    var positionId = req.params._id;
    var fileSize = 0;
    var relativePhotoPath = '';
    if(req.files !== undefined && req.files !== null
    &&req.files.pic !== undefined && req.files.pic !== null) {
        fileSize = req.files.pic.size;
        relativePhotoPath = req.files.pic.path;
    }
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
    var applicantName = req.body.name;
    if(!!req.session.openId){
        Applicant.find({wechatOpenId: req.session.openId}).then(results => {
            console.log(results);
            var foundApplicant = null;
            results.forEach(function(applicant){
                if(applicant.name === applicantName.toLowerCase() && applicant.phone === req.body.phone){
                    foundApplicant = applicant;
                }
            });
            if(null === foundApplicant) {
                Position.findOne({_id : req.params._id})
                    .then(position => {
                    var appliedPositions = [];
                    var position = {
                        positionId: positionId,
                        positionName: position.name
                    };
                    appliedPositions.push(position);

                    var applicant = new Applicant({
                        name: applicantName.toLowerCase(),
                        school: req.body.college,
                        major: req.body.major,
                        phone: req.body.phone,//change to string
                        email: req.body.email,
                        qq: req.body.QQ,
                        appliedPositions: appliedPositions,
                        educationalBackground: req.body.educationalBackground
                    });
                    if(fileSize !== 0){
                        applicant.photoName = photoName;
                    }
                    if(!!req.body.graduationDate){
                        var graduationDate = new Date(req.body.graduationDate);
                        applicant.graduationDate = graduationDate;
                    }
                    if(!!req.session.openId){
                        applicant.wechatOpenId = req.session.openId;
                    }
                    applicant.save().then(persistedObj => {
                        console.log(persistedObj);
                        res.redirect('/position/success/' + positionId);
                        Position.update({_id : positionId}, {$inc : {applyCount : 1}}).exec();
                    });
                });
            } else{
                //persistIfApplicantFound(foundApplicant, req, res, true);
                Position.findOne({_id : req.params._id})
                    .then(position => {
                    var applicant = foundApplicant;
                    var positionId = req.params._id;
                    var appliedPositions = applicant.appliedPositions;
                    var needAddNewPosition = true;
                    appliedPositions.forEach(function (position) {
                        if (position.positionId === positionId) {
                            needAddNewPosition = false;
                        }
                    });
                    if (needAddNewPosition) {
                        var position = {
                            positionId: positionId,
                            positionName: position.name
                        };
                        applicant.appliedPositions.push(position);
                    }
                    if (!!req.body.graduationDate) {
                        var graduationDate = new Date(req.body.graduationDate);
                        applicant.graduationDate = graduationDate;
                    }
                    if (req.body.college !== '') {
                        applicant.school = req.body.college;
                    }
                    if (req.body.major !== '') {
                        applicant.major = req.body.major;
                    }
                    if (req.body.email !== '') {
                        applicant.email = req.body.email;
                    }
                    if (!!req.body.educationalBackground) {
                        applicant.educationalBackground = req.body.educationalBackground;
                    }
                    if (req.body.QQ !== '') {
                        applicant.qq = req.body.QQ;
                    }
                    if (fileSize !== 0) {
                        applicant.photoName = photoName;
                    }
                    applicant.updated = Date.now();
                    if (!!req.session.openId) {
                        applicant.wechatOpenId = req.session.openId;
                    }
                    Applicant.update({_id: applicant.id}, applicant)
                        .then(result => {
                        console.log(result);
                        res.redirect('/position/success/' + positionId);
                        if (needAddNewPosition) {
                            Position.update({_id: positionId}, {$inc: {applyCount: 1}}).exec();
                        }
                    }).catch(function(error){
                        console.log('error in update process: ', error);
                        res.redirect('/position/success/' + positionId);
                    });
                });
            }
        });

    } else {
        Applicant.findOne({name: applicantName.toLowerCase(), phone: req.body.phone, wechatOpenId:{$exists: false}})
            .then(result => {
            console.log(result);
            Position.findOne({_id : req.params._id})
                .then(position => {
                if(null === result){
                var appliedPositions = [];
                var position = {
                    positionId: positionId,
                    positionName: position.name
                };
                appliedPositions.push(position);

                var applicant = new Applicant({
                    name: applicantName.toLowerCase(),
                    school: req.body.college,
                    major: req.body.major,
                    phone: req.body.phone,//change to string
                    email: req.body.email,
                    qq: req.body.QQ,
                    appliedPositions: appliedPositions,
                    educationalBackground: req.body.educationalBackground
                });
                if(fileSize !== 0){
                    applicant.photoName = photoName;
                }
                if(!!req.body.graduationDate){
                    var graduationDate = new Date(req.body.graduationDate);
                    applicant.graduationDate = graduationDate;
                }
                applicant.save().then(persistedObj => {
                    //console.log(persistedObj);
                    res.redirect('/position/success/' + positionId);
                    Position.update({_id : positionId}, {$inc : {applyCount : 1}}).exec();
                });
            } else {
                var applicant = result;
                var appliedPositions = applicant.appliedPositions;
                var needAddNewPosition = true;
                appliedPositions.forEach(function(position){
                    if (position.positionId === positionId){
                        needAddNewPosition = false;
                    }
                });
                if(needAddNewPosition){
                    var position = {
                        positionId: positionId,
                        positionName: position.name
                    };
                    applicant.appliedPositions.push(position);
                }
                if(!!req.body.graduationDate){
                    var graduationDate = new Date(req.body.graduationDate);
                    applicant.graduationDate = graduationDate;
                }
                if(req.body.college !== '') {
                    applicant.school = req.body.college;
                }
                if(req.body.major !== '') {
                    applicant.major = req.body.major;
                }
                if(req.body.email !== '') {
                    applicant.email = req.body.email;
                }
                if(!!req.body.educationalBackground){
                    applicant.educationalBackground = req.body.educationalBackground;
                }
                if(req.body.QQ !== '') {
                    applicant.qq = req.body.QQ;
                }
                if(fileSize !== 0){
                    applicant.photoName = photoName;
                }
                applicant.updated = Date.now();
                Applicant.update({_id: applicant.id}, applicant)
                    .then(result => {
                    console.log(result);
                    res.redirect('/position/success/' + positionId);
                    if(needAddNewPosition){
                        Position.update({_id : positionId}, {$inc : {applyCount : 1}}).exec();
                    }
                }).catch(function(error){
                    console.log('error in update process: ', error);
                    res.redirect('/position/success/' + positionId);
                });
        }
    });


    });
    }
};

module.exports.success = function (req, res) {
  Position.findOne({_id : req.params.positionId}, {successMessage : 1})
        .then(result => {
          res.render('./server/position/views/success', {successMessages : result.successMessage.split('/')});
        })

};

module.exports.device = function (req, res) {
  res.render('./server/position/views/device');
};
