import React from 'react';
import { Dropdown } from '../form/Dropdown';
import { Select } from '../form/Select';
import { useForm } from '../form/useForm';

const Form: React.FC = () => {
  const names = ['Hoan', 'Remco', 'Tom', 'Madeleine'];
  const ages = [30, 40, 35, 20];
  const genders = ['male', 'female', 'N/A'];
  const favoriteColors = ['red', 'purple', 'yellow', 'green', 'brown', 'white', 'black', 'pink', 'rose', 'blue', 'grey', 'orange'];

  const initialValues = {
    name: null,
    age: null,
    gender: 'male',
    favorites: null
  };
  const onSubmit = (values: any) => console.log(values);

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
    <form>
      <Dropdown
        title='Name'
        name='name'
        value={values.name}
        options={names}
        valueChanged={handleInputChange}
        validated={true}
      />
      <Select
        title='Gender'
        name="gender"
        value={values.gender}
        options={genders}
        valueChanged={handleInputChange}
        validated={true}
        triedToSubmit
      />
    </form>
  )
};

export default Form;
