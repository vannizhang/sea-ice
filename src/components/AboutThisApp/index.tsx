import './style.scss';
import * as React from 'react';
import { modal as initCalciteModal } from 'calcite-web/dist/js/calcite-web.min.js';

// interface IProps {}
// interface IState {}

export default class AboutThisApp extends React.PureComponent {
  // constructor(props: IProps) {
  //   super(props);
  // }

  componentDidMount() {
    initCalciteModal();
  }

  render() {
    return (
      <div
        className="js-modal modal-overlay about-this-app-modal"
        data-modal="about"
      >
        <div
          className="modal-content column-12"
          role="dialog"
          aria-labelledby="modal"
        >
          <a
            className="js-modal-toggle link-light-blue right"
            href="#"
            aria-label="close-modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 32 32"
              className="svg-icon"
            >
              <path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z" />
            </svg>
          </a>

          <h3 className="trailer-half">About this App</h3>

          <p>
            Areas of the ocean that have frozen are considered “sea ice,” and
            can vary from slushy, barely solid areas to sheets of ice that are
            meters thick. Since the late 1970s, satellites have been used to
            monitor both the extent and concentration of sea ice around the
            world, and the{' '}
            <a
              className="link-light-blue"
              href="https://nsidc.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              National Snow and Ice Data Center
            </a>{' '}
            generates a sea ice extent analyses from this data. We have applied
            a smoothing algorithm to the original shapefiles accessed from
            NSIDC.
          </p>

          <p>
            This app displays the monthly mean sea ice extent for the{' '}
            <a
              className="link-light-blue"
              href="https://www.arcgis.com/home/item.html?id=4c3f71392afa46f6b45b07653f052030"
              target="_blank"
              rel="noopener noreferrer"
            >
              Arctic
            </a>{' '}
            and{' '}
            <a
              className="link-light-blue"
              href="https://www.arcgis.com/home/item.html?id=a0868b2d72d045e9837b3ad3b0225b7c"
              target="_blank"
              rel="noopener noreferrer"
            >
              Antarctic
            </a>{' '}
            along with the historical median extent. Additionally, graphs are
            used to visualize the minimum and maximum extent for each year
            (top), and the monthly time series for each year (bottom). Use the
            top graph to select specific years to display in the map.{' '}
          </p>

          <p>
            This app was designed by members of the{' '}
            <a
              className="link-light-blue"
              href="https://livingatlas.arcgis.com/en/"
              target="_blank"
              rel="noopener noreferrer"
            >
              ArcGIS Living Atlas of the World
            </a>{' '}
            team.{' '}
          </p>

          <div className="text-right">
            <button className="btn js-modal-toggle">Close</button>
          </div>
        </div>
      </div>
    );
  }
}
