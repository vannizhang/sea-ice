import './style.scss';

import * as React from 'react';
import * as d3 from 'd3';

import { IMinMaxSeaExtByYearData } from '../../types';

interface IProps {
    data: IMinMaxSeaExtByYearData
};

interface IState {
    svg:SVGElement,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    xAxis:d3.AxisContainerElement,
    yAxis:d3.AxisContainerElement
};

export default class SeaIceExtByYearChart extends React.PureComponent<IProps, IState> {

    private containerRef = React.createRef<HTMLDivElement>();
    
    constructor(props:IProps){
        super(props);

        this.state = {
            svg: null,
            xScale: null,
            yScale: null,
            xAxis: null,
            yAxis: null
        };
    }

    initSvg(){

    }

    componentDidUpdate(){
        console.log(this.props.data)
    }

    componentDidMount(){

    }

    render(){
        return (
            <div className='sea-ice-ext-by-year-chart-wrap' ref={this.containerRef}></div>
        );
    }
}