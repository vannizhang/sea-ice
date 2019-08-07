import './style/index.scss';
import "@babel/polyfill";

// required by ArcGIS REST JS 
// import "isomorphic-fetch";
// import "es6-promise";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';


const initApp = ()=>{

    ReactDOM.render(
        <App/>, 
        document.getElementById('appRootDiv')
    );
};

initApp();