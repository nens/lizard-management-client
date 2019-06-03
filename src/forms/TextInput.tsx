// The main Form class

import React, { Component } from "react";
import { connect } from "react-redux";

import formStyles from "../styles/Forms.css";

interface TextInputProps {
  name: string,
  value: string,
  placeHolder?: string,
  step: number,
  validators?: Function[],
  formValues: {[key: string]: any},
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: Function,
  wizardStyle: boolean
};

export default class TextInput extends Component<TextInputProps, {}> {
  render() {
    const {
      name,
      placeHolder,
      value,
      validated,
      valueChanged,
      handleEnter
    } = this.props;

    return (
      <input
        name={name}
        id={`textinput-${name}`}
        type="text"
        autoComplete="false"
        className={formStyles.FormControl}
        placeholder={placeHolder}
        onChange={e => this.props.valueChanged(e.target.value)}
        value={value}
        onKeyUp={handleEnter}
      />
    );
  }

  setFocus() {
    if (this.props.wizardStyle) {
      // In wizard style mode, only one form field is visible at a time
      // and it should receive focus.
      const inputElem = document.getElementById(`textinput-${this.props.name}`);

      if (inputElem) {
        console.log('Updating...');
        setTimeout(function() {
          inputElem.focus();
        }, 0);
      }
    }
  }

  componentWillReceiveProps() {
    this.setFocus();
  }

  componentDidMount() {
    this.setFocus();
  }
}
