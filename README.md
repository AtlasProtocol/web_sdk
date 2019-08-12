# Atlas Ads Web-SDK
Atlas Ads SDK provides accessibility to various digital ads especially block-chain related digital ads.

## How to build

```bash
- npm run build:test
- npm run build:prod
```


# Fast Integration
[中文文档](https://sdkcdn.atlaspro.io/sdk/WIKI/wikisite/index.html)

### SDK Import SDK
Test environment
```javascript
<script src="https://sdkcdn.atlaspro.io/libs/atp.ads.test.js"></script>
```
Production environment
```javascript
<script src="https://sdkcdn.atlaspro.io/libs/atp.ads.js"></script>
```
### Setup Ad div Tag
Place your ads div.
```javascript
<!--ATP顶部广告位-->  
<div class="flex banner1"  id="atlaspAds-Top"></div>  
<!--ATP底部广告位-->  
<div class="flex banner2"  id="atlaspAds-bottom"></div>
```
### SDK Options

**partnerID** below is testing ONLY, **for formal partner ID please contact [sdk@atlasp.io](mailto:sdk@atlasp.io)**
`getAd` obtain ads, parameters are div id, height and width respectively.
```javascript
<script>  
/*init ATP-SDK ,Set partnerID)*/  
//partnerID here is testing ONLY, contact atlas protocol for formal partner ID.  
var partnerID = 'pbftrnffif2matuqtq9cg';  
  
var atpAds = AtlasAds(partnerID);  
  
//getAd by setting the containerId and ads dimension (height, width) 
atpAds.getAd('#atlaspAds-Top',720,200);  
atpAds.getAd('#atlaspAds-bottom',720,200);  
  
</script>
```
You have now completed fast integration
> **For Production environment, please contact [sdk@atlasp.io](mailto:sdk@atlasp.io) for formal partner ID**

# API Reference
```javascript
//get ads function, you can either query for adunitID or ad size.
//get ads by adunitId
getAd(container,adunitId)  
//get ads by dimension  
getAd(container,width,height)  
  
/*Optional config */  
  
//allow scaling   
atpAds.isAllowScaling(false)  
  
//Set the minimum price
atpAds.setMinCPM(10)
```
`isAllowScaling` allow scaling , false by default

`setMinCPM` Set the minimum price (USDT/CPM)

`getAd`get ads function,container is the div that use display ad. `width`ad width，`height`ad height，`adunitId`ad unit id. You only need query ad for dimension or ad unit id. Example here:
```javascript
/*query one way ONLY*/  
  
//set ads dimension width720 height200  
atpAds.getAd('#atlaspAds-bottom',720,200);

//set adunitId，sdk can get your conditions from our system.  
atpAds.getAd('#atlaspAds-bottom','atp_720x200_001');
```

# Ad Size

### Mobile
| type            |size(px)       |    
|----------------|---------------------
|mobile banner      |720×200        |   
|mobile rectangle      |720×640        |
### PC
| type            |size(px)       |
|----------------|---------------------
|medium rectangle        |360×300        |
|half page          |360×720        |
|large web banner          |840×140        |
|leaderboard       |1200×100        |

# Media Type

Now sdk supports image format **png / jpeg**


# FAQ

If you have any question during integration, please contact  
AtlasProtocol dev team  [sdk@atlasp.io](mailto:sdk@atlasp.io) ，we will respond asap.

For mobile client demo[移动端demo](http://releases.atlasp.io/sdk/SDK-WEB-DEMO/ATP-WEBSDK-DEMO.zip)

For more Atlas Protocol product [Atlas Product](https://www.atlaspro.io/product/)



