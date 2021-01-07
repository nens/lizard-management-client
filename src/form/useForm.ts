import React, { useState } from 'react';

type Value = any;
export interface Values {
  [name: string]: Value
}

interface FormInput {
  initialValues: Values,
  onSubmit: (values: Values) => void,
}

interface FormOutput {
  values: Values,
  touchedField: string,
  triedToSubmit: boolean,
  formSubmitted: boolean,
  tryToSubmitForm: () => void, 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
  handleValueChange: (name: string, value: Value) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  handleReset: (e: React.FormEvent<HTMLFormElement>) => void,
  handleFocus: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  handleBlur: () => void,
  clearInput: (name: string) => void,
}

export const useForm = ({ initialValues, onSubmit }: FormInput): FormOutput => {
  const [values, setValues] = useState<{}>(initialValues || {});
  const [touchedField, setTouchedField] = useState<string>('');
  const [triedToSubmit, setTriedToSubmit] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const tryToSubmitForm = () => setTriedToSubmit(true);

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleValueChange = (name: string, value: Value) => {
    setValues({
      ...values,
      [name]: value
    });
  };

  const clearInput = (name: string) => {
    setValues({
      ...values,
      [name]: ''
    });
  };

  const handleFocus = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target;
    const name = target.name;
    setTouchedField(name);
  };

  const handleBlur = () => {
    setTouchedField('');
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValues(initialValues);
    setTriedToSubmit(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmitted(true);
    onSubmit(values);
  };

  return {
    values,
    touchedField,
    triedToSubmit,
    formSubmitted,
    tryToSubmitForm,
    handleInputChange,
    handleFocus,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput,
    handleValueChange,
  };
};