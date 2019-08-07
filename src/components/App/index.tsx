
import * as React from 'react';

import Map from '../Map';
import InfoPanel from '../InfoPanel';
import { queryMinMaxSeaExtByYear } from '../../services/sea-ice-extents'
import { PolarRegion } from '../../types';

interface IProps {};

interface IState {
    polarRegion:PolarRegion,
    seaIceExtByYearData:any
};

export default class App extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            polarRegion: 'antarctic',
            seaIceExtByYearData: null
        }
    }

    setSeaIceExtByYearData(data:any){
        this.setState({
            seaIceExtByYearData: data
        });
    }

    async loadSeaIceExtData(){
        const seaIceExtByYear = await queryMinMaxSeaExtByYear();

        this.setSeaIceExtByYearData(seaIceExtByYear);

        // console.log(seaIceExtByYear);
    }

    async componentDidMount(){
        this.loadSeaIceExtData();
    }

    render(){
        return (
            <div id='appContentDiv'>
                <Map 
                    polarRegion={this.state.polarRegion}
                />
                <InfoPanel />
            </div>
        )
    }
}
