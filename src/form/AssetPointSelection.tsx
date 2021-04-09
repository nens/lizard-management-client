import React from 'react';
import { assetTypes, Location } from '../types/locationFormTypes';
import { GeometryField } from './GeometryField';
import MapSelectAssetOrPoint from './MapSelectAssetOrPoint';
import { SelectDropdown, Value } from './SelectDropdown';
import formStyles from './../styles/Forms.module.css';

interface MyProps {
  relatedAsset: any,
  coordinates: Location | null,
  assetType: Value,
  handleCoordinatesChanged: (value: Location | null) => void,
  handleAssetTypeChanged: (value: Value) => void,
  handleAssetObjectChanged: (value: any) => void,
  triedToSubmit?: boolean,
}

export const AssetPointSelection = (props: MyProps) => {
  const {
    relatedAsset,
    coordinates,
    assetType,
    handleAssetTypeChanged,
    handleCoordinatesChanged,
    handleAssetObjectChanged,
    triedToSubmit
  } = props;

  return (
    <div>
      <SelectDropdown
        title={'Asset type'}
        name={'assetType'}
        placeholder={'- Search and select -'}
        value={assetType}
        valueChanged={value => handleAssetTypeChanged(value as Value)}
        options={assetTypes}
        validated
      />
      <MapSelectAssetOrPoint
        title={'Asset location'}
        name={'selectedAssetObj'}
        value={{
          asset: relatedAsset,
          location: coordinates
        }}
        valueChanged={value => handleAssetObjectChanged(value)}
        validated={true}
        triedToSubmit={triedToSubmit}
      />
      <div style={{display: "flex"}}>
        <div style={{width: "58%", marginRight: "40px"}}>
          <GeometryField
            title={'Geometry'}
            name={'selectedAssetObj'}
            value={{
              asset: assetType,
              location: coordinates
            }}
            valueChanged={value => handleCoordinatesChanged(value.location)}
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
              {assetType ? assetType.label : "None selected. See all endpoints"}
            </a>
          </label>
        </div>
      </div>
    </div>
  )
}