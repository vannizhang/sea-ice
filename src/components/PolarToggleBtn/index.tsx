import './style.scss';
import * as React from 'react';
import ToggleBtn from './ToggleBtn';

import { PolarRegion } from '../../types';

interface IProps {
  activePolarRegion: PolarRegion;
  onClick: (value: string) => void;
}
// interface IState {}

import data from './data';

export default class PolarToggleBtns extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    const btns = data.map((d, i) => {
      return (
        <ToggleBtn
          key={`polar-toggle-btn-${i}`}
          label={d.label}
          value={d.value}
          isActive={d.value === this.props.activePolarRegion ? true : false}
          onClick={this.props.onClick}
        />
      );
    });

    return <div className="polar-toggle-btns">{btns}</div>;
  }
}
