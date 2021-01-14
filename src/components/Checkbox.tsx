import React from 'react';
import styles from './Checkbox.module.css';

interface Props {
  name?: string;
  checked: boolean;
  onChange: () => void;
  size?: number;
  borderRadius?: number;
  checkmarkColor?: string;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
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
    onFocus,
    onBlur,
    readOnly
  } = props;
  return (
    <div
      className={styles.CheckboxContainer}
      style={{
        width: size || 16, // default checkbox size is 16px
        height: size || 16
      }}
    >
      <input 
        id={name}
        name={name}
        className={styles.Checkbox}
        checked={checked} 
        onChange={() => !readOnly && onChange()}
        type="checkbox"
        style={{
          width: size || 16,
          height: size || 16,
          borderRadius: borderRadius
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
      />
      {/* next div is checkmark */}
      <div
        style={{
          width: size ? (size - 4) : 12, // default checkmark size is 16-4=12px
          height: size ? (size - 4) : 12,
          borderRadius: borderRadius,
          backgroundColor: checkmarkColor || "#354B61"
        }}
      />

    </div>
    
  )
};

export default Checkbox;