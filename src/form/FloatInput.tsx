import React from 'react';
import { TextInput } from './TextInput';

interface MyProps {
  title: string,
  name: string,
  value: number,
  validated: boolean,
  valueChanged: (value: number) => void,
  clearInput?: (name: string) => void,
  errorMessage?: string | false,
  placeholder?: string,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  form?: string,
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
    clearInput,
    errorMessage,
    triedToSubmit,
    form,
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
      form={form}
    />
  );
}
