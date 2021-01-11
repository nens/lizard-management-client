import React from 'react';
import styles from './Checkbox.module.css';

interface Props {
  checked: boolean;
  onChange: () => void;
  size?: number;
}

const Checkbox: React.FC<Props> = ({checked, onChange, size}) => {
  return (
    <div
      className={styles.CheckboxContainer}
      style={{
        width: size,
        height: size
      }}
    >
      <input 
        className={styles.Checkbox}
        checked={checked} 
        onChange={onChange} 
        type="checkbox"
        style={{
          width: size,
          height: size
        }}
      >
      </input>
      {/* next div is checkmark */}
      <div
        style={{
          width: size && size - 4,
          height: size && size - 4
        }}
      />

    </div>
    
  )
};

export default Checkbox;