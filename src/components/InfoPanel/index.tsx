import './style.scss';
import * as React from 'react';

import PolarToggleBtn from '../PolarToggleBtn';
import SeaIceExtByYearChart from '../SeaIceExtByYearChart';
import MonthlyTrendChart from '../MonthlyTrendChart';

// import { queryMinMaxSeaIceExtByYear, querySeaIceExtByMonth, queryMedianSeaIceExtByMonth } from '../../services/sea-ice-extents'
import {
  PolarRegion,
  IMinMaxSeaExtByYearData,
  ISeaIceExtByMonthData,
  IMedianSeaIceExtByMonth,
  ISeaIceExtVal2MonthLookup,
  IRecordDate,
} from '../../types';

interface IProps {
  polarRegion: PolarRegion;
  polarRegionOnChange: (value: string) => void;
  activeRecordDate: IRecordDate;
  seaIceExtByYearData: IMinMaxSeaExtByYearData;
  seaIceExtByMonthData: ISeaIceExtByMonthData;
  medianSeaIceExtByMonthData: IMedianSeaIceExtByMonth;
  seaIceExtVal2MonthLookup: ISeaIceExtVal2MonthLookup;
  seaIceValOnSelect: (year: number, value: number) => void;
  isMobile?: boolean;
}

interface IState {
  // year value returned by the mouse hover on sea ice ext by year bar chart
  yearOnHover: number;
}

export default class InfoPanel extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      yearOnHover: undefined,
    };

    this.seaIceExtByYearChartOnHover = this.seaIceExtByYearChartOnHover.bind(
      this
    );
  }

  // componentDidMount(){
  // }

  seaIceExtByYearChartOnHover(year: number) {
    // console.log(year);
    this.setState({
      yearOnHover: year,
    });
  }

  render() {
    const { isMobile } = this.props;
    const { yearOnHover } = this.state;

    const toggleBtn = !isMobile ? (
      <div className="trailer-half">
        <PolarToggleBtn
          activePolarRegion={this.props.polarRegion}
          onClick={this.props.polarRegionOnChange}
        />
      </div>
    ) : null;

    return (
      <div id="infoPanelDiv" className="info-panel-container">
        {toggleBtn}

        <div className="trailer-half">
          <SeaIceExtByYearChart
            polarRegion={this.props.polarRegion}
            data={this.props.seaIceExtByYearData}
            seaIceExtVal2MonthLookup={this.props.seaIceExtVal2MonthLookup}
            onHover={this.seaIceExtByYearChartOnHover}
            onClick={this.props.seaIceValOnSelect}
          />
        </div>

        <div className="trailer-half">
          <MonthlyTrendChart
            polarRegion={this.props.polarRegion}
            data={this.props.seaIceExtByMonthData}
            medianData={this.props.medianSeaIceExtByMonthData}
            yearOnHover={yearOnHover}
          />
        </div>

        {/* <div className='padding-left-half padding-right-half text-right'>
                    <a className='js-modal-toggle font-size--3 link-light-gray' href='javascript:void(0);' data-modal="about">
                        <span className='icon-ui-description'></span>
                        about this app
                    </a>
                </div> */}
      </div>
    );
  }
}
