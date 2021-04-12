import React, { useState } from 'react';
import { AssetLocationValue, assetTypes, Location } from '../types/locationFormTypes';
import { GeometryField } from './GeometryField';
import MapSelectAssetOrPoint from './MapSelectAssetOrPoint';
import { SelectDropdown, Value } from './SelectDropdown';
import formStyles from './../styles/Forms.module.css';

export interface AssetObject {
  value: number,
  label: string,
  type: string,
  location: number[],
}

interface MyProps {
  asset: AssetObject,
  location: Location | null,
  handleLocationChanged: (value: Location | null) => void,
  handleAssetChanged: (value: AssetLocationValue) => void,
  triedToSubmit?: boolean,
}

export const AssetPointSelection = (props: MyProps) => {
  const {
    asset,
    location,
    handleLocationChanged,
    handleAssetChanged,
    triedToSubmit
  } = props;
  console.log('asset', asset)

  const [assetType, setAssetType] = useState<Value | null | undefined>(asset ? assetTypes.find(assetType => assetType.value === asset.type) : null);

  return (
    <div>
      <SelectDropdown
        title={'Asset type'}
        name={'assetType'}
        placeholder={'- Search and select -'}
        value={assetType}
        valueChanged={value => setAssetType(value as Value)}
        options={assetTypes}
        validated
      />
      <MapSelectAssetOrPoint
        title={'Asset location'}
        name={'selectedAssetObj'}
        value={{
          asset: asset,
          location: location
        }}
        valueChanged={value => handleAssetChanged(value)}
        validated={true}
        triedToSubmit={triedToSubmit}
      />
      <div style={{display: "flex"}}>
        <div style={{width: "58%", marginRight: "40px"}}>
          <GeometryField
            title={'Geometry'}
            name={'selectedAssetObj'}
            value={{
              asset: asset,
              location: location
            }}
            valueChanged={value => handleLocationChanged(value.location)}
            validated
            triedToSubmit={triedToSubmit}
          />
        </div>
        <div>
          <label
            className={formStyles.Label}
          >
            <span className={formStyles.LabelTitle}>
              Selected asset
            </span>
            <a 
              href={
                // values.selectedAssetObj.asset && 
                // values.selectedAssetObj.asset.value &&  
                // values.selectedAssetObj.asset.value.entity_name ? 
                // `/api/v3/${values.selectedAssetObj.asset.value.entity_name}s/${values.selectedAssetObj.asset.value.entity_id}`
                // : values.selectedAssetObj.asset?
                // `/api/v3/${currentRecord.object.type}s/${currentRecord.object.id}`
                // :
                '/api/v3/'
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {asset ? asset.label : "None selected. See all endpoints"}
            </a>
          </label>
        </div>
      </div>
    </div>
  )
}