
import './style.scss';
import * as React from 'react';

interface IProps {};
interface IState {};

export default class InfoPanel extends React.PureComponent<IProps, IState> {
    constructor(props:IProps){
        super(props);
    }

    render(){
        return (
            <div id='infoPanelDiv' className='info-panel-container'>

            </div>
        );
    }
}