import * as React from 'react';
import * as d3 from 'd3';

import { PolarRegion, ISeaIceExtByMonthData } from '../../types';

interface IProps {
    data: ISeaIceExtByMonthData
    polarRegion:PolarRegion,
};

interface IState {
    svg:any,
    height: number,
    width: number,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    chartData: Array<Array<number>>
};

export default class SeaIceExtByYearChart extends React.PureComponent<IProps, IState> {

    private containerRef = React.createRef<HTMLDivElement>();

    constructor(props:IProps){
        super(props);

        this.state = {
            svg: null,
            height: 0,
            width: 0,
            xScale: null,
            yScale: null,
            chartData: []
        };
    }

    
    setSvg(svg:any){
        this.setState({
            svg: svg
        });
    }

    setScales(x:any, y:any){
        this.setState({
            xScale: x,
            yScale: y
        });
    }

    setHeightWidth(height:number, width:number){
        this.setState({
            height: height,
            width: width
        });
    }

    initSvg(){
        const container = this.containerRef.current;
        const margin = {top: 15, right: 10, bottom: 25, left: 25};

        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;
        this.setHeightWidth(height, width);

        const xScale = d3.scaleLinear().range([0, width]);
        const yScale = d3.scaleLinear().range([height, 0]);
        this.setScales(xScale, yScale);

        const svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", 'sea-ice-monthly-trend-chart')
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.setSvg(svg);
    }

    drawChart(){
        this.updateDomainForXScale();
        this.updateDomainForYScale();
        this.drawXLabels();
        this.drawYLabels();
        this.drawLines();
    }

    updateDomainForXScale = ()=>{
        const { xScale } = this.state;
        
    }

    updateDomainForYScale = ()=>{
        const { yScale } = this.state;
    }

    drawXLabels(){
        const { svg, xScale } = this.state;
    }

    drawYLabels(){
        const { svg, yScale } = this.state;
    }

    drawLines(){
        const { svg, xScale, yScale, height, chartData } = this.state;
    }

    componentDidMount(){
        this.initSvg();
    }

    render(){
        return (
            <div className='sea-ice-monthly-trend-chart-wrap' ref={this.containerRef} style={{
                width: '400px',
                height: '250px'
            }}></div>
        );
    }
}