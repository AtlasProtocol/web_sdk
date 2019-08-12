
## How to build

3 different environments:
```bash
- npm run build:dev
- npm run build:test
- npm run build:prod
```

A standalone sdk file, build/AtlasAds.{environment}.js,  will be generated

## How to use

* partner, audience, inventory and adunit these four are necessary for any publisher to integrate our ads sdk
* first argument of AtlasDigitalAd.play is the selector of the DOM element which will be the container of creatives.

- Once imported by <script> tag in a HTML page, a variable named 'AtlasAds' would be exported under global window scope.
- Also can be used as a node package. CES_URL is a magic variable, it should be set during the compiling procedure.

Example javascript 

```HTML
    <script src="AtlasAds.production.js"></script>
    <script>
     var partnerID = '1';
     var dp = AtlasAds(partnerID);

     // play(containerSelector, inventoryObject, adUnitObject, audienceObject)
     // dp.play('#bottom-banner', inventory, unit1, audience);

     // getAd(containerSelector, width, height)
     dp.getAd('#bottom-banner', 300, 250);
     dp.getAd('#right-banner', 300, 250);
    </script>
```
