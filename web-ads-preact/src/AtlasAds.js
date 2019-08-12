import {Component, h, render} from 'preact';
import ky from 'ky';

const apiUrls = {
    cesurl: 'https://test-ces.atpsrv.net'
}

const system = 'Atlas Ads'
const version = '1.0'
const apiVersion = 'v1'

export default class AtlasAds extends Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(props))
        this.partnerID = props.partnerID
        this.width = props.width
        this.height = props.height
        this.state = {
            jumpUrl: '',
            imgUrl: ''
        }
    }

    componentDidMount() {

        this.getAd(this.width, this.height)
    }

    getAd(width, height) {
        let adunit = {
            creativeRestrictions: {
                acceptedCreativeMimeTypes: ['image/jpeg', 'image/png'],
                width: width,
                height: height,
                allowScaling: false
            }
        }
        this.play(null, adunit, null)
    }

    async play(inventory, adunit, audience) {
        let ts = (new Date()).getTime()

        let POST_INTERACT = apiUrls.cesurl + '/' + apiVersion + '/ad'

        let reqData = {
            system: system,
            version: version,
            timestamp: ts,
            partner: {
                id: this.partnerID
            },
            audience: audience,
            inventory: inventory,
            adUnit: adunit
        }
        try {
            const data = await ky.post(POST_INTERACT, {json: reqData}).json();
            if (!data.success) {
                console.log(data.errormsg)
            } else {
                let resp = data.data
                if (resp.ads[0] && resp.ads[0].creativeUrl) {
                    this.setState({imgUrl: resp.ads[0].creativeUrl})
                }
                if (resp.ads[0] && resp.ads[0].tracking.click) {
                    this.setState({jumpUrl: resp.ads[0].tracking.click})
                }


            }

        }
        catch (e) {
            console.log(e)
        }
    }

    jumpClick = () => {
        window.location.href = this.state.jumpUrl
    }

    render() {

        return (
            <div>
                <img src={this.state.imgUrl} onClick={this.jumpClick}/>
            </div>
        );
    }

}
