import React from "react";
import styles from "./AccessModifier.module.css";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string;
  name: string;
  value: string | null;
  valueChanged: (value: string) => void;
  onFocus?: (e: any) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  form?: string;
}

export const getAccessibiltyText = (accessModifier: string) => {
  if (accessModifier === "Common") return "Login";
  return accessModifier;
};

export const AccessModifier: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
    value,
    valueChanged,
    onFocus,
    onBlur,
    readOnly,
  } = props;

  return (
    <label htmlFor={name} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <div className={readOnly ? styles.AccessModifierTilesReadOnly : styles.AccessModifierTiles}>
        <div
          id={name}
          className={
            value === "Private"
              ? `${styles.AccessModifier} ${styles.AccessModifierSelected}`
              : styles.AccessModifier
          }
          onClick={() => !readOnly && valueChanged("Private")}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>Private</span>
          <span>(own organisation)</span>
        </div>
        <div
          id={name}
          className={
            value === "Common"
              ? `${styles.AccessModifier} ${styles.AccessModifierSelected}`
              : styles.AccessModifier
          }
          onClick={() => !readOnly && valueChanged("Common")}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>Login</span>
          <span>(login required)</span>
        </div>
        <div
          id={name}
          className={
            value === "Public"
              ? `${styles.AccessModifier} ${styles.AccessModifierSelected}`
              : styles.AccessModifier
          }
          onClick={() => !readOnly && valueChanged("Public")}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>Public</span>
          <span>(open to everyone)</span>
        </div>
      </div>
    </label>
  );
};
