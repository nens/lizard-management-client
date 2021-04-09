import React, { useState, useEffect } from 'react';
import { FloatInput } from './FloatInput';
import { AssetLocationValue } from "../types/locationFormTypes";
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
    // clearInput,
    errorMessage,
    triedToSubmit,
    readOnly
  } = props;

  const [lat, setLat] = useState<number>(NaN);
  const [lng, setLng] = useState<number>(NaN);

  useEffect(() => {
    if ( value.asset && value.asset.value && value.asset.value.view ) {
      setLat(value.asset.value.view[0]);
      setLng(value.asset.value.view[1])
    } else if (value.location) {
      setLat(value.location.lat);
      setLng(value.location.lng); 
    } else {
      setLat(NaN);
      setLng(NaN);
    };
  }, [value.asset, value.location]);

  const valueChangedLat = (value:number) => {
    valueChanged({
      asset: null,
      location:{
        lat: value,
        lng: lng
      }
    });
  };
  const valueChangedLng = (value:number) => {
    valueChanged({
      asset: null,
      location:{
        lat: lat,
        lng: value
      }
    });
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
        style={{
          display: "flex",
          color: "#C9C9C9"
        }}
      >
        {/* lng */}
        <div style={{marginRight: "16px", }}>
          <FloatInput
            title={"X"}
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
            // clearInput={clearInput}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            readOnly={readOnly}
          />
        </div>
        {/* lat */}
        <div>
          <FloatInput
            title={"Y"}
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
            // clearInput={clearInput}
            errorMessage={errorMessage}
            triedToSubmit={triedToSubmit}
            readOnly={readOnly}
          />
        </div>

      </div>
    </label>
  );
}
