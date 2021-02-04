import React, { useEffect, useRef } from 'react';
import Select, { createFilter, StylesConfig } from 'react-select';
import formStyles from "../styles/Forms.module.css";

type Value = {
  [key: string]: string
};

interface MyProps {
  title: string,
  name: string,
  value: Value,
  valueChanged: (value: Value | null) => void,
  options: Value[],
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  triedToSubmit?: boolean,
  readOnly?: boolean,
  searchable?: boolean,
  clearable?: boolean,
  loading?: boolean,
  isMulti?: boolean,
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
    isMulti,
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

  // useRef for Select component to set focus on
  const mySelect = useRef<any>(null);

  // Optional sub-labels for the Option container
  const optionSubLabel: React.FC<{[key: string]: string}> = ({ label, subLabel }) => (
    <div style={{ display: "flex", position: 'relative' }}>
      <div>{label}</div>
      <div style={{ position: 'absolute', left: 400, color: "#ccc" }}>{subLabel}</div>
    </div>
  );

  // Custom styling for Select component
  const customStyles: StylesConfig<{}, boolean> = {
    control: (styles, { isFocused }) => ({
      ...styles,
      borderColor: isFocused? '#73C9B2' : styles.borderColor,
      boxShadow: isFocused? '0 0 1px 1px #73C9B2' : styles.boxShadow,
      ':hover': {
        borderColor: isFocused? '#73C9B2' : styles[':hover']?.borderColor
      }
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
      <div style={{position: 'relative'}}>
        <Select
          ref={mySelect}
          name={name}
          styles={customStyles}
          placeholder={placeholder}
          options={options}
          defaultValue={value}
          // @ts-ignore
          onChange={option => valueChanged(option)}
          isLoading={loading}
          isClearable={clearable === undefined ? true : false}
          isSearchable={searchable}
          isDisabled={readOnly}
          isMulti={isMulti}
          formatOptionLabel={optionSubLabel}
          filterOption={createFilter({ ignoreAccents: false })}
        />
        {/* Hidden input field to apply HTML custom validation */}
        <input
          ref={myInput}
          tabIndex={-1}
          autoComplete='off'
          onFocus={() => mySelect.current && mySelect.current.focus()}
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