import './style.scss';

import * as React from 'react';
import * as d3 from 'd3';

import {
  PolarRegion,
  ISeaIceExtByMonthData,
  IMedianSeaIceExtByMonth,
} from '../../types';

interface IProps {
  data: ISeaIceExtByMonthData;
  medianData: IMedianSeaIceExtByMonth;
  polarRegion: PolarRegion;
  yearOnHover: number;
}

interface IState {
  svg: any;
  height: number;
  width: number;
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  chartData: Array<Array<number>>;
  medianData: Array<number>;
  years: Array<number>;
}

export default class SeaIceExtByYearChart extends React.PureComponent<
  IProps,
  IState
> {
  private containerRef = React.createRef<HTMLDivElement>();
  private trendLineClassName = 'monthly-trend-line';

  constructor(props: IProps) {
    super(props);

    this.state = {
      svg: null,
      height: 0,
      width: 0,
      xScale: null,
      yScale: null,
      chartData: [],
      medianData: [],
      years: [],
    };
  }

  setSvg(svg: any) {
    this.setState({
      svg: svg,
    });
  }

  setScales(x: any, y: any) {
    this.setState({
      xScale: x,
      yScale: y,
    });
  }

  setHeightWidth(height: number, width: number) {
    this.setState({
      height: height,
      width: width,
    });
  }

  setChartData() {
    const data = this.props.data[this.props.polarRegion].filter((d, i) => {
      // only include data for years with full 12 month of data
      // except the for the last item, which is the current year
      return (
        d.values.length === 12 ||
        i === this.props.data[this.props.polarRegion].length - 1
      );
    });
    // .filter(d=>d.values.length === 12);

    const chartData = data.map((d) => {
      const values = d.values.filter((n) => n);
      return values;
    });

    const medianData = this.props.medianData[this.props.polarRegion];

    const years = data.map((d) => d.year);

    this.setState(
      {
        chartData,
        medianData,
        years,
      },
      () => {
        this.drawChart();
      }
    );
  }

  initSvg() {
    const container = this.containerRef.current;
    const margin = { top: 15, right: 10, bottom: 25, left: 25 };

    const width = container.offsetWidth - margin.left - margin.right;
    const height = container.offsetHeight - margin.top - margin.bottom;
    this.setHeightWidth(height, width);

    const xScale = d3
      .scaleLinear()
      .range([0, width])
      .domain([0, 11]); // 12 month on x scale

    const yScale = d3.scaleLinear().range([height, 0]);

    this.setScales(xScale, yScale);

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('class', 'sea-ice-monthly-trend-chart')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.setSvg(svg);
  }

  drawChart() {
    // this.updateDomainForXScale();
    this.updateDomainForYScale();
    this.drawXLabels();
    this.drawYLabels();
    this.drawLines();
  }

  // updateDomainForXScale = ()=>{
  //     const { xScale } = this.state;
  // }

  updateDomainForYScale = () => {
    const { yScale, chartData } = this.state;

    const minVals = chartData.map((d) => d3.min(d));
    const minVal = Math.floor(d3.min(minVals));

    const maxVals = chartData.map((d) => d3.max(d));
    const maxVal = Math.ceil(d3.max(maxVals));

    // console.log(chartData, minVal, maxVal);

    yScale.domain([minVal, maxVal]);
  };

  drawXLabels() {
    const { svg, height, xScale } = this.state;

    const labels = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => {
      return labels[i];
    });

    const xAxisLabel = svg.selectAll('.x.axis');

    if (!xAxisLabel.size()) {
      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);
    } else {
      xAxisLabel.attr('transform', 'translate(0,' + height + ')').call(xAxis);
    }
  }

  drawYLabels() {
    const { svg, yScale } = this.state;

    const yAxis = d3.axisLeft(yScale).ticks(5);

    const yAxisLabel = svg.selectAll('.y.axis');

    if (!yAxisLabel.size()) {
      svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    } else {
      yAxisLabel.call(yAxis);
    }
  }

  drawLines() {
    const { svg, xScale, yScale, chartData, medianData } = this.state;

    const lineGroupClassName = 'monthly-trend-lines';
    const medianLineClassName = 'median-monthly-trend-line';

    const existingLineGroups = svg.selectAll('.' + lineGroupClassName);
    const existingMedianLine = svg.selectAll('.' + medianLineClassName);

    if (existingLineGroups) {
      existingLineGroups.remove().exit();
    }

    if (existingMedianLine) {
      existingMedianLine.remove().exit();
    }

    const valueline = d3
      .line()
      .curve(d3.curveCardinal)
      .x((d) => {
        return xScale(d[0]);
      })
      .y((d) => {
        return yScale(d[1]);
      });

    const lines = svg
      .append('g')
      .attr('class', 'monthly-trend-lines')
      .selectAll('.monthly-trend-line-group')
      .data(chartData)
      .enter()
      .append('g')
      .attr('class', 'monthly-trend-line-group')
      .append('path')
      // .attr('class', 'monthly-trend-line')
      .attr('class', (d: any, idx: number) => {
        const modifierClass = [this.trendLineClassName];

        if (idx === chartData.length - 1) {
          modifierClass.push('is-current-year');
        }

        return modifierClass.join(' ');
      })
      .attr('data-index', (d: any, idx: number) => idx)
      .attr('d', (lineData: any) => {
        const data = lineData.map((value: number, index: number) => {
          return [+index, +value];
        });
        return valueline(data);
      });
    // .on('mouseover', (d:any, i:number)=>{
    //     console.log(i);
    // })

    const medianLine = svg
      .append('path')
      .data([medianData])
      .attr('class', medianLineClassName)
      .style('stroke-dasharray', '6, 6')
      .attr('d', (d: any) => {
        const data = d.map((value: number, index: number) => {
          return [+index, +value];
        });
        return valueline(data);
      });
  }

  highlightYearOnHover() {
    const { yearOnHover } = this.props;
    const { years } = this.state;

    const yearOnHoverIndex = years.indexOf(yearOnHover);

    d3.selectAll('.' + this.trendLineClassName).classed('is-active', false);

    if (yearOnHoverIndex !== -1) {
      const lineToHighlight = d3.select(
        `.${this.trendLineClassName}[data-index='${yearOnHoverIndex}']`
      );
      lineToHighlight.classed('is-active', true);
    }
  }

  getInfoDiv() {
    const { yearOnHover } = this.props;

    const titleStr = 'Monthly Change';

    const title = yearOnHover ? (
      <div className="sea-ice-ext-color is-bright">
        <span>
          {yearOnHover} {titleStr}
        </span>
      </div>
    ) : (
      <div className="sea-ice-ext-color">
        <span>{titleStr}</span>
      </div>
    );

    return (
      <div className="info-window font-size--3">
        {title}
        <div className="text-right">
          <span className="margin-right-half">current year</span>
          <span className="median-sea-ice-ext-color">monthly median</span>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (!this.state.svg) {
      this.initSvg();
    }

    if (this.props.data) {
      if (
        this.props.data !== prevProps.data ||
        this.props.polarRegion !== prevProps.polarRegion
      ) {
        this.setChartData();
      }

      if (this.props.yearOnHover !== prevProps.yearOnHover) {
        this.highlightYearOnHover();
      }
    }
  }

  componentDidMount() {
    if (!this.state.svg && this.props.data) {
      this.initSvg();
      this.setChartData();
    }
  }

  render() {
    const InfoDiv = this.getInfoDiv();

    return (
      <div className="sea-ice-monthly-trend-chart-wrap">
        {InfoDiv}
        <div
          ref={this.containerRef}
          style={{
            width: '100%',
            height: '250px',
          }}
        ></div>
      </div>
    );
  }
}
