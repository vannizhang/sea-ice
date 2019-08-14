import './style.scss';

import * as React from 'react';
import { loadCss, loadModules } from "esri-loader";

import { MapConfig } from './config';

import { PolarRegion, IRecordDate } from '../../types';
import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IFeatureLayer from "esri/layers/FeatureLayer";
import ISimpleRenderer from "esri/renderers/SimpleRenderer";
import ISimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import ISimpleLineSymbol from "esri/symbols/SimpleLineSymbol";

interface IProps {
    polarRegion:PolarRegion,
    activeRecordDate: IRecordDate
};

interface IState {};

export default class Map extends React.PureComponent<IProps, IState> {

    private mapView: IMapView;
    private readonly LayerIdSeaIceExt = 'seaIceExt';
    private readonly LayerIdMedianSeaIceExt = 'medianSeaIceExt';

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

        const defExp = this.getDefExpForSeaIceExtLayer();

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
            id: this.LayerIdSeaIceExt,
            url: MapConfig.sea_ice_ext_feature_service.url[this.props.polarRegion],
            definitionExpression: defExp,
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
            id: this.LayerIdMedianSeaIceExt,
            url: MapConfig.median_sea_ice_ext_feature_service.url[this.props.polarRegion],
            definitionExpression: defExp,
            visible: true,
            renderer: rendererMedianSeaIceExt
        });

        return [medianSeaIceExtLayer, seaIceExtLayer];

    }

    updateDefExp4SeaIceExtLayers(){

        if(!this.mapView){
            return;
        }

        const seaIceExtLayer = this.mapView.map.findLayerById(this.LayerIdSeaIceExt) as IFeatureLayer;
        const medianSeaIceExtLayer = this.mapView.map.findLayerById(this.LayerIdMedianSeaIceExt) as IFeatureLayer;

        if(seaIceExtLayer && medianSeaIceExtLayer){
            const defExp = this.getDefExpForSeaIceExtLayer();

            [ seaIceExtLayer, medianSeaIceExtLayer ].forEach(layer=>{
                layer.definitionExpression = defExp;
            })
        }

    }

    getDefExpForSeaIceExtLayer(){

        const year = this.props.activeRecordDate ? this.props.activeRecordDate.year : 0;
        const month = this.props.activeRecordDate ? this.props.activeRecordDate.month : 0;

        return `${MapConfig.median_sea_ice_ext_feature_service.fields.year} = ${year} AND ${MapConfig.median_sea_ice_ext_feature_service.fields.month} = ${month}`;
    }

    mapViewOnReadyHandler(mapView:IMapView){
        this.mapView = mapView;
    }

    componentDidUpdate(prevProps:IProps, prevState:IState){
        if(this.props.polarRegion !== prevProps.polarRegion){
            this.toggleWebMap();
        }

        if(this.props.activeRecordDate !== prevProps.activeRecordDate){
            this.updateDefExp4SeaIceExtLayers();
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