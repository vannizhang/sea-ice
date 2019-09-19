
import './style.scss';
import * as React from 'react';

interface IProps {
    height?: number,
    title: string,
    toggleChartOnClick: ()=>void
};
interface IState {};

export default class MobileHeader extends React.PureComponent<IProps, IState> {
    
    constructor(props:IProps){
        super(props);
    }

    render(){

        const { height, title, toggleChartOnClick } = this.props;

        return (
            <div className='mobile-header' style={{
                height: height || 50
            }}>

                <div className='app-title'>
                    <span className='text-white font-size-2 avenir-light'>{title}</span>
                </div>

                <div className='nav-btns'>
                    <span className='nav-btn toggle-chart-btn' onClick={toggleChartOnClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24"><path d="M22 20h-1v-8h1zM18 7h-1v13h1zm-4-5h-1v18h1zm-4 5H9v13h1zm-4 5H5v8h1zM2 22V0H1v23h23v-1z"/></svg>
                    </span>
                </div>
                
            </div>
        );
    }
}