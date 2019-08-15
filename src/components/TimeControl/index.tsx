import './style.scss';
import * as React from 'react';

import { 
    PolarRegion, 
    ISeaIceExtByMonthData, 
    IRecordDate 
} from '../../types';

interface IProps {
    polarRegion:PolarRegion,
    recordDates: Array<IRecordDate>
    activeRecordDate: IRecordDate,
    seaIceExtByMonthData:ISeaIceExtByMonthData,
};

interface IState {
};

export default class TimeControl extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);
    }

    render(){
        return (
            <div></div>
        );
    }
}