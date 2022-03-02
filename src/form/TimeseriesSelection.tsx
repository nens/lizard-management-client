import React, { useState } from "react";
import { AssetResponseFromSearchEndpoint } from "../types/locationFormTypes";
import { getTimeseriesLabel, TimeseriesFromAssetEndpoint } from "../types/timeseriesType";
import { convertToSelectObject } from "../utils/convertToSelectObject";
import { SelectDropdown, Value } from "./SelectDropdown";

interface AssetFromSearchEndpoint {
  entity_name: string;
  entity_id: number | null;
}

interface AssetFromAssetEndpoint {
  timeseries: TimeseriesFromAssetEndpoint[];
  filters?: NestedAsset[];
  pumps?: NestedAsset[];
}

interface NestedAsset {
  value: string;
  label: string;
  code: string;
  name: string;
  timeseries: TimeseriesFromAssetEndpoint[];
}

interface MyProps {
  name: string;
  timeseries: Value | null;
  valueChanged: (value: Value | {} | null) => void;
  triedToSubmit: boolean;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

// Helper function to fetch assets in async select dropdown
const fetchAssets = async (searchInput: string) => {
  if (!searchInput) return;

  const NUMBER_OF_RESULTS = 20;
  const params = [`page_size=${NUMBER_OF_RESULTS}`, `q=${searchInput}`];

  const urlQuery = params.join("&");
  const response = await fetch(`/api/v3/search/?${urlQuery}`, {
    credentials: "same-origin",
  });
  const responseJSON = await response.json();

  return responseJSON.results.map((asset: AssetResponseFromSearchEndpoint) => ({
    ...asset,
    value: asset.id,
    label: asset.title,
  }));
};

// Helper function to get nest assets from the selected asset
const getNestedAssetList = (asset: AssetFromAssetEndpoint | null): NestedAsset[] => {
  if (asset && asset.filters) {
    return asset.filters;
  } else if (asset && asset.pumps) {
    return asset.pumps;
  } else {
    return [];
  }
};

// Validators for asset & nested asset
const validateAsset = (asset: AssetFromSearchEndpoint) => {
  return asset.entity_id && asset.entity_name;
};
const validateNestedAsset = (asset: NestedAsset) => {
  return asset.code || asset.name;
};

export function TimeseriesSelection(props: MyProps) {
  const { name, timeseries, triedToSubmit, onFocus, onBlur } = props;

  const [selectedAsset, setSelectedAsset] = useState<AssetFromAssetEndpoint | null>(null);
  const [selectedNestedAsset, setSelectedNestedAsset] = useState<NestedAsset | null>(null);

  return (
    <div>
      <SelectDropdown
        title={"Location"}
        name={name + "_asset"}
        placeholder={"- Search and select a location -"}
        valueChanged={async (value) => {
          if (!value) {
            setSelectedAsset(null);
            setSelectedNestedAsset(null);
            return;
          }
          const assetObj = value as AssetFromSearchEndpoint;
          if (!validateAsset(assetObj)) {
            console.error("Missing parameters from asset: ", assetObj);
            return;
          } else {
            const asset = await fetch(`/api/v3/${assetObj.entity_name}s/${assetObj.entity_id}/`, {
              credentials: "same-origin",
            }).then((response) => response.json());
            setSelectedAsset(asset);
            setSelectedNestedAsset(null);
          }
        }}
        options={[]}
        validated
        isAsync
        isCached
        loadOptions={fetchAssets}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <SelectDropdown
        title={"Sub-location"}
        name={name + "_nestedAsset"}
        placeholder={"- Select a sub-location if necessary -"}
        value={selectedNestedAsset}
        valueChanged={(value) => {
          if (!value) {
            setSelectedNestedAsset(null);
            return;
          }
          const nestedAsset = value as NestedAsset;
          if (!validateNestedAsset(nestedAsset)) {
            return;
          } else {
            setSelectedNestedAsset(nestedAsset);
          }
        }}
        options={getNestedAssetList(selectedAsset).map((obj) => ({
          ...obj,
          value: obj.code,
          label: obj.code,
        }))}
        validated
        // field is read-only if no asset is selected or no nested asset found
        readOnly={!selectedAsset || getNestedAssetList(selectedAsset).length === 0}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <SelectDropdown
        title={"Time series *"}
        name={name}
        placeholder={"- Select a time series -"}
        value={timeseries}
        valueChanged={(value) => props.valueChanged(value)}
        options={
          // Show timeseries of nested asset if a nested asset is selected
          selectedNestedAsset
            ? selectedNestedAsset.timeseries.map((ts) =>
                convertToSelectObject(
                  ts.uuid,
                  getTimeseriesLabel(ts),
                  ts.uuid,
                  "",
                  ts.location || ""
                )
              )
            : // Show timeseries of only the asset and not also the nested assets if no nested asset is selected
            selectedAsset
            ? selectedAsset.timeseries.map((ts) =>
                convertToSelectObject(
                  ts.uuid,
                  getTimeseriesLabel(ts),
                  ts.uuid,
                  "",
                  ts.location || ""
                )
              )
            : []
        }
        validated={!!timeseries}
        errorMessage={"Please select a timeseries"}
        triedToSubmit={triedToSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
