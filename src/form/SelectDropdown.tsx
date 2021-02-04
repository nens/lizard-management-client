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
        />
        {/* Hidden input field to apply HTML custom validation */}
        <input
          ref={myInput}
          tabIndex={-1}
          autoComplete='off'
          style={{
            position: 'absolute',
            opacity: 0,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            padding: 0,
            zIndex: -1,
          }}
        />
      </div>
    </label>
  );
}