import './style.scss';

import * as React from 'react';
import { loadCss, loadModules } from 'esri-loader';

import { MapConfig } from './config';

import { PolarRegion, IRecordDate } from '../../types';
import IMapView from 'esri/views/MapView';
import IWebMap from 'esri/WebMap';
import IFeatureLayer from 'esri/layers/FeatureLayer';
import ISimpleRenderer from 'esri/renderers/SimpleRenderer';
import ISimpleFillSymbol from 'esri/symbols/SimpleFillSymbol';
import ISimpleLineSymbol from 'esri/symbols/SimpleLineSymbol';

interface IProps {
  polarRegion: PolarRegion;
  activeRecordDate: IRecordDate;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  isMobile?: boolean;
}

// interface IState {}

export default class Map extends React.PureComponent<IProps> {
  private mapView: IMapView;
  private readonly LayerIdSeaIceExt = 'seaIceExt';
  private readonly LayerIdMedianSeaIceExt = 'medianSeaIceExt';
  private delay: NodeJS.Timeout;

  constructor(props: IProps) {
    super(props);

    // this.state = {};

    loadCss();
  }

  async initMap() {
    const { padding, isMobile } = this.props;

    try {
      type Modules = [typeof IMapView];

      const [MapView] = await (loadModules(['esri/views/MapView']) as Promise<
        Modules
      >);

      const webmap = await this.getWebMap();

      const view = new MapView({
        container: MapConfig['container-id'],
        map: webmap,
        padding,
        // overwrite the scale if using a mobile device
        scale: isMobile ? MapConfig['map-scale-4-mobile-view'] : undefined,
      });

      view.when(() => {
        this.mapViewOnReadyHandler(view);
      });
    } catch (err) {
      console.error(err);
    }
  }

  async toggleWebMap() {
    try {
      if (this.mapView) {
        this.mapView.map = await this.getWebMap();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async getWebMap() {
    try {
      type Modules = [typeof IWebMap];

      const [WebMap] = await (loadModules(['esri/WebMap']) as Promise<Modules>);

      const seaIceExtLayers = await this.getSeaIceExtLayers();

      const webmap = new WebMap({
        portalItem: {
          id: MapConfig['web-map-id'][this.props.polarRegion],
        },
        layers: [...seaIceExtLayers],
      });

      return webmap;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getSeaIceExtLayers() {
    try {
      type Modules = [
        typeof IFeatureLayer,
        typeof ISimpleRenderer,
        typeof ISimpleFillSymbol,
        typeof ISimpleLineSymbol
      ];

      const [
        FeatureLayer,
        SimpleRenderer,
        SimpleFillSymbol,
        SimpleLineSymbol,
      ] = await (loadModules([
        'esri/layers/FeatureLayer',
        'esri/renderers/SimpleRenderer',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
      ]) as Promise<Modules>);

      const defExp = this.getDefExpForSeaIceExtLayer();
      // console.log(defExp);

      const rendererSeaIceExt = new SimpleRenderer({
        symbol: new SimpleFillSymbol({
          color: MapConfig['sea-ice-ext-feature-service'].style.fillColor,
          outline: {
            // autocasts as new SimpleLineSymbol()
            width: 1,
            color: MapConfig['sea-ice-ext-feature-service'].style.outlineColor,
          },
        }),
      });

      const seaIceExtLayer = new FeatureLayer({
        id: this.LayerIdSeaIceExt,
        url:
          MapConfig['sea-ice-ext-feature-service'].url[this.props.polarRegion],
        definitionExpression: defExp,
        visible: true,
        renderer: rendererSeaIceExt,
      });

      const rendererMedianSeaIceExt = new SimpleRenderer({
        symbol: new SimpleLineSymbol({
          color:
            MapConfig['median-sea-ice-ext-feature-service'].style.outlineColor,
          width: 1,
          style: 'dash',
        }),
      });

      const medianSeaIceExtLayer = new FeatureLayer({
        id: this.LayerIdMedianSeaIceExt,
        url:
          MapConfig['median-sea-ice-ext-feature-service'].url[
            this.props.polarRegion
          ],
        definitionExpression: defExp,
        visible: true,
        renderer: rendererMedianSeaIceExt,
      });

      return [medianSeaIceExtLayer, seaIceExtLayer];
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  updateDefExp4SeaIceExtLayers() {
    if (!this.mapView) {
      return;
    }

    const seaIceExtLayer = this.mapView.map.findLayerById(
      this.LayerIdSeaIceExt
    ) as IFeatureLayer;
    const medianSeaIceExtLayer = this.mapView.map.findLayerById(
      this.LayerIdMedianSeaIceExt
    ) as IFeatureLayer;

    if (seaIceExtLayer && medianSeaIceExtLayer) {
      const defExp = this.getDefExpForSeaIceExtLayer();

      [seaIceExtLayer, medianSeaIceExtLayer].forEach((layer) => {
        layer.definitionExpression = defExp;
      });
    }
  }

  activeRecordDateOnChangeHandler() {
    clearTimeout(this.delay);

    this.delay = setTimeout(() => {
      this.updateDefExp4SeaIceExtLayers();
    }, 500);
  }

  getDefExpForSeaIceExtLayer() {
    const { activeRecordDate } = this.props;

    const year = activeRecordDate ? activeRecordDate.year : 0;
    const month = activeRecordDate ? activeRecordDate.month : 0;

    return `${MapConfig['median-sea-ice-ext-feature-service'].fields.year} = ${year} AND ${MapConfig['median-sea-ice-ext-feature-service'].fields.month} = ${month}`;
  }

  mapViewOnReadyHandler(mapView: IMapView) {
    this.mapView = mapView;

    // the activeRecordDate data might not be ready at the time when map view get initialized,
    // therefore need to call this method to make sure the sea ice ext layer will be displayed on the map once it's ready
    this.updateDefExp4SeaIceExtLayers();
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.polarRegion !== prevProps.polarRegion) {
      this.toggleWebMap();
    }

    if (this.props.activeRecordDate !== prevProps.activeRecordDate) {
      // this.updateDefExp4SeaIceExtLayers();
      this.activeRecordDateOnChangeHandler();
    }
  }

  componentDidMount() {
    this.initMap();
  }

  render() {
    return <div id={MapConfig['container-id']}></div>;
  }
}
