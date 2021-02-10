import React from "react";
import styles from "./CustomRadioSelect.module.css";
import formStyles from "../styles/Forms.module.css";


interface Option {
  value: string,
  component: JSX.Element,
  selectedComponent: JSX.Element,
}

interface Props {
  title: string | JSX.Element,
  name: string,
  value: string,
  valueChanged: (event: any) => void,
  readonly?: boolean
  options: Option[]
};

export const CustomRadioSelect: React.FC<Props> = (props) => {

  const {
    title,
    name,
    value,
    valueChanged,
    readonly,
    options,
  } = props;


  return (
    <div>
      <label><span className={`${formStyles.LabelTitle}`}>{title}</span></label>
      <div className={styles.OptionsRow}>
      {
        options.map((option: Option)=>{

          return (
              <label 
                className={styles.Label}
                key={option.value}
              >
                <input 
                  type="radio" 
                  name={name} 
                  value={option.value}
                  onChange={(event:any)=>{
                    valueChanged(event);
                  }}
                  checked={option.value === value}
                  readOnly={readonly}
                />
                <div className={styles.NotSelected}>{option.component}</div>
                <div className={styles.Selected}>{option.selectedComponent}</div>
              </label>
          );
        })
      }
      </div>
    </div>
  );
}