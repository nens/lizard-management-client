import React, { useEffect, useRef } from "react";
import ClearInputButton from "./../forms/ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string,
  valueChanged: Function,
  clearInput: (name: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  readOnly?: boolean
};

export const TextArea: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    valueChanged,
    clearInput,
    handleEnter,
    validated,
    errorMessage,
    readOnly
  } = props;

  // Set validity of the input field
  const myInput = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated) {
        myInput.current.setCustomValidity('');
      } else {
        myInput.current.setCustomValidity(errorMessage || '');
      };
    };
  })

  return (
    <label htmlFor={name}>
      <span>{title}</span>
      <div style={{ position: 'relative'}}>
        <textarea
          ref={myInput}
          name={name}
          id={name}
          autoComplete="off"
          className={formStyles.FormControl}
          placeholder={placeholder}
          onChange={e => valueChanged(e)}
          value={value || ""}
          onKeyUp={handleEnter}
          readOnly={!!readOnly}
          disabled={!!readOnly}
        />
        {!readOnly ? <ClearInputButton onClick={() => clearInput(name)}/> : null}
      </div>
    </label>
  );
}