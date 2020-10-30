import React, { useEffect, useRef, useState } from "react";
import ClearInputButton from "../components/ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string,
  options: string[],
  valueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  clearInput: (name: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
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
    <label htmlFor={name}>
      <span>{title}</span>
      <div style={{position: 'relative'}}>
        <input
          ref={myInput}
          name={name}
          id={name}
          value={value}
          autoComplete={'off'}
          className={formStyles.FormControl}
          list={'data-list'}
          placeholder={placeholder}
          onChange={valueChanged}
          onMouseOver={e => {
            setOldInputValue(e.currentTarget.value);
            e.currentTarget.value = '';
          }}
          onMouseOut={e => e.currentTarget.value = oldInputValue}
        />
        {!readOnly ? <ClearInputButton onClick={() => clearInput(name)}/> : null}
        <datalist id={'data-list'}>
          {options.map(option => (
            <option
              key={option}
              value={option}
              label={option}
            />
          ))}
        </datalist>
      </div>
    </label>
  );
}