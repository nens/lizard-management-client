import React from 'react';
import { TextInput } from './TextInput';

interface MyProps {
  title: string,
  name: string,
  value: number,
  validated: boolean,
  valueChanged: (value: number) => void,
  clearInput?: (e: any) => void,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const FloatInput: React.FC<MyProps> = (props) => {  
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
      validated={validated}
      errorMessage={errorMessage}
      type="number" 
      value={value} 
      valueChanged={e => valueChanged(parseFloat(e.target.value))}
      onFocus={onFocus}
      onBlur={onBlur}
      triedToSubmit={triedToSubmit}
      readOnly={readOnly}
      clearInput={clearInput}
      handleEnter={handleEnter}
    />
  );
}
