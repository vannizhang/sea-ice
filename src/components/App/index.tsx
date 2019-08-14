
import * as React from 'react';

import Map from '../Map';
import InfoPanel from '../InfoPanel';
import { PolarRegion, IRecordDate } from '../../types';
import { queryRecordDates } from '../../services/sea-ice-extents';

interface IProps {};

interface IState {
    polarRegion:PolarRegion,
    recordDates: Array<IRecordDate>
    activeRecordDate: IRecordDate
};

export default class App extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
            polarRegion: 'arctic',
            recordDates: [],
            activeRecordDate: null
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

    async setRecordDates(){
        const recordDates = await queryRecordDates();
        // console.log(recordDates);

        this.setState({
            recordDates
        }, ()=>{
            this.updateActiveRecordDate();
        })
    }

    componentDidMount(){
        this.setRecordDates();
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
                />
            </div>
        )
    }
}
