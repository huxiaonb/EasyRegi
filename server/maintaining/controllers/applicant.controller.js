var _ = require('lodash'),
    ExcelExporter = require('excel-export');
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');
var mongoose = require('mongoose');
var Applicant = mongoose.model('Applicant');

exports.renderPreviewPage = renderPreviewPage;
exports.exportApplicants = exportApplicants;

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

