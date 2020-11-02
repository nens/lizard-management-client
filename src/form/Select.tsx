import React, { useEffect, useRef } from "react";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string,
  valueChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  options: string[],
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  triedToSubmit: boolean,
  readOnly?: boolean
};

export const Select: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    valueChanged,
    options,
    validated,
    errorMessage,
    triedToSubmit
  } = props;

  // Set validity of the input field
  const myInput = useRef<HTMLSelectElement>(null);
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
        <select
          ref={myInput}
          name={name}
          id={name}
          value={value}
          autoComplete="off"
          className={`${formStyles.FormControlSmall} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
          onChange={valueChanged}
        >
          <option
            value={''}
            label={placeholder}
            disabled
          />
          {options.map(option => (
            <option
              key={option}
              value={option}
              label={option}
            />
          ))}
        </select>
      </div>
    </label>
  );
}