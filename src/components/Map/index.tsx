import './style.scss';

import * as React from 'react';
import { loadCss, loadModules } from "esri-loader";

import { MapConfig } from './config';

import { PolarRegion } from '../../types';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";

interface IProps {
    polarRegion:PolarRegion,
};

interface IState {};

export default class Map extends React.PureComponent<IProps, IState> {

    mapView: IMapView;

    constructor(props:IProps){
        super(props);

        this.state = {
        };
    }

    async initMap(){

        loadCss();

        try {

            type Modules = [
                typeof IMapView,
                typeof IWebMap
            ];

            const [ MapView, WebMap ] = await (loadModules([
                'esri/views/MapView', 
                'esri/WebMap'
            ]) as Promise<Modules>);

            const webmap = new WebMap({
                portalItem: {
                    id: MapConfig.web_map_id.antarctica
                }
            });

            const view = new MapView({
                container: MapConfig.container_id,
                map: webmap
            });

            view.when(()=>{
                this.mapViewOnReadyHandler(view);
            });

        } catch(err){
            console.error(err)
        }
    }

    mapViewOnReadyHandler(mapView:IMapView){
        this.mapView = mapView;
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