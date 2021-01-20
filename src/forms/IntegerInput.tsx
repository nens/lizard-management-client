// The main Form class

import React, { Component } from "react";
import TextInput from "./TextInput";

interface IntegerInputProps {
  name: string,
  value: string,
  placeholder?: string,
  validators?: Function[],
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: (e: any) => void,
  wizardStyle: boolean,
  readOnly?: boolean
};

export default class IntegerInput extends Component<IntegerInputProps, {}> {
  render() {
    const {
      name,
      placeholder,
      validators,
      value,
      validated,
      valueChanged,
      handleEnter,
      readOnly,
      wizardStyle,
    } = this.props;

    return (
      <TextInput
        name={name}
        placeholder={placeholder}
        validators={validators}
        value={value}
        validated={validated}
        valueChanged={(e: any) => {
          var reg = /^\d+$/;
          if (reg.test(e) || e === '' || e === null) {
            valueChanged(e);
          }
        }}
        handleEnter={handleEnter}
        readOnly={readOnly}
        wizardStyle={wizardStyle}
      />
    );
  }
}
