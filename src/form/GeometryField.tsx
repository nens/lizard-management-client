import React from 'react';
import { FloatInput } from './FloatInput';
import { Location } from "../types/locationFormTypes";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: Location | null,
  validated: boolean,
  valueChanged: (value: Location | null) => void,
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
    valueChanged,
    validated,
    errorMessage,
    onFocus,
    onBlur,
    handleEnter,
    clearInput,
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
            value={value ? value.lng : NaN}
            valueChanged={lng => {
              valueChanged({
                lat: value ? value.lat : NaN,
                lng: !isNaN(lng) ? lng : NaN
              });
            }}
            validated={validated && (
              !value || !isNaN(value.lng) // either leave both X and Y fields empty or fill in both fields
            )}
            errorMessage={errorMessage}
            onFocus={onFocus}
            onBlur={onBlur}
            handleEnter={handleEnter}
            clearInput={clearInput}
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
            value={value ? value.lat : NaN}
            valueChanged={lat => {
              valueChanged({
                lng: value ? value.lng : NaN,
                lat: !isNaN(lat) ? lat : NaN
              });
            }}
            validated={validated && (
              !value || !isNaN(value.lat) // either leave both X and Y fields empty or fill in both fields
            )}
            errorMessage={errorMessage}
            onFocus={onFocus}
            onBlur={onBlur}
            handleEnter={handleEnter}
            clearInput={clearInput}
            triedToSubmit={triedToSubmit}
            readOnly={readOnly}
          />
        </div>
      </div>
    </label>
  );
}
