
import './style.scss';
import * as React from 'react';

import PolarToggleBtn from '../PolarToggleBtn';
import SeaIceExtByYearChart from '../SeaIceExtByYearChart';

import { queryMinMaxSeaExtByYear } from '../../services/sea-ice-extents'
import { PolarRegion, IMinMaxSeaExtByYearData } from '../../types';

interface IProps {
    polarRegion:PolarRegion, 
    polarRegionOnChange: ((value:string)=>void)
};

interface IState {
    seaIceExtByYearData:IMinMaxSeaExtByYearData
};

export default class InfoPanel extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);

        this.state = {
            seaIceExtByYearData: null
        }
    }

    setSeaIceExtByYearData(data:IMinMaxSeaExtByYearData){
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
            <div id='infoPanelDiv' className='info-panel-container'>

                <div className='trailer-half'>
                    <PolarToggleBtn 
                        activePolarRegion={this.props.polarRegion}
                        onClick={this.props.polarRegionOnChange}
                    />
                </div>

                <div className='trailer-half'>
                    <SeaIceExtByYearChart 
                        data={this.state.seaIceExtByYearData}
                    />
                </div>

            </div>
        );
    }
}