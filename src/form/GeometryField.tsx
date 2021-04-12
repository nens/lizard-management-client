import React from 'react';
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
    clearInput,
    errorMessage,
    triedToSubmit,
    readOnly
  } = props;

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
            value={value.location ? value.location.lng : NaN}
            validated={validated}
            valueChanged={e => {
              if (isNaN(e)) return;
              valueChanged({
                asset: null,
                location: {
                  lat: value.location ? value.location.lat : NaN,
                  lng: e
                }
              });
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
            title={"Y"}
            name={name}
            placeholder={placeholder}
            value={value.location ? value.location.lat : NaN}
            validated={validated}
            valueChanged={e => {
              if (isNaN(e)) return;
              valueChanged({
                asset: null,
                location: {
                  lng: value.location ? value.location.lng : NaN,
                  lat: e
                }
              });
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
