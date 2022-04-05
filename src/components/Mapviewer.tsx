import { LatLngBounds } from 'leaflet';
import { useEffect, useState } from 'react';
import { Map, Pane, TileLayer, WMSTileLayer } from 'react-leaflet';
import { fetchRasterV4, RasterLayerFromAPI } from '../api/rasters';
import { mapBoxAccesToken } from '../mapboxConfig';
import { timestamps } from '../utils/getPath';

const getBounds = (raster: RasterLayerFromAPI): LatLngBounds => {
  const bounds = raster.spatial_bounds!;
  return new LatLngBounds(
    [bounds.north, bounds.west], [bounds.south, bounds.east]
  );
};

const frameCount = 13;

export default function MapViewer () {
  const [raster, setRaster] = useState<RasterLayerFromAPI | null>(null);
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    fetchRasterV4("3e5f56a7-b16e-4deb-8449-cc2c88805159").then(res => setRaster(res));
  }, [])

  useEffect(() => {
    if (raster) {
      setInterval(() => {
        setStep((step) => (step + 1) % frameCount);
      }, 1000)
    }
  }, [raster])

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
        // gridTemplateRows: '9fr 1fr',
        // rowGap: 10
      }}
    >
      <Map
        bounds={getBounds(raster)}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`}
        />
        {/* <Pane
          style={{
            visibility: timestamps[step] === '2021-02-02T10:50:00' ? 'visible' : 'hidden'
          }}
        >
          <WMSTileLayer
            url={'/wms/'}
            layers={'radar:5min'}
            styles={'radar-5min'}
            time={'2021-02-02T10:50:00'}
            format={'image/png'}
            uppercase={true}
          />
        </Pane> */}
        {timestamps.map(timestamp => (
          <Pane
            key={timestamp}
            style={{
              visibility: timestamp === timestamps[step] ? 'visible' : 'hidden'
            }}
          >
            <WMSTileLayer
              url={'/wms/'}
              layers={'radar:5min'}
              styles={'radar-5min'}
              time={timestamp}
              format={'image/png'}
              uppercase={true}
              bounds={getBounds(raster)}
              opacity={1}
              // onload={() => console.log('hoan', timestamp, timestamps[step])}
            />
          </Pane>
        ))}
      </Map>
    </div>
  )
}
