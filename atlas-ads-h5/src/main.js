import $ from 'mini-zepto'

const apiUrls = {
    cesurl: CES_URL ? CES_URL : process.env.CES_URL
}

const system = 'Atlas Ads'
const version = '1.0'
const apiVersion = 'v1'


class AtlasAds {

    constructor(partnerID) {
        this.partnerID = partnerID
        this.width = '720';
        this.height = '200';
        this.allowScaling = false
    }

    setMinCPM(minPrice) {
        this.minPrice = minPrice
    }

    setDimension(width, height) {
        this.width = width;
        this.height = height;
    }

    setAdunitId(id) {
        this.adunitId = id
    }

    isAllowScaling(type) {
        this.allowScaling = type
    }
    setExcludeTags(arrExcludeTags) {
        this.arrExcludeTags = arrExcludeTags
    }
    //arguments :container, width, height, adunitId
    getAd() {
        let adunit = {}
        if (arguments.length == 2) {

            adunit = {
                id: arguments[1] + '',
                minPrice: this.minPrice + '',
                creativeRestrictions: {
                    acceptedCreativeMimeTypes: ['image/jpeg', 'image/png'],
                    allowScaling: this.allowScaling
                }
            }
        } else if (arguments.length == 3) {
            this.width = arguments[1];
            this.height = arguments[2];
            adunit = {
                minPrice: this.minPrice + '',
                creativeRestrictions: {
                    acceptedCreativeMimeTypes: ['image/jpeg', 'image/png'],
                    width: arguments[1] + '',
                    height: arguments[2] + '',
                    allowScaling: this.allowScaling
                }
            }
        }


        this.play(arguments[0], null, adunit, null)
    }


    play(container, inventory, adunit, audience) {
        const ts = (new Date()).getTime()

        try {
            $.ajax({
                url: `${apiUrls.cesurl}/${apiVersion}/ad`,
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Content-type': 'application/json'
                },
                crossDomain: true,
                data: JSON.stringify({
                    system: system,
                    version: version,
                    timestamp: ts,
                    partner: {
                        id: this.partnerID
                    },
                    audience: audience,
                    inventory: inventory,
                    adUnit: adunit,
                    excludeTags: this.arrExcludeTags
                }),
                success: (res, txtStatus, xhr) => {
                    if (!res.success) {
                        console.log(res.errormsg)
                    } else {
                        var data = res.data

                        let img = new Image()
                        img.src = data.ads[0].creativeUrl
                        img.style.height = '100%';
                        img.style.width = '100%';
                        let anch = $('<a href="' + data.ads[0].tracking.click + '" target="_blank" >')

                        if (this.allowScaling) {
                            anch = $('<a style="display:block;width:100%;height:100%;" href="' + data.ads[0].tracking.click + '" target="_blank" >')
                        }
                        anch.append(img)
                        $(container).empty().append(anch)

                    }
                },
                error: (xhr, txtStatus, err) => {
                    console.log(err)
                }
            })
        } catch (e) {
            console.log(e)
        }
    }
}

export default AtlasAds

if (typeof window !== 'undefined') {
    window['AtlasAds'] = (partner) => {
        return new AtlasAds(partner)
    }
}
