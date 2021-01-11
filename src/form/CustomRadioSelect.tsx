import React, { useState } from "react";
import styles from "./CustomRadioselect.module.css";
import formStyles from "../styles/Forms.module.css";

interface Option {
  title: string,
  value: string,
  imgUrl: string,
}

interface CheckBoxProps {
  title: string | JSX.Element,
  name: string,
  value: string,
  valueChanged: (event: any) => void,
  readonly?: boolean
  options: Option[]
};

export const CustomRadioSelect: React.FC<CheckBoxProps> = (props) => {

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
            <>
            <input 
              type="radio" 
              id={title+name+value} 
              name={name} 
              value={option.value}
              onChange={(event:any)=>{
                valueChanged(event);
              }}
              checked={option.value === value}
            />
            <label 
              htmlFor={title+name+option.value}
            >
              {option.title}
            </label>
            </>
          );
        })
      }
      {/* <input type="radio" id="male" name={name} value="male"/>
      <label 
        // @ts-ignore
        for="male"
      >
        Male
      </label>
      <input type="radio" id="female" name={name} value="female"/>
      <label 
        // @ts-ignore
        for="female"
      >
        Female
      </label>
      <input type="radio" id="other" name={name} value="other"/>
      <label 
        // @ts-ignore
        for="other"
      >
        Other
      </label> */}
    </div>
  );
}