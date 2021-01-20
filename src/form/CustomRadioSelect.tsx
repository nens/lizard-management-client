import React from "react";
import styles from "./CustomRadioSelect.module.css";

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
      <label>{title}</label>
      {/* <br/> */}
      <div className={styles.OptionsRow}>
      {
        options.map((option: Option)=>{

          return (
            <div key={option.value} className={styles.OptionContainer}>
              <input 
                type="radio" 
                id={title+name+option.value} 
                name={name} 
                value={option.value}
                onChange={(event:any)=>{
                  valueChanged(event);
                }}
                checked={option.value === value}
                readOnly={readonly}
              />
              <label 
                htmlFor={title+name+option.value}
                className={styles.Label}
              >
                {option.component}
                {option.selectedComponent}
              </label>
            </div>
          );
        })
      }
      </div>
    </div>
  );
}