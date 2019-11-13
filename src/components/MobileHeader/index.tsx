import './style.scss';
import * as React from 'react';

import PolarToggleBtn from '../PolarToggleBtn/MobileVersion';
import { PolarRegion } from '../../types';

interface IProps {
  height?: number;
  title: string;
  polarRegion: PolarRegion;
  toggleChartOnClick: () => void;
  polarRegionOnChange: (value: string) => void;
}
// interface IState {}

export default class MobileHeader extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const {
      height,
      title,
      toggleChartOnClick,
      polarRegion,
      polarRegionOnChange,
    } = this.props;

    return (
      <div
        className="mobile-header"
        style={{
          height: height || 50,
        }}
      >
        <div className="app-title">
          <span className="text-white font-size-2 avenir-light">{title}</span>
        </div>

        <div className="nav-btns">
          <div className="margin-right-1">
            <PolarToggleBtn
              activePolarRegion={polarRegion}
              onClick={polarRegionOnChange}
            />
          </div>

          <span
            className="nav-btn toggle-chart-btn margin-right-1"
            onClick={toggleChartOnClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 16 16"
            >
              <path d="M14 13h-1V6h1zM10 2H9v11h1zM6 6H5v7h1zm-4 8V0H1v15h15v-1z" />
            </svg>
          </span>

          <span className="nav-btn js-modal-toggle" data-modal="about">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 16 16"
            >
              <path d="M7.5 0A7.5 7.5 0 1 0 15 7.5 7.509 7.509 0 0 0 7.5 0zm.001 14.1A6.6 6.6 0 1 1 14.1 7.5a6.608 6.608 0 0 1-6.599 6.6zM7.5 5.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1zM7 7h1v5H7zm2 5H6v-1h3z" />
            </svg>
          </span>
        </div>
      </div>
    );
  }
}
