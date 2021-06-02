import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {mapBoxAccesToken} from '../mapboxConfig';
import { MapViewerRasterLayerTable} from "./MapViewerRasterLayerTable";


const mapSource1 = {
  'type': 'raster',
  // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
  'tiles': [
    "https://nxt3.staging.lizard.net/api/v3/wms/?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=dem%3Anl&STYLES=dem_nl&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=256&WIDTH=256&TIME=2021-06-01T14%3A38%3A34&SRS=EPSG%3A3857&bbox={bbox-epsg-3857}",
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
    
    latitude: 52.6892,
    longitude: 5.9,
    zoom: 8,
  });
  const [selectedRasters, setSelectedRasters ] = useState<any[]>([]);
  const [showAddRasters, setShowAddRasters ] = useState(false);

  return (
    <div 
      style={{
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
        mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
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