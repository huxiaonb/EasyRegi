var _ = require('lodash'),
    ExcelExporter = require('excel-export');
var config = require('../../../config/config');
var logger = require('../../../config/lib/logger');
var mongoose = require('mongoose');
var Applicant = mongoose.model('Applicant');

exports.renderPreviewPage = renderPreviewPage;
exports.exportApplicants = exportApplicants;

function dateFormat(date){
    var fMonth = date.getMonth() + 1 +'月';
    return date.getFullYear() +'年' +  fMonth +  date.getDate()+'日';
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
                var familyMembers = _.get(dbApplicant, ['familyMembers'], []),
                    family = [];
                var his = _.get(dbApplicant, ['educationHistories'], []),
                    educationHistories = [];
                var works = _.get(dbApplicant, ['workExperiences'], []),
                    workExperiences = [];
                var threeCategoryRelations = _.get(dbApplicant, ['threeCategoryRelations'], []),
                    threeC = [];
                var i = 0;
                for(i = 0; i < 4; i++){
                    if(i < familyMembers.length){
                        var familyItem = {
                            relationship: familyMembers[i].relationship || '',
                            name: familyMembers[i].name || '',
                            phoneNumber: familyMembers[i].phoneNumber || '',
                            address: familyMembers[i].address || ''
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
                    idCardNumber: _.get(dbApplicant, ['idCardNumber'], ''),
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
                var conf = {
                    name: 'Sheet1',
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
                    }]
                };
                conf.rows = [];
                if(!_.isEmpty(applicants)){
                    _.forEach(applicants, function(app){
                        var appRow = [];
                        appRow.push(_.get(app, ['name'], ''));
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
                    });
                }
                var result = ExcelExporter.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent("入职员工") + ".xlsx");
                res.end(result, 'binary');

            }
        });
    }
}