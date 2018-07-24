import React, { Component } from "react";

import { Scrollbars } from "react-custom-scrollbars";
//import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectBoxSimple.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";

class SelectOrganisation extends Component {
  constructor(props) {
    super(props);
    this.state = { showChoices: false };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyUp(e) {
    if (e.key === "Escape") {
      this.setState({ showChoices: false });
    }
  }
  handleInput(e) {
    this.setState({ mustShowResults: true, query: e.target.value });
  }

  render() {
    const { choices, choice, updateModelValue } = this.props;
    const { showChoices } = this.state;
    return (
      <div className={`${styles.SelectOrganisation} form-input`}>
        <input
          id="rasterSelection"
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder="- select a value -"
          onKeyUp={this.handleKeyUp}
          value={choice}
          onFocus={() => this.setState({ showChoices: true })}
          onBlur={() => this.setState({ showChoices: false })}
        />
        <div
          className={
            showChoices
              ? styles.Results
              : displayStyles.None + " " + styles.Results
          }
        >
          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {choices.map((choice, i) => {
              return (
                <div
                  tabIndex={i + 1}
                  key={i}
                  className={styles.ResultRow}
                  onMouseDown={e => {
                    this.setState({
                      showChoices: false
                    });
                    updateModelValue(choice);
                  }}
                >
                  {choice}
                </div>
              );
            })}
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default SelectOrganisation;
