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
    triedToSubmit,
    tryToSubmitForm,
    handleInputChange,
    handleSubmit,
    handleReset,
    clearInput,
  } = useForm({
    initialValues,
    onSubmit
  });

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      style={{width: '90%'}}
    >
      <TextInput
        title={'Name'}
        name={'name'}
        placeholder={'Enter at least 3 characters'}
        value={values.name as string}
        valueChanged={handleInputChange}
        clearInput={clearInput}
        validated={!minLength(3, values.name as string)}
        errorMessage={minLength(3, values.name as string)}
        triedToSubmit={triedToSubmit}
      />
      <TextArea
        title={'Description'}
        name={'description'}
        placeholder={'Enter description'}
        value={values.description as string}
        valueChanged={handleInputChange}
        clearInput={clearInput}
        validated={true}
        triedToSubmit={triedToSubmit}
      />
      <TextInput
        title={'Url'}
        name={'url'}
        placeholder={'Enter at least 1 character'}
        value={values.url as string}
        valueChanged={handleInputChange}
        clearInput={clearInput}
        validated={!minLength(1, values.url as string)}
        errorMessage={minLength(1, values.url as string)}
        triedToSubmit={triedToSubmit}
      />
      <CheckBox
        title={'Feature info'}
        name={'featureInfo'}
        value={values.featureInfo as boolean}
        valueChanged={handleInputChange}
      />
      <IntegerInput
        title={'Min zoom level'}
        name={'minZoom'}
        placeholder={'Enter between 0 and 31'}
        value={values.minZoom as string}
        valueChanged={handleInputChange}
        clearInput={clearInput}
        validated={
          !rangeCheck(parseInt(values.minZoom as string), 0, 31)
        }
        errorMessage={
          rangeCheck(parseInt(values.minZoom as string), 0, 31)
        }
        triedToSubmit={triedToSubmit}
      />
      <IntegerInput
        title={'Max zoom level'}
        name={'maxZoom'}
        placeholder={'Enter between 0 and 31'}
        value={values.maxZoom as string}
        valueChanged={handleInputChange}
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
        triedToSubmit={triedToSubmit}
      />
      <TextInput
        title={'Organisation'}
        name={'organisation'}
        value={values.organisation as string}
        valueChanged={handleInputChange}
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
          onClick={tryToSubmitForm}
        />
      </div>
    </form>
  )
};