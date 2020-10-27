import React from "react";
import ClearInputButton from "./../forms/ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface TextInputProps {
  name: string,
  value: string,
  valueChanged: Function,
  validated: boolean,
  errorMessage?: string,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  readOnly?: boolean
};

export const TextInput: React.FC<TextInputProps> = (props) => {  
  const {
    name,
    placeholder,
    value,
    valueChanged,
    handleEnter,
    validated,
    errorMessage,
    readOnly
  } = props;

  return (
    <div>
      <div style={{ position: 'relative'}}>
        <input
          name={name}
          id={`textinput-${name}`}
          type="text"
          autoComplete="off"
          className={formStyles.FormControl}
          placeholder={placeholder}
          onChange={e => valueChanged(e.target.value)}
          value={value || ""}
          onKeyUp={handleEnter}
          readOnly={!!readOnly}
          disabled={!!readOnly}
        />
        {!readOnly ? <ClearInputButton onClick={() => valueChanged(null)}/> : null}
      </div>
      {!validated ? <span className={formStyles.Errors}>{errorMessage}</span> : null}
    </div>
  );
}
