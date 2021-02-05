import React, { useEffect, useState } from 'react';
import FormActionButtons from '../components/FormActionButtons';
import { Dropdown } from '../form/Dropdown';
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
      <Dropdown
        title='Select dropdown'
        name='color'
        value={values.color}
        options={colors}
        valueChanged={value => handleValueChange('color', value)}
        validated={!!values.color}
        errorMessage={'Please select a color'}
      />
      <SelectDropdown
        title='Select dropdown'
        name='color1'
        value={values.color1}
        options={colors.map(color => ({
          value: color,
          label: color
        }))}
        valueChanged={value => handleValueChange('color1', value)}
        validated={!!values.color1}
        errorMessage={'Please select a color'}
        searchable={false}
        readOnly
      />
      <SelectDropdown
        title='Searchable dropdown'
        name='color2'
        value={values.color2}
        options={colors.map(color => ({
          value: color,
          label: color
        }))}
        valueChanged={value => handleValueChange('color2', value)}
        validated={!!values.color2}
        errorMessage={'Please select a color'}
        isMulti
      />
      <SelectDropdown
        title='Searchable dropdown with label'
        name='color3'
        value={values.color3}
        options={colors.map(color => ({
          value: color,
          label: color,
          subLabel: color
        }))}
        valueChanged={value => handleValueChange('color3', value)}
        validated={!!values.color3}
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
