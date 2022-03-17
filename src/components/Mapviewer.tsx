import { useRef, useState } from 'react';
import Map, { Source, Layer, MapRef, Popup } from 'react-map-gl';
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
// import { mapBoxAccesToken } from '../mapboxConfig';
// import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Use pump icon as iconImage for measuring station vector tile
// import pumpIcon from '../images/pump.png';
// const pumpIconImage = new Image(20, 20);
// pumpIconImage.src = pumpIcon;

export default function MapViewer () {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [popupData, setPopupData] = useState<any | null>(null);
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
        initialViewState={{
          latitude: 52.6892,
          longitude: 5.9,
          zoom: 8
        }}
        mapLib={maplibregl}
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%'
        }}
        // mapStyle={'mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6'}
        mapStyle={"https://api.maptiler.com/maps/streets/style.json?key=apPhpL758oE94pC4mFOd"}
        onClick={(event) => {
          console.log('hoan event', event);
          setPopupData(event);
        }}
        // onLoad={() => {
        //   const map: mapboxgl.Map = mapRef && mapRef.current && mapRef.current.getMap();
        //   // console.log('hoan source', map.getSource('measuringstation'))
        //   // console.log('hoan layer', map.getLayer('layer-1'))
        //   // map.addImage('hoanImage', image, { sdf: true })
        //   map.loadImage(
        //     pumpIcon,
        //     (e, img) => {
        //       if (e || !img) return console.log('Failed to load image: ', e);
        //       map.addImage('pumpIconImage', img, { sdf: true });
        //     }
        //   );
        // }}
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
            `/api/v4/measuringstations/vectortiles/{z}/{x}/{y}/?organisation__uuid=${selectedOrganisation.uuid}`
          ]}
          minzoom={6}
          maxzoom={14}
        >
          <Layer
            key={'layer-1'}
            id={'layer-1'}
            type={'circle'}
            // type={'symbol'}
            source={'measuringstation'}
            source-layer={'default'}
            // layout={{
            //   "text-field": "{object_name}",
            //   "text-size": 14,
            //   "text-anchor": "bottom-left",
            //   "icon-image": "pumpIconImage",
            //   "icon-anchor": "bottom-right",
            //   "icon-size": 0.1
            // }}
            paint={{
              "circle-radius": 4,
              "circle-stroke-width": 1,
              "circle-stroke-color": 'grey',
              "circle-color": [
                'case',
                ['>', ["get", "object_id"], 1000],
                'red',
                'blue'
              ],
              // "text-color": [
              //   'case',
              //   ['>', ["get", "object_id"], 1000],
              //   'blue',
              //   'red'
              // ],
              // "icon-color": [
              //   'case',
              //   ['>', ["get", "object_id"], 1000],
              //   'blue',
              //   'red'
              // ],
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
