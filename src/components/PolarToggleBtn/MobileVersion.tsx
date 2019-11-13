import './style.scss';
import * as React from 'react';

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
      const modifierClasses = ['crumb'];

      if (d.value === this.props.activePolarRegion) {
        modifierClasses.push('is-active');
      }

      return (
        <span
          key={`polar-toggle-btn-${i}`}
          className={modifierClasses.join(' ')}
          onClick={this.props.onClick.bind(this, d.value)}
        >
          {d.shortLabel}
        </span>
      );
    });

    return <nav className="breadcrumbs">{btns}</nav>;
  }
}
