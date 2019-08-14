
import './style.scss';
import * as React from 'react';

import PolarToggleBtn from '../PolarToggleBtn';
import SeaIceExtByYearChart from '../SeaIceExtByYearChart';
import MonthlyTrendChart from '../MonthlyTrendChart';

import { queryMinMaxSeaIceExtByYear, querySeaIceExtByMonth, queryMedianSeaIceExtByMonth } from '../../services/sea-ice-extents'
import { PolarRegion, IMinMaxSeaExtByYearData, ISeaIceExtByMonthData, IMedianSeaIceExtByMonth, IRecordDate } from '../../types';

interface IProps {
    polarRegion:PolarRegion, 
    polarRegionOnChange: ((value:string)=>void),
    activeRecordDate: IRecordDate
};

interface IState {
    seaIceExtByYearData:IMinMaxSeaExtByYearData,
    seaIceExtByMonthData:ISeaIceExtByMonthData,
    medianSeaIceExtByMonthData:IMedianSeaIceExtByMonth
};

export default class InfoPanel extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);

        this.state = {
            seaIceExtByYearData: null,
            seaIceExtByMonthData: null,
            medianSeaIceExtByMonthData: null
        }
    }

    setSeaIceExtByYearData(data:IMinMaxSeaExtByYearData){
        this.setState({
            seaIceExtByYearData: data
        });
    }

    setSeaIceExtByMonthData(data:ISeaIceExtByMonthData, medianData:IMedianSeaIceExtByMonth){
        this.setState({
            seaIceExtByMonthData: data,
            medianSeaIceExtByMonthData: medianData
        });
    }

    async loadSeaIceExtData(){
        const seaIceExtByYear = await queryMinMaxSeaIceExtByYear();

        const seaIceExtByMonth = await querySeaIceExtByMonth();

        const medianSeaIceExtByMonth = await queryMedianSeaIceExtByMonth();

        this.setSeaIceExtByYearData(seaIceExtByYear);
        // console.log(seaIceExtByYear);

        this.setSeaIceExtByMonthData(seaIceExtByMonth, medianSeaIceExtByMonth);
        // console.log(seaIceExtByMonth);
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

                <div className='trailer-half'>
                    <MonthlyTrendChart 
                        polarRegion={this.props.polarRegion}
                        data={this.state.seaIceExtByMonthData}
                        medianData={this.state.medianSeaIceExtByMonthData}
                    />
                </div>

            </div>
        );
    }
}