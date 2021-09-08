import React from 'react';
import styles from "./InfoLabel.module.css";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  name: string,
  title: string,
  value: number | boolean,
}

export const InfoLabel = (props: MyProps) => {
  const {
    name,
    title,
    value,
  } = props;

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <div
        id={name}
        className={styles.InfoLabel}
      >
        <h3>{title}</h3>
        <span className={styles.InfoValue}>
          {
            typeof(value) === 'number' ? value.toLocaleString() : // value is a number
            value ? <i className="fa fa-check-circle" /> : <i className="fa fa-times-circle" /> // value is boolean
          }
        </span>
      </div>
    </label>
  )
}