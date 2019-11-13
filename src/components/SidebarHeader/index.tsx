import './style.scss';
import * as React from 'react';

interface IProps {
  title: string;
}
// interface IState {}

export default class SideBarHeader extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div className="sidebar-header">
        <div className="text-white">
          <span className="font-size-3 avenir-light">Sea Ice Aware</span>
        </div>
        <div
          className="text-white about-app-btn js-modal-toggle"
          data-modal="about"
        >
          <span className="icon-ui-description"></span>
          <span className="font-size--3">About this app</span>
        </div>
      </div>
    );
  }
}
