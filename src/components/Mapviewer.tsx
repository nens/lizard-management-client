import React, { useEffect, useRef, useState } from 'react';
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
  
  const [showRoads, setShowRoads] = useState(false);
  const [showWaterbodies, setShowWaterbodies] = useState(false);
  const [showBuildings, setShowBuildings] = useState(false);

  const [popupData, setPopupData] = useState<any | null>(null)

  const [ lizardBuildings, setLizardBuildings ] = useState<null | any[]>(null);

  const mapRef = useRef<any>(null);
  
  useEffect(() => {
    (async () => {
      // 4.8,52.7,4.9,52.8
      const response = await fetch(`/api/v4/buildings/?in_bbox=${viewport.longitude-0.005},${viewport.latitude-0.005},${viewport.longitude+0.005},${viewport.latitude+0.005}`, {
        credentials: "same-origin"
      });
      
      const result = await response.json();
      console.log('result', result)
      setLizardBuildings(result);
    })();
  }, [viewport]);

  let lizardBuildingGeoJson = null;
  const geoJsonBasis = {
    "type" : "FeatureCollection",
    "features" : []
  }
  if (lizardBuildings ) {
    lizardBuildings.forEach((lizardBuilding)=>{
      geoJsonBasis.features.push(
          { 
            // @ts-ignore
          "type" : "Feature", 
          // @ts-ignore
          "properties" : {  
            // "capacity" : "10", 
            // "type" : "U-Rack",
            // "mount" : "Surface"
          }, 
          // @ts-ignore
          "geometry" : lizardBuilding.geometry
        }
      );
    });
    lizardBuildingGeoJson = geoJsonBasis;
  }
  

  console.log('lizardBuildingGeoJson', lizardBuildingGeoJson)

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
          width: "200px",
          height: "100vh",
          overflowY: "auto",
          backgroundColor: "white",
          zIndex: 10,
        }}
      >
       <label>Roads <input type="checkbox" checked={showRoads===true} onClick={()=>setShowRoads(!showRoads)}></input></label>
       <br/>
       <label>Water <input type="checkbox" checked={showWaterbodies===true} onClick={()=>setShowWaterbodies(!showWaterbodies)}></input></label>
       <br/>
       <label>Buildings <input type="checkbox" checked={showBuildings===true} onClick={()=>setShowBuildings(!showBuildings)}></input></label>
       <br/> 

       <h1>Lizard Rasters</h1>
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
        ref={mapRef}
        width="100%"
        height="100%"
        onViewportChange={(viewport:any) => setViewport(viewport)}
        mapboxApiAccessToken={mapBoxAccesToken}
        mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
        onClick={(event)=>{
          console.log('event', event.features, event);
          setPopupData(event);
        }}
        onLoad={() => {
          const map: mapboxgl.Map = mapRef.current.getMap();
          console.log('hoan source', map.getSource('measuringstation').type)
          console.log('hoan layer', map.getLayer('hoan'))
        }}
      >
        {popupData? <Popup
          latitude={popupData.lngLat[1]}
          longitude={popupData.lngLat[0]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setPopupData(null)}
          anchor="top" >
          <div>
          { popupData.features.map((feature:any)=>{
            return (
              <div>
                <h3>Properties:</h3>
                <hr/>
                {Object.keys(feature.properties).map((key:string)=>{
                  return (
                    <div>
                      <span>{key} :  </span>
                      <span>{feature.properties[key]} :  </span>
                    </div>
                  );
                })}
              </div>
            )})}
          </div>
        </Popup>:null}

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
            key={"mapbox://mapbox.mapbox-terrain-v2"}
            id={"mapbox://mapbox.mapbox-terrain-v2"}
            url={'mapbox://mapbox.mapbox-terrain-v2'}
            type={'vector'}
          >
            {/* <Layer
              key={'terrain-data'}
              id={'terrain-data'}
              beforeId={'GROUP_' + 78}
              type={'line'}
              source={"mapbox://mapbox.mapbox-terrain-v2"}
              source-layer={'contour'}
              paint={{
                'line-color': '#ff69b4',
                'line-width': 1
                }}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                  }}
              
            /> */}
            {/* below does not work */}
            {/* <Layer
              key={'terrain-data-fill'}
              id={'terrain-data-fill'}
              beforeId={'GROUP_' + 79}
              type={'fill'}
              source={"mapbox://mapbox.mapbox-terrain-v2"}
              source-layer={"polygon"}
              paint={{
                'fill-color': '#ff69b4',
                }}
                layout={{
                  }}
              
            /> */}
          </Source>
          <Source
            key={"measuringstation"}
            id={"measuringstation"}
            type={'vector'}
            tiles={[
              // `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=${mapBoxAccesToken}`
              `/api/v4/measuringstations/vectortiles/{z}/{x}/{y}/`
            ]}
            minzoom={6}
            maxzoom={14}
          >
            <Layer
              key={'hoan'}
              id={'hoan'}
              type={'fill'}
              source={'measuringstation'}
              source-layer={'abc'}
              paint={{}}
            />
            {/* <Layer
              key={'mapillary'}
              id={'mapillary'}
              beforeId={'road-label'}
              type={'line'}
              source={"mapillary"}
              source-layer={'sequence'}
              paint={{
                'line-opacity': 0.6,
                'line-color': 'rgb(53, 175, 109)',
                'line-width': 2
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
              }}
            /> */}
          </Source>

          {/* Below layer is a style and we cannot ad it as a vector tile? */}
          {/* <Source
            key={"copied_standard_1"}
            id={"copied_standard_1"}
            type={'vector'}
            url={"mapbox://styles/nelenschuurmans/ckrbsw9f806k017o9ctzbyr0w"}
          >
            <Layer
              key={'copied_standard_1'}
              id={'copied_standard_1'}
              beforeId={'GROUP_' + 80}
              type={'line'}
              source={"copied_standard_1"}
              source-layer={'Buildings'}
              paint={{
                'line-opacity': 0.6,
                'line-color': 'rgb(53, 175, 109)',
                'line-width': 2
                }}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                  }}
              
            />

          </Source> */}
          <Source
            key={"mapbox://mapbox.mapbox-streets-v7"}
            id={"mapbox://mapbox.mapbox-streets-v7"}
            url={"mapbox://mapbox.mapbox-streets-v7"}
            type={'vector'}
          >
            {showRoads?<Layer
              key={'mapbox://mapbox.mapbox-streets-v7'}
              id={'mapbox://mapbox.mapbox-streets-v7'}
              beforeId={'GROUP_' + 82}
              type={'line'}
              source={"mapbox://mapbox.mapbox-streets-v7"}
              source-layer={'road'}
              paint={{
                'line-opacity': 0.6,
                'line-color': 'rgb(53, 175, 109)',
                'line-width': 2
                }}
                layout={{
                  'line-join': 'round',
                  'line-cap': 'round'
                  }}
              
            />:null}
            {showWaterbodies?<Layer
              key={'mapbox://mapbox.mapbox-streets-v7_2'}
              id={'mapbox://mapbox.mapbox-streets-v7_2'}
              beforeId={'GROUP_' + 82}
              type={'line'}
              source={"mapbox://mapbox.mapbox-streets-v7"}
              // source-layer={'waterway'}
              source-layer={'water'}
              // source-layer={'building'}
              paint={{
              'line-opacity': 0.6,
              'line-color': 'rgb(0, 175, 255)',
              'line-width': 2
              }}
              layout={{
                'line-join': 'round',
                'line-cap': 'round'
                }}
              
            />:null}
            {showBuildings?<Layer
              key={'mapbox://mapbox.mapbox-streets-v7_3'}
              id={'mapbox://mapbox.mapbox-streets-v7_3'}
              beforeId={'GROUP_' + 82}
              type={'fill'}
              source={"mapbox://mapbox.mapbox-streets-v7"}
              source-layer={'building'}
              paint={{
                'fill-color': 'rgb(255, 0, 0)'
              }}
            />:null}

          </Source>

          {lizardBuildingGeoJson?
            // buildings work for hofweg Rotterdam. But long loading an flickering retrigger.
            <Source
              key={"lizard_building_geojson"}
              id={"lizard_building_geojson"}
              type={'geojson'}
              // @ts-ignore
              data={lizardBuildingGeoJson}
            >
              <Layer
                id={`lizard_building_geojson`}
                type={`fill`}
                source={`lizard_building_geojson`}// reference the data source
                layout={{}}
                paint={{
                  // 'line-opacity': 0.6,
                  'fill-color': 'rgb(255, 0, 0)',
                  // 'line-width': 2
                  }}
              />                
            </Source>
          :null}
        
            
      </ReactMapGL>
    </div>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
 
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(MapViewer); 