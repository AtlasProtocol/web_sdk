# Atlas Ads Web-SDK
欢迎使用星途在线广告SDK


# 快速集成 Fast Integration

### 引入SDK Import SDK
测试环境
```javascript
<script src="https://sdkcdn.atlaspro.io/libs/atp.ads.test.js"></script>
```
生产环境
```javascript
<script src="https://sdkcdn.atlaspro.io/libs/atp.ads.js"></script>
```
### 设置div标签 Setup Ad div Tag
设置好需要展示的广告位div
```javascript
<!--ATP顶部广告位-->  
<div class="flex banner1"  id="atlaspAds-Top"></div>  
<!--ATP底部广告位-->  
<div class="flex banner2"  id="atlaspAds-bottom"></div>
```
### 配置项设置 SDK Options

设置**partnerID**, 测试版本如下,正式版本partnerID请与ATP确认
使用`getAd`方法获取广告, 传入对应div id以及广告位宽度, 高度
```javascript
<script>  
/*初始化ATPSDK，并设置partnerID (init ATP-SDK ,Set partnerID)*/  
//此处为测试版本partnerID, 正式环境上线前请与ATP确认正式partnerID  
var partnerID = 'pbftrnffif2matuqtq9cg';  
  
var atpAds = AtlasAds(partnerID);  
  
//获取广告 传入div containerId和广告的宽高（getAd set the containerId and dimension wide high）  
atpAds.getAd('#atlaspAds-Top',720,200);  
atpAds.getAd('#atlaspAds-bottom',720,200);  
  
</script>
```
到此，ATP-SDK-WEB 版的最小化集成基本结束
> **请注意生产环境地址配置，以及正式partnerID需要联系Atlas进行确认**

# API手册 API Reference
```javascript
//获取广告接口 设置方式只需要使用其中一种  
//以adunitId 获取广告  
getAd(container,adunitId)  
//以宽度高度 获取广告  
getAd(container,width,height)  
  
/*可选配置项(Optional config) */  
  
//是否允许拉伸 optional  
atpAds.isAllowScaling(false)  
  
//设置投放底价 (Set the price) optional  
atpAds.setMinCPM(10)
```
`isAllowScaling` 是否允许广告图片拉伸, 默认为false

`setMinCPM` 是设置接受投放的底价, 单位为USDT/CPM

`getAd`是获取广告接口,其中container是相关页面元素的**div id**。`width`是广告宽度，`height`是广告高度，`adunitId`是广告单元id。请注意宽高 `width`, `height`和广告单元id `adunitId` 只需要填写其中一组，同时设置会以adunitId为优先条件。以下为示例:
```javascript
/*只需要设置以下一种方式*/  
  
//设置宽高条件 width720 height200  
atpAds.getAd('#atlaspAds-bottom',720,200);

//设置预定义的adunitId，从ATP系统中读取宽高等限制项  
atpAds.getAd('#atlaspAds-bottom','atp_720x200_001');
```

# 广告尺寸 Ad Size

### 移动端 Mobile
| 类别            |尺寸(px)       |    
|----------------|---------------------
|移动横幅广告      |720×200        |   
|移动中幅广告      |720×640        |
### 桌面端 PC
| 类别            |尺寸(px)       |
|----------------|---------------------
|中矩形广告        |360×300        |
|半版广告          |360×720        |
|横幅广告          |840×140        |
|通栏横幅广告       |1200×100        |

# 广告媒体类型 Media Type

目前支持类型为 图片广告, 图片类型支持 **png / jpeg**


# 常见问题 FAQ

星途协议提供互动广告SDK,如在集成中发现问题，可随时邮件至  
AtlasProtocol工程团队邮件组 [sdk@atlasp.io](mailto:sdk@atlasp.io) ，我们会尽快与您取得联系并确认问题

移动端效果展示可参考我们的[移动端demo](http://releases.atlasp.io/sdk/SDK-WEB-DEMO/ATP-WEBSDK-DEMO.zip)

更多星途产品请访问: [Atlas Product](https://www.atlaspro.io/product/)

![avatar][base64str]


 [base64str]:data:image/png;base64,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
