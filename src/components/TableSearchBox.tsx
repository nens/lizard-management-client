import React from 'react';

interface Props {
  value: string;
  onChange: (event:any) => void;
  placeholder: string
}

const TableSearchBox: React.FC<Props> = ({value, onChange, placeholder}) => {
  return (
    <input 
      value={value} 
      onChange={onChange} 
      type="text"
      placeholder={placeholder}
    ></input>
  )
};

export default TableSearchBox;