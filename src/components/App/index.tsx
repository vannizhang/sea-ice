
import * as React from 'react';

import Map from '../Map';

interface IProps {};
interface IState {};

export default class App extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);
    }

    render(){
        return (
            <div id='appContentDiv'>
                <Map />
            </div>
        )
    }
}
