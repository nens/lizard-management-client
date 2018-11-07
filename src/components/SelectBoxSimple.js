import React, { Component } from "react";

import { Scrollbars } from "react-custom-scrollbars";
//import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectBoxSimple.css";
import formStyles from "../styles/Forms.css";

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
    return (
      <div className={`${styles.SelectGeneralClass} form-input`}>
        <input
          style={{ caretColor: "transparent" }}
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
            // showChoices ?
            styles.Results
            // : displayStyles.None + " " + styles.Results
          }
        >
          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {choices.map((choiceItem, i) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start"
                  }}
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
                  <div style={{ flex: "1" }}>{choiceItem}</div>
                  {/* <div
                    style={{
                      flex: "2",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap"
                    }}
                  >
                    some description
                  </div>
                  <div style={{ marginLeft: "auto" }}>i</div> */}
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
