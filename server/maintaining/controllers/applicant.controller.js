var _ = require('lodash');

exports.renderPreviewPage = renderPreviewPage;

function renderPreviewPage(req, res, next){
    var applicantId = _.get(req, ['params', 'id'], '');
    console.log('preview of applicant id by', applicantId);
    var data = {
        wechatOpenId: 'sdofsjdofjsdkfosjdf_Fc',
        name: '高晓松',
        gender: '男'
    };
    res.render('./server/weChat/views/applicantPreview', {
            applicant: data
        })
}