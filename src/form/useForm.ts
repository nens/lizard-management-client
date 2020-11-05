import React, { useState } from 'react';

export interface Values {
  [name: string]: string | string[] | boolean | null | undefined
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
  triedToSubmit: boolean,
  tryToSubmitForm: () => void, 
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  handleValueChange: (name: string, value: string | null) => void,
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  handleReset: (e: React.FormEvent<HTMLFormElement>) => void,
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void,
  clearInput: (name: string) => void,
}

export const useForm = ({ initialValues, onSubmit }: FormInput): FormOutput => {
  const [values, setValues] = useState<{}>(initialValues || {});
  const [touchedValues, setTouchedValues] = useState<{}>({});
  const [triedToSubmit, setTriedToSubmit] = useState<boolean>(false);

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

  const handleValueChange = (name: string, value: string | null) => {
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

  const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValues(initialValues);
    setTriedToSubmit(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return {
    values,
    touchedValues,
    triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleBlur,
    handleSubmit,
    handleReset,
    clearInput,
    handleValueChange,
  };
};