import { useEffect, useRef } from 'react';
import ReactMapGL, { Source, Layer, MapRef, RasterSource } from 'react-map-gl';
import { mapBoxAccesToken } from '../mapboxConfig';
import 'mapbox-gl/dist/mapbox-gl.css';

const timestamps = [
  '2021-02-02T10:00:00',
  '2021-02-02T10:05:00',
  '2021-02-02T10:10:00',
  '2021-02-02T10:15:00',
  '2021-02-02T10:20:00',
  '2021-02-02T10:25:00',
  '2021-02-02T10:30:00',
  '2021-02-02T10:35:00',
  '2021-02-02T10:40:00',
  '2021-02-02T10:45:00',
  '2021-02-02T10:50:00',
  '2021-02-02T10:55:00',
  '2021-02-02T11:00:00'
];

export default function MapViewer () {
  const mapRef = useRef<MapRef>(null);
  const frameCount = 13;
  let currentStep = 0;

  const getPath = () => {
    return `/wms/?service=WMS&request=GetMap&version=1.1.1&format=image/png&layers=radar:5min&styles=radar-5min&transparent=false&height=256&width=256&srs=EPSG:3857&time=${timestamps[currentStep]}&bbox={bbox-epsg-3857}`
  }

  // const getPath = () => {
  //   return `https://docs.mapbox.com/mapbox-gl-js/assets/radar${currentImage}.gif`;
  // };

  // useEffect(() => {
  //   fetch(`/wms/?service=WMS&request=GetMap&version=1.1.1&format=image/png&layers=radar:hour&styles=radar-hour&transparent=false&height=256&width=256&srs=EPSG:3857&time=2021-01-22T10:50:00&BBOX=469629.1017841229,6418264.3910496775,626172.1357121639,6574807.4249777235`)
  //     .then(res => console.log(res))
  // }, [])

  useEffect(() => {
    setInterval(() => {
      currentStep = (currentStep + 1) % frameCount;
      const source = mapRef.current!.getSource('wms') as RasterSource;
      if (source) source.tiles = [getPath()]
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
        mapStyle={"mapbox://styles/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6"}
        // mapStyle={'mapbox://styles/mapbox/dark-v10'}
      >
          {/* <Source
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
          </Source> */}

          <Source
            id='wms'
            type='raster'
            tiles={[
              getPath()
            ]}
            tileSize={256}
          >
            <Layer
              id='wms-layer'
              type='raster'
              source={'wms'}
              paint={{
                "raster-fade-duration": 0
              }}
            />
          </Source>
      </ReactMapGL>
    </div>
  )
}
