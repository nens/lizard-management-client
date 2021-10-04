import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl';
import mapboxgl from "mapbox-gl";
import {mapBoxAccesToken} from '../mapboxConfig';
import { MapViewerRasterLayerTable} from "./MapViewerRasterLayerTable";

/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

interface MyProps {
}

function MapViewer (props: MyProps & DispatchProps) {
  // const { } = props;

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

const onClick = (event: any) => {
  const {
    features,
    srcEvent: { offsetX, offsetY }
  } = event;
  console.log(features)
};

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
        onViewportChange={(viewport:any) => setViewport(viewport)}
        mapboxApiAccessToken={mapBoxAccesToken}
        mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
        onClick={onClick}
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
                {/* 
                // @ts-ignore */}
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
        <Source 
          key={"vector_tile_mapbox1"}
          type={"vector"}
          //tiles={[`http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6?access_token=${mapBoxAccesToken}`]}
          tiles={[`https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?sku=101cmdIjjXnSr&access_token=${mapBoxAccesToken}`]}
          // mapbox.mapbox-streets-v8
          // tiles={[`http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v8}`]}
          // tiles={["mapbox://styles/nelenschuurmans/ckucf5p4y4rvo18s0k9k9upbm"]}
          // tileSize={256}
          id={"vector_tile_mapbox1"}
        >
          {/* 
          // @ts-ignore */}
          <Layer
            key={"vector_tile_mapbox1"}
            id={"vector_tile_mapbox1"}
            beforeId={'GROUP_' + 80}
            type={"fill"}
            source={"vector_tile_mapbox1"}
            source-layer={"building"}
            paint={{
              "fill-color": "rgba(255,0,0, 1)",
              "fill-outline-color": "rgba(255,244,244, 1)"
              }}
            minzoom={0}
            maxzoom={22}
          />
          <Layer
            key={"vector_tile_mapbox2"}
            id={"vector_tile_mapbox2"}
            beforeId={'GROUP_' + 79}
            type={"fill"}
            source={"vector_tile_mapbox1"}
            source-layer={"waterway"}
            paint={{
              "fill-color": "rgba(255,0,255, 1)",
              "fill-outline-color": "rgba(255,244,255, 1)"
              }}
            minzoom={0}
            maxzoom={22}
          />
        </Source>

        <Popup
          latitude={52.3676}
          longitude={4.9041}
          closeButton={true}
          closeOnClick={false}
          // onClose={() => togglePopup(false)}
          anchor="top" >
          <div>You are here</div>
        </Popup>
        
      </ReactMapGL>
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 