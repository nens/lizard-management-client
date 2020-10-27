import React, { useState } from 'react';
import { TextInput } from '../form/TextInput';
import Test from './../Test';

export default {
  component: Test,
  title: 'Test'
}

export const Form: React.FC = () => {
  const [name, setName] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor="textinput-rasterName">
        <span>Name: </span>
        <TextInput
          name="rasterName"
          placeholder="name of raster"
          value={name}
          valueChanged={setName}
          validated={name.length > 3}
          errorMessage={'length must > 3'}          
        />
        <input type="submit" value="Submit"/>
      </label>
    </form>
  )
};