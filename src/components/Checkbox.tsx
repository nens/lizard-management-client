import React from 'react';
import styles from './Pagination.module.css';

interface Props {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<Props> = ({checked, onChange}) => {
  return (
    <input 
      checked={checked} 
      onChange={onChange} 
      type="checkbox"
    ></input>
  )
};

export default Checkbox;