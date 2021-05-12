import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { Value } from '../form/SelectDropdown';

interface MyProps {
  options: Value[],
  value: Value | null,
  valueChanged: (value: Value | null) => void,
}

const TableSearchToggle: React.FC<MyProps> = ({
  options,
  value,
  valueChanged
}) => {
  // Custom styling for different Select's child components
  const customStyles: StylesConfig<{}, boolean> = {
    // Custom styling for Control component
    control: styles => ({
      ...styles,
      minWidth: 160,
      backgroundColor: 'var(--color-dark-main)',
      cursor: 'pointer'
    }),
    // Custom styling for input value
    singleValue: styles => ({
      ...styles,
      color: 'var(--color-light-main)'
    }),
    // Custom styling for the Indicator components
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: styles => ({
      ...styles,
      ':hover': {
        color: 'var(--color-light-main)'
      }
    })
  };

  return (
    <Select
      options={options}
      defaultValue={value}
      // @ts-ignore
      onChange={valueChanged}
      isSearchable={false}
      styles={customStyles}
    />
  )
}

export default TableSearchToggle;