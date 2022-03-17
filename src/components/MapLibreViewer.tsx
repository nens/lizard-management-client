import { useRef, useEffect } from 'react';
import maplibregl, { Map } from 'maplibre-gl';

export default function MapViewer () {
  const mapContainer = useRef(null);
  const map = useRef<any>(null);
  const apiKey = 'apPhpL758oE94pC4mFOd';

  useEffect(() => {
    if (map.current) return;
    let mapLibreMap: Map = map.current;
    mapLibreMap = new maplibregl.Map({
      container: mapContainer.current!,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${apiKey}`,
      center: [5.9, 52.6892],
      zoom: 8
    });

    mapLibreMap.addControl(new maplibregl.NavigationControl({}), 'top-right');

    mapLibreMap.on('load', () => {
      mapLibreMap.addSource(
        'vector-tile-1',
        {
          type: 'vector',
          tiles: [
            'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|4142433049200173|72206abe5035850d6743b23a49c41333'
          ],
          minzoom: 6,
          maxzoom: 14,
        }
      );
      mapLibreMap.addLayer({
        id: 'layer-1',
        type: 'line',
        source: 'vector-tile-1',
        'source-layer': 'sequence',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-opacity': 0.6,
          'line-color': 'rgb(53, 175, 109)',
          'line-width': 2
          // 'circle-radius': 4,
          // 'circle-stroke-width': 1,
          // 'circle-stroke-color': 'grey',
          // 'circle-color': [
          //   'case',
          //   ['>', ["get", "object_id"], 1000],
          //   'red',
          //   'blue'
          // ]
        }
      });
    })
  })

  return (
    <div
      className="map-wrap"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <div
        ref={mapContainer}
        className="map"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  )
}