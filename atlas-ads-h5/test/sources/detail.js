document.documentElement.style.fontSize = document.documentElement.offsetWidth / 3.75 + "px";
var uid = $('#uid').val();
var targetId = $('#targetId').val();
var commentPostUrl = $('#commentPostUrl').val();
var ua = navigator.userAgent.toLowerCase();

var username = $('#username').val();
console.log("username="+username);
var teamid = $('#teamid').val();
console.log("teamid="+teamid);
var teamUrl = $('#teamUrl').val();
console.log("teamUrl="+teamUrl);
var headurl = $('#headurl').val();
console.log("headurl="+headurl);


var is_ios = false;
var url = 'xmx://open?newsId=' + targetId ;
var env = $('#env').val();
if ('dev' == env || 'test' == env) {
    url = 'xmxdev://open?newsId=' + targetId;
}

var config = {
    /*scheme:必须*/
    scheme_IOS: url,
    scheme_Adr: url,
    IOS_download_url: 'https://itunes.apple.com/us/app/3am/id1372770421',
    Adr_download_url: '',
    timeout: 1500
};
// 配置sdk config

wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: $('#appid').val(), // 必填，公众号的唯一标识
    timestamp: $('#timestamp').val(), // 必填，生成签名的时间戳
    nonceStr: $('#nonce').val(), // 必填，生成签名的随机串
    signature: $('#signature').val(),// 必填，签名，见附录1
    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.ready(function () {
    var url = $('#url').val();
    var img = null;
    if($('img').length){
        img = $('img')[0].src;
    }
    console.log('wechat api ready!');
    // 分享到朋友圈
    wx.onMenuShareTimeline({
        title: document.title, // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: img, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    // 分享给好友
    wx.onMenuShareAppMessage({
        title: document.title, // 分享标题
        desc: '3点钟', // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: img, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    // 分享到QQ
    wx.onMenuShareQQ({
        title: document.title, // 分享标题
        desc: '3点钟', // 分享描述
        link: url, // 分享链接
        imgUrl: img, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    // 分享到QQ空间
    wx.onMenuShareQZone({
        title: document.title, // 分享标题
        desc: '3点钟', // 分享描述
        link: url, // 分享链接
        imgUrl: img, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});
wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    console.log("errormsg=" + JSON.stringify(res));
});
//判断是否是PC
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
// 如果app已下载，直接跳转app页面
var top = 0;
//   jumpFun('ifme://home','ifme://home');
$(".infor").on("click", function () {
    top = $(window).scrollTop();
    is_ios = false;
    jumpFun(top);
});
$(".ios_open,.add").on("click", function () {
    is_ios = true;
    top = $(window).scrollTop();
    jumpFun();
});
$(".inforbot").on("click",function () {
    window.location.href=teamUrl;
});
isIos();
jumpApp();
if (!is_weixin()) {
    $(".inforbot").hide();
}

function isIos() {
    if (/iphone|ipad|ipod/.test(ua)) {
        $(".ios_open").css({"display": "block"});
    }
}
function jumpApp() {
    $(window).scrollTop(top);
    var startTime = Date.now();
    var ifr = document.createElement('iframe');
    ifr.src = ua.indexOf('os') > 0 ? config.scheme_IOS : config.scheme_Adr;
    // if (!is_weixin()) {
    if (/iphone|ipad|ipod/.test(ua)) {
        $(".ios_open").css({"display": "block"});
        /* ifr.style.display = 'none';
         document.body.appendChild(ifr);
         window.location = config.scheme_IOS;*/
        // location.href = "https://itunes.apple.com/cn/app/id1076966093";
    } else if (/android/.test(ua)) {
        ifr.style.display = 'none';
        document.body.appendChild(ifr);
        window.location = config.scheme_Adr;
    }
    // }
}
function jumpFun() {
    if (is_weixin() && !is_MQQBrowser()) {
        if (/iphone|ipad|ipod/.test(ua)) {
            if(!is_ios){
                window.location.href='itms-services://?action=download-manifest&amp;url=https://3amfile.oss-cn-hangzhou.aliyuncs.com/3amim.plist';
            }else{
                $(".fuceng").show();
                $(".container").css({"position": "fixed", "top": -top + "px"});
                $("body").on("touchmove", function (e) {
                    e.preventDefault();
                })
            }
        } else {
            $("#fc").removeClass("fuceng").addClass("fuceng_android").show();
            $(".container").css({"position": "fixed", "top": -top + "px"});
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            })
        }
        setTimeout(function () {
            $("#fc").on("click", function () {
                $(".container").css({"position": "initial"});
                $(window).scrollTop(top);
                $("body").unbind("touchmove");
                $(this).hide();
                $("#fc").unbind();
            });
        }, 10);//延时
    } else if (ua.match(/WeiBo/i) == "weibo") {
        //在新浪微博客户端打开
        if (/iphone|ipad|ipod/.test(ua)) {
            $(".fuceng").show();
            $(".container").css({"position": "fixed", "top": -top + "px"});
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            })
        } else {
            $("#fc").removeClass("fuceng").addClass("fuceng_android").show();
            $(".container").css({"position": "fixed", "top": -top + "px"});
            $("body").on("touchmove", function (e) {
                e.preventDefault();
            })
        }
        setTimeout(function () {
            $("#fc").on("click", function () {
                $(".container").css({"position": "initial"});
                $(window).scrollTop(top);
                $("body").unbind("touchmove");
                $(this).hide();
                $("#fc").unbind();
            });
        }, 10);//延时
    } else {
        $(".inforbot").hide();
        var ifr = document.createElement('iframe');
        if (/iphone|ipad|ipod/.test(ua)) {
            if (is_ios) {
                ifr.src = config.scheme_IOS;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                window.location = ifr.src;
            } else {
                window.location.href = "itms-services://?action=download-manifest&amp;url=https://3amfile.oss-cn-hangzhou.aliyuncs.com/3amim.plist";
            }
            /* ifr.src =config.scheme_IOS;
             ifr.style.display = 'none';
             document.body.appendChild(ifr);
             window.location = ifr.src;
             window.setTimeout(function(){
             document.body.removeChild(ifr);
             location.href = "https://itunes.apple.com/cn/app/id1076966093";
             },2000);*/
        } else if (/android/.test(ua)) {
            //alert(config.scheme_Adr);
            ifr.src = config.scheme_Adr;
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
            window.location = ifr.src;
            window.setTimeout(function () {
                var timestamp=new Date().getTime();
                $.get('https://3am-image.oss-cn-hangzhou.aliyuncs.com/biuld_info.json?v=' + timestamp, {flag: 'WAP'}, function (msg) {
                    location.href = msg.url;
                }, 'json');
                //alert("android版本敬请期待");
                //location.href = "https://3am-image.oss-cn-hangzhou.aliyuncs.com/3AM_1.1.apk";
            }, 3000);
        } else {
            var timestamp=new Date().getTime();
            $.get('https://3am-image.oss-cn-hangzhou.aliyuncs.com/biuld_info.json?v=' + timestamp, {flag: 'WAP'}, function (msg) {
                location.href = msg.url;
            }, 'json');
            //location.href = "https://3am-image.oss-cn-hangzhou.aliyuncs.com/3AM_1.1.apk";
            //alert("android版本敬请期待");
        }
    }
}
function is_weixin() {
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    }
    else {
        return false;
    }
}
function is_qq() {
    if (ua.match(/QQ/i) == "qq") {
        return true;
    }
    else {
        return false;
    }
}
function is_MQQBrowser() {
    if (ua.indexOf("MQQBrowser") > -1) {
        return true;
    }
    else {
        return false;
    }
}
if (IsPC()) {
    $(".container,html,body").css({"width": "604px", "margin": "0 auto"});
    $("html").css("fontSize", "120px");
}else{
   /* $(window).scroll(function() {
        if ($(document).scrollTop()<=0){
            //滚动条已经到达顶部
            $(".infor").css({"position":"relative"});
            $(".all-content").css({"margin-top":"0px"});
        }else{
            $(".infor").css({"position":"fixed"});
            $(".all-content").css({"margin-top":"0.64rem"});
        }
    });*/
}

$(document).ready(function () {
    var num=$('.diamond').html();
    if(num!='0'){$('.award').show()}


    var uid = $('#uid').val();
    $('#bad-vote').on('click',function () {
        if(uid){
            var param = {uid:uid,targetId:targetId,praiseType:2,targetType:1};
            var self = this;
            $.ajax({
                type: "post",
                url: commentPostUrl,
                async: false,
                data: JSON.stringify(param),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if(res.code==0){
                        $('.bad-num').html(res.data.againstCount);
                        $(self).parent().find('p').addClass('blue');
                        $(self).find('img').attr('src','/common/images/news/bad_blue.png');
                    }
                }
            });
        }
    });


    $('#good-vote').on('click',function () {
        if(uid){
            var self = this;
            var param = {uid:uid,targetId:targetId,praiseType:1,targetType:1};
            $.ajax({
                type: "post",
                url: commentPostUrl,
                async: false,
                data: JSON.stringify(param),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(res) {
                    if(res.code==0){
                        $('.good-num').html(res.data.supportCount);
                        $(self).parent().find('p').addClass('blue');
                        $(self).find('img').attr('src','/common/images/news/good_blue.png');
                    }

                }
            });
        }
    });



});

$('.banner').on('click',function () {
    location.href="https://3am-image.oss-cn-hangzhou.aliyuncs.com/recruit_content.html";
    $("html , body").animate({ scrollTop : 100 } , 1000);
});

$('.banner1').on('click',function () {
    location.href="https://3am-image.oss-cn-hangzhou.aliyuncs.com/recruit_advertising.html";
    $("html , body").animate({ scrollTop : 100 } , 1000);
});


// 点赞 接口 news/comments/add
// 参数
/*
*  uid
*  targetId
*  praiseType ->  赞类型: 支持1，反对2
*  targetType -> 赞的内容类型: 1新闻，2评论
*
*
* */