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
                typeof IMapView
            ];

            const [ MapView ] = await (loadModules([
                'esri/views/MapView'
            ]) as Promise<Modules>);

            const webmap = await this.getWebMap();

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

    async toggleWebMap(){
        if(this.mapView){
            this.mapView.map = await this.getWebMap();
        }
    }

    async getWebMap(){

        type Modules = [
            typeof IWebMap
        ];

        const [ WebMap ] = await (loadModules([
            'esri/WebMap'
        ]) as Promise<Modules>);

        const webmap = new WebMap({
            portalItem: {
                id: MapConfig.web_map_id[this.props.polarRegion]
            }
        });

        return webmap;
    }

    mapViewOnReadyHandler(mapView:IMapView){
        this.mapView = mapView;
    }

    componentDidUpdate(prevProps:IProps, prevState:IState){
        if(this.props.polarRegion !== prevProps.polarRegion){
            this.toggleWebMap();
        }
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