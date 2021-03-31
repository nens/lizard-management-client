// Component to preview raster on a map.
// And optionally let the user select a point on it (maybe
// by searching for an asset and using its point)

// Optional property 'setLocation' should be a function that sets the
// location, in the form {'lat': <lat>, 'lng': <lng>}; if it is not
// passed, user cannot choose a location and this component is for
// raster preview only.

import React, { useState, useEffect } from "react";
import { Map, Marker, TileLayer, WMSTileLayer, ZoomControl } from "react-leaflet";
import { SelectDropdown } from "./SelectDropdown";
import { mapBoxAccesToken} from '../mapboxConfig';
import { convertToSelectObject } from "../utils/convertToSelectObject";
import styles from "../components/RasterPreview.module.css";
import { fetchRasterV4, RasterLayerFromAPI } from '../api/rasters';
// import { latLng } from "leaflet";
import formStyles from "../styles/Forms.module.css";


interface Location {
  lat: number,
  lng: number
}

type Asset = any | null;

interface Value {
  asset: Asset;
  point: Location;
}

interface Props {
  title: string,
  value: Value;
  name: string;
  rasterUuid?:string;
  valueChanged: (value: Value)=> void,
  validated: boolean;
  errorMessage?: string;
  triedToSubmit: boolean;
}

// Helper function to fetch assets in async select dropdown
const fetchAssets = async (raster:any | null, searchInput: string, type: string | null) => {
  if (!searchInput) return;

  const NUMBER_OF_RESULTS = 20;
  const params=[`page_size=${NUMBER_OF_RESULTS}`, `q=${searchInput}`];

  if (raster && raster.spatial_bounds) {
    const { west, east, north, south } = raster.spatial_bounds;
    params.push(`in_bbox=${west},${south},${east},${north}`);
  };
  if (type) {
    params.push(`type=${type}`);
  }

  const urlQuery = params.join('&');
  const response = await fetch(`/api/v3/search/?${urlQuery}`, {
    credentials: "same-origin"
  });
  const responseJSON = await response.json();

  // @ts-ignore
  return responseJSON.results.map(asset => convertToSelectObject(asset, asset.title))
};

const MapSelectAssetOrPoint = (props:Props) => {
  const {
    title,
    name,
    rasterUuid,
    value,
    valueChanged,
    validated,
    errorMessage,
    triedToSubmit
  } = props;

  

  const [raster, setRaster] = useState<RasterLayerFromAPI | null>(null);

  // useState to temporarily store the selected asset
  // from the asset select dropdown
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (rasterUuid) {
      fetchRasterV4(rasterUuid).then(
        raster => setRaster(raster)
      ).catch(console.error);
    };
  }, [rasterUuid]);

  const setLocation = (location: Location | null) => {
    if (location !== null && raster !== null) {
      // Check if location fits within the raster
      const { lat, lng } = location;
      const bounds = raster.spatial_bounds;

      if (!bounds) return;

      const inBounds = (
        lat >= bounds.south && lat <= bounds.north &&
        lng >= bounds.west && lng <= bounds.east
      );

      if (!inBounds) return;
    };
    // @ts-ignore
    valueChanged({ asset: null, location: location});
  };

  const chooseLocation = !!setLocation;

  const setAsset = (option: { value: Asset } | null) => {
    const asset = option && option.value;
    console.log('valuechange 2', asset);
    if (asset && asset.view) {
      console.log('valuechange 3', asset);
      const lat = asset.view[0];
      const lng = asset.view[1];
      if (raster !== null) {
        if ( !raster.spatial_bounds) {
          console.log('valuechange 4', asset);
          return;
        }
        console.log('valuechange 5', asset);
        const inBounds = (
          lat >= raster.spatial_bounds.south && lat <= raster.spatial_bounds.north &&
          lng >= raster.spatial_bounds.west && lng <= raster.spatial_bounds.east
        );
        if (!inBounds) { 
          return; 
        }
      }
      console.log('valuechange 6', asset);
      // @ts-ignore
      valueChanged({ asset: option, location: {lat:lat,lng:lng}});
    } else {
      // @ts-ignore
      valueChanged({ asset: null, location: null});
    }
  };

   

  

  const handleMapClick = (e:any) => {
    setLocation({
      lat: e.latlng.lat,
      lng: e.latlng.lng
    });

    // if there is a selected asset from the dropdown, reset it
    if (selectedAsset) setSelectedAsset(null);
  };

  const formatWMSStyles = (rawStyles:any) => {
    /*
       Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores
       behind the screens.
     */
    return typeof rawStyles === typeof {} ? rawStyles[0][0] : rawStyles;
  };

  const formatWMSLayers = (rawLayerNames:any) => {
    /*
       Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores
       behind the screens.
     */
    return rawLayerNames.split(",")[0];
  }

  // Center of the map if no raster yet
  const DEFAULT_POSITION = [52.1858, 5.2677];

  const marker = (
    // @ts-ignore
    value.location ? [value.location.lat, value.location.lng] : DEFAULT_POSITION
  );

  let mapLocation;

  if (raster && raster.spatial_bounds) {
    mapLocation = {
      bounds: [
        [
          raster.spatial_bounds.south,
          raster.spatial_bounds.west
        ],
        [
          raster.spatial_bounds.north,
          raster.spatial_bounds.east
        ]
      ]
    };
  } else {
    mapLocation = {
      center: marker,
      zoom: 8
    };
  };

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
    <div
      className={styles.MapContainer}
    >
      {chooseLocation ?
        <div
          className={styles.AssetSelect}
        >
          <SelectDropdown
            title={''}
            name={name}
            placeholder={'- Search and select an asset -'}
            value={value.asset}
            valueChanged={value => {
              console.log('valuechange 1', value);
              // @ts-ignore
              setAsset(value);
            }}
            options={[]}
            validated={validated}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            isAsync
            loadOptions={searchInput => fetchAssets(raster, searchInput, null)}
          />
        </div>
      : null}
      <Map
        // @ts-ignore
        onClick={handleMapClick}
        className={styles.MapStyle}
        zoomControl={false}
        {...mapLocation}
      >
        <ZoomControl position="bottomright"/>
        <TileLayer url={`https://api.mapbox.com/styles/v1/nelenschuurmans/ck8sgpk8h25ql1io2ccnueuj6/tiles/256/{z}/{x}/{y}@2x?access_token=${mapBoxAccesToken}`} />
        {raster ? (
          <WMSTileLayer
            url="/wms/"
            // @ts-ignore
            styles={formatWMSStyles(raster.options.styles)}
            layers={formatWMSLayers(raster.wms_info.layer)}
            opacity={0.9}
          />
        ) : null}
        
        {
        // @ts-ignore
        value.location ?
          // @ts-ignore
          <Marker position={marker} />
        : null}
      </Map>
    </div>
    </label>
  );
}

export default MapSelectAssetOrPoint;