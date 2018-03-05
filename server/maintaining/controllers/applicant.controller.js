var _ = require('lodash'),
    ExcelExporter = require('excel-export');
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');
var async = require('async');
var request = require('request');
var moment = require('moment');
var mongoose = require('mongoose');
var Applicant = mongoose.model('Applicant');
var Position = mongoose.model('Position');
var Company = mongoose.model('Company');

exports.renderPreviewPage = renderPreviewPage;
exports.exportApplicants = exportApplicants;
exports.sendResumeFeedbackMessage = sendResumeFeedbackMessage;
exports.sendResumeHasBeenCheckedMessage = sendResumeHasBeenCheckedMessage;
exports.sendInterviewMessage = sendInterviewMessage;

function dateFormat(date){
    var month = date.getMonth() + 1,
        day = date.getDate(),
        fMonth = '',
        fDay = '';
    if(month < 10){
        fMonth = '0' + month.toString();
    } else {
        fMonth = month.toString();
    }
    if(day < 10){
        fDay = '0' + day.toString();
    } else {
        fDay = day.toString();
    }
    return date.getFullYear() +'-' +  fMonth + '-' +  fDay;
}
function renderPreviewPage(req, res, next){
    var applicantId = _.get(req, ['query', 'id'], ''),
        companyName = _.get(req, ['query', 'companyName'], '');
    logger.info('preview of applicant id by', applicantId);
    var data = {
        wechatOpenId: 'sdofsjdofjsdkfosjdf_Fc',
        name: '高晓松',
        gender: '男'
    };
    if(_.isEmpty(applicantId)){
        res.status(500).send({success: false, errmsg: 'applicant does not exist'});
    } else {
        Applicant.findOne({_id: applicantId}, function(err1, dbApplicant){
            if(err1 || _.isEmpty(dbApplicant)) {
                logger.info('Error in finding applicant by id', applicantId, err1);
                res.status(500).send({success: false, errmsg: 'Error in finding applicant'});
            } else {
                //var that = this;
                var formatDate = dateFormat(_.get(dbApplicant, ['birthDate'], ''));
                var idCardNumber = _.get(dbApplicant, ['idCardNumber'], ''),
                    idCardNumberLenth = idCardNumber.length;
                    idNumberArr = [];
                var familyMembers = _.get(dbApplicant, ['familyMembers'], []),
                    family = [];
                var his = _.get(dbApplicant, ['educationHistories'], []),
                    educationHistories = [];
                var works = _.get(dbApplicant, ['workExperiences'], []),
                    workExperiences = [];
                var threeCategoryRelations = _.get(dbApplicant, ['threeCategoryRelations'], []),
                    threeC = [];
                var i = 0;
                for(i = 0; i < 18; i++){
                    if(i < idCardNumberLenth){
                        var num = idCardNumber[i];
                        if(num != null && num != undefined){
                            idNumberArr.push(num);
                        } else {
                            idNumberArr.push('');
                        }
                    } else {
                        idNumberArr.push('');
                    }
                }
                for(i = 0; i < 4; i++){
                    if(i < familyMembers.length){
                        var familyItem = {
                            relationship: familyMembers[i].relationship || '',
                            name: familyMembers[i].name || '',
                            phoneNumber: familyMembers[i].phoneNumber || '',
                            address: familyMembers[i].homeAddress || ''
                        };
                        family.push(familyItem);
                    } else {
                        var familyItem = {
                            relationship: '',
                            name: '',
                            phoneNumber: '',
                            address: ''
                        };
                        family.push(familyItem);
                    }
                }

                for(i = 0; i < 3; i++){
                    if(i < his.length){
                        var educationHistoryItem = {
                            colledgeName: his[i].colledgeName || '',
                            startedAt: dateFormat(his[i].startedAt) || '',
                            endedAt: dateFormat(his[i].endedAt) || '',
                            major: his[i].major || '',
                            isGraduated: his[i].isGraduated || ''
                        };
                        educationHistories.push(educationHistoryItem);
                    } else {
                        var educationHistoryItem = {
                            colledgeName: '',
                            startedAt: '',
                            endedAt: '',
                            major: '',
                            isGraduated: ''
                        };
                        educationHistories.push(educationHistoryItem);
                    }
                }

                for(i = 0; i < 3; i++){
                    if(i < works.length){
                        var workItem = {
                            companyName: works[i].companyName || '',
                            startedAt: dateFormat(works[i].startedAt) || '',
                            endedAt: dateFormat(works[i].endedAt) || '',
                            resignReason: works[i].resignReason || '',
                            guarantorName: works[i].guarantorName || '',
                            guarantorPhoneNumber: works[i].guarantorPhoneNumber || '',
                            guarantorInfo: works[i].guarantorName + '-' + works[i].guarantorPhoneNumber,
                        };
                        workExperiences.push(workItem);
                    } else {
                        var workItem = {
                            companyName: '',
                            startedAt: '',
                            endedAt: '',
                            resignReason: '',
                            guarantorName: '',
                            guarantorPhoneNumber: '',
                            guarantorInfo: ''
                        };
                        workExperiences.push(workItem);
                    }
                }

                for(i = 0; i < 2; i++){
                    if(i < threeCategoryRelations.length){
                        var threeCItem = {
                            type: threeCategoryRelations[i].type || '',
                            relationship: threeCategoryRelations[i].relationship || '',
                            employeeNumber: threeCategoryRelations[i].employeeNumber || '',
                            name: threeCategoryRelations[i].name || '',
                            department: threeCategoryRelations[i].department || ''
                        };
                        threeC.push(threeCItem);
                    } else {
                        var threeCItem = {
                            type: '',
                            relationship: '',
                            employeeNumber: '',
                            name: '',
                            department: ''
                        };
                        threeC.push(threeCItem);
                    }
                }

                var newH = his.map(item=>(Object.assign(item,{range: dateFormat(item.startedAt) +'~' + dateFormat(item.endedAt)})));
                var newW = works.map(item=>(Object.assign(item,{range: dateFormat(item.startedAt) +'~' + dateFormat(item.endedAt)})));

                var app = {
                    name: _.get(dbApplicant, ['name'], ''),
                    gender: _.get(dbApplicant, ['gender'], ''),
                    folk: _.get(dbApplicant, ['folk'], ''),
                    birthDate: formatDate,
                    healthState: _.get(dbApplicant, ['healthState'], ''),
                    marriageState: _.get(dbApplicant, ['marriageState'], ''),
                    idCardNumber: idNumberArr,
                    nativePlace: _.get(dbApplicant, ['nativePlace'], ''),
                    homeAddress: _.get(dbApplicant, ['homeAddress'], ''),
                    currentAddress: _.get(dbApplicant, ['currentAddress'], ''),
                    mobile: _.get(dbApplicant, ['mobile'], ''),
                    tele: _.get(dbApplicant, ['tele'], ''),
                    email: _.get(dbApplicant, ['email'], ''),
                    qqNumber: _.get(dbApplicant, ['qqNumber'], ''),
                    photoName: _.get(dbApplicant, ['photoName'], ''),
                    idCardFrontPhotoName: _.get(dbApplicant, ['idCardFrontPhotoName'], ''),
                    familyMembers: family,
                    educationHistories: educationHistories,
                    workExperiences: workExperiences,
                    emergencyContactName: _.get(dbApplicant, ['emergencyContactName'], ''),
                    emergencyContactPhoneNumber: _.get(dbApplicant, ['emergencyContactPhoneNumber'], ''),
                    emergencyContactAddress: _.get(dbApplicant, ['emergencyContactAddress'], ''),
                    threeCategoryRelations: threeC
                };
                res.render('./server/weChat/views/applicantPreview', {
                    applicant: app,
                    companyName: companyName
                });
            }
        })
    }
}

