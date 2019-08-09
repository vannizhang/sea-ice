
import * as React from 'react';

import Map from '../Map';
import InfoPanel from '../InfoPanel';
import { PolarRegion } from '../../types';

interface IProps {};

interface IState {
    polarRegion:PolarRegion,
};

export default class App extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            polarRegion: 'antarctic'
        }

        this.updatePolarRegion = this.updatePolarRegion.bind(this);
    }

    updatePolarRegion(polarRegion:PolarRegion){
        this.setState({
            polarRegion: polarRegion
        });
    }

    render(){
        return (
            <div id='appContentDiv'>
                <Map 
                    polarRegion={this.state.polarRegion}
                />
                <InfoPanel 
                    polarRegion={this.state.polarRegion}
                    polarRegionOnChange={this.updatePolarRegion}
                />
            </div>
        )
    }
}
