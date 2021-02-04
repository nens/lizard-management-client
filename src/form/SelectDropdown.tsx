import React, { useEffect, useRef } from "react";
import Select from 'react-select';
import formStyles from "../styles/Forms.module.css";

type Value = {
  [key: string]: string
};

interface MyProps {
  title: string,
  name: string,
  value: Value,
  valueChanged: (value: Value | null) => void,
  options: {[key: string]: string}[],
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  triedToSubmit?: boolean,
  readOnly?: boolean,
  searchable?: boolean,
  clearable?: boolean,
  loading?: boolean,
};

export const SelectDropdown: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    valueChanged,
    options,
    validated,
    errorMessage,
    triedToSubmit,
    searchable,
    clearable,
    loading,
    readOnly,
  } = props;

  // Set validity of the input field
  const myInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated) {
        myInput.current.setCustomValidity('');
      } else {
        myInput.current.setCustomValidity(errorMessage || '');
      };
    };
  });

  const optionSubLabel: React.FC<{[key: string]: string}> = ({ label, subLabel }) => (
    <div style={{ display: "flex", position: 'relative' }}>
      <div>{label}</div>
      <div style={{ position: 'absolute', left: 400, color: "#ccc" }}>{subLabel}</div>
    </div>
  );

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div style={{position: 'relative'}}>
        <Select
          // className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
          name={name}
          placeholder={placeholder}
          options={options}
          defaultValue={value}
          onChange={option => valueChanged(option)}
          isLoading={loading}
          isClearable={clearable === undefined ? true : false}
          isSearchable={searchable}
          isDisabled={readOnly}
          formatOptionLabel={optionSubLabel}
          // required
          // inputProps={{
          //   onInvalid: (e: any) => e.target.setCustomValidity('Please select one'),
          //   onInput: (e: any) => e.target.setCustomValidity(''),
          // }}
        />
      </div>
    </label>
  );
}