import './style.scss';

import * as React from 'react';
import { loadCss, loadModules } from "esri-loader";

import { MapConfig } from './config';

import { PolarRegion } from '../../types';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IFeatureLayer from "esri/layers/FeatureLayer";
import ISimpleRenderer from "esri/renderers/SimpleRenderer";
import ISimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import ISimpleLineSymbol from "esri/symbols/SimpleLineSymbol";

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

        const seaIceExtLayers = await this.getSeaIceExtLayers();

        const webmap = new WebMap({
            portalItem: {
                id: MapConfig.web_map_id[this.props.polarRegion]
            },
            layers:[
                ...seaIceExtLayers
            ]
        });

        return webmap;
    }

    async getSeaIceExtLayers(){

        type Modules = [
            typeof IFeatureLayer,
            typeof ISimpleRenderer,
            typeof ISimpleFillSymbol,
            typeof ISimpleLineSymbol
        ];

        const [ FeatureLayer, SimpleRenderer, SimpleFillSymbol, SimpleLineSymbol ] = await (loadModules([
            'esri/layers/FeatureLayer',
            "esri/renderers/SimpleRenderer",
            "esri/symbols/SimpleFillSymbol",
            "esri/symbols/SimpleLineSymbol"
        ]) as Promise<Modules>);

        const rendererSeaIceExt = new SimpleRenderer({ 
            symbol: new SimpleFillSymbol({
                color: MapConfig.sea_ice_ext_feature_service.style.fillColor,
                outline: {  // autocasts as new SimpleLineSymbol()
                    width: 1,
                    color:  MapConfig.sea_ice_ext_feature_service.style.outlineColor
                }
            })
        });

        const seaIceExtLayer = new FeatureLayer({
            url: MapConfig.sea_ice_ext_feature_service.url[this.props.polarRegion],
            definitionExpression: 'Rec_Year = 2015 AND Rec_Month = 12',
            visible: true,
            renderer: rendererSeaIceExt
        });

        const rendererMedianSeaIceExt = new SimpleRenderer({ 
            symbol: new SimpleLineSymbol({
                color: MapConfig.median_sea_ice_ext_feature_service.style.outlineColor,
                width: 1,
                style: 'dash'
            })
        });

        const medianSeaIceExtLayer = new FeatureLayer({
            url: MapConfig.median_sea_ice_ext_feature_service.url[this.props.polarRegion],
            definitionExpression: 'Rec_Year = 2015 AND Rec_Month = 12',
            visible: true,
            renderer: rendererMedianSeaIceExt
        });

        return [medianSeaIceExtLayer, seaIceExtLayer];

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