import React, { useRef, useState } from 'react';
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl';
import mapboxgl from "mapbox-gl";
import {mapBoxAccesToken} from '../mapboxConfig';

/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export default function MapViewer () {
  const [viewport, setViewport] = useState({
    latitude: 52.6892,
    longitude: 5.9,
    zoom: 8
  });
  const [popupData, setPopupData] = useState<any>(null)
  const mapRef = useRef<any>(null);

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
        {popupData? (
          <Popup
            latitude={popupData.lngLat[1]}
            longitude={popupData.lngLat[0]}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupData(null)}
            anchor="top"
          >
            {popupData.features.map((feature: any) => {
              return (
                <div>
                  <h3>Properties:</h3>
                  <hr/>
                  {Object.keys(feature.properties).map((key:string)=>{
                    return (
                      <div>
                        <span>{key}: </span>
                        <span>{feature.properties[key]}: </span>
                      </div>
                    );
                  })}
                </div>
              )})}
          </Popup>
        ) : null}
          <Source
            key={"measuringstation"}
            id={"measuringstation"}
            type={'vector'}
            tiles={[
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
          </Source>
      </ReactMapGL>
    </div>
  )
}