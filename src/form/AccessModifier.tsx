import React from "react";
import styles from "./AccessModifier.module.css";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string | null,
  valueChanged: (value: string) => void,
  handleEnter?: (e: any) => void,
  readOnly?: boolean,
  form?: string,
};

export const AccessModifier: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    value,
    valueChanged,
    readOnly,
    // form,
  } = props;

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div
        className={readOnly ? styles.AccessModifierTilesReadOnly : styles.AccessModifierTiles}
      >
        <div
          className={value === 'Private' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
          onClick={() => !readOnly && valueChanged('Private')}
        >
          <span>Private</span>
          <span>(own organisation)</span>
        </div>
        <div
          className={value === 'Common' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
          onClick={() => !readOnly && valueChanged('Common')}
        >
          <span>Common</span>
          <span>(logged in only)</span>
        </div>
        <div
          className={value === 'Public' ? `${styles.AccessModifier} ${styles.AccessModifierSelected}` : styles.AccessModifier}
          onClick={() => !readOnly && valueChanged('Public')}
        >
          <span>Public</span>
          <span>(open to everyone)</span>
        </div>
      </div>
    </label>
  );
}