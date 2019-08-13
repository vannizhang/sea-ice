import './style.scss';

import * as React from 'react';
import * as d3 from 'd3';

import { PolarRegion, ISeaIceExtByMonthData, IMedianSeaIceExtByMonth } from '../../types';

interface IProps {
    data: ISeaIceExtByMonthData,
    medianData: IMedianSeaIceExtByMonth,
    polarRegion:PolarRegion,
};

interface IState {
    svg:any,
    height: number,
    width: number,
    xScale: d3.ScaleLinear<number, number>,
    yScale: d3.ScaleLinear<number, number>,
    chartData: Array<Array<number>>,
    medianData:Array<number>
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
            chartData: [],
            medianData: []
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

    setChartData(){
        
        // can only draw line for year with full 12 month of data
        const data = this.props.data[this.props.polarRegion]
                .filter(d=>d.values.length === 12);
        
        // const years = data.map(d=>d.year);

        const chartData = data.map(d=>d.values);

        const medianData = this.props.medianData[this.props.polarRegion];

        // console.log(years, chartData);

        this.setState({
            chartData,
            medianData
        },()=>{
            this.drawChart();
        });
    }

    initSvg(){
        const container = this.containerRef.current;
        const margin = {top: 15, right: 10, bottom: 25, left: 25};

        const width = container.offsetWidth - margin.left - margin.right;
        const height = container.offsetHeight - margin.top - margin.bottom;
        this.setHeightWidth(height, width);

        const xScale = d3.scaleLinear()
            .range([0, width])
            .domain([0, 11]); // 12 month on x scale

        const yScale = d3.scaleLinear()
            .range([height, 0])
            
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
        // this.updateDomainForXScale();
        this.updateDomainForYScale();
        this.drawXLabels();
        this.drawYLabels();
        this.drawLines();
    }

    // updateDomainForXScale = ()=>{
    //     const { xScale } = this.state;
    // }

    updateDomainForYScale = ()=>{
        const { yScale, chartData } = this.state;

        const minVals = chartData.map(d=>d3.min(d));
        const minVal = Math.floor(d3.min(minVals));

        const maxVals = chartData.map(d=>d3.max(d));
        const maxVal = Math.ceil(d3.max(maxVals));

        // console.log(minVal, maxVal);

        yScale.domain([minVal, maxVal]);
    }

    drawXLabels(){
        const { svg, height, xScale } = this.state;

        const labels = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const xAxis = d3.axisBottom(xScale)
                    .tickFormat((d,i)=>{
                        return labels[i];
                    });

        const xAxisLabel = svg.selectAll('.x.axis');

        if(!xAxisLabel.size()){
            svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        } else {
            xAxisLabel.attr("transform", "translate(0," + height + ")").call(xAxis);
        }
    }

    drawYLabels(){
        const { svg, yScale } = this.state;

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

    drawLines(){
        const { svg, xScale, yScale, chartData, medianData } = this.state;

        const lineGroupClassName = 'monthly-trend-lines';
        const medianLineClassName = 'median-monthly-trend-line';

        const existingLineGroups = svg.selectAll('.' + lineGroupClassName);
        const existingMedianLine = svg.selectAll('.' + medianLineClassName);

        if(existingLineGroups){
            existingLineGroups.remove().exit();
        }

        if(existingMedianLine){
            existingMedianLine.remove().exit();
        }

        const valueline = d3.line()
            .curve(d3.curveCardinal)
            .x((d)=>{ 
                return xScale(d[0]); 
            })
            .y((d)=>{ 
                return yScale(d[1]); 
            });

        const lines = svg.append('g')
                .attr('class', 'monthly-trend-lines')
            .selectAll('.monthly-trend-line-group')
            .data(chartData).enter()
            .append('g')
                .attr('class', 'monthly-trend-line-group')  
            .append('path')
                // .attr('class', 'monthly-trend-line')
                .attr('class', (d:any, idx:number)=>{

                    const modifierClass = ['monthly-trend-line'];

                    if(idx === chartData.length - 1){
                        modifierClass.push('is-active');
                    }

                    return modifierClass.join(' ');
                })
                .attr('d', ( lineData:any )=>{
                    const data = lineData.map((value:number, index:number)=>{
                        return [+index, +value]
                    });
                    return valueline(data);
                });
                // .on('mouseover', (d:any, i:number)=>{
                //     console.log(i);
                // })

        const medianLine = svg.append('path')
            .data([medianData])
            .attr("class", medianLineClassName)
            .style("stroke-dasharray", ("6, 6")) 
            .attr("d", ( d:any )=>{
                const data = d.map((value:number, index:number)=>{
                    return [+index, +value]
                });
                return valueline(data);
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
            <div className='sea-ice-monthly-trend-chart-wrap' ref={this.containerRef} style={{
                width: '400px',
                height: '250px'
            }}></div>
        );
    }
}