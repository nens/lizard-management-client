// Component to preview raster on a map.
// And optionally let the user select a point on it (maybe
// by searching for an asset and using its point)

// Optional property 'setLocation' should be a function that sets the
// location, in the form {'lat': <lat>, 'lng': <lng>}; if it is not
// passed, user cannot choose a location and this component is for
// raster preview only.

import React, { useState } from "react";
import { Map, Marker, TileLayer, WMSTileLayer, ZoomControl } from "react-leaflet";
import { SelectDropdown } from "../form/SelectDropdown";
import { mapBoxAccesToken} from '../mapboxConfig';
import { convertToSelectObject } from "../utils/convertToSelectObject";
import styles from "./RasterPreview.module.css";

// Helper function to fetch assets in async select dropdown
const fetchAssets = async (raster, searchInput) => {
  if (!searchInput) return;

  const NUMBER_OF_RESULTS = 20;
  const params=[`page_size=${NUMBER_OF_RESULTS}`, `q=${searchInput}`];

  if (raster && raster.spatial_bounds) {
    const { west, east, north, south } = raster.spatial_bounds;
    params.push(`in_bbox=${west},${south},${east},${north}`);
  };

  const urlQuery = params.join('&');
  const response = await fetch(`/api/v3/search/?${urlQuery}`, {
    credentials: "same-origin"
  });
  const responseJSON = await response.json();

  return responseJSON.results.map(asset => convertToSelectObject({lat: asset.view[0], lng: asset.view[1]}, asset.title))
};

const RasterPreview = (props) => {
  const {
    name,
    raster,
    location,
    setLocation,
    validated,
    errorMessage,
    triedToSubmit
  } = props;

  const chooseLocation = !!setLocation;

  // useState to temporarily store the selected asset
  // from the asset select dropdown
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleMapClick = (e) => {
    setLocation({
      lat: e.latlng.lat,
      lng: e.latlng.lng
    });

    // if there is a selected asset from the dropdown, reset it
    if (selectedAsset) setSelectedAsset(null);
  };

  const formatWMSStyles = (rawStyles) => {
    /*
       Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores
       behind the screens.
     */
    return typeof rawStyles === typeof {} ? rawStyles[0][0] : rawStyles;
  };

  const formatWMSLayers = (rawLayerNames) => {
    /*
       Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores
       behind the screens.
     */
    return rawLayerNames.split(",")[0];
  }

  // Center of the map if no raster yet
  const DEFAULT_POSITION = [52.1858, 5.2677];

  const marker = (
    location ? [location.lat, location.lng] : DEFAULT_POSITION
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
            value={selectedAsset}
            valueChanged={value => {
              setSelectedAsset(value);
              if (value) {
                setLocation(value.value);
              } else {
                setLocation(null);
              };
            }}
            options={[]}
            validated={validated}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            isAsync
            loadOptions={searchInput => fetchAssets(raster, searchInput)}
          />
        </div>
      : null}
      <Map
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
            styles={formatWMSStyles(raster.options.styles)}
            layers={formatWMSLayers(raster.wms_info.layer)}
            opacity={0.9}
          />
        ) : null}
        {location ?
          <Marker position={marker} />
        : null}
      </Map>
    </div>
  );
}

export default RasterPreview;