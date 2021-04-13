import React, { useEffect, useState } from 'react';
import MapSelectAssetOrPoint from './MapSelectAssetOrPoint';
import { AssetLocationValue, assetTypes } from '../types/locationFormTypes';
import formStyles from "../styles/Forms.module.css";
import { GeometryField } from './GeometryField';
import { SelectDropdown, Value } from './SelectDropdown';

interface MyProps {
  value: AssetLocationValue,
  valueChanged: (value: AssetLocationValue) => void,
  triedToSubmit?: boolean,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
}

export const AssetPointSelection: React.FC<MyProps> = (props) => {
  const {
    value,
    valueChanged,
    triedToSubmit,
    // onFocus,
    // onBlur,
  } = props;

  // asset type selection dropdown
  const [assetType, setAssetType] = useState<Value | null>(null);

  // useEffect to keep assetType in sync with type from the selected asset
  useEffect(() => {
    if (value.asset && value.asset.type) {
      const currentAssetType = value.asset.type;
      const assetTypeObject = assetTypes.find(type => type.value === currentAssetType);
      setAssetType(assetTypeObject ? assetTypeObject : null);
    };
  }, [value.asset]);

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
        name={'assetLocation'}
        assetType={assetType ? assetType.value as string : null}
        value={value}
        valueChanged={valueChanged}
        validated
      />
      <div style={{display: "flex"}}>
        <div style={{flex: 3, marginRight: "40px"}}>
          <GeometryField
            title={'Geometry'}
            name={'geometry'}
            value={value}
            valueChanged={valueChanged}
            validated
            triedToSubmit={triedToSubmit}
          />
        </div>
        <div style={{flex: 2}}>
          <label
            className={formStyles.Label}
          >
            <span className={formStyles.LabelTitle}>
              Selected asset
            </span>
            <a 
              href={
                value.asset && 
                value.asset.value &&  
                value.asset.type ? (
                  `/api/v3/${value.asset.type}s/${value.asset.value}`
                ) : (
                  '/api/v3/'
                )
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {value.asset ? value.asset.label : "None selected. See all endpoints" }
            </a>
          </label>
        </div>
      </div>
    </div>
  )
};