import React, { useState } from "react";
import styles from "./CustomRadioselect.module.css";
import formStyles from "../styles/Forms.module.css";

interface Option {
  title: string,
  value: string,
  imgUrl: string,
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
      <br/>
      {
        options.map((option: Option)=>{

          return (
            <span key={option.value}>
            <input 
              type="radio" 
              id={title+name+value} 
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
            >
              {option.title}
            </label>
            </span>
          );
        })
      }
    </div>
  );
}