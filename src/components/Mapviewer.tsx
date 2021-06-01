import React, { useEffect, useState } from 'react';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {mapBoxAccesToken} from '../mapboxConfig';
import { MapViewerRasterLayerTable} from "./MapViewerRasterLayerTable";




interface MyProps {
}

interface APIResponse {
  previous: string | null,
  next: string | null,
  results: any[]
}

function MapViewer (props: MyProps & DispatchProps) {
  const { } = props;

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
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
      >
    
        {/* <Source id="source_id" tileJsonSource={RASTER_SOURCE_OPTIONS} />
        <Layer type="raster" id="layer_id" sourceId="source_id" /> */}
      </ReactMapGL>
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 