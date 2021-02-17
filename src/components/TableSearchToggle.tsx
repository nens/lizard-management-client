import React from 'react';
import Select from 'react-select';
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
  return (
    <Select
      options={options}
      defaultValue={value}
      onChange={valueChanged}
      isSearchable={false}
      styles={{
        control: styles => ({
          ...styles,
          width: 150
        })
      }}
    />
  )
}

export default TableSearchToggle;