var openId = $('#openId').text();
var signatureObj = JSON.parse($('#signatureObj').text());

function shareToTimeLine(title, link, imgUrl){
    wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl: imgUrl,
        success: function () {
            // 用户确认分享后执行的回调函数
            alert('分享到朋友圈成功');
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            alert('你没有分享到朋友圈');
        }
    });
}

$(document).ready(function(){
    function bindClickEvent(){
        $('#shareToTimeline').on('click', function(){
            console.log('click');
            WeixinJSBridge.invoke("shareTimeline",{
                    "link":"http://www.mfca.com.cn",
                    "img_url":"http://www.mfca.com.cn/img/dog.jpg",
                    "img_width":"120",
                    "img_height":"120",
                    "desc":"i am description",
                    "title":"just test from WeixinJsBridge"
                },
                function(e){
                    alert(JSON.stringify(e));
                });
        });

        $('#tipsForShare').on('click', function(){
            $("#shareit").show();
        });

        $("#shareit").on("click", function(){
            $("#shareit").hide();
        });
    }
    /*function onBridgeReady(){
        if(typeof WeixinJSBridge === "undefined") {
            console.log('weixinJSBridge does not exist');
            return;
        }
        WeixinJSBridge.on('menu:share:timeline', function(argv)
        {
            console.log('menu:share:timeline');
            WeixinJSBridge.invoke("shareTimeline",{
                    "link":"http://www.mfca.com.cn",
                    "img_url":"http://www.mfca.com.cn/img/dog.jpg",
                    "img_width":"120",
                    "img_height":"120",
                    "desc":"i am description",
                    "title":"just test from WeixinJsBridge"
                },
                function(e){
                    alert(JSON.stringify(e));
                });
        });
    }
    if(document.addEventListener){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if(document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }*/

    bindClickEvent();

});

wx.config({
    debug: true,
    appId: 'wx54e94ab2ab199342',
    timestamp: signatureObj.timestamp,//Date.now().toString().substr(0,10),
    nonceStr: signatureObj.noncestr,//generateNonceString(),
    signature: signatureObj.signature,
    jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'hideOptionMenu',
        'showOptionMenu',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'closeWindow'
    ]
});

wx.ready(function(){
    var title = '入职易--我刚找到了一份好工作，你也来试试',
        link = 'http://www.mfca.com.cn',
        imgUrl = 'http://www.mfca.com.cn/img/dog.jpg';
    shareToTimeLine(title, link, imgUrl);
});