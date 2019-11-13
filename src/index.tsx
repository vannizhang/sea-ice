import './style/index.scss';
import '@babel/polyfill';

// required by ArcGIS REST JS
import 'isomorphic-fetch';
import 'es6-promise';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import { miscFns } from 'helper-toolkit-ts';

const initApp = () => {
  const isMobileDevice = miscFns.isMobileDevice();
  const isNarrowScreen = window.outerWidth < 860 ? true : false;
  const isMobileView = isMobileDevice || isNarrowScreen;

  ReactDOM.render(
    <App isMobile={isMobileView} />,
    document.getElementById('appRootDiv')
  );
};

initApp();
