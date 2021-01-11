import React from 'react';
import styles from './Checkbox.module.css';

interface Props {
  name?: string;
  checked: boolean;
  onChange: () => void;
  size?: number;
  borderRadius?: number;
  checkmarkColor?: string;
  readOnly?: boolean;
}

const Checkbox: React.FC<Props> = (props) => {
  const {
    name,
    checked,
    onChange,
    size,
    borderRadius,
    checkmarkColor,
    readOnly
  } = props;
  return (
    <div
      className={styles.CheckboxContainer}
      style={{
        width: size,
        height: size
      }}
    >
      <input 
        id={name+'_checkbox'}
        name={name}
        className={styles.Checkbox}
        checked={checked} 
        onChange={() => !readOnly && onChange()}
        type="checkbox"
        style={{
          width: size,
          height: size,
          borderRadius: borderRadius
        }}
        readOnly={readOnly}
      />
      {/* next div is checkmark */}
      <div
        style={{
          width: size && size - 4,
          height: size && size - 4,
          borderRadius: borderRadius,
          backgroundColor: checkmarkColor
        }}
      />

    </div>
    
  )
};

export default Checkbox;