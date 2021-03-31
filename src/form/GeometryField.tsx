// The main Form class

import React from 'react';
import { TextInput } from './TextInput';
import {FloatInput} from './FloatInput';

interface MyProps {
  title: string,
  name: string,
  value: string,
  validated: boolean,
  valueChanged: (e: React.ChangeEvent<HTMLInputElement>) => void,
  clearInput?: (e: any) => void,
  errorMessage?: string | false,
  placeholder?: string,
  handleEnter?: (e: any) => void,
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onBlur?: () => void,
  triedToSubmit?: boolean,
  readOnly?: boolean
};

export const GeometryField: React.FC<MyProps> = (props) => {  
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
    <div>
      {/* lat */}
      <FloatInput {...props}/>
      {/* lng */}
      <FloatInput {...props}/>

    </div>
  );
}
