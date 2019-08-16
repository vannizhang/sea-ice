import './style.scss';
import * as React from 'react';

import { dateFns } from 'helper-toolkit-ts';

import { 
    PolarRegion, 
    ISeaIceExtByMonthData, 
    IRecordDate,
    IMedianSeaIceExtByMonth
} from '../../types';

interface IProps {
    polarRegion:PolarRegion,
    recordDates: Array<IRecordDate>
    activeRecordDate: IRecordDate,
    seaIceExtByMonthData:ISeaIceExtByMonthData,
    medianSeaIceExtByMonthData:IMedianSeaIceExtByMonth
    onValueChange: (index:number)=>void
};

interface IState {
    value: number,
    seaIceExtAreaValues: {
        [key in PolarRegion]: number[]
    },
    isPlaying: boolean
};

export default class TimeControl extends React.PureComponent<IProps, IState> {

    private playInterval:NodeJS.Timeout;

    constructor(props:IProps){
        super(props);

        this.state = {
            value: 0,
            // save sea ext area values in memory so it's easier to retrive
            seaIceExtAreaValues: {
                antarctic: [],
                arctic: []
            },
            isPlaying: false
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.goNext = this.goNext.bind(this);
        this.goPrev = this.goPrev.bind(this);
        this.togglePlay = this.togglePlay.bind(this);
    }

    updateValue(newVal=0){

        const { onValueChange } = this.props;

        this.setState({
            value: newVal
        },()=>{
            onValueChange(newVal);
        });
    }

    goNext(){
        const { recordDates } = this.props;
        const { value } = this.state;

        const newVal = value + 1 <= recordDates.length - 1 ? value + 1 : 0;
        this.updateValue(newVal);
    }

    goPrev(){
        const { recordDates } = this.props;
        const { value } = this.state;

        const newVal = value - 1 >= 0 ? value - 1 : recordDates.length - 1;
        this.updateValue(newVal);
    }

    togglePlay(){

        const { isPlaying } = this.state;

        const newVal = !isPlaying;

        this.setState({
            isPlaying: newVal
        },()=>{

            if(newVal){
                this.play();
            } else {
                this.pause();
            }

        })

    }

    play(){
        this.playInterval = setInterval(()=>{
            this.goNext();
        }, 3000);
    }

    pause(){
        clearInterval(this.playInterval);
    }

    updateSeaIceExtAreaValues(){

        let antarcticValues:Array<number> = [];
        let arcticValues:Array<number> = [];
        
        this.props.seaIceExtByMonthData['antarctic'].forEach(d=>{
            antarcticValues = antarcticValues.concat(d.values);
        })

        this.props.seaIceExtByMonthData['arctic'].forEach(d=>{
            arcticValues = arcticValues.concat(d.values);
        });

        const seaIceExtAreaValues = {
            antarctic: antarcticValues,
            arctic: arcticValues
        };

        this.setState({
            seaIceExtAreaValues
        });
    }

    onChangeHandler(event:React.FormEvent<HTMLInputElement>){
        const newVal = +event.currentTarget.value || 0;
        // console.log(newVal);
        this.updateValue(newVal);
    }

    getLabelForActiveDate(){
        const { recordDates } = this.props;
        const activeDate = recordDates.length ? recordDates[this.state.value] : null;
        const monthIdx = activeDate ? activeDate.month - 1 : undefined;
        const monthName = dateFns.getMonthName(monthIdx, true);
        return activeDate ? `${monthName} ${activeDate.year}` : '';
    }

    getSeaIceExtArea(){
        const { polarRegion, medianSeaIceExtByMonthData, activeRecordDate } = this.props;
        const { seaIceExtAreaValues, value } = this.state;

        const medianVal = activeRecordDate ? medianSeaIceExtByMonthData[polarRegion][activeRecordDate.month - 1] : 0;
        const values = seaIceExtAreaValues[polarRegion];

        return {
            area: values[value] || 0,
            median: medianVal
        };
    }

    getSeaIceExtInfo(){

        const { recordDates } = this.props;

        if(!recordDates.length){
            return null;
        }

        const activeRecordDateLabel = this.getLabelForActiveDate();
        const areaForActiveRecordDate = this.getSeaIceExtArea();

        const areaDiff = areaForActiveRecordDate.area - areaForActiveRecordDate.median;
        const areaDiffInPct = (( Math.abs(areaDiff) /areaForActiveRecordDate.median ) * 100).toFixed(1);
        const areaDiffDesc = areaDiff > 0 
        ? <span>{areaDiffInPct}% above median</span>
        : <span>{areaDiffInPct}% below median</span>;

        return (
            <div className='info-window'>
                <span className='font-size--3'>{activeRecordDateLabel}</span>
                <span className='font-size--1'>{areaForActiveRecordDate.area} million km<sup>2</sup></span>
                <span className='font-size--3'>{areaDiffInPct !== '0.0' ? areaDiffDesc : 'same as median'}</span>
            </div>
        )
    }

    componentDidUpdate(prevProps:IProps){
        if(this.props.recordDates !== prevProps.recordDates){
            this.updateValue(this.props.recordDates.length - 1);
        }

        if(this.props.seaIceExtByMonthData !== prevProps.seaIceExtByMonthData){
            this.updateSeaIceExtAreaValues();
        }
    }

    render(){

        const  { isPlaying } = this.state;

        const maxVal = this.props.recordDates.length - 1;

        const infoWindow = this.getSeaIceExtInfo();

        return (
            <div id='time-control-container'>

                <div className='time-control'>

                    <div className='play-btn widget-btn' onClick={this.togglePlay}>
                        {
                            isPlaying 
                            ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height='32' width='32'><path d="M11 6H8a2.006 2.006 0 0 0-2 2v15a2.006 2.006 0 0 0 2 2h3a2.006 2.006 0 0 0 2-2V8a2.006 2.006 0 0 0-2-2zm1 17a1.001 1.001 0 0 1-1 1H8a1.001 1.001 0 0 1-1-1V8a1.001 1.001 0 0 1 1-1h3a1.001 1.001 0 0 1 1 1zM23 6h-3a2.006 2.006 0 0 0-2 2v15a2.006 2.006 0 0 0 2 2h3a2.006 2.006 0 0 0 2-2V8a2.006 2.006 0 0 0-2-2zm1 17a1.001 1.001 0 0 1-1 1h-3a1.001 1.001 0 0 1-1-1V8a1.001 1.001 0 0 1 1-1h3a1.001 1.001 0 0 1 1 1z"/></svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height='32' width='32'><path d="M9 5v21l16-10.498zm1 1.853l13.177 8.65L10 24.147z"/></svg>
                        }
                    </div>

                    {infoWindow}

                    <div className='time-slider'>
                        <div className='margin-left-1 margin-right-1'>

                            <form className="calcite-slider">
                                <label>
                                    <input type="range" min="0" max={maxVal} value={this.state.value} step="1" onChange={this.onChangeHandler}></input>
                                </label>
                            </form>

                            <div className='slider-ticks-wrap'>
                                
                            </div>

                        </div>
                    </div>

                    <div className='previous-btn widget-btn' onClick={this.goPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height='32' width='32'><path d="M27.202 2h-23.4A1.802 1.802 0 0 0 2 3.798V27.2A1.8 1.8 0 0 0 3.8 29h23.4a1.8 1.8 0 0 0 1.8-1.8V3.798A1.8 1.8 0 0 0 27.202 2zM28 27.2a.8.8 0 0 1-.8.8H3.8a.801.801 0 0 1-.8-.8V3.798A.801.801 0 0 1 3.802 3h23.4a.798.798 0 0 1 .798.798zM20 26L9 15.5 20 5zM19 7.337L10.448 15.5 19 23.663z"/></svg>
                    </div>

                    <div className='next-btn widget-btn' onClick={this.goNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height='32' width='32'><path d="M27.198 2h-23.4A1.8 1.8 0 0 0 2 3.798V27.2A1.8 1.8 0 0 0 3.8 29h23.4a1.8 1.8 0 0 0 1.8-1.8V3.798A1.802 1.802 0 0 0 27.198 2zM28 27.2a.801.801 0 0 1-.8.8H3.8a.8.8 0 0 1-.8-.8V3.798A.798.798 0 0 1 3.798 3h23.4a.801.801 0 0 1 .802.798zM11 5l11 10.5L11 26zm1 18.663l8.552-8.163L12 7.337z"/></svg>
                    </div>

                </div>

            </div>
        );
    }
}