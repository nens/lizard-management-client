import React from 'react';
import { useForm, Values } from '../form/useForm';
import { greaterThanMin, minLength, rangeCheck } from '../form/validators';
import { TextInput } from '../form/TextInput';
import { TextArea } from '../form/TextArea';
import { Button } from '../form/Button';
import { IntegerInput } from '../form/IntegerInput';
import { CheckBox } from '../form/CheckBox';

export const WmsForm: React.FC = () => {
  const initialValues: Values = {
    name: '',
    description: '',
    url: '',
    featureInfo: false,
    minZoom: '',
    maxZoom: '',
    organisation: 'Utrecht',
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
        errorMessage={minLength(3, values.name as string)}
      />
      <TextArea
        title={'Description'}
        name={'description'}
        placeholder={'raster description'}
        value={values.description as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={true}
      />
      <TextInput
        title={'Url'}
        name={'url'}
        placeholder={'WMS url'}
        value={values.url as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={!minLength(1, values.url as string)}
        errorMessage={minLength(1, values.url as string)}
      />
      <CheckBox
        title={'Feature info'}
        name={'featureInfo'}
        value={values.featureInfo as boolean}
        valueChanged={handleChange}
      />
      <IntegerInput
        title={'Min zoom level'}
        name={'minZoom'}
        placeholder={'Minimum zoom level'}
        value={values.minZoom as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={
          !rangeCheck(parseInt(values.minZoom as string), 0, 31)
        }
        errorMessage={
          rangeCheck(parseInt(values.minZoom as string), 0, 31)
        }
      />
      <IntegerInput
        title={'Max zoom level'}
        name={'maxZoom'}
        placeholder={'Maximum zoom level'}
        value={values.maxZoom as string}
        valueChanged={handleChange}
        clearInput={clearInput}
        validated={
          !rangeCheck(parseInt(values.maxZoom as string), 0, 31) &&
          !greaterThanMin(
            parseInt(values.minZoom as string),
            parseInt(values.maxZoom as string)
          )
        }
        errorMessage={
          rangeCheck(parseInt(values.maxZoom as string), 0, 31) ||
          greaterThanMin(
            parseInt(values.minZoom as string),
            parseInt(values.maxZoom as string)
          )
        }
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