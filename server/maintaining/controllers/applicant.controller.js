var _ = require('lodash'),
    ExcelExporter = require('excel-export');
var mongoose = require('mongoose');
var Applicant = mongoose.model('Applicant');

exports.renderPreviewPage = renderPreviewPage;
exports.exportApplicants = exportApplicants;

function dateFormat(date){
    var fMonth = date.getMonth() + 1 +'月';
    return date.getFullYear() +'年' +  fMonth +  date.getDate()+'日';
}
function renderPreviewPage(req, res, next){
    var applicantId = _.get(req, ['params', 'id'], '');
    console.log('preview of applicant id by', applicantId);
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
                console.log('Error in finding applicant by id', applicantId, err1);
                res.status(500).send({success: false, errmsg: 'Error in finding applicant'});
            } else {
                //var that = this;
                var formatDate = dateFormat(_.get(dbApplicant, ['birthDate'], ''));
                var his = _.get(dbApplicant, ['educationHistories'], []);
                var works = _.get(dbApplicant, ['workExperiences'], []);
                
                var newH = his.map(item=>(Object.assign(item,{range: dateFormat(item.startedAt) +'~' + dateFormat(item.endedAt)})));
                var newW = works.map(item=>(Object.assign(item,{range: dateFormat(item.startedAt) +'~' + dateFormat(item.endedAt)})));

                var app = {
                    name: _.get(dbApplicant, ['name'], ''),
                    gender: _.get(dbApplicant, ['gender'], ''),
                    folk: _.get(dbApplicant, ['folk'], ''),
                    birthDate: formatDate,
                    healthState: _.get(dbApplicant, ['healthState'], ''),
                    idCardNumber: _.get(dbApplicant, ['idCardNumber'], ''),
                    homeAddress: _.get(dbApplicant, ['homeAddress'], ''),
                    currentAddress: _.get(dbApplicant, ['currentAddress'], ''),
                    mobile: _.get(dbApplicant, ['mobile'], ''),
                    tele: _.get(dbApplicant, ['tele'], ''),
                    email: _.get(dbApplicant, ['email'], ''),
                    qqNumber: _.get(dbApplicant, ['qqNumber'], ''),
                    photoName: _.get(dbApplicant, ['photoName'], ''),
                    idCardPhotoName: _.get(dbApplicant, ['idCardPhotoName'], ''),
                    familyMembers: _.get(dbApplicant, ['familyMembers'], []),
                    educationHistories:newH,
                    workExperiences: newW
                }
                res.render('./server/weChat/views/applicantPreview', {
                    applicant: app
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
    console.log(applicantName, companyId, startedAt, endedAt);
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
                        width: 15
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
                        console.log(_.isDate(birthDate))
                        if(_.isDate(birthDate)){
                            appRow.push(birthDate.toLocaleDateString());    
                        } else {
                            appRow.push(_.get(app, ['birthDate'], ''));
                        }
                        appRow.push(_.get(app, ['healthState'], ''));
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
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(result, 'binary');

            }
        });
    }
}