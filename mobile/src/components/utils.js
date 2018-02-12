import React from 'react';
import { Toast } from 'antd-mobile';
import lapi from './registerProfile/lapi';

export async function wepay(data){
    Toast.loading('Loading...', 0);
    let checkResult = await lapi.checkIfNeedPay(data);
    if (checkResult && checkResult.success) {
        if (checkResult.needPay) {
            let res = await lapi.pay();
            if (res) {
                if (res.return_code === 'SUCCESS') {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": res.appid,//公众号名称，由商户传入
                            "timeStamp": res.timeStamp,//时间戳，自1970年以来的秒数
                            "nonceStr": res.nonce_str, //随机串
                            "package": "prepay_id=" + res.prepay_id,//xxx
                            "signType": "MD5",//微信签名方式：
                            "paySign": res.paySign //微信签名
                        },
                        async function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                data.payDate = new Date();
                                let r = await lapi.submitSelectComp(data);
                                if(r.success){
                                    Toast.hide();
                                    return true;
                                }else{
                                    Toast.hide();
                                    return false; 
                                }
                                
                            } else {
                                Toast.hide();
                                Toast.error('error');
                            } 
                        }
                    );
                }
            } else {
                Toast.hide();
                Toast.error('error');
            }
        } else {
            let sr = await lapi.submitSelectComp(data);
            
            if(sr.success){
                Toast.hide();
                return true;
            }else{
                Toast.hide();
                Toast.error('error');
                return false;
            }
            
            
        }
    } else {
        Toast.hide();
        Toast.error('error');
    }
    
}
export function trim(str, charlist) {

    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

export function deepMerge(obj1, obj2) {
    for (let key in obj2) {
        obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
            deepMerge(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    }
    return obj1;
}
export function withoutSpace(value = '') {
    return value.replace(/\s+/g, "")
}