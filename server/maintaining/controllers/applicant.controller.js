var _ = require('lodash');
var mongoose = require('mongoose');
var Applicant = mongoose.model('Applicant');

exports.renderPreviewPage = renderPreviewPage;

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
                var date = _.get(dbApplicant, ['birthDate'], '');
                var fMonth = date.getMonth() + 1 +'月';
                var formatDate = date.getFullYear() +'年' +  fMonth +  date.getDate()+'日';
                console.log(formatDate);
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
                    educationHistories: _.get(dbApplicant, ['educationHistories'], []),
                    workExperiences: _.get(dbApplicant, ['workExperiences'], [])
                }
                res.render('./server/weChat/views/applicantPreview', {
                    applicant: app
                });
            }
        })
    }
}