import React, { useEffect, useRef } from 'react';
import Select, { components, createFilter, StylesConfig, ValueType, OptionProps } from 'react-select';
import formStyles from "../styles/Forms.module.css";

type Value = {
  [key: string]: string
};

interface MyProps {
  title: string,
  name: string,
  value: Value,
  valueChanged: (value: ValueType<Value, boolean>) => void,
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
  form?: string,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
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
    form,
    onFocus,
    onBlur,
    readOnly,
  } = props;

  // useRef for Select component to set focus on
  const mySelect = useRef<any>(null);

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

  const Option: React.FC<OptionProps<{}, boolean>> = (props) => (
    <components.Option {...props}>
      <div>{props.data.label}</div>
      <div
        style={{
          color: props.isSelected ? undefined : '#ccc',
          position: 'absolute',
          left: '40%'
        }}
      >
        {props.data.subLabel}
      </div>
    </components.Option>
  );

  // Custom styling for different Select's child components
  const customStyles: StylesConfig<{}, boolean> = {
    // Custom styling for Control component
    control: (styles, { isFocused }) => {
      let borderColor: string = styles.borderColor as string;
      let boxShadow: string = styles.boxShadow as string;
      if (triedToSubmit && !validated) {
        borderColor =  '#AE0000';
        boxShadow = 'none';
      } else if (isFocused) {
        borderColor = '#73C9B2';
        boxShadow = '0 0 1px 1px #73C9B2';
      };
      return {
        ...styles,
        backgroundColor: readOnly ?  'rgb(216, 216, 216)' : styles.backgroundColor,
        cursor: readOnly ? 'not-allowed' : styles.cursor,
        borderColor: borderColor,
        boxShadow: boxShadow,
        ':hover': {
          borderColor: borderColor
        }
      }
    },
    // Custom styling for Option list component
    option: (styles, { isSelected }) => ({
      ...styles,
      display: 'flex',
      position: 'relative',
      color: isSelected ? 'white' : styles.color
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
          inputId={name}
          name={name}
          components={{ Option }}
          styles={customStyles}
          placeholder={placeholder}
          options={options}
          defaultValue={value}
          onChange={option => valueChanged(option)}
          isLoading={loading}
          isClearable={!readOnly && clearable === undefined ? true : false}
          isSearchable={!readOnly && searchable}
          menuIsOpen={readOnly ? false : undefined}
          isMulti={isMulti}
          onFocus={onFocus}
          onBlur={onBlur}
          filterOption={createFilter({ ignoreAccents: false })}
        />
        {/* Hidden input field to apply HTML custom validation */}
        <input
          ref={myInput}
          tabIndex={-1}
          autoComplete='off'
          onFocus={() => mySelect.current && mySelect.current.focus()}
          form={form}
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