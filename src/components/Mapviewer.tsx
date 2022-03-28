import { useEffect, useRef } from 'react';
import ReactMapGL, { Source, Layer, MapRef } from 'react-map-gl';
import { mapBoxAccesToken } from '../mapboxConfig';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapViewer () {
  const mapRef = useRef<MapRef>(null);
  const frameCount = 5;
  let currentImage = 0;

  const getPath = () => {
    return `https://docs.mapbox.com/mapbox-gl-js/assets/radar${currentImage}.gif`;
  };

  useEffect(() => {
    setInterval(() => {
      currentImage = (currentImage + 1) % frameCount;
      // @ts-ignore
      mapRef.current!.getSource('radar').updateImage({ url: getPath() });
    }, 200);
  })

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
      <ReactMapGL
        ref={mapRef}
        initialViewState={{
          latitude: 52.6892,
          longitude: 5.9,
          zoom: 8
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
        mapboxAccessToken={mapBoxAccesToken}
        // mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
        mapStyle={'mapbox://styles/mapbox/dark-v10'}
      >
          <Source
            id={'radar'}
            type={'image'}
            url={getPath()}
            coordinates={[
              [-80.425, 46.437],
              [-71.516, 46.437],
              [-71.516, 37.936],
              [-80.425, 37.936]
            ]}
          >
              <Layer
                id='radar-layer'
                type='raster'
                source={'radar'}
                paint={{
                  "raster-fade-duration": 0
                }}
              />
          </Source>
      </ReactMapGL>
    </div>
  )
}
