// The main Form class

import React, { Component } from "react";
import { connect } from "react-redux";

import formStyles from "../styles/Forms.css";
import WithStep from "./WithStep";

interface TextInputProps {
  name: string,
  value: string,
  placeHolder?: string,
  index?: number,
  validators?: Function[],
  formValues: {[key: string]: any},
  validated: boolean,
  valueChanged: Function
};

class TextInput extends Component<TextInputProps, {}> {
  onChange(value: string): void {
    const {
      name,
      validators,
      formValues,
      valueChanged
    } = this.props;

    let validated = true;

    if (validators) {
      validators.forEach(validator => {
        if (validator(value, formValues)) {
          validated = false;
        }
      });
    }

    valueChanged(name, value, validated);
  }

  render() {
    const {
      name,
      placeHolder,
      index,
      value,
      validated,
      valueChanged
    } = this.props;

    return (
      <WithStep step={index} title={name}>
        <input
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder={placeHolder}
          onChange={e => this.onChange(e.target.value)}
          value={value}
          // onKeyUp={e => this.handleEnter(e)}
        />
      </WithStep>
    );
  }
}

export default connect()(TextInput);
