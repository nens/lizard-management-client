import React, { useEffect, useRef } from "react";
import { ClearInputButton } from "./ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string;
  name: string;
  value: string | null;
  valueChanged: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  clearInput?: (name: string) => void;
  validated: boolean;
  errorMessage?: string | false;
  placeholder?: string;
  onFocus?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  triedToSubmit?: boolean;
  readOnly?: boolean;
  rows?: number;
  form?: string;
}

export const TextArea: React.FC<MyProps> = (props) => {
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
    rows,
    form,
  } = props;

  // Set validity of the input field
  const myInput = useRef<HTMLTextAreaElement>(null);
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
        <textarea
          ref={myInput}
          name={name}
          id={name}
          autoComplete="off"
          className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ""}`}
          placeholder={placeholder}
          onChange={(e) => valueChanged(e)}
          value={value || ""}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={!!readOnly}
          rows={rows}
          spellCheck={false}
          form={form}
          style={{
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1137650
            // whiteline in firefox
            whiteSpace: "pre-wrap",
          }}
        />
        {clearInput && !readOnly && value !== null && (value + "").length ? (
          <ClearInputButton onClick={() => clearInput(name)} />
        ) : null}
      </div>
    </label>
  );
};
