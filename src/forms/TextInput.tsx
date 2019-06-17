// The main Form class

import React, { Component } from "react";

import ClearInputButton from "./ClearInputButton";

import formStyles from "../styles/Forms.css";

interface TextInputProps {
  name: string,
  value: string,
  placeholder?: string,
  validators?: Function[],
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: Function,
  wizardStyle: boolean
};

export default class TextInput extends Component<TextInputProps, {}> {
  render() {
    const {
      name,
      placeholder,
      value,
      validated,
      valueChanged,
      handleEnter
    } = this.props;

    return (
      <div>
        <input
          name={name}
          id={`textinput-${name}`}
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder={placeholder}
          onChange={e => this.props.valueChanged(e.target.value)}
          value={value || ""}
          onKeyUp={handleEnter}
        />
        <ClearInputButton onClick={() => this.props.valueChanged(null)}/>
      </div>
    );
  }

  setFocus() {
    if (this.props.wizardStyle) {
      // In wizard style mode, only one form field is visible at a time
      // and it should receive focus.
      const inputElem = document.getElementById(`textinput-${this.props.name}`);

      if (inputElem) {
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
