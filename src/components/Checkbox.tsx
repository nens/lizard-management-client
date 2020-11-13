import React from 'react';
import styles from './Checkbox.module.css';

interface Props {
  checked: boolean;
  onChange: () => void;
}

const Checkbox: React.FC<Props> = ({checked, onChange}) => {
  return (
    <div
      className={styles.CheckboxContainer}
    >
      <input 
        className={styles.Checkbox}
        checked={checked} 
        onChange={onChange} 
        type="checkbox"
      >
      </input>
      {/* next div is checkmark */}
      <div></div>

    </div>
    
  )
};

export default Checkbox;