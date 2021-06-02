import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import {mapBoxAccesToken} from '../mapboxConfig';
import { MapViewerRasterLayerTable} from "./MapViewerRasterLayerTable";

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
  const [selectedRasterForReOrdering, setSelectedRasterForReOrdering ] = useState<null | string>(null);

  const moveSelectedRasterUp = () => {
    const ind = selectedRasters.findIndex((item)=>{return item.uuid === selectedRasterForReOrdering})
    const length = selectedRasters.length;
    if (ind < (length -1)) {
      const newArr = arraymove(selectedRasters, ind, ind+1)
      setSelectedRasters(newArr)
    }
  }
  const moveSelectedRasterDown = () => {
    const ind = selectedRasters.findIndex((item)=>{return item.uuid === selectedRasterForReOrdering})
    if (ind > 0) {
      const newArr = arraymove(selectedRasters, ind, ind-1)
      setSelectedRasters(newArr)
    }
  }


  const arraymove = (arrInput: any[], fromIndex: number, toIndex: number) => {
    const arr = arrInput.map(id=>id)
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
}

const reversedRasters = selectedRasters.map(id=>id).reverse();

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
          width: "700px",
          height: "100vh",
          overflowY: "scroll",
          backgroundColor: "white",
          zIndex: 10,
        }}
      >
       

        <form>
          {reversedRasters.map((raster)=>{
            return (
              <div
                key={raster.uuid}
              >{raster.name} 
                <input 
                  checked={selectedRasterForReOrdering === raster.uuid} 
                  onChange={(event)=>{
                    setSelectedRasterForReOrdering(raster.uuid)
                  }} 
                  type="radio" value={raster.uuid} name="select_for_change_order"
                ></input>
              </div>
            );
          })}

          <button type="button" onClick={moveSelectedRasterUp} disabled={!selectedRasterForReOrdering}> Up</button>
          <button type="button" onClick={moveSelectedRasterDown} disabled={!selectedRasterForReOrdering}>Down</button>
        </form>
        

        {!showAddRasters? 
        <button onClick={()=>{setShowAddRasters(true)}}>Add new layer</button>
        :null}
        {showAddRasters? 
        <button onClick={()=>{setShowAddRasters(false)}}>Close new layer table</button>
        :null}
        
        {showAddRasters? 
        <MapViewerRasterLayerTable
          setSelectedRasters={(rasters)=> {
            const uniqueRasters = rasters.filter((raster)=>{
              if (selectedRasters.find((selectedRaster)=>{
                return selectedRaster.uuid === raster.uuid;
              })) {
                return false;
              } else {
                return true;
              }
            });
            setSelectedRasters(selectedRasters.concat(uniqueRasters))
          }}
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
    

          {selectedRasters.map((raster)=>{
            return (
              <Source 
                key={raster.uuid}
                type={'raster'}
                tiles={[
                  `${raster.wms_info.endpoint}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=${raster.wms_info.layer}&FORMAT=image%2Fpng&TRANSPARENT=false&HEIGHT=256&WIDTH=256&TIME=2021-06-01T14%3A38%3A34&SRS=EPSG%3A3857&bbox={bbox-epsg-3857}`
                ]}
                tileSize={256}
                id={raster.uuid}
              >
                {/* 
                // @ts-ignore */}
                <Layer
                  key={raster.uuid}
                  id={raster.uuid}
                  type={'raster'}
                  source={raster.uuid}
                  paint={{}}
                  minzoom={0}
                  maxzoom={22}
                />
              </Source>
            );
          })}
        
        
      </ReactMapGL>
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 