function exportApplicants(req, res, next){
    var idList = _.get(req, ['body', 'idList']);
    var applicantName = _.get(req, ['query', 'name'], ''),
        companyId = _.get(req, ['query', 'id'], ''),
        startedAt = _.get(req, ['query', 'startedAt'], ''),
        endedAt = _.get(req, ['query', 'endedAt'], '');
    logger.info(applicantName, companyId, startedAt, endedAt);
    if(_.isEmpty(companyId)){
        res.status(500).send({success: false, errmsg: 'company id is required'});
    } else {
        var queryCriteria = {$and: []};
        queryCriteria.$and.push({'registeredCompanies.companyId': companyId});
        
        if(!_.isEmpty(applicantName))
            queryCriteria.$and.push({'name': {'$regex':applicantName, '$options':"$i"}});
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
                logger.info(applicants);
                var confs = [];
                confs = initExcelSheetConfs(confs);
                constructBasicInfoSheet(applicants, confs);
                var result = ExcelExporter.execute(confs);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent("入职员工") + ".xlsx");
                res.end(result, 'binary');

            }
        });
    }
}

function initExcelSheetConfs(confs){
    var basicInfoConf = {
        name: 'Personal',
        cols: [{
            caption: '姓名',
            type: 'string',
            width: 15
        }, {
            caption: '性别',
            type: 'string'
        }, {
            caption: '民族',
            type: 'string'
        }, {
            caption: '出生日期',
            type: 'string',
            width: 15
        }, {
            caption: '健康状况',
            type: 'string'
        },{
            caption: '婚姻状况',
            type: 'string'
        }, {
            caption: '身份证号码',
            type: 'string',
            width: 25
        }, {
            caption: '家庭住址',
            type: 'string',
            width: 15
        }, {
            caption: '现住址',
            type: 'string',
            width: 15
        }, {
            caption: '手机',
            type: 'string',
            width: 15
        }, {
            caption: '联系电话',
            type: 'string',
            width: 15
        }, {
            caption: '邮箱',
            type: 'string',
            width: 20
        }, {
            caption: 'QQ',
            type: 'string',
            width: 15
        }],
        rows: []
    },
    educationConf = {
        name: 'Education',
        cols: [{
            caption: '姓名',
            type: 'string',
            width: 15
        }, {
            caption: '毕业院校',
            type: 'string',
            width: 25
        }, {
            caption: '日期起',
            type: 'string',
            width: 15
        }, {
            caption: '日期止',
            type: 'string',
            width: 15
        }, {
            caption: '学历',
            type: 'string'
        },{
            caption: '专业',
            type: 'string',
            width: 15
        }, {
            caption: '毕业',
            type: 'string'
        }],
        rows: []
    },
    workExperienceConf = {
        name: 'WorkExperience',
        cols: [{
            caption: '姓名',
            type: 'string',
            width: 15
        }, {
            caption: '公司名称',
            type: 'string',
            width: 30
        }, {
            caption: '日期起',
            type: 'string',
            width: 15
        }, {
            caption: '日期止',
            type: 'string',
            width: 15
        }, {
            caption: '离职原因',
            type: 'string',
            width: 15
        },{
            caption: '证明人及联络方式',
            type: 'string',
            width: 25
        }],
        rows: []
    },
    emergencyContactConf = {
        name: 'Emergency',
        cols: [{
            caption: '姓名',
            type: 'string',
            width: 15
        }, {
            caption: '紧急联络人姓名',
            type: 'string',
            width: 25
        }, {
            caption: '紧急联络人电话',
            type: 'string',
            width: 25
        }, {
            caption: '紧急联络人地址',
            type: 'string',
            width: 35
        }],
        rows: []
    };
    confs.push(basicInfoConf);
    confs.push(educationConf);
    confs.push(workExperienceConf);
    confs.push(emergencyContactConf);
    return confs;
}

function constructBasicInfoSheet(applicants, confs){
    var conf = confs[0];
    if(!_.isEmpty(applicants)){
        _.forEach(applicants, function(app){
            var appRow = [],
                name = _.get(app, ['name'], ''),
                educationHistories = _.get(app, ['educationHistories'], []),
                workExperiences = _.get(app, ['workExperiences'], []);
            appRow.push(name);
            appRow.push(_.get(app, ['gender'], ''));
            appRow.push(_.get(app, ['folk'], ''));
            var birthDate = _.get(app, ['birthDate'], '');
            if(_.isDate(birthDate)){
                appRow.push(birthDate.toLocaleDateString());
            } else {
                appRow.push(_.get(app, ['birthDate'], ''));
            }
            appRow.push(_.get(app, ['healthState'], ''));
            appRow.push(_.get(app, ['marriageState'], ''));
            appRow.push(_.get(app, ['idCardNumber'], ''));
            appRow.push(_.get(app, ['homeAddress'], ''));
            appRow.push(_.get(app, ['currentAddress'], ''));
            appRow.push(_.get(app, ['mobile'], ''));
            appRow.push(_.get(app, ['tele'], ''));
            appRow.push(_.get(app, ['email'], ''));
            appRow.push(_.get(app, ['qqNumber'], ''));

            conf.rows.push(appRow);
            constructEducationHistoriesSheet(name, educationHistories, confs[1]);
            constructWorkExperiencesSheet(name, workExperiences, confs[2]);
            constructEmergencyContactSheet(app, confs[3]);
        });
    }
    return confs;
}

function constructEducationHistoriesSheet(name, educationHistories, conf){
    if(!_.isEmpty(educationHistories)){
        var appRow;
        _.forEach(educationHistories, function(edu){
            appRow = [];
            appRow.push(name);
            appRow.push(_.get(edu, ['colledgeName'], ''));
            var colledgeStartedAt = _.get(edu, ['startedAt'], ''),
                colledgeEndedAt = _.get(edu, ['endedAt'], '');
            if(_.isDate(colledgeStartedAt)){
                appRow.push(colledgeStartedAt.toLocaleDateString());
            } else {
                appRow.push(colledgeStartedAt);
            }
            if(_.isDate(colledgeEndedAt)){
                appRow.push(colledgeEndedAt.toLocaleDateString());
            } else {
                appRow.push(colledgeEndedAt);
            }
            appRow.push(_.get(edu, ['degree'], ''));
            appRow.push(_.get(edu, ['major'], ''));
            appRow.push(_.get(edu, ['isGraduated'], ''));

            conf.rows.push(appRow);
        });
    }
}

function constructWorkExperiencesSheet(name, workExperiences, conf){
    if(!_.isEmpty(workExperiences)){
        var appRow;
        _.forEach(workExperiences, function(wrk){
            appRow = [];
            appRow.push(name);
            appRow.push(_.get(wrk, ['companyName'], ''));
            var wrkStartedAt = _.get(wrk, ['startedAt'], ''),
                wrkEndedAt = _.get(wrk, ['endedAt'], '');
            if(_.isDate(wrkStartedAt)){
                appRow.push(wrkStartedAt.toLocaleDateString());
            } else {
                appRow.push(wrkStartedAt);
            }
            if(_.isDate(wrkEndedAt)){
                appRow.push(wrkEndedAt.toLocaleDateString());
            } else {
                appRow.push(wrkEndedAt);
            }
            appRow.push(_.get(wrk, ['resignReason'], ''));
            var guarantorInfo = _.get(wrk, ['guarantorName'], '') + ' ' + _.get(wrk, ['guarantorPhoneNumber'], '');
            appRow.push(guarantorInfo);

            conf.rows.push(appRow);
        });
    }
}

function constructEmergencyContactSheet(app, conf){
    var name = _.get(app, ['name'], ''),
        emergencyContactName = _.get(app, ['emergencyContactName'], ''),
        emergencyContactPhoneNumber = _.get(app, ['emergencyContactPhoneNumber'], ''),
        emergencyContactAddress = _.get(app, ['emergencyContactAddress'], '');
    var appRow = [];
    appRow.push(name);
    appRow.push(emergencyContactName);
    appRow.push(emergencyContactPhoneNumber);
    appRow.push(emergencyContactAddress);
    conf.rows.push(appRow);
}

function sendResumeFeedbackMessage(req, res){
    var openId = !_.isEmpty(_.get(req, ['body', 'openId'], '')) ? _.get(req, ['body', 'openId'], '') : 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
    var positionId = !_.isEmpty(_.get(req, ['body', 'positionId'], '')) ? _.get(req, ['body', 'positionId'], '') : "59ede2e6c969da2b48238fe6"
    var companyId = !_.isEmpty(_.get(req, ['body', 'companyId'], '')) ? _.get(req, ['body', 'companyId'], '') : ""
    console.log(openId, positionId);
    var findApplicantInfoTask = [];
    findApplicantInfoTask.push(startSearchApplicantInfoTask(openId, positionId));
    findApplicantInfoTask.push(findApplicant());
    findApplicantInfoTask.push(findPosition());
    async.waterfall(findApplicantInfoTask, function(error, result){
        if(error){
            logger.error('Error in find applicant info: ', error);
            res.status(500).send({success: false, errmsg: '发送消息失败'});
        } else {
            var title = '尊敬的' + _.get(result, ['dbApplicant', 'name'], '用户') + '，您的简历已通过审核';
            var remark = '邀请您面试并办理入职手续，请尽快带齐您的相关证件前往办理，联系人：' + _.get(result, ['dbPosition', 'contactPerson'], '') + '，联系电话：' + _.get(result, ['dbPosition', 'phoneNumber'], '');
            var companyId = _.get(result, ['dbPosition', 'companyId'], '');
            var registeredCompany = _.find(_.get(result, ['dbApplicant', 'registeredCompanies'], {}), {'companyId': companyId});
            var templateMessageOpt = {
                "touser": openId,
                "template_id": "x5dSWR4FZHkrYo8AMSKHZbByK0tXBXvvni0lLTi6CE4",
                // "url":"http://weixin.qq.com/download",
                "data":{
                    "first": {
                        "value": title,
                        "color": "#000000"
                    },
                    "job":{
                        "value": _.get(result, ['dbPosition', 'name'], ''),
                        "color": "#000000"
                    },
                    "company": {
                        "value": _.get(registeredCompany, ['companyName'], ''),
                        "color": "#000000"
                    },
                    "time": {
                        "value": "2018年01月22日",
                        "color": "#000000"
                    },
                    "remark":{
                        "value": remark,
                        "color": "#FF4040"
                    }
                }
            };
            sendTemplateMessage(templateMessageOpt, function(sendErr, returnedBody){
                if(sendErr){
                    logger.error('Error in send template message', sendErr);
                    res.status(500).send({success: false, errmsg: '发送消息失败'});
                } else {
                    logger.info('call send template message api with feedback: ', returnedBody);
                    res.json({success: true});
                }
            });
        }
    });
}

function sendResumeHasBeenCheckedMessage(req, res){
    var openId = !_.isEmpty(_.get(req, ['body', 'openId'], '')) ? _.get(req, ['body', 'openId'], '') : 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
    var applicantName = !_.isEmpty(_.get(req, ['body', 'applicantName'], '')) ? _.get(req, ['body', 'applicantName'], '') : '张生';
    var companyName = !_.isEmpty(_.get(req, ['body', 'companyName'], '')) ? _.get(req, ['body', 'companyName'], '') : '小米科技';
    var companyId = !_.isEmpty(_.get(req, ['body', 'companyId'], '')) ? _.get(req, ['body', 'companyId'], '') : '小米科技';
    var now = moment().format('YYYY-MM-DD');
    var welcomeMessage = '尊敬的' + applicantName + '，很荣幸地通知您，有企业关注到您的简历';
    var remark = companyName + '请您补充【详细个人简历】，以便为您安排合适的职位';
    var templateMessageOpt = {
        "touser": openId,
        "template_id": "7LzhoVYeJ7G8Qbqofvh0XrLBkm88iCNko8z8mVxDycY",
        // "url":"http://weixin.qq.com/download",
        "data":{
            "first": {
                "value": welcomeMessage,
                "color": "#000"
            },
            "keyword1":{
                "value": companyName,
                "color": "#000"
            },
            "keyword2": {
                "value": now,
                "color": "#000"
            },
            "remark":{
                "value": remark,
                "color": "#FF4040"
            }
        }
    };
    sendTemplateMessage(templateMessageOpt, function(sendErr, returnedBody){
        if(sendErr){
            logger.error('Error in send template message', sendErr);
            res.status(500).send({success: false, errmsg: '发送消息失败'});
        } else {
            logger.info('call send template message api with feedback: ', returnedBody);
            addCompanyIdIntoMessageSentList(openId, 'completeResumeInvitationList', companyId, function(updateErr){
                res.json({success: true});
            });
        }
    });
}

function addCompanyIdIntoMessageSentList(openId, messageSentListType, companyId, callback){
    Applicant.findOne({wechatOpenId: openId}, function(error, dbApplicant){
       if(error || _.isEmpty(dbApplicant)){
           logger.error('Error in find applicant when add company id into message sent list', error);
           return callback(null, null);
       } else {
           var messageSentList = _.get(dbApplicant, [messageSentListType], []);
           if(_.indexOf(messageSentList, companyId) < 0){
               messageSentList.push(companyId);
               Applicant.update({wechatOpenId: openId}, {$set: {messageSentListType: messageSentList}}, {upsert: false})
                   .exec(function (updateError, result) {
                       if(updateError) logger.error('Error in update message list', updateError);
                       return callback(null, null);
                   });
           } else {
               logger.info('company %s already sent message to user %s', companyId, openId);
               return callback(null, null);
           }
       }
    });
}

