import React from 'react';
import { Dropdown } from '../form/Dropdown';
import { Select } from '../form/Select';
import { SubmitButton } from '../form/SubmitButton';
import { useForm } from '../form/useForm';

interface FormProps {
  onSubmit: (values: any) => void
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const colors = ['red', 'purple', 'yellow', 'green', 'brown', 'white', 'black', 'pink', 'rose', 'blue', 'grey', 'orange', 'gold', 'chocolate'];

  const initialValues = {};

  const {
    values,
    triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleValueChange,
    fieldOnFocus,
    handleBlur,
    handleFocus,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({initialValues, onSubmit});

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: 20
      }}
    >
      <Select
        title='Simple select dropdown'
        name='select'
        value={values.select || ''}
        options={colors}
        valueChanged={handleInputChange}
        validated={true}
        triedToSubmit
      />
      <Dropdown
        title='Dropdown with search bar'
        name='dropdown'
        value={values.dropdown || ''}
        options={colors}
        valueChanged={handleInputChange}
        validated={true}
      />
      <SubmitButton
        onClick={tryToSubmitForm}
      />
    </form>
  )
};

export default Form;
