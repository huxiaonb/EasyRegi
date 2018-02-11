import URL from "url-parse"
import reqwest from 'reqwest';


/**
 * ajax请求，封装cors与数据类型
 * @param  {string} url 请求url, 可忽略并在 opt.url设置
 * @param  {object} opt 请求配置
 * @return {[type]}     请求对象
 */
const _request = (url, opt = {}) => {
    if(url && typeof url === 'object'){
        opt = url
    }
    let options = {
        type: 'GET',
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        serialize: true,
        xhrFields: {
            withCredentials: true
        },
        url: url || opt.url,
        ...opt
    };
    if(options.type !== 'GET' && options.serialize){
        try{
            options.data = JSON.stringify(options.data)
        }catch(e){}
    }
    delete options.serialize;
    return $.ajax(options)
}
let abortHandler;
export default {
    //api list,
    createApplicant(data){
        return _request({
            url: '../api/v1/Applicant',
            type: 'POST',
            data: data
        })
    },
    getApplicant(weChatId){
        return _request({
            url: '../api/v1/Applicant?query='+ JSON.stringify({wechatOpenId : weChatId}),
            type: 'GET'
        })
    },
    updateApplicant(id,data){
        return _request({
            url: '../api/v1/Applicant/' + id,
            type: 'PUT',
            data: data
        })
    },
    submitSelectComp(data){
        return _request({
            url:'../weChat/applicant/submitRegisterCompany',
            type: 'POST',
            data: data
        })
    },
    getAllCompanyNames(){
        // return $.ajax({
        //     url:'http://localhost:3000/weChat/getAllCompanyNames',
        //     type: 'GET',
        //     success: function(data){
        //         console.log('getAllCompanyNames');
        //         console.log(data);
        //     }
        // })
        return _request({
            url: '../weChat/getAllCompanyNames',
            type: 'GET'
        })
    },
    getIdCardInfo(idCardNum){
        return _request({
            url: 'http://api.jisuapi.com/idcard/query?appkey=6d8934f38525ce7e&idcard='+idCardNum, //342422199209201753
            type: 'GET',
            dataType: 'JSONP'
        })
    },
    checkIfNeedPay(data){
        return _request({
            url: '../weChat/checkIfNeedPay',
            type: 'POST',
            data: data
        })
    },
    pay(){
        return _request({
            url:'../weChat/pay',
            type: 'POST',
        })
        
    },
    findNearbyPositions(info,limit=5,offset=0){
        return _request({
            url: '../weChat/position/findNearbyPositions?limit=' + limit + '&offset=' + offset,
            type: 'POST',
            data : info
        });
    },
    searchPositions(info, limit = 5, offset = 0, keyword) {
        //中断上一次请求后再请求再搜索下一个关键词
        abortHandler && abortHandler();
        let re =  _request({
            url: '../weChat/position/search?limit=' + limit + '&offset=' + offset + '&keyword=' + keyword,
            type: 'POST',
            data: info
        });
        abortHandler = re.abort;
        return re
    },
    findAllPositions(){
        return _request({
            url: '../weChat/position/findAllPositions',
            type: 'GET',
        })
    },
    getVerCode(num){
        return _request({
            url: '../aliCloud/sendCaptchaCode?phoneNumber=' + num,
            type: 'GET',
        })
    },
    verifyCaptcha(num){
        return _request({
            url: '../aliCloud/verifyCaptchaCode?captcha=' + num,
            type: 'GET',
        })
    },
    submitBasicInfo(data){
        return _request({
            url: '../saveBasicInfo',
            type: 'POST',
            data
        });
    },
    loadPositionDetail(id){
        return _request({
            url: '../weChat/position/loadPosition',
            type: 'POST',
            id
        });
    },
    uploadFile(f, openId){
        // return $.ajax({
        //     url:'../weChat/applicant/personalInfo/submit?id=' + openId + '&type=' + f.type,
        //     type: 'POST',
        //     contentType : 'multipart/form-data; boundary=foo',
        //     processData: false,
        //     data : f.data
        // })
        reqwest({
            url: '../weChat/applicant/personalInfo/submit?id=' + openId + '&type=' + f.type,
            method: 'post',
            processData: false,
            data: f.data,
            });
        
    },
    sendRedPack(positionId) {
        return _request({
            url: '../sendRedPack?positionId=' + positionId,
            method: 'get'
        });
    }
}