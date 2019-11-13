import * as React from 'react';

interface IProps {
  label: string;
  value: string;
  isActive: boolean;
  onClick: (value: string) => void;
}

// interface IState {}

export default class PolarToggleBtn extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);

    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler() {
    this.props.onClick(this.props.value);
  }

  render() {
    const isActive = this.props.isActive ? 'is-active' : '';

    return (
      <div
        className={`polar-toggle-btn font-size-2 text-center avenir-light ${isActive}`}
        onClick={this.onClickHandler}
      >
        {this.props.label}
      </div>
    );
  }
}
