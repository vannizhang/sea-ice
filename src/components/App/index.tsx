
import * as React from 'react';

import Map from '../Map';
import InfoPanel from '../InfoPanel';
import TimeControl from '../TimeControl';
import AboutThisApp from '../AboutThisApp';

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
        this.timeControlOnValueChange = this.timeControlOnValueChange.bind(this);
        this.seaIceValOnSelect = this.seaIceValOnSelect.bind(this);
    }

    updatePolarRegion(polarRegion:PolarRegion){
        this.setState({
            polarRegion: polarRegion
        });
    }

    updateActiveRecordDate(index=-1){

        const { recordDates } = this.state;

        if(!recordDates.length){
            return;
        }
        
        index = ( index === -1 ) ? recordDates.length - 1 : index; 

        const activeRecordDate = recordDates[index];

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
        // console.log(recordDates);
    }

    timeControlOnValueChange(index:number){
        this.updateActiveRecordDate(index);
    }

    seaIceValOnSelect(year:number, value:number){
        // console.log(year, value);
        const { seaIceExtByMonthData, recordDates, polarRegion } = this.state;

        // values for the selected year
        const values = seaIceExtByMonthData[polarRegion].filter(d=>{
            return d.year === year;
        })[0].values;

        const monthNum = values.indexOf(value) + 1;

        for(let i = 0, len = recordDates.length; i < len; i++){
            const d = recordDates[i];

            if(d.year === year && d.month === monthNum){
                this.updateActiveRecordDate(i);
                break;
            }
        }
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
                    seaIceValOnSelect={this.seaIceValOnSelect}
                />
                <TimeControl 
                    polarRegion={this.state.polarRegion}
                    recordDates={this.state.recordDates}
                    activeRecordDate={this.state.activeRecordDate}
                    seaIceExtByMonthData={this.state.seaIceExtByMonthData}
                    medianSeaIceExtByMonthData={this.state.medianSeaIceExtByMonthData}
                    onValueChange={this.timeControlOnValueChange}
                />
                <AboutThisApp />
            </div>
        )
    }
}
