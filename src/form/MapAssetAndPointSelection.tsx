// Component to preview a map and optionally with a raster layer on top.
// User can select a point by searching for an asset and using its point
// or by directly clicking on the map

import React, { useState } from "react";
import { Map, Marker, TileLayer, WMSTileLayer, ZoomControl } from "react-leaflet";
import { SelectDropdown } from "./SelectDropdown";
import { mapBoxAccesToken} from '../mapboxConfig';
import { AssetObject, AssetLocationValue } from "../types/locationFormTypes";
import { geometryValidator } from "./validators";
import { RasterLayerFromAPI } from "../api/rasters";
import styles from "./MapAssetAndPointSelection.module.css";
import formStyles from "../styles/Forms.module.css";

interface Props {
  title: string,
  name: string,
  assetType?: string | null,
  raster?: RasterLayerFromAPI | null,
  value: AssetLocationValue;
  valueChanged: (value: AssetLocationValue)=> void,
}

// Helper function to fetch assets in async select dropdown
const fetchAssets = async (searchInput: string, raster?: RasterLayerFromAPI | null, type?: string | null) => {
  if (!searchInput) return;

  const NUMBER_OF_RESULTS = 20;
  const params=[`page_size=${NUMBER_OF_RESULTS}`, `q=${searchInput}`];

  if (raster && raster.spatial_bounds) {
    const { west, east, north, south } = raster.spatial_bounds;
    params.push(`in_bbox=${west},${south},${east},${north}`);
  };
  if (type) {
    params.push(`type=${type}`);
  };

  const urlQuery = params.join('&');
  const response = await fetch(`/api/v3/search/?${urlQuery}`, {
    credentials: "same-origin"
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((asset: any) => ({
    value: asset.entity_id,
    label: asset.title,
    location: asset.view ? {
      lat: asset.view[0],
      lng: asset.view[1]
    } : null,
    type: asset.entity_name
  }));
};

export const MapAssetAndPointSelection = (props: Props) => {
  const {
    title,
    name,
    assetType,
    raster,
    value,
    valueChanged
  } = props;

  // useState to temporarily store the selected asset from the asset select dropdown.
  // This is required for the RasterPointSelection as it does not contain information about its related asset.
  const [selectedAsset, setSelectedAsset] = useState<AssetObject | null>(null);

  const handleMapClick = (e: any) => {
    valueChanged({
      ...value,
      location: {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }
    });

    // Reset the selectedAsset state
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
  const DEFAULT_POSITION = {
    lat: 52.1858,
    lng: 5.2677
  };

  const marker = (
    value.location && geometryValidator(value.location) ? value.location : DEFAULT_POSITION
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
        <div
          className={styles.AssetSelect}
        >
          <SelectDropdown
            title={''}
            name={name}
            placeholder={'- Search and select an asset -'}
            value={value.asset || selectedAsset}
            valueChanged={asset => {
              setSelectedAsset(asset as AssetObject | null);
              if (!asset) {
                valueChanged({
                  ...value,
                  asset: null
                });
                return;
              };
              const selectedAssetFromDropdown = asset as AssetObject;
              valueChanged({
                asset: selectedAssetFromDropdown,
                location: selectedAssetFromDropdown.location
              });
            }}
            options={[]}
            validated
            isAsync
            loadOptions={searchInput => fetchAssets(searchInput, raster, assetType)}
          />
        </div>
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
          {geometryValidator(value.location) ? (
            <Marker position={marker} />
          ) : null}
        </Map>
      </div>
    </label>
  );
}