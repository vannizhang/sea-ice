import './style.scss';
import * as React from 'react';

import Map from '../Map';
import InfoPanel from '../InfoPanel';
import TimeControl from '../TimeControl';
import AboutThisApp from '../AboutThisApp';
import SideBarHeader from '../SidebarHeader';
import MobileHeader from '../MobileHeader';
import AppConfig from './config';

import {
  PolarRegion,
  IMinMaxSeaExtByYearData,
  ISeaIceExtByMonthData,
  IMedianSeaIceExtByMonth,
  IRecordDate,
  ISeaIceExtVal2MonthLookup,
} from '../../types';

import {
  queryMinMaxSeaIceExtByYear,
  querySeaIceExtByMonth,
  queryMedianSeaIceExtByMonth,
  queryRecordDates,
  prepareSeaIceExtByMonth,
  generateValue2MonthLookup,
} from '../../services/sea-ice-extents';

interface IProps {
  isMobile: boolean;
}

interface IState {
  polarRegion: PolarRegion;
  recordDates: Array<IRecordDate>;
  activeRecordDate: IRecordDate;
  seaIceExtByYearData: IMinMaxSeaExtByYearData;
  seaIceExtByMonthData: ISeaIceExtByMonthData;
  medianSeaIceExtByMonthData: IMedianSeaIceExtByMonth;
  seaIceExtVal2MonthLookup: ISeaIceExtVal2MonthLookup;
  isMobileInfoWindowVisible: boolean;
}

export default class App extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      polarRegion: 'arctic',
      recordDates: [],
      activeRecordDate: null,
      seaIceExtByYearData: null,
      seaIceExtByMonthData: null,
      medianSeaIceExtByMonthData: null,
      seaIceExtVal2MonthLookup: null,
      isMobileInfoWindowVisible: false,
    };

    this.updatePolarRegion = this.updatePolarRegion.bind(this);
    this.timeControlOnValueChange = this.timeControlOnValueChange.bind(this);
    this.seaIceValOnSelect = this.seaIceValOnSelect.bind(this);
    this.toggleMobileInfoWindow = this.toggleMobileInfoWindow.bind(this);
  }

  updatePolarRegion(polarRegion: PolarRegion) {
    this.setState({
      polarRegion: polarRegion,
    });
  }

  updateActiveRecordDate(index = -1) {
    const { recordDates } = this.state;

    if (!recordDates.length) {
      return;
    }

    index = index === -1 ? recordDates.length - 1 : index;

    const activeRecordDate = recordDates[index];

    this.setState({
      activeRecordDate,
    });
  }

  setSeaIceExtByYearData(data: IMinMaxSeaExtByYearData) {
    this.setState({
      seaIceExtByYearData: data,
    });
  }

  setSeaIceExtByMonthData(
    data: ISeaIceExtByMonthData,
    medianData: IMedianSeaIceExtByMonth
  ) {
    this.setState({
      seaIceExtByMonthData: data,
      medianSeaIceExtByMonthData: medianData,
    });
  }

  setRecordDates(recordDates: Array<IRecordDate>) {
    this.setState(
      {
        recordDates,
      },
      () => {
        this.updateActiveRecordDate();
      }
    );
  }

  setSeaIceVal2MonthLookup(lookup: ISeaIceExtVal2MonthLookup) {
    this.setState({
      seaIceExtVal2MonthLookup: lookup,
    });
  }

  async loadAppData() {
    try {
      const seaIceExtByYear = await queryMinMaxSeaIceExtByYear();

      const seaIceExtByMonthFeatures = await querySeaIceExtByMonth();

      const seaIceExtByMonth: ISeaIceExtByMonthData = {
        antarctic: prepareSeaIceExtByMonth(seaIceExtByMonthFeatures.antarctic),
        arctic: prepareSeaIceExtByMonth(seaIceExtByMonthFeatures.arctic),
      };

      const medianSeaIceExtByMonth = await queryMedianSeaIceExtByMonth();

      const recordDates = await queryRecordDates();

      const seaIceVal2MonthLookup = generateValue2MonthLookup(
        seaIceExtByMonthFeatures
      );

      this.setSeaIceExtByYearData(seaIceExtByYear);
      // console.log(seaIceExtByYear);

      this.setSeaIceExtByMonthData(seaIceExtByMonth, medianSeaIceExtByMonth);
      // console.log(seaIceExtByMonthFeatures);

      this.setRecordDates(recordDates);
      // console.log(recordDates);

      this.setSeaIceVal2MonthLookup(seaIceVal2MonthLookup);
      // console.log(seaIceVal2MonthLookup);
    } catch (err) {
      console.error(err);
    }
  }

  timeControlOnValueChange(index: number) {
    this.updateActiveRecordDate(index);
  }

  seaIceValOnSelect(year: number, value: number) {
    const { seaIceExtByMonthData, recordDates, polarRegion } = this.state;

    // values for the selected year
    const values = seaIceExtByMonthData[polarRegion].filter((d) => {
      return d.year === year;
    })[0].values;

    const monthNum = values.indexOf(value) + 1;

    for (let i = 0, len = recordDates.length; i < len; i++) {
      const d = recordDates[i];

      if (d.year === year && d.month === monthNum) {
        this.updateActiveRecordDate(i);
        break;
      }
    }
  }

  toggleMobileInfoWindow() {
    const { isMobileInfoWindowVisible } = this.state;
    const newValue = !isMobileInfoWindowVisible;

    this.setState({
      isMobileInfoWindowVisible: newValue,
    });
  }

  componentDidMount() {
    this.loadAppData();
  }

  render() {
    const { isMobile } = this.props;
    const { isMobileInfoWindowVisible } = this.state;
    const mobileHeaderHeight = AppConfig['mobile-header-height'] || 50;

    const infoPanel = (
      <InfoPanel
        polarRegion={this.state.polarRegion}
        polarRegionOnChange={this.updatePolarRegion}
        activeRecordDate={this.state.activeRecordDate}
        seaIceExtByYearData={this.state.seaIceExtByYearData}
        seaIceExtByMonthData={this.state.seaIceExtByMonthData}
        medianSeaIceExtByMonthData={this.state.medianSeaIceExtByMonthData}
        seaIceExtVal2MonthLookup={this.state.seaIceExtVal2MonthLookup}
        seaIceValOnSelect={this.seaIceValOnSelect}
        isMobile={isMobile}
      />
    );

    const timeControl = (
      <TimeControl
        polarRegion={this.state.polarRegion}
        recordDates={this.state.recordDates}
        activeRecordDate={this.state.activeRecordDate}
        seaIceExtByMonthData={this.state.seaIceExtByMonthData}
        medianSeaIceExtByMonthData={this.state.medianSeaIceExtByMonthData}
        onValueChange={this.timeControlOnValueChange}
      />
    );

    const desktopSidePanel = !isMobile ? (
      <div className="side-panel fancy-scrollbar">
        <SideBarHeader title={AppConfig.title} />
        {timeControl}
        {infoPanel}
      </div>
    ) : null;

    const mobileInfoPanel =
      isMobile && isMobileInfoWindowVisible ? (
        <div className="floating-panel fancy-scrollbar">{infoPanel}</div>
      ) : null;

    const mobileHeader = isMobile ? (
      <MobileHeader
        title={AppConfig.title}
        height={mobileHeaderHeight}
        toggleChartOnClick={this.toggleMobileInfoWindow}
        polarRegion={this.state.polarRegion}
        polarRegionOnChange={this.updatePolarRegion}
      />
    ) : null;

    const mobileBottomPanel = isMobile ? (
      <div className="mobile-view-bottom-panel">{timeControl}</div>
    ) : null;

    return (
      <div id="appContentDiv" className={isMobile ? 'is-mobile' : ''}>
        <Map
          polarRegion={this.state.polarRegion}
          activeRecordDate={this.state.activeRecordDate}
          padding={{
            top: isMobile ? mobileHeaderHeight : 0,
            bottom: isMobile ? mobileHeaderHeight : 0,
            right: 500
          }}
          isMobile={isMobile}
        />

        <AboutThisApp />

        {desktopSidePanel}

        {mobileHeader}

        {mobileInfoPanel}

        {mobileBottomPanel}
      </div>
    );
  }
}
