// The main Form class

import React, {useState} from 'react';
import {FloatInput} from './FloatInput';
import {
  // Location, 
  // Asset, 
  AssetLocationValue
} from "../types/locationFormTypes"
 

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

  // @ts-ignore
  let lat;
  // @ts-ignore
  let lng; 
  if ( value.asset && value.asset.value && value.asset.value.view ) {
    lat = value.asset.value.view[0] as number;
    lng = value.asset.value.view[1] as number;
  } else if (value.location) {
    lat = value.location.lat as number;
    lng = value.location.lng as number; 
  } else {
    lat = NaN as number;
    lng = NaN as number;
  }

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
    <div>
      {/* lat */}
      <FloatInput
        title={title}
        name={name}
        placeholder={placeholder}
        value={lat}
        validated={validated}
        valueChanged={valueChangedLat}
        onFocus={onFocus}
        onBlur={onBlur}
        handleEnter={handleEnter}
        clearInput={clearInput}
        errorMessage={errorMessage}
        triedToSubmit={triedToSubmit}
        readOnly={readOnly}
      />
      {/* lng */}
      <FloatInput
        title={title}
        name={name}
        placeholder={placeholder}
        value={lng}
        validated={validated}
        valueChanged={valueChangedLng}
        onFocus={onFocus}
        onBlur={onBlur}
        handleEnter={handleEnter}
        clearInput={clearInput}
        errorMessage={errorMessage}
        triedToSubmit={triedToSubmit}
        readOnly={readOnly}
      />

    </div>
  );
}
