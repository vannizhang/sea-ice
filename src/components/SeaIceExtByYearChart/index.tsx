import './style.scss';

import * as React from 'react';
import * as d3 from 'd3';

import { IMinMaxSeaExtByYearData, PolarRegion } from '../../types';
import config from './config';

interface IProps {
    data: IMinMaxSeaExtByYearData
    polarRegion:PolarRegion,
    onHover:(year?:number)=>void
};

interface IState {
    svg:any,
    height: number,
    width: number,
    xScale0: d3.ScaleBand<number>,
    xScale1: d3.ScaleBand<number>,
    yScale: d3.ScaleLinear<number, number>,
    chartData: Array<Array<number>>,
    years:Array<number>
};

export default class SeaIceExtByYearChart extends React.PureComponent<IProps, IState> {

    private containerRef = React.createRef<HTMLDivElement>();
    
    constructor(props:IProps){
        super(props);

        this.state = {
            svg: null,
            height: 0,
            width: 0,
            xScale0: null,
            xScale1: null,
            yScale: null,
            chartData: [],
            years: null
        };
    }

    setChartData(){

        const data = this.props.data[this.props.polarRegion];

        const minValues = data.map(d=>{
            return d.min;
        });

        const maxValues = data.map(d=>{
            return d.max;
        });

        const years = data.map(d=>{
            return d.year;
        });

        this.setState({
            chartData: [
                maxValues, minValues
            ],
            years: years
        },()=>{
            this.drawChart();
        });
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

        const xScale0 = d3.scaleBand();
        const xScale1 = d3.scaleBand(); 
        const yScale = d3.scaleLinear().range([height, 0]);
        this.setScales(xScale0, xScale1, yScale);

        const svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", 'sea-ice-ext-by-year-chart')
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.setSvg(svg);
    }

    drawChart(){
        this.updateDomainForXScale();
        this.updateDomainForYScale();
        this.drawXLabels();
        this.drawYLabels();
        this.drawBars();
    }

    updateDomainForXScale = ()=>{
        const xDomain0 = d3.range(this.state.chartData[0].length)
        this.state.xScale0.domain(xDomain0).range([0, this.state.width]);

        const xDomain1 = d3.range(this.state.chartData.length);
        // this.state.xScale1.domain(xDomain1).range([0, this.state.xScale0.bandwidth()*.6]);
        this.state.xScale1.domain(xDomain1).range([0, this.state.xScale0.bandwidth()*1.1]);
    }

    updateDomainForYScale = ()=>{
        const maxValues = this.state.chartData[0];
        const yScaleMax = d3.max(maxValues);
        this.state.yScale.domain([0, yScaleMax]);
    }

    drawXLabels(){
        const { svg, xScale0, years } = this.state;

        // show the ticks on xAxis for every 4 years
        const tickValues = xScale0.domain()
            .filter((d)=>{
                return !(years[d] % 4);
            });
        
        const xAxis = d3.axisBottom(xScale0)
                        .tickValues(tickValues)
                        .tickFormat((d)=>{
                            return years[d].toString();
                        });

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
        const { svg, yScale } = this.state;
        // const yAxis = this.state.yAxis;
        const yAxis = d3.axisLeft(yScale).ticks(5);

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
        const { onHover } = this.props;
        const { svg, xScale0, xScale1, yScale, height, chartData, years } = this.state;

        const barGroupClassName = 'sea-ice-ext-by-year-bar-group';

        const barGroups = svg.selectAll('.' + barGroupClassName);

        if(barGroups){
            barGroups.remove().exit();
        }

        svg.append("g")
            .attr('class', barGroupClassName)
            .selectAll("g")
            .data(chartData)
        .enter().append("g")
            .style("fill", (d:any, i:number)=>{
                return i === 0 ? config.color.maxVal : config.color.minVal
            })
            .attr("transform", (d:any, i:number)=>{ 
                return "translate(" + 0 + ",0)"; 
            })
            // .attr("transform", (d:any, i:number)=>{ 
            //     return "translate(" + xScale1(i) + ",0)"; 
            // })
        .selectAll("rect")
            .data((d:any)=>{ return d; })
        .enter().append("rect")
            .attr("width", xScale1.bandwidth())
            .attr("height", (d:number)=>{ 
                return height - yScale(d); 
            })
            .attr("x", (d:any, i:number)=>{ 
                return xScale0(i); 
            })
            .attr("y", (d:number)=>{ 
                return yScale(d); 
            })
            .style('opacity', .8)
            .on('mouseover', (d:any, i:number)=>{
                // console.log(years[i]);
                onHover(years[i])
            })
            .on('mouseout', (d:any, i:number)=>{
                onHover(undefined);
            });
    }

    componentDidUpdate(prevProps:IProps, prevState:IState){
        
        if( this.props.data !== prevProps.data || 
            this.props.polarRegion !== prevProps.polarRegion
        ){
            if(this.props.data){
                this.setChartData();
            }
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