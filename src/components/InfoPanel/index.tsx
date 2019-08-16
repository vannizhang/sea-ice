
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
    // year value returned by the mouse hover on sea ice ext by year bar chart
    yearOnHover:number
};

export default class InfoPanel extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);

        this.state = {
            yearOnHover: undefined
        };

        this.seaIceExtByYearChartOnHover = this.seaIceExtByYearChartOnHover.bind(this);
    }

    // componentDidMount(){
    // }

    seaIceExtByYearChartOnHover(year:number){
        // console.log(year);
        this.setState({
            yearOnHover: year
        });
    }

    render(){

        const { yearOnHover } = this.state;

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
                        onHover={this.seaIceExtByYearChartOnHover}
                    />
                </div>

                <div className='trailer-half'>
                    <MonthlyTrendChart 
                        polarRegion={this.props.polarRegion}
                        data={this.props.seaIceExtByMonthData}
                        medianData={this.props.medianSeaIceExtByMonthData}
                        yearOnHover={yearOnHover}
                    />
                </div>

            </div>
        );
    }
}