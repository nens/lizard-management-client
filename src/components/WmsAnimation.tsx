import { LatLngBounds } from 'leaflet';
import { useEffect, useState } from 'react';
import { Map, TileLayer, WMSTileLayer } from 'react-leaflet';
import { fetchRasterV4, RasterLayerFromAPI } from '../api/rasters';
import { mapBoxAccesToken } from '../mapboxConfig';
import { timestamps as initialTimestamps } from '../utils/getPath';

const getBounds = (raster: RasterLayerFromAPI): LatLngBounds => {
  const bounds = raster.spatial_bounds!;
  return new LatLngBounds(
    [bounds.north, bounds.west], [bounds.south, bounds.east]
  );
};

// number of frame count based on the number of time steps
const frameCount = initialTimestamps.length;

// keep track of counter id in global scope to stop the setInterval
let counterId: number;

export default function WmsAnimation () {
  const [raster, setRaster] = useState<RasterLayerFromAPI | null>(null);
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
    fetchRasterV4("3e5f56a7-b16e-4deb-8449-cc2c88805159").then(res => setRaster(res));
  }, [])

  useEffect(() => {
    const unloadedTiles = timestamps.filter(ts => !ts.loaded).length;
    if (unloadedTiles === 0) {
      setTilesReady(true);
    } else {
      setTilesReady(false);
    }
  }, [timestamps])

  if (!raster) return <div>loading ...</div>

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
      <Map
        bounds={getBounds(raster)}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
        />
        {timestamps.map(timestamp => (
          <WMSTileLayer
            key={timestamp.time}
            url={'/wms/'}
            layers={'radar:5min'}
            styles={'radar-5min'}
            time={timestamp.time}
            format={'image/png'}
            uppercase={true}
            bounds={getBounds(raster)}
            tileSize={1024}
            opacity={timestamp.time === timestamps[step].time ? 1 : 0}
            onload={() => {
              console.log('finish loading tiles for ', timestamp.time)
              setTimestamps(timestamps =>
                timestamps.map(ts => {
                  if (ts.time === timestamp.time) {
                    return {
                      ...ts,
                      loaded: true
                    }
                  };
                  return ts;
                })
              )
            }}
            // the onTileLoadStart happens when a tile is requested and starts loading
            // in this case, stop the animation and set the "loaded" parameter back to false
            // to indicate that the tiles are being reloaded
            // However, it normally takes very long to reload all the tiles (way longer than the first time)
            // During this time, user is not supposed to zoom in/zoom out, else the reloading process will happen again
            ontileloadstart={() => {
              stopAnimation();
              setTimestamps(timestamps =>
                timestamps.map(ts => {
                  if (ts.time === timestamp.time) {
                    return {
                      ...ts,
                      loaded: false
                    }
                  };
                  return ts;
                })
              )
            }}
          />
        ))}
      </Map>
      <div>
        <button
          onClick={startAnimation}
          disabled={!tilesReady || playAnimation}
        >
          {tilesReady ? 'Play' : 'Loading ...'}
        </button>
        {' '}
        <button
          onClick={stopAnimation}
        >
          Stop
        </button>
        {' '}
        <span>Time: {timestamps[step].time}</span>
      </div>
    </div>
  )
}
