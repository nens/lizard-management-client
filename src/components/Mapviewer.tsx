import React, { useRef, useState } from 'react';
import ReactMapGL, { Source, Layer, Popup, MapEvent, MapRef } from 'react-map-gl';
import mapboxgl from "mapbox-gl";
import { mapBoxAccesToken } from '../mapboxConfig';

/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-webpack-loader-syntax
(mapboxgl as any).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

export default function MapViewer () {
  const [viewport, setViewport] = useState({
    latitude: 52.6892,
    longitude: 5.9,
    zoom: 8
  });
  const [popupData, setPopupData] = useState<MapEvent | null>(null);
  const mapRef = useRef<MapRef>(null);

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
          console.log('hoan event', event.features);
          setPopupData(event);
        }}
        onLoad={() => {
          const map: mapboxgl.Map = mapRef && mapRef.current && mapRef.current.getMap();
          console.log('hoan source', map.getSource('measuringstation'))
          // console.log('hoan layer', map.getLayer('layer-1'))
        }}
      >
        {popupData && popupData.features?.length ? (
          <Popup
            latitude={popupData.lngLat[1]}
            longitude={popupData.lngLat[0]}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopupData(null)}
            anchor="top"
          >
            <h3>Properties</h3>
            {popupData.features.map((feature: any, i: number) => {
              return (
                <div key={i}>
                  <hr />
                  <h4>{feature.source}</h4>
                  {Object.keys(feature.properties).map(key => {
                    return (
                      <div key={key}>
                        {key}: {feature.properties[key]}
                      </div>
                    );
                  })}
                </div>
              )})}
          </Popup>
        ) : null}

        {/* Vector tile layer for measuring stations from Lizard */}
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
            key={'layer-1'}
            id={'layer-1'}
            type={'symbol'}
            source={'measuringstation'}
            source-layer={'default'}
            layout={{
              "text-field": "{object_name}",
              "text-size": 14
            }}
            paint={{
              // dynamic styling for text color based on object_id
              "text-color": [
                'case',
                ['>', ["get", "object_id"], 1000],
                'blue',
                'red'
              ]
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  )
}