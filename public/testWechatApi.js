var openId = $('#openId').text();
alert(openId);
var signatureObj = JSON.parse($('#signatureObj').text());
console.log(signatureObj.signature);
function generateNonceString(length){
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = "";
    for (var i = 0; i < (length || 32); i++) {
        noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
};
wx.config({
    debug: true,
    appId: 'wx54e94ab2ab199342',
    timestamp: signatureObj.timestamp,//Date.now().toString().substr(0,10),
    nonceStr: signatureObj.noncestr,//generateNonceString(),
    signature: signatureObj.signature,
    jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
    ]
});

wx.ready(function(){
    wx.onMenuShareTimeline({
        title: '入职易--我刚找到了一份好工作，你也来试试',
        link: 'http://www.mfca.com.cn',
        imgUrl: 'http://www.mfca.com.cn/img/dog.jpg',
        success: function () {
            // 用户确认分享后执行的回调函数
            alert('分享到朋友圈成功');
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            alert('你没有分享到朋友圈');
        }
    });
});
