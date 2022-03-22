import { useRef, useState } from 'react';
import Map, { Source, Layer, MapRef, Popup, MapLayerMouseEvent } from 'react-map-gl';
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
import pumpIcon from '../images/pump.png';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const mapTilerApiKey = "apPhpL758oE94pC4mFOd";

export default function MapViewer () {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [popupData, setPopupData] = useState<MapLayerMouseEvent | null>(null);
  const mapRef = useRef<MapRef>(null);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          latitude: 52.6892,
          longitude: 5.9,
          zoom: 8
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
        interactiveLayerIds={['layer-2']}
        // mapboxAccessToken={mapBoxAccesToken}
        // mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
        mapStyle={`https://api.maptiler.com/maps/fde8275a-3062-4cd8-acd3-366f9e3602ec/style.json?key=${mapTilerApiKey}`}
        onClick={(event: MapLayerMouseEvent) => {
          console.log('clicked event', event.features);
          setPopupData(event);
        }}
        onLoad={() => {
          if (!mapRef || !mapRef.current) return;
          const map = mapRef && mapRef.current;
          map.loadImage(
            pumpIcon,
            (e, img) => {
              if (e || !img) return console.log('Failed to load image: ', e);
              map.addImage('pumpIconImage', img, { sdf: true });
            }
          );
        }}
      >
        {popupData && popupData.features?.length ? (
          <Popup
            latitude={popupData.lngLat.lat}
            longitude={popupData.lngLat.lng}
            closeButton={false}
            closeOnClick={true}
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
              )
            })}
          </Popup>
        ) : null}

        {/* Vector tile layer for measuring stations from Lizard */}
        <Source
          key={"measuringstation"}
          id={"measuringstation"}
          type={'vector'}
          tiles={[
            `${window.origin}/api/v4/measuringstations/vectortiles/{z}/{x}/{y}/?organisation__uuid=${selectedOrganisation.uuid}`
          ]}
          minzoom={6}
          maxzoom={14}
        >
          {/* <Layer
            id={'layer-1'}
            type={'circle'}
            source={'measuringstation'}
            source-layer={'default'}
            paint={{
              "circle-radius": 10,
              "circle-stroke-width": 1,
              "circle-stroke-color": 'grey',
              "circle-color": [
                'case',
                ['>', ["get", "object_id"], 1000],
                'red',
                'blue'
              ]
            }}
          /> */}
          <Layer
            id={'layer-2'}
            type={'symbol'}
            source={'measuringstation'}
            source-layer={'default'}
            layout={{
              "text-field": "{object_name}",
              "text-size": 14,
              "text-anchor": "bottom-left",
              "icon-image": "pumpIconImage",
              "icon-anchor": "bottom-right",
              "icon-size": 0.1,
            }}
            paint={{
              "text-color": [
                'case',
                ['>', ["get", "object_id"], 1000],
                'blue',
                'red'
              ],
              "icon-color": [
                'case',
                ['>', ["get", "object_id"], 1000],
                'blue',
                'red'
              ],
              // "icon-color": [
              //   'match',
              //   ["get", "object_name"],
              //   "ZWOLLE",
              //   'red',
              //   "Dante",
              //   'brown',
              //   'blue'
              // ]
            }}
          />
        </Source>
      </Map>
    </div>
  )
}
