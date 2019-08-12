import './style';
import {Component} from 'preact';

import AtlasAds from "./AtlasAds";

export default class index extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h1>ATP广告位</h1>

                <AtlasAds
                    partnerID={'pbftrnffif2matuqtq9cg'}
                    width={'750'}
                    height={'160'}
                />

            </div>
        );
    }
}