function sendInterviewMessage(req, res){
    var openId = !_.isEmpty(_.get(req, ['body', 'openId'], '')) ? _.get(req, ['body', 'openId'], '') : 'of0RLszGA9FJ7AtV0bmpQ8REs_Fc';
    var applicantName = !_.isEmpty(_.get(req, ['body', 'applicantName'], '')) ? _.get(req, ['body', 'applicantName'], '') : '张生';
    var companyName = !_.isEmpty(_.get(req, ['body', 'companyName'], '')) ? _.get(req, ['body', 'companyName'], '') : '小米科技';
    var interviewDate = !_.isEmpty(_.get(req, ['body', 'interviewDate'], '')) ? _.get(req, ['body', 'interviewDate'], '') : '待定';
    var welcomeMessage = '尊敬的' + applicantName + '，很荣幸地通知您，有企业邀请您投递简历参加面试';
    var remark = companyName + '邀请您面试并办理入职手续，请您在【周边招聘】中向该企业投递您的简历，若您的个人简历不完整，请维护【详细个人简历】';
    var templateMessageOpt = {
        "touser": openId,
        "template_id": "9p5kn2Er2ldfQtc9aSTMcJHRo7Cj7aIOglKUj88007Y",
        // "url":"http://weixin.qq.com/download",
        "data":{
            "first": {
                "value": welcomeMessage,
                "color": "#000"
            },
            "keyword1":{
                "value": companyName,
                "color": "#000"
            },
            "keyword2": {
                "value": interviewDate,
                "color": "#000"
            },
            "remark":{
                "value": remark,
                "color": "#FF4040"
            }
        }
    };
    sendTemplateMessage(templateMessageOpt, function(sendErr, returnedBody){
        if(sendErr){
            logger.error('Error in send template message', sendErr);
            res.status(500).send({success: false, errmsg: '发送消息失败'});
        } else {
            logger.info('call send template message api with feedback: ', returnedBody);
            res.json({success: true});
        }
    });
}

function startSearchApplicantInfoTask(openId, positionId){
    return function(callback){
        var result = {
            openId: openId,
            positionId: positionId
        };
        return callback(null, result);
    }
}

function findApplicant(){
    return function(result, callback){
        var openId = _.get(result, ['openId'], '');
        if(_.isEmpty(openId)){
            return callback('open id is empty', null);
        } else {
            Applicant.findOne({wechatOpenId: openId}, function(error, dbApplicant) {
                if (error || _.isEmpty(dbApplicant)) {
                    logger.error('Error in finding applicant for openid:', openId, error);
                    return callback('Error in finding applicant for openid', null);
                } else {
                    result.dbApplicant = dbApplicant;
                    return callback(null, result);
                }
            });
        }
    }
}

function findPosition(){
    return function(result, callback){
        var positionId = _.get(result, ['positionId'], '');
        if(_.isEmpty(positionId)){
            return callback('position id is empty', null);
        } else {
            Position.findOne({'_id': positionId}, function(error, dbPosition){
                if (error || _.isEmpty(dbPosition)) {
                    logger.error('Error in finding position for positionId:', positionId, error);
                    return callback('Error in finding position for positionId', null);
                } else {
                    console.log(JSON.stringify(dbPosition))
                    result.dbPosition = dbPosition;
                    return callback(null, result);
                }
            });
        }
    }
}

function findCompany(){
    return function (result, callback) {
        var companyId = _.get(result, ['dbPosition', 'companyId'], '');
        if(_.isEmpty(companyId)){
            return callback('company id is empty', null);
        } else {
            Company.findOne({'_id': companyId}, function(error, dbCompany){
                if(error || _.isEmpty(dbCompany)){
                    logger.error('Error in finding company for companyId:', companyId, error);
                    return callback('Error in finding company for companyId', null);
                } else {
                    result.dbCompany = dbCompany;
                    return callback(null, result);
                }
            });
        }
    }
}

function sendTemplateMessage(templateMessageBody, callback){
    var wechatSendTemplateMessageUrl = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + global.accessToken;
    request.post({
        url: wechatSendTemplateMessageUrl,
        body: templateMessageBody,
        json: true
    }, function(error, response, body){
        if(!error && _.get(response, ['statusCode'], 0) == 200 && !_.isEmpty(body)){
            return callback(null, body)
        } else {
            var errMsg = {error: error, statusCode: _.get(response, ['statusCode'], 0), errMsgFromWechat: _.get(body, ['errmsg'], '')};
            return callback(JSON.stringify(errMsg), null);
        }
    });
}