import './SliderTicks.scss';
import * as React from 'react';

import { IRecordDate } from '../../types';

interface IProps {
  recordDates: Array<IRecordDate>;
}
// interface IState {}

export default class TimeControl extends React.PureComponent<IProps> {
  private containerRef = React.createRef<HTMLDivElement>();

  constructor(props: IProps) {
    super(props);
  }

  getTicks(): JSX.Element {
    const { recordDates } = this.props;
    const uniqueYear = Array.from(new Set(recordDates.map((d) => d.year)));

    const container = this.containerRef.current;
    const containerWidth = container ? container.clientWidth : 0;
    const gapWidth = uniqueYear.length
      ? (containerWidth - uniqueYear.length - 5) / (uniqueYear.length - 1)
      : 0;

    const ticks = uniqueYear.map((d, i) => {
      const xFromLeft = i * gapWidth;

      const style = {
        transform: `translate(${xFromLeft}px)`,
      };

      return (
        <span
          key={`time-slider-tick-${i}`}
          className="tick"
          data-year={d}
          style={style}
        ></span>
      );
    });

    const labels = uniqueYear
      .filter((d, i) => {
        return i >= 2 && !(d % 10);
      })
      .map((year, i) => {
        const posByYear = uniqueYear.indexOf(year);

        const xFromLeftByYear = (posByYear / uniqueYear.length) * 100;

        const style = {
          position: 'absolute' as 'absolute',
          top: 0,
          left: xFromLeftByYear + '%',
          transform: `translate(-50%)`,
        };

        return (
          <span
            key={`time-slider-tick-label-${i}`}
            className="tick-label"
            data-index={year}
            style={style}
          >
            {year}
          </span>
        );
      });

    return (
      <div className="slider-ticks-wrap">
        <div className="slider-ticks-group">{ticks}</div>
        <div className="slider-labels-group">{labels}</div>
      </div>
    );
  }

  render() {
    const ticks = this.getTicks();

    return <div ref={this.containerRef}>{ticks}</div>;
  }
}
