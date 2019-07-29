import './style.scss';

import * as React from 'react';
import { loadCss, loadModules } from "esri-loader";

import { MapConfig } from './config';

import IWebMap from "esri/WebMap";
import IMapView from 'esri/views/MapView';

interface IProps {};
interface IState {};

loadCss();

export default class Map extends React.PureComponent<IProps, IState> {

    constructor(props:IProps){
        super(props);

        this.state = {
        };
    }

    initMap(){
        loadModules([
            'esri/views/MapView', 
            'esri/WebMap'
        ]).then(([
            MapView, 
            WebMap
        ])=>{

            const webmap:IWebMap = new WebMap({
                portalItem: {
                    id: MapConfig.web_map_id
                }
            });
      
            const view:IMapView = new MapView({
                container: MapConfig.container_id,
                map: webmap,
            });

            view.when(()=>{
                // this.mapViewOnReadyHandler(view);
            });

        }).catch(err=>{
            console.error(err);
        })
    }

    componentDidMount(){
        this.initMap();
    }

    render(){
        return (
            <div id={MapConfig.container_id}></div>
        );
    }

}