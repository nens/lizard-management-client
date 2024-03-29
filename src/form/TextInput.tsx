import React, { useEffect, useRef } from "react";
import { ClearInputButton } from "./ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string;
  name: string;
  value: string | null | number;
  valueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearInput?: (name: string) => void;
  validated: boolean;
  errorMessage?: string | false;
  placeholder?: string;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  triedToSubmit?: boolean;
  readOnly?: boolean;
  type?: string;
  required?: boolean;
  form?: string;
}

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
    validated,
    errorMessage,
    triedToSubmit,
    readOnly,
    type,
    required,
    form,
  } = props;

  // Set validity of the input field
  const myInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (myInput && myInput.current) {
      if (validated) {
        myInput.current.setCustomValidity("");
      } else {
        myInput.current.setCustomValidity(errorMessage || "");
      }
    }
  });

  return (
    <label htmlFor={name} className={formStyles.Label}>
      <span className={formStyles.LabelTitle}>{title}</span>
      <div style={{ position: "relative" }}>
        <input
          ref={myInput}
          name={name}
          id={name}
          autoComplete="off"
          className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ""}`}
          placeholder={placeholder}
          onChange={valueChanged}
          value={value || (value === 0 ? value : "")}
          readOnly={!!readOnly}
          type={type || "text"}
          required={required}
          onFocus={onFocus}
          onBlur={onBlur}
          form={form}
          step={"any"} // no stepping is implied for number input type
        />
        {clearInput && !readOnly && value !== null && (value + "").length ? (
          <ClearInputButton onClick={() => clearInput(name)} />
        ) : null}
      </div>
    </label>
  );
};
