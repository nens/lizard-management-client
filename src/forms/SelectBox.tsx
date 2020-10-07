// The main Form class

import React, { Component } from "react";
import Scrollbars from "react-custom-scrollbars";

import ClearInputButton from "./ClearInputButton";

import styles from "./SelectBox.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";

type displayStringsT = {[key: string]: string};
type choiceT = [string|number, string] | [string|number, string, string]
export type choicesT = choiceT[];

interface SelectBoxProps {
  name: string,
  value: string | null,
  choices: choicesT,
  placeholder?: string,
  validators?: Function[],
  validated: boolean,
  handleEnter: (e: any) => void,
  valueChanged: Function,
  wizardStyle: boolean
  showSearchField?: boolean
  readonly?: boolean
};

interface SelectBoxState {
  showChoices: boolean,
  displayStrings: displayStringsT,
  searchString: string
}

export default class SelectBox extends Component<SelectBoxProps, SelectBoxState> {
  constructor(props: SelectBoxProps) {
    super(props);

    // The 'choices' prop is an array of [key, displayString] pairs;
    // optionally a third element containing a description may be present.

    // Here we create an object to be able to translate keys to displayStrings.
    // Choice keys may be numbers, but they must map to strings uniquely!
    const displayStrings: displayStringsT = {};
    const choices: choicesT = props.choices;

    choices.forEach((choice: choiceT) => {
      const [key, displayString] = choice;
      displayStrings["" + key] = displayString;
    });

    this.state = {
      showChoices: false,
      displayStrings: displayStrings,
      searchString: ""
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  handleKeyUp(e: any): void {
    if (e.key === "Escape") {
      this.setState({ showChoices: false });
    }
  }

  toggleChoices(): void {
    this.setState({
      showChoices: !this.state.showChoices,
      searchString: ""
    });
  }

  clearInput(): void {
    // Clear input and close choices
    this.props.valueChanged(null);
    this.setState({
      showChoices: false
    });
  }

  render() {
    const {
      choices,
      value,
      name,
      valueChanged,
      placeholder,
      showSearchField,
      readonly
    } = this.props;
    const {
      showChoices,
      displayStrings,
      searchString
    } = this.state;

    return (
      <div className={`${styles.SelectGeneralClass} form-input`}>
        <input
          style={{ caretColor: "transparent" }}
          id={`selectbox-${name}`}
          tabIndex={-1}
          type="text"
          autoComplete="false"
          className={
            formStyles.FormControl +
            " " +
            (readonly ? " " + inputStyles.ReadOnly : null)
          }
          placeholder={placeholder}
          value={value ? (displayStrings[value] || "") : ""}
          onClick={() => !readonly &&  this.toggleChoices()}
          onKeyUp={par => !readonly && this.handleKeyUp(par)}
          onChange={() => {}}
          readOnly={readonly}
          disabled={readonly}
        />
        { 
        !readonly ?
          value !== null ? (
            <ClearInputButton onClick={() => this.clearInput()}/>
            ) : (
            <ClearInputButton
              icon="arrow_drop_down"
              onClick={() => this.toggleChoices()}/>
          )
        :
        null
        }
      {showChoices ? (
        <div className={styles.Results}>

          {showSearchField ? (
            <span style={{fontSize: "smaller"}}>
              <input
                id={`searchbox-${name}`}
                name={`searchbox-${name}`}
                type="text"
                autoComplete="false"
                autoFocus={true}
                value={searchString}
                onChange={(e) => {this.setState({ searchString: e.target.value })}}
                onKeyUp={this.handleKeyUp}
              />
              <i style={{verticalAlign: "middle"}} className="material-icons">search</i>
            </span>
          ) : null}

          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {choices.map((choice, i) => {
              const choiceValue: string|number = choice[0];
              const choiceDisplay: string = choice[1];
              const choiceDescription: string = (
                choice.length === 3 ? choice[2] : "");
              const isSelected = choiceValue === value;

              if (searchString &&
                  choiceDisplay.toLowerCase().indexOf(
                    searchString.toLowerCase()) === -1) {
                return null; // Hide
              }

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start"
                  }}
                  tabIndex={i + 1}
                  key={"" + choiceValue + i}
                  className={`${styles.ResultRow} ${isSelected
                ? styles.Active
                : styles.Inactive}`}
                  onMouseDown={e => {
                    this.setState({
                      showChoices: false
                    });
                    valueChanged(choiceValue);
                  }}
                >
                  <div style={{ flex: "1" }}>{choiceDisplay}</div>
                  <div
                    style={{
                      flex: "2",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap"
                    }}
                  >
                    <i>{choiceDescription}</i>
                  </div>
                </div>
              );
            })}
          </Scrollbars>
        </div>
      ) : null}
      </div>
    );
  }
}
