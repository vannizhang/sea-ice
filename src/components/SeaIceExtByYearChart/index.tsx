import './style.scss';

import * as React from 'react';
import * as d3 from 'd3';

import { IMinMaxSeaExtByYearData, IMinMaxSeaExtByYearDataItem, PolarRegion } from '../../types';

interface IProps {
    data: IMinMaxSeaExtByYearData
    polarRegion:PolarRegion,
};

interface IState {
    svg:any,
    height: number,
    xScale0: d3.ScaleBand<string>,
    xScale1: d3.ScaleBand<string>,
    yScale: d3.ScaleLinear<number, number>,
    xAxis:d3.AxisContainerElement,
    yAxis:d3.AxisContainerElement
};

export default class SeaIceExtByYearChart extends React.PureComponent<IProps, IState> {

    private svgElementId = 'SeaIceExtByYearChartSvg';
    private containerRef = React.createRef<HTMLDivElement>();
    
    constructor(props:IProps){
        super(props);

        this.state = {
            svg: null,
            height: 0,
            xScale0: null,
            xScale1: null,
            yScale: null,
            xAxis: null,
            yAxis: null
        };
    }

    setSvg(svg:any){
        this.setState({
            svg: svg
        });
    }

    setScales(x0:any, x1:any, y:any){
        this.setState({
            xScale0: x0,
            xScale1: x1,
            yScale: y
        });
    }

    setAxis(x:any, y:any){
        this.setState({
            xAxis: x,
            yAxis: y
        });
    }

    setHeight(height:number){
        this.setState({
            height: height
        });
    }

    initSvg(){
        const container = this.containerRef.current;
        const margin = {top: 5, right: 10, bottom: 20, left: 40};

        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;
        this.setHeight(height);

        const svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", this.svgElementId)
            .attr("class", 'sea-ice-ext-by-year-chart')
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.setSvg(svg);

        const xScale0 = d3.scaleBand().range([0, width]);
        const xScale1 = d3.scaleBand().range([0, xScale0.bandwidth() - 10]);

        const yScale = d3.scaleLinear().range([height, 0]);
        this.setScales(xScale0, xScale1, yScale);

        const xAxis = d3.axisBottom(xScale0);
        const yAxis = d3.axisLeft(yScale).ticks(5);
        this.setAxis(xAxis, yAxis);

    }

    drawChart(){
        this.updateDomainForXScale();
        this.updateDomainForYScale();
        this.drawXLabels();
        this.drawYLabels();
        this.drawBars();
    }

    updateDomainForXScale = ()=>{
        const xDomain = this.props.data[this.props.polarRegion]
        .map((d:IMinMaxSeaExtByYearDataItem)=>{ 
            return d.year.toString(); 
        });
        this.state.xScale0.domain(xDomain);
    }

    updateDomainForYScale = ()=>{
        const maxVals = this.props.data[this.props.polarRegion]
        .map((d:IMinMaxSeaExtByYearDataItem)=>{ 
            return d.max; 
        });
        const yScaleMax = d3.max(maxVals);
        this.state.yScale.domain([0, yScaleMax]);
    }

    drawXLabels(){
        const svg = this.state.svg;
        const xAxis = this.state.xAxis;
        const xAxisLabel = svg.selectAll('.x.axis');
        if(!xAxisLabel.size()){
            svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.state.height + ")")
            .call(xAxis);
        } else {
            xAxisLabel.attr("transform", "translate(0," + this.state.height + ")").call(xAxis);
        }
    }

    drawYLabels(){
        const svg = this.state.svg;
        const yAxis = this.state.yAxis;
        const yAxisLabel = svg.selectAll('.y.axis');

        if(!yAxisLabel.size()){
            svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        } else {
            yAxisLabel.call(yAxis);
        }
    }

    drawBars(){
        // const { svg, xScale0, xScale1, yScale, height } = this.state;
        // const data = this.props.data[this.props.polarRegion];

        // svg.append("g").selectAll("g")
        //     .data(data)
        // .enter().append("g")
        //     .style("fill", '#987654')
        //     .attr("transform", (d:IMinMaxSeaExtByYearDataItem)=>{ return "translate(" + xScale1(d.year.toString()) + ",0)"; })
        // .selectAll("rect")
        //     .data((d:IMinMaxSeaExtByYearDataItem)=>{ return d; })
        // .enter().append("rect")
        //     .attr("width", xScale1.bandwidth())
        //     .attr("height", yScale)
        //     .attr("x", function(d:IMinMaxSeaExtByYearDataItem) { return xScale0(d.year.toString()); })
        //     .attr("y", function(d:IMinMaxSeaExtByYearDataItem) { return height - yScale(d.min); });
    }

    componentDidUpdate(){
        
        if(this.props.data){

            // const min = this.props.data['arctic'].map(d=>{
            //     return d.min
            // });

            // const max = this.props.data['arctic'].map(d=>{
            //     return d.max
            // });

            // console.log([
            //     min, max
            // ]);

            this.drawChart();
        }
        
    }

    componentDidMount(){
        this.initSvg();
    }

    render(){
        return (
            <div className='sea-ice-ext-by-year-chart-wrap' ref={this.containerRef} style={{
                width: '400px',
                height: '250px'
            }}></div>
        );
    }
}