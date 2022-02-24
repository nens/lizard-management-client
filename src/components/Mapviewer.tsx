import { useState } from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import mapboxgl from "mapbox-gl";
import {mapBoxAccesToken} from '../mapboxConfig';
import { MapViewerRasterLayerTable} from "./MapViewerRasterLayerTable";
import { RasterLayerFromAPI } from '../api/rasters';

/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface MapViewport {
  latitude: number,
  longitude: number,
  zoom: number
}

function MapViewer () {
  const [viewport, setViewport] = useState<MapViewport>({
    latitude: 52.6892,
    longitude: 5.9,
    zoom: 8,
  });
  const [selectedRasters, setSelectedRasters ] = useState<RasterLayerFromAPI[]>([]);
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


  const arraymove = (arrInput: RasterLayerFromAPI[], fromIndex: number, toIndex: number) => {
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
          overflowY: "auto",
          backgroundColor: "white",
          zIndex: 10,
        }}
      >
       

       <h1>Layers</h1>
        {reversedRasters.length === 0?<div>No layers added yet</div>:null}
        {!showAddRasters? 
        <button onClick={()=>{setShowAddRasters(true)}}>+ Add new layer</button>
        :null}

        <form
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            
            {reversedRasters.map((raster)=>{
              return (
                <div
                  key={raster.uuid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{width:"280px", /*display: "inline-block",*/ textAlign: "right"}}>{raster.name} </span>
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
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            { reversedRasters.length > 1?
            <>
              <button type="button" onClick={moveSelectedRasterUp} disabled={!selectedRasterForReOrdering}> ^</button>
              <button type="button" onClick={moveSelectedRasterDown} disabled={!selectedRasterForReOrdering}>v</button>
            </>
            :null}
            
          </div>
          
        </form>
        
        <hr/>

        
        {showAddRasters? 
        <div
          style={{
            position: "relative"
          }}
        >
          <button 
          style={{
            position: "absolute",
            right: "10px",
            top: "18px",
          }} 
          onClick={()=>{setShowAddRasters(false)}}>X</button>
        </div>
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
        onViewportChange={(viewport: MapViewport) => setViewport(viewport)}
        mapboxApiAccessToken={mapBoxAccesToken}
        mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
      >

          {/* these 100 layers are needed for ordering layers with "beforeId"
          See answer yurivangeffen here
          https://github.com/visgl/react-map-gl/issues/939
           */}
          {new Array(100).fill(1).map((name,ind) => {
            return (<Layer
              key={'GROUP_' + ind}
              id={'GROUP_' + ind}
              type='background'
              layout={{ visibility: 'none' }}
              paint={{}}
            />)
          })}

          {selectedRasters.map((raster, ind)=>{
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
                <Layer
                  key={raster.uuid}
                  id={raster.uuid}
                  // beforeId={selectedRasters[ind+1] && selectedRasters[ind+1].uuid}
                  beforeId={'GROUP_' + ind}
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

export default MapViewer; 