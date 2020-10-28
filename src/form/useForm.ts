import React, { useState } from 'react';

export interface Values {
  [name: string]: string
}
interface TouchedValues {
  [name: string]: boolean
}

interface FormInput {
  initialValues: Values,
  onSubmit: (values: Values) => void,
}

interface FormOutput {
  values: Values,
  touchedValues: TouchedValues,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  handleReset: (e: React.FormEvent<HTMLFormElement>) => void,
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void,
  clearInput: (name: string) => void,
}

export const useForm = ({ initialValues, onSubmit }: FormInput): FormOutput => {
  const [values, setValues] = useState<{}>(initialValues || {});
  const [touchedValues, setTouchedValues] = useState<{}>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
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

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const name = target.name;
    setTouchedValues({
      ...touchedValues,
      [name]: true
    });
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValues({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return {
    values,
    touchedValues,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput
  };
};