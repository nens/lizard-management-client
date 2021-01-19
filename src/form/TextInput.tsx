import React, { useEffect, useRef } from "react";
import { ClearInputButton } from "./ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string | null | number,
  valueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  clearInput?: (name: string) => void,
  validated: boolean,
  errorMessage?: string | false,
  placeholder?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  handleEnter?: (e: any) => void,
  triedToSubmit?: boolean,
  readOnly?: boolean,
  form?: string,
  type?: string,
  required?: boolean,
  showUpDownArrows?: boolean, // only works if type = "number"
};

export const TextInput: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    valueChanged,
    clearInput,
    onFocus,
    onBlur,
    handleEnter,
    validated,
    errorMessage,
    triedToSubmit,
    readOnly,
    form,
    type,
    required,
    showUpDownArrows,
  } = props;

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
  })

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
          autoComplete="off"
          className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''} ${showUpDownArrows? "": formStyles.HideNumberUpDownArrows}`}
          placeholder={placeholder}
          onChange={valueChanged}
          value={value || (value===0? value: "")}
          onKeyUp={handleEnter}
          readOnly={!!readOnly}
          disabled={!!readOnly}
          form={form}
          type={type || "text"}
          required={required}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {clearInput && !readOnly && value !== null && (value + '').length ? <ClearInputButton onClick={() => clearInput(name)}/> : null}
      </div>
    </label>
  );
}