import React, { useEffect, useRef, useState } from "react";
import { ClearInputButton } from "./ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string,
  options: string[],
  valueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  validated: boolean,
  clearInput?: (name: string) => void,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const Dropdown: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    options,
    valueChanged,
    clearInput,
    validated,
    errorMessage,
    triedToSubmit,
    readOnly
  } = props;

  // Temporary state to reset input field on mouseOver and mouseOut
  const [oldInputValue, setOldInputValue] = useState<string>('');

  // Set validity of the input field
  const myInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated) {
        myInput.current.setCustomValidity('');
      } else {
        myInput.current.setCustomValidity(errorMessage || '');
      };
    };
  });

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div style={{position: 'relative'}}>
        <input
          ref={myInput}
          name={name}
          id={name}
          value={value}
          autoComplete={'off'}
          className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
          list={`${name}-list`}
          placeholder={placeholder}
          onChange={valueChanged}
          onMouseOver={e => {
            setOldInputValue(e.currentTarget.value);
            e.currentTarget.value = '';
          }}
          onMouseOut={e => e.currentTarget.value = oldInputValue}
        />
        {!readOnly && clearInput ? <ClearInputButton onClick={() => clearInput(name)}/> : null}
        <datalist id={`${name}-list`}>
          {options.map((option, i) => (
            <option
              key={i}
              value={option}
              label={option}
            />
          ))}
        </datalist>
      </div>
    </label>
  );
}