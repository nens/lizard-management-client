import React from 'react';
import styles from "./InfoLabel.module.css";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  name: string,
  title: string,
  value: string | number | boolean,
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
            typeof(value) === 'string' ? value : // display a string e.g. date
            typeof(value) === 'number' ? value.toLocaleString() : // display a number
            value ? <i className="fa fa-check-circle" /> : <i className="fa fa-times-circle" /> // display a boolean
          }
        </span>
      </div>
    </label>
  )
}