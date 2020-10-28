import React from 'react';
import { TextInput } from '../form/TextInput';
import { useForm } from '../form/useForm';
import Test from './../Test';
import { Values } from './../form/useForm';
import { minLength } from '../form/validators';
import { TextArea } from '../form/TextArea';

export default {
  component: Test,
  title: 'Test'
}

export const Form: React.FC = () => {
  const initialValues = {
    name: '',
    description: '',
  };
  const onSubmit = (values: Values) => {
    console.log('submitted', values)
  };

  const {
    values,
    touchedValues,
    handleBlur,
    handleChange,
    handleSubmit,
    handleReset,
    clearInput
  } = useForm({
    initialValues,
    onSubmit
  });

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <TextInput
        label={'Name'}
        name={'name'}
        placeholder={'raster name'}
        value={values.name}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={!minLength(3, values.name)}
        errorMessage={minLength(3, values.name)}
      />
      <TextArea
        label={'Description'}
        name={'description'}
        placeholder={'raster description'}
        value={values.description}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={!minLength(1, values.description)}
        errorMessage={minLength(1, values.description)} 
      />
      <div>
        <input
          type="reset"
          value="Reset"
        />
        <input
          type="submit"
          value="Submit"
        />
      </div>
    </form>
  )
};