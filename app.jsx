import React from 'react';
import ReactDOM from 'react-dom';
import ol from 'openlayers';
import {addLocaleData, IntlProvider} from 'react-intl';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CustomTheme from './theme';
import MapPanel from '@boundlessgeo/sdk/components/MapPanel';
import LayerList from '@boundlessgeo/sdk/components/LayerList';
import Geocoding from '@boundlessgeo/sdk/components/Geocoding';
import Measure from '@boundlessgeo/sdk/components/Measure';
import GeocodingResults from '@boundlessgeo/sdk/components/GeocodingResults';
import Navigation from '@boundlessgeo/sdk/components/Navigation';
import Select from '@boundlessgeo/sdk/components/Select';
import QueryBuilder from '@boundlessgeo/sdk/components/QueryBuilder';
import FeatureTable from '@boundlessgeo/sdk/components/FeatureTable';
import Chart from '@boundlessgeo/sdk/components/Chart';
import Header from '@boundlessgeo/sdk/components/Header';
import Button from '@boundlessgeo/sdk/components/Button';
import DrawFeature from '@boundlessgeo/sdk/components/DrawFeature';
import Zoom from '@boundlessgeo/sdk/components/Zoom';
import HomeButton from '@boundlessgeo/sdk/components/HomeButton';
import QGISPrint from '@boundlessgeo/sdk/components/QGISPrint';
import InfoPopup from '@boundlessgeo/sdk/components/InfoPopup';
import EditPopup from '@boundlessgeo/sdk/components/EditPopup';
import ImageExport from '@boundlessgeo/sdk/components/ImageExport';
import Login from '@boundlessgeo/sdk/components/Login';
import enLocaleData from 'react-intl/locale-data/en';
import zhLocaleData from 'react-intl/locale-data/zh';
import injectTapEventPlugin from 'react-tap-event-plugin';
import enMessages from '@boundlessgeo/sdk/locale/en';
import zhMessages from './zh';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

addLocaleData(
  [...enLocaleData,...zhLocaleData]
);

var styleJitidi = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(0,0,255,0.505882)'
  })
});

// var styleTrees = new ol.style.Style({
//   fill: new ol.style.Fill({
//     color: 'rgba(186,221,105,0.505882)'
//   })
// });

var styleAirports = new ol.style.Style({
  image: new ol.style.Icon({
    scale: 0.025000,
    anchorOrigin: 'top-left',
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    anchor: [0.5, 0.5],
    src: './data/styles/plane.svg'
  })
});

// var baseStylePopp = [new ol.style.Style({
//   image: new ol.style.Circle({
//     radius: 7.0,
//     stroke: new ol.style.Stroke({
//       color: 'rgba(0,0,0,255)',
//       lineDash: null,
//       width: 1
//     }),
//     fill: new ol.style.Fill({
//       color: 'rgba(255,255,255,1.0)'
//     })
//   })
// }), new ol.style.Style({
//   image: new ol.style.Circle({
//     radius: 1.0,
//     stroke: new ol.style.Stroke({
//       color: 'rgba(0,0,0,255)',
//       lineDash: null,
//       width: 1
//     }),
//     fill: new ol.style.Fill({
//       color: 'rgba(0,0,0,1.0)'
//     })
//   })
// })];

// var clusterStyleCachePopp = {};
// var stylePopp = function(feature) {
//   var style;
//   var features = feature.get('features');
//   var size = 0;
//   for (var i = 0, ii = features.length; i < ii; ++i) {
//     if (features[i].selected) {
//       return null;
//     }
//     if (features[i].hide !== true) {
//       size++;
//     }
//   }
//   if (size === 0) {
//     return null;
//   }
//   if (size !== 1) {
//     style = clusterStyleCachePopp[size];
//     if (!style) {
//       style = new ol.style.Style({
//         image: new ol.style.Circle({
//           radius: 10,
//           stroke: new ol.style.Stroke({
//             color: '#fff'
//           }),
//           fill: new ol.style.Fill({
//             color: '#3399CC'
//           })
//         }),
//         text: new ol.style.Text({
//           text: size.toString(),
//           fill: new ol.style.Fill({
//             color: '#fff'
//           })
//         })
//       });
//       clusterStyleCachePopp[size] = style;
//     }
//     return style;
//   } else {
//     return baseStylePopp;
//   }
// };
var proj3857 = ol.proj.get('EPSG:3857');
var proj3857Extent = proj3857.getExtent();
var map = new ol.Map({
  controls: [],
  layers: [
    new ol.layer.Group({
      type: 'base-group',
      title: '底图',
      layers: [
        new ol.layer.Tile({
          type: 'base',
          title: '地图',
          source: new ol.source.OSM()
        }),
        new ol.layer.Tile({
          type: 'base',
          title: '影像',
          visible: false,
          source: new ol.source.XYZ({
            attributions: [
              new ol.Attribution({
                html: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              })
            ],
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          })
        })
      ]
    }),
    // new ol.layer.Vector({
    //   id: 'lyr01',
    //   isSelectable: true,
    //   geometryType: 'Polygon',
    //   attributes: ['cat', 'VEGDESC', 'VEG_ID', 'F_CODEDESC', 'F_CODE', 'AREA_KM2'],
    //   title: 'trees',
    //   style: styleTrees,
    //   source: new ol.source.Vector({
    //     format: new ol.format.GeoJSON(),
    //     url: './data/trees.json'
    //   })
    // }),
    // new ol.layer.Vector({
    //   id: 'lyr02',
    //   isSelectable: true,
    //   geometryType: 'Point',
    //   attributes: ['cat', 'F_CODEDESC', 'F_CODE', 'TYPE'],
    //   title: 'popp',
    //   style: stylePopp,
    //   source: new ol.source.Cluster({
    //     source: new ol.source.Vector({
    //       format: new ol.format.GeoJSON(),
    //       url: './data/popp.json'
    //     })
    //   })
    // }),
    // new ol.layer.Vector({
    //   title: 'airports',
    //   id: 'lyr03',
    //   popupInfo: '<b>cat</b>: [cat]<br><b>NA3</b>: [NA3]<br><b>ELEV</b>: [ELEV]<br><b>F_CODE</b>: [F_CODE]<br><b>IKO</b>: [IKO]<br><b>NAME</b>: [NAME]<br><b>USE</b>: [USE]',
    //   isSelectable: true,
    //   geometryType: 'Point',
    //   attributes: ['cat', 'NA3', 'ELEV', 'F_CODE', 'IKO', 'NAME', 'USE'],
    //   style: styleAirports,
    //   source: new ol.source.Vector({
    //     format: new ol.format.GeoJSON(),
    //     url: './data/airports.json'
    //   })
    // }),
    new ol.layer.Vector({
      title: '项目',
      id: 'lyr02',
      popupInfo: '<img alt src = "./data/[NAME].jpg" style = "maxWidth:100%;maxHeight:100%">',
      isSelectable: true,
      geometryType: 'Point',
      attributes: ['cat', 'NA3', 'ELEV', 'F_CODE', 'IKO', 'NAME', 'USE'],
      style: styleAirports,
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: './data/project.json'
      })
    }),
    new ol.layer.Vector({
      title: '集体地',
      id: 'lyr01',
      // popupInfo: '<b>Entity</b>: [Entity]<br><b>类型</b>: [Layer]<br><b>海拔</b>: [Elevation]<br><b>面积</b>: [Area]<br><b>周长</b>: [Perimeter]<br>',
      popupInfo:['FID','Entity','Elevation'],
      isSelectable: true,
      geometryType: 'Polygon',
      attributes: ['FID', 'OBJECTID', 'Entity', 'Layer', 'Color', 'Linetype', 'Continuous','Elevation','LineWt','RefName','Area','Perimeter'],
      style: styleJitidi,
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: './data/jitidi.json'
      })
    })
  ],
  view: new ol.View({
    projection: proj3857,
    extent: proj3857Extent,
    center: [12949668,4864593],
    zoom: 13
  })
});

var charts = [{
//   title: 'Airports count per use category',
//   categoryField: 'USE',
//   layer: 'lyr03',
//   valueFields: [],
//   displayMode: 2,
//   operation: 2
// }, {
  title: '东升镇集体地',
  categoryField: 'VEGDESC',
  layer: 'lyr01',
  valueFields: ['AREA_KM2'],
  displayMode: 1,
  operation: 2
}];

var printLayouts = [{
  name: 'Layout 1',
  thumbnail: 'layout1_thumbnail.png',
  width: 420.0,
  elements: [{
    name: 'Title',
    height: 40.825440467359044,
    width: 51.98353115727002,
    y: 39.25222551928783,
    x: 221.77507418397624,
    font: 'Helvetica',
    type: 'label',
    id: '24160ce7-34a3-4f25-a077-8910e4889681',
    size: 18
  }, {
    height: 167.0,
    width: 171.0,
    grid: {
      intervalX: 0.0,
      intervalY: 0.0,
      annotationEnabled: false,
      crs: ''
    },
    y: 19.0,
    x: 16.0,
    type: 'map',
    id: '3d532cb9-0eca-4e50-9f0a-ce29b1c7f5a6'
  }],
  height: 297.0
}];

class BasicApp extends React.Component {
  getChildContext() {
    return {
      muiTheme: getMuiTheme(CustomTheme)
    };
  }
  _toggle(el) {
    if (el.style.display === 'block') {
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
    }
  }
  _hide(el){
    el.style.display = 'none';
  }
  _toggleTable() {
    this._toggle(ReactDOM.findDOMNode(this.refs.tablePanel));
    this.refs.table.getWrappedInstance().setDimensionsOnState();
    this._hide(ReactDOM.findDOMNode(this.refs.chartPanel));
  }
  _toggleQuery() {
    this._toggle(ReactDOM.findDOMNode(this.refs.queryPanel));
  }
  _toggleChart() {
    this._toggle(ReactDOM.findDOMNode(this.refs.chartPanel));
    this._hide(ReactDOM.findDOMNode(this.refs.tablePanel));
  }
  render() {
    return (
      <div id='content'>
        <Header showLeftIcon={false} title='东升镇土地资源管理信息系统'>
          <Geocoding />
          <Navigation secondary={true} toggleGroup='navigation' map={map}/>
          <Measure toggleGroup='navigation' map={map}/>
          <Button toggleGroup='navigation' buttonType='Icon' iconClassName='headerIcons ms ms-table' tooltip='数据表格' onTouchTap={this._toggleTable.bind(this)}/>
          <Button toggleGroup='navigation' buttonType='Icon' iconClassName='headerIcons fa fa-filter' tooltip='查询' onTouchTap={this._toggleQuery.bind(this)}/>
          <Button toggleGroup='navigation' buttonType='Icon' iconClassName='headerIcons ms ms-bar-chart' tooltip='图表' onTouchTap={this._toggleChart.bind(this)}/>
          <DrawFeature toggleGroup='navigation' map={map} />
          <Select toggleGroup='navigation' map={map}/>  
          <ImageExport map={map} />
          <QGISPrint map={map} layouts={printLayouts} />  
          <Login />             
        </Header>
        <MapPanel id='map' map={map}/>
        <div ref='queryPanel' className='query-panel'><QueryBuilder map={map} /></div>
        <div id='geocoding-results' className='geocoding-results-panel'><GeocodingResults map={map} /></div>
        <div id='zoom-buttons'><Zoom map={map} /></div>
        <HomeButton id='home-button' map={map} style={{top:'132px',marginLeft:'20px'}}/>
        <div id='layerlist'><LayerList allowFiltering={true} showOpacity={true} showDownload={true} showGroupContent={true} showZoomTo={true} allowReordering={true} map={map} /></div>
        <div ref='tablePanel' id='table-panel' className='attributes-table'><FeatureTable toggleGroup='navigation' ref='table' map={map} /></div>
        <div id='editpopup' className='ol-popup'><EditPopup toggleGroup='navigation' map={map} /></div>
        <div id='popup' className='ol-popup'><InfoPopup toggleGroup='navigation' map={map} /></div>
        <div ref='chartPanel' className='chart-panel'><Chart charts={charts} onClose={this._toggleChart.bind(this)}/></div>
      </div>
    );
  }
}

BasicApp.childContextTypes = {
  muiTheme: React.PropTypes.object
};

ReactDOM.render(<IntlProvider locale={navigator.language} messages={zhMessages}><BasicApp /></IntlProvider>, document.getElementById('main'));
