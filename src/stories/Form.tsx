import React, { useEffect, useState } from 'react';
import FormActionButtons from '../components/FormActionButtons';
import { SubmitButton } from '../form/SubmitButton';
import { TextInput } from '../form/TextInput';
import { useForm } from '../form/useForm';
import { SelectDropdown } from './../form/SelectDropdown';

interface FormProps {
  onSubmit: (values: any) => void
}

interface Sources {
  isFetching: boolean,
  values: {[key: string]: string}
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const colors = ['red', 'purple', 'yellow', 'green', 'brown', 'white', 'black', 'pink', 'rose', 'blue', 'grey', 'orange', 'gold', 'chocolate'];

  const initialValues = {};

  const [beers, setBeers] = useState<{isFetching: boolean, beers: any}>({isFetching: false, beers: []});
  useEffect(() => {
    setBeers({isFetching: true, beers: []})
    fetch('https://api.punkapi.com/v2/beers/')
    .then(response => response.json())
    .then(json => {
      setTimeout(() => {
        setBeers({isFetching: false, beers: json})
      }, 5000)
    })
  }, [])

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
      <TextInput
        name='text'
        title='Text Input'
        value={values.text}
        validated={values.text && values.text.length >= 3}
        errorMessage={'Please insert at least 3 characters'}
        valueChanged={handleInputChange}
      />
      <SelectDropdown
        title='Select dropdown'
        name='color'
        value={values.color}
        options={colors.map(color => ({
          value: color,
          label: color
        }))}
        valueChanged={value => handleValueChange('color', value)}
        validated={values.color !== null}
        errorMessage={'Please select a color'}
        searchable={false}
      />
      <SelectDropdown
        title='Searchable dropdown'
        name='color'
        value={values.color}
        options={colors.map(color => ({
          value: color,
          label: color
        }))}
        valueChanged={value => handleValueChange('color', value)}
        validated={values.color !== null}
        errorMessage={'Please select a color'}
      />
      <SelectDropdown
        title='Searchable dropdown with label'
        name='color'
        value={values.color}
        options={colors.map(color => ({
          value: color,
          label: color,
          subLabel: color
        }))}
        valueChanged={value => handleValueChange('color', value)}
        validated={values.color !== null}
        errorMessage={'Please select a color'}
      />
      <SelectDropdown
        title='Searchable dropdown with loading'
        name='beer'
        value={values.beer}
        options={beers.beers.map((beer: any) => ({
          value: beer.id,
          label: beer.name,
          subLabel: beer.tagline
        }))}
        valueChanged={value => handleValueChange('beer', value)}
        validated
        loading={beers.isFetching}
      />
      <br/>
      <SubmitButton />
      {/* <FormActionButtons
        actions={[
          {
            displayValue: "Delete",
            actionFunction: () => null
          },
        ]}
      /> */}
    </form>
  )
};

export default Form;
