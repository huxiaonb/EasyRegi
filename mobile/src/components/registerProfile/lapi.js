import URL from "url-parse"


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
    }
}