import React from "react";
import { useEffect, useRef } from "react";
import styles from "./Checkbox.module.css";

interface Props {
  name?: string;
  checked: boolean | undefined;
  onChange: () => void;
  size?: number;
  borderRadius?: number;
  checkmarkColor?: string;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  form?: string;
  validated?: boolean;
  errorMessage?: string | false;
  title?: string;
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
    readOnly,
    form,
    validated,
    errorMessage,
    title,
  } = props;

  const myInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated !== false) {
        myInput.current.setCustomValidity("");
      } else {
        myInput.current.setCustomValidity(errorMessage || "");
      }
    }
  });

  return (
    <div
      className={styles.CheckboxContainer}
      style={{
        width: size || 16, // default checkbox size is 16px
        height: size || 16,
      }}
    >
      <input
        ref={myInput}
        id={name}
        name={name}
        className={styles.Checkbox}
        checked={checked}
        onChange={() => !readOnly && onChange()}
        type="checkbox"
        style={{
          width: size || 16,
          height: size || 16,
          borderRadius: borderRadius,
          backgroundColor: readOnly ? "#c9c9c9" : "white",
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        form={form}
        title={title}
      />
      {/* next div is checkmark */}
      <div
        style={{
          width: size ? (size * 3) / 4 : 12, // default checkmark size is 16 *3/4=12px
          height: size ? (size * 3) / 4 : 12,
          borderRadius: borderRadius,
          backgroundColor: !readOnly ? checkmarkColor || "#354B61" : "#878787",
        }}
      />
    </div>
  );
};

export default Checkbox;
