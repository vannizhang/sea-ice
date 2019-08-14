
import './style.scss';
import * as React from 'react';

import PolarToggleBtn from '../PolarToggleBtn';
import SeaIceExtByYearChart from '../SeaIceExtByYearChart';
import MonthlyTrendChart from '../MonthlyTrendChart';

// import { queryMinMaxSeaIceExtByYear, querySeaIceExtByMonth, queryMedianSeaIceExtByMonth } from '../../services/sea-ice-extents'
import { PolarRegion, IMinMaxSeaExtByYearData, ISeaIceExtByMonthData, IMedianSeaIceExtByMonth, IRecordDate } from '../../types';

interface IProps {
    polarRegion:PolarRegion, 
    polarRegionOnChange: ((value:string)=>void),
    activeRecordDate: IRecordDate,
    seaIceExtByYearData:IMinMaxSeaExtByYearData,
    seaIceExtByMonthData:ISeaIceExtByMonthData,
    medianSeaIceExtByMonthData:IMedianSeaIceExtByMonth
};

interface IState {
};

export default class InfoPanel extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);
    }

    // componentDidMount(){
    // }

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
                        data={this.props.seaIceExtByYearData}
                    />
                </div>

                <div className='trailer-half'>
                    <MonthlyTrendChart 
                        polarRegion={this.props.polarRegion}
                        data={this.props.seaIceExtByMonthData}
                        medianData={this.props.medianSeaIceExtByMonthData}
                    />
                </div>

            </div>
        );
    }
}