// The main Form class

import React, {useState, useEffect} from 'react';
import {FloatInput} from './FloatInput';
import {
  // Location, 
  // Asset, 
  AssetLocationValue
} from "../types/locationFormTypes";
import formStyles from "../styles/Forms.module.css";

 

interface MyProps {
  title: string,
  name: string,
  value: AssetLocationValue,
  validated: boolean,
  valueChanged: (value: AssetLocationValue) => void,
  clearInput?: (e: any) => void,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const GeometryField: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    validated,
    valueChanged,
    onFocus,
    onBlur,
    handleEnter,
    clearInput,
    errorMessage,
    triedToSubmit,
    readOnly
  } = props;

  // TODO:
  // allow location lat lng fields to be empty
  // probably best to do this by storing local state in geometry field (try this first)
  // otherwise we can make the location type defenition allow to be empty and check for this in the oter component as well (MapSelectAssetOrPoint)

  const [lat, setLat] = useState(NaN);
  const [lng, setLng] = useState(NaN);


  useEffect(() => {
    // @ts-ignore
    // let lat;
    // @ts-ignore
    // let lng; 
    if ( value.asset && value.asset.value && value.asset.value.view ) {
      setLat(value.asset.value.view[0]);
      setLng(value.asset.value.view[1])
    } else if (value.location) {
      setLat(value.location.lat);
      setLng(value.location.lng); 
    } else {
      setLat(NaN);// as number;
      setLng(NaN)// as number;
    }
  }, [value.asset, value.location]);
  // // @ts-ignore
  // let lat;
  // // @ts-ignore
  // let lng; 
  // if ( value.asset && value.asset.value && value.asset.value.view ) {
  //   lat = value.asset.value.view[0] as number;
  //   lng = value.asset.value.view[1] as number;
  // } else if (value.location) {
  //   lat = value.location.lat as number;
  //   lng = value.location.lng as number; 
  // } else {
  //   lat = NaN as number;
  //   lng = NaN as number;
  // }

  const valueChangedLat = (value:number) => {
    if (value) {

    }
    valueChanged({
      asset: null,
      // @ts-ignore
      location:{lat:value, lng:lng}
    })
  }
  const valueChangedLng = (value:number) => {
    valueChanged({
      asset: null,
      // @ts-ignore
      location:{lat:lat, lng:value}
    })
  }

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div style={{display: "flex", }}>
        
        {/* lng */}
        <div style={{marginRight: "16px", }}>
          <FloatInput
            title={"x"}
            name={name}
            placeholder={placeholder}
            value={lng}
            validated={validated}
            valueChanged={(value)=>{
              if (isNaN(value)) {
                setLng(NaN);
              } else {
                valueChangedLng(value);
              }
              
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            handleEnter={handleEnter}
            clearInput={clearInput}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            readOnly={readOnly}
          />
        </div>
        {/* lat */}
        <div>
          <FloatInput
            title={"y"}
            name={name}
            placeholder={placeholder}
            value={lat}
            validated={validated}
            valueChanged={(value)=>{
              if (isNaN(value)) {
                setLat(NaN);
              } else {
                valueChangedLat(value);
              }
              
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            handleEnter={handleEnter}
            clearInput={clearInput}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            readOnly={readOnly}
          />
        </div>

      </div>
    </label>
  );
}
