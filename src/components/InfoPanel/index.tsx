
import './style.scss';
import * as React from 'react';

import PolarToggleBtn from '../PolarToggleBtn';
import SeaIceExtByYearChart from '../SeaIceExtByYearChart';

import { queryMinMaxSeaIceExtByYear, querySeaIceExtByMonth } from '../../services/sea-ice-extents'
import { PolarRegion, IMinMaxSeaExtByYearData, ISeaIceExtByMonthData } from '../../types';

interface IProps {
    polarRegion:PolarRegion, 
    polarRegionOnChange: ((value:string)=>void)
};

interface IState {
    seaIceExtByYearData:IMinMaxSeaExtByYearData
    seaIceExtByMonthData:ISeaIceExtByMonthData
};

export default class InfoPanel extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);

        this.state = {
            seaIceExtByYearData: null,
            seaIceExtByMonthData: null
        }
    }

    setSeaIceExtByYearData(data:IMinMaxSeaExtByYearData){
        this.setState({
            seaIceExtByYearData: data
        });
    }

    setSeaIceExtByMonthData(data:ISeaIceExtByMonthData){
        this.setState({
            seaIceExtByMonthData: data
        });
    }

    async loadSeaIceExtData(){
        const seaIceExtByYear = await queryMinMaxSeaIceExtByYear();

        const seaIceExtByMonth = await querySeaIceExtByMonth();

        this.setSeaIceExtByYearData(seaIceExtByYear);
        // console.log(seaIceExtByYear);

        this.setSeaIceExtByMonthData(seaIceExtByMonth);
        console.log(seaIceExtByMonth);
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
                        polarRegion={this.props.polarRegion}
                        data={this.state.seaIceExtByYearData}
                    />
                </div>

            </div>
        );
    }
}