// Todo: This component should probably also be used for the raster alarms

// Component to preview raster on a map.
// And optionally let the user select a point on it 
// by searching for an asset and using its point

import React from "react";
import { Map, Marker, TileLayer, WMSTileLayer, ZoomControl } from "react-leaflet";
import { SelectDropdown } from "./SelectDropdown";
import { mapBoxAccesToken} from '../mapboxConfig';
import { AssetObject, AssetLocationValue } from "../types/locationFormTypes";
import { geometryValidator } from "./validators";
import styles from "../components/RasterPreview.module.css";
import formStyles from "../styles/Forms.module.css";

interface Props {
  title: string,
  name: string,
  assetType?: string | null,
  raster?: any,
  value: AssetLocationValue;
  valueChanged: (value: AssetLocationValue)=> void,
}

// Helper function to fetch assets in async select dropdown
const fetchAssets = async (raster: any, searchInput: string, type?: string | null) => {
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

const MapSelectAssetOrPoint = (props:Props) => {
  const {
    title,
    name,
    assetType,
    raster,
    value,
    valueChanged
  } = props;

  const handleMapClick = (e: any) => {
    valueChanged({
      asset: null,
      location: {
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }
    });
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
            value={value.asset}
            valueChanged={e => {
              if (!e) {
                valueChanged({
                  ...value,
                  asset: null
                });
                return;
              };
              const selectedAssetFromDropdown = e as AssetObject;
              valueChanged({
                asset: selectedAssetFromDropdown,
                location: selectedAssetFromDropdown.location
              });
            }}
            options={[]}
            validated
            isAsync
            loadOptions={searchInput => fetchAssets(raster, searchInput, assetType)}
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

export default MapSelectAssetOrPoint;