import { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer, MapRef } from 'react-map-gl';
import { mapBoxAccesToken } from '../mapboxConfig';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPath, timestamps as initialTimestamps } from '../utils/getPath';

// number of frame count based on the number of time steps
const frameCount = initialTimestamps.length;

// keep track of counter id in global scope to stop the setInterval
let counterId: number;

export default function MapViewer () {
  const mapRef = useRef<MapRef>(null);
  const [step, setStep] = useState<number>(0);
  const [tilesReady, setTilesReady] = useState<boolean>(false);
  const [timestamps, setTimestamps] = useState<{time: string, loaded: boolean}[]>(initialTimestamps);
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);

  // Functions to stop and start the animation
  const startAnimation = () => {
    setPlayAnimation(true);
    counterId = window.setInterval(() => setStep((step) => (step + 1) % frameCount), 750);
  };
  const stopAnimation = () => {
    setPlayAnimation(false);
    window.clearInterval(counterId);
  };

  useEffect(() => {
    const unloadedTiles = timestamps.filter(ts => !ts.loaded).length;
    if (unloadedTiles === 0) {
      setTilesReady(true);
    } else {
      setTilesReady(false);
    }
  }, [timestamps])

  // useEffect(() => {
  //   setInterval(() => {
  //     currentStep = (currentStep + 1) % frameCount;
  //     const source = mapRef.current!.getSource('wms') as RasterSource;
  //     if (source) source.tiles = [getPath()]
  //   }, 200);
  // })

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '14fr 1fr',
        rowGap: 10
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
          tiles={timestamps.map(ts => getPath(ts.time))}
          tileSize={1024}
        >
          <Layer
            id='wms-layer'
            type='raster'
            source={'wms'}
            paint={{
              "raster-opacity": 1
            }}
          />
        </Source>
      </ReactMapGL>
      <div>
        <button
          onClick={() => startAnimation()}
          disabled={!tilesReady || playAnimation}
        >
          {tilesReady ? 'Play' : 'Loading ...'}
        </button>
        {' '}
        <button
          onClick={() => stopAnimation()}
        >
          Stop
        </button>
        {' '}
        <span>Time: {timestamps[step].time}</span>
      </div>
    </div>
  )
}
