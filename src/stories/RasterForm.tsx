import React from 'react';
import { useForm, Values } from '../form/useForm';
import { minLength } from '../form/validators';
import { TextInput } from '../form/TextInput';
import { TextArea } from '../form/TextArea';
import { Select } from '../form/Select';
import { Button } from '../form/Button';
import { required } from '../form/validators';
import { DurationField } from '../form/DurationField';
import { CheckBox } from '../form/CheckBox';

export const RasterForm: React.FC = () => {
  const initialValues: Values = {
    name: '',
    description: '',
    type: '',
    temporal: false,
    duration: null,
    organisation: 'Nelen & Schuurmans',
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
    clearInput,
    handleValueChange,
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
        title={'Name'}
        name={'name'}
        placeholder={'raster name'}
        value={values.name as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={!minLength(3, values.name as string)}
        // validated={true}
        errorMessage={minLength(3, values.name as string)}
      />
      <TextArea
        title={'Description'}
        name={'description'}
        placeholder={'raster description'}
        value={values.description as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={!minLength(1, values.description as string)}
        // validated={true}
        errorMessage={minLength(1, values.description as string)}
      />
      <Select
        title={'Type'}
        name={'type'}
        placeholder={'select raster type'}
        value={values.type as string}
        valueChanged={handleChange}
        options={['none', 'curve', 'aggregate']}
        validated={!required('Please select an option', values.type)}
        // validated={true}
        errorMessage={required('Please select an option', values.type)}
      />
      <CheckBox
        title={'Temporal'}
        name={'temporal'}
        value={values.temporal as boolean}
        valueChanged={handleChange}
      />
      <DurationField
        name={'duration'}
        value={values.duration as string}
        valueChanged={(value) => handleValueChange('duration', value)}
        validated={true}
        readOnly={values.temporal === false}
      />
      <TextInput
        title={'Organisation'}
        name={'organisation'}
        value={values.organisation as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={true}
        readOnly
      />
      <br/>
      <div>
        <Button
          type='reset'
        />
        {' '}
        <Button
          type='submit'
        />
      </div>
    </form>
  )
};