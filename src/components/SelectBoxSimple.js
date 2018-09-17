import React, { Component } from "react";

import { Scrollbars } from "react-custom-scrollbars";
//import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectBoxSimple.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";

class SelectBoxSimple extends Component {
  constructor(props) {
    super(props);
    this.state = { showChoices: false };
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    if (e.key === "Escape") {
      this.setState({ showChoices: false });
    }
  }

  render() {
    const {
      choices,
      choice,
      updateModelValue,
      onKeyUp,
      inputId,
      placeholder
    } = this.props;
    const { showChoices } = this.state;
    return (
      <div className={`${styles.SelectGeneralClass} form-input`}>
        <input
          id={inputId}
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder={placeholder} //"- select a value -"
          value={choice}
          onClick={() => this.setState({ showChoices: true })}
          onBlur={() => this.setState({ showChoices: false })}
          onChange={() => {}} // no op in order to suppress error in console
          onKeyUp={event => {
            onKeyUp(event);
            this.handleKeyUp(event);
          }}
        />
        <div
          className={
            showChoices
              ? styles.Results
              : displayStyles.None + " " + styles.Results
          }
        >
          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {choices.map((choiceItem, i) => {
              return (
                <div
                  tabIndex={i + 1}
                  key={i}
                  className={`${styles.ResultRow} ${choiceItem === choice
                    ? styles.Active
                    : styles.Inactive}`}
                  onMouseDown={e => {
                    this.setState({
                      showChoices: false
                    });
                    updateModelValue(choiceItem);
                  }}
                >
                  {choiceItem}
                </div>
              );
            })}
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default SelectBoxSimple;
