
import * as React from 'react';

import Map from '../Map';
import InfoPanel from '../InfoPanel';
import TimeControl from '../TimeControl';

import { 
    PolarRegion, 
    IMinMaxSeaExtByYearData, 
    ISeaIceExtByMonthData, 
    IMedianSeaIceExtByMonth, 
    IRecordDate 
} from '../../types';

import { 
    queryMinMaxSeaIceExtByYear, 
    querySeaIceExtByMonth, 
    queryMedianSeaIceExtByMonth, 
    queryRecordDates 
} from '../../services/sea-ice-extents';

interface IProps {};

interface IState {
    polarRegion:PolarRegion,
    recordDates: Array<IRecordDate>
    activeRecordDate: IRecordDate,
    seaIceExtByYearData:IMinMaxSeaExtByYearData,
    seaIceExtByMonthData:ISeaIceExtByMonthData,
    medianSeaIceExtByMonthData:IMedianSeaIceExtByMonth
};

export default class App extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            polarRegion: 'arctic',
            recordDates: [],
            activeRecordDate: null,
            seaIceExtByYearData: null,
            seaIceExtByMonthData: null,
            medianSeaIceExtByMonthData: null
        }

        this.updatePolarRegion = this.updatePolarRegion.bind(this);
    }

    updatePolarRegion(polarRegion:PolarRegion){
        this.setState({
            polarRegion: polarRegion
        });
    }

    updateActiveRecordDate(index=-1){
        
        index = ( index === -1 ) ? this.state.recordDates.length - 1 : index; 

        const activeRecordDate = this.state.recordDates[index];

        this.setState({
            activeRecordDate
        });
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

    setRecordDates(recordDates:Array<IRecordDate>){
        this.setState({
            recordDates
        }, ()=>{
            this.updateActiveRecordDate();
        })
    }

    async loadAppData(){
        const seaIceExtByYear = await queryMinMaxSeaIceExtByYear();

        const seaIceExtByMonth = await querySeaIceExtByMonth();

        const medianSeaIceExtByMonth = await queryMedianSeaIceExtByMonth();

        const recordDates = await queryRecordDates();

        this.setSeaIceExtByYearData(seaIceExtByYear);
        // console.log(seaIceExtByYear);

        this.setSeaIceExtByMonthData(seaIceExtByMonth, medianSeaIceExtByMonth);
        // console.log(seaIceExtByMonth);

        this.setRecordDates(recordDates);
    }

    componentDidMount(){
        this.loadAppData();
    }

    render(){
        return (
            <div id='appContentDiv'>
                <Map 
                    polarRegion={this.state.polarRegion}
                    activeRecordDate={this.state.activeRecordDate}
                />
                <InfoPanel 
                    polarRegion={this.state.polarRegion}
                    polarRegionOnChange={this.updatePolarRegion}
                    activeRecordDate={this.state.activeRecordDate}
                    seaIceExtByYearData={this.state.seaIceExtByYearData}
                    seaIceExtByMonthData={this.state.seaIceExtByMonthData}
                    medianSeaIceExtByMonthData={this.state.medianSeaIceExtByMonthData}
                />
                <TimeControl 
                    polarRegion={this.state.polarRegion}
                    recordDates={this.state.recordDates}
                    activeRecordDate={this.state.activeRecordDate}
                    seaIceExtByMonthData={this.state.seaIceExtByMonthData}
                />
            </div>
        )
    }
}
