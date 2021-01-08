// The main Form class

import React from 'react';
import { TextInput } from './TextInput';

interface MyProps {
  title: string,
  name: string,
  value: string,
  validated: boolean,
  valueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  clearInput: (e: any) => void,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const IntegerInput: React.FC<MyProps> = (props) => {  
  const {
    title,
    name,
    placeholder,
    value,
    validated,
    valueChanged,
    onFocus,
    onBlur,
    handleEnter,
    clearInput,
    errorMessage,
    triedToSubmit,
    readOnly
  } = props;

  return (
    <TextInput
      title={title}
      name={name}
      placeholder={placeholder}
      value={value}
      validated={validated}
      valueChanged={(e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        var reg = /^\d+$/;
        if (reg.test(value) || value === '' || value === null) {
          valueChanged(e);
        };
      }}
      clearInput={clearInput}
      onFocus={onFocus}
      onBlur={onBlur}
      handleEnter={handleEnter}
      errorMessage={errorMessage}
      readOnly={readOnly}
      triedToSubmit={triedToSubmit}
    />
  );
}
