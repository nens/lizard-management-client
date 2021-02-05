import React, { useEffect, useRef, useState } from "react";
import { ClearInputButton } from "./ClearInputButton";
import formStyles from "../styles/Forms.module.css";

interface MyProps {
  title: string,
  name: string,
  value: string,
  options: string[],
  valueChanged: (value: string | null) => void,
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

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  console.log(filteredOptions)

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

  // Filter options
  useEffect(() => {
    setFilteredOptions(options.filter(option => option.includes(searchString)));
  }, [name, options, searchString]);

  const handleKeyUp = (e: any) => {
    if (e.key === "Escape") {
      setMenuIsOpen(false);
    };
  };

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
    >
      <span className={formStyles.LabelTitle}>
        {title}
      </span>
      <div style={{position: 'relative'}}>
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          {value}
        </span>
        <input
          ref={myInput}
          name={name}
          id={name}
          autoComplete={'off'}
          className={`${formStyles.FormControl} ${triedToSubmit ? formStyles.FormSubmitted : ''}`}
          placeholder={placeholder}
          onClick={() => setMenuIsOpen(!menuIsOpen)}
          onKeyUp={e => handleKeyUp(e)}
          onKeyDown={() => setMenuIsOpen(true)}
          onChange={e => setSearchString(e.target.value)}
          style={{
            position: 'relative'
          }}
          onBlur={() => setMenuIsOpen(false)}
        />
        {!readOnly && clearInput ? <ClearInputButton onClick={() => clearInput(name)}/> : null}
        {menuIsOpen && (
          <ul
            style={{
              position: 'absolute',
              listStyle: 'none',
              paddingLeft: 10,
              top: '100%',
              left: 0,
              zIndex: 1,
              backgroundColor: 'grey',
              maxHeight: 100,
              width: '100%',
              overflowY: 'auto',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            {filteredOptions.map((option, i) => (
              <li
                key={i}
                style={{
                  padding: '2px 0'
                }}
                onMouseDown={e => {
                  e.preventDefault();
                  setMenuIsOpen(false);
                  valueChanged(option);
                  if (myInput && myInput.current) myInput.current.focus();
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </label>
  );
}