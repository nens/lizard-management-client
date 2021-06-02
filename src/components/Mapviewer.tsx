import React, { useEffect, useState } from 'react';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {mapBoxAccesToken} from '../mapboxConfig';
import { MapViewerRasterLayerTable} from "./MapViewerRasterLayerTable";


const rasterStyle = {
  "version": 8,
  "sources": {
    // 'background': {
    //   `https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`} />
    // }
    'wms-test-source': {
        'type': 'raster',
        // use the tiles option to specify a WMS tile source URL
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
        'tiles': [
        'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
        ],
        'tileSize': 256,
      }
  },
  "layers": [{
      'id': 'wms-test-layer',
      'type': 'raster',
      'source': 'wms-test-source',
      'paint': {},
      "minzoom": 0,
      "maxzoom": 22
  }
  ]
}

const mapSource1 = {
  'type': 'raster',
  // use the tiles option to specify a WMS tile source URL
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
  'tiles': [
  'https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015'
  ],
  'tileSize': 256,
  "id": "wms-test-layer",
};
const mapLayer1 = {
  'id': 'wms-test-layer',
  'type': 'raster',
  'source': 'wms-test-source',
  'paint': {},
  "minzoom": 0,
  "maxzoom": 22
};


interface MyProps {
}

function MapViewer (props: MyProps & DispatchProps) {
  const { } = props;

  const [viewport, setViewport] = useState({
    // latitude: 37.7577,
    // longitude: -122.4376,
    // zoom: 8
    latitude: 40.6892,
    longitude: -74.5447,
    zoom: 8
  });
  const [selectedRasters, setSelectedRasters ] = useState<any[]>([]);
  const [showAddRasters, setShowAddRasters ] = useState(false);

  // https://nxt3.staging.lizard.net/api/v3/wms/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=dem%3Anl&STYLES=dem_nl&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=256&WIDTH=256&TIME=2021-06-01T14%3A38%3A34&SRS=EPSG%3A3857&BBOX=313086.06785608194,6731350.458905761,469629.1017841229,6887893.492833804
  // https://nxt3.staging.lizard.net/api/v3/wms/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=intern%3Anl%3Arws%3Anwm%3Ahw_ref2015_t10&STYLES=Blues%3A5%3A20&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=256&WIDTH=256&TIME=2021-05-31T14%3A00%3A00&SRS=EPSG%3A3857&BBOX=604158.271566033,6777824.17210315,606604.2564711587,6780270.157008276
  
  return (
    <div 
      style={{
        // width:"100%",
        // height:"100%",
        position: "fixed",
        top: 0,
        left: 0,
        width:"100vw",
        height:"100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          // bottom: 0,
          height: "100vh",
          width: "700px",
          backgroundColor: "white",
          zIndex: 10,
        }}
      >
        {!showAddRasters? 
        <button onClick={()=>{setShowAddRasters(true)}}>Add</button>
        :null}
        {showAddRasters? 
        <button onClick={()=>{setShowAddRasters(false)}}>Close</button>
        :null}

        {selectedRasters.map((raster)=>{
          return (
            <div>{raster.name}</div>
          );
        })}
        
        {showAddRasters? 
        <MapViewerRasterLayerTable
          setSelectedRasters={setSelectedRasters}
        />
        :null}

      </div>
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(viewport:any) => setViewport(viewport)}
        mapboxApiAccessToken={mapBoxAccesToken}
        // mapStyle={rasterStyle}
        // style= {'mapbox://styles/mapbox/streets-v11'}
      >
    
        <Source {...mapSource1}>
          {/* 
          // @ts-ignore */}
          <Layer {...mapLayer1} />
        </Source>
        
        
      </ReactMapGL>
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 