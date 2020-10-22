import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import Scrollbars from "react-custom-scrollbars";
import ClearButton from "../components/ClearButton.js";

import styles from "./SlushBucket.module.css";
import formStyles from "../styles/Forms.module.css";
import inputStyles from "../styles/Input.module.css";

type choiceT = {value: string | number, display: string};
export type choicesT = [choiceT];
type valueItemT = string | number
type valueT = [valueItemT];

interface Props {
  title: string,
  name: string,
  placeholder: string,
  readOnly: boolean | undefined,
  value: valueT,
  choices: choicesT,
  validators?: Function[],
  validated: boolean,
  valueChanged: Function,
};

interface State {
  searchString: string
}

export default class SlushBucket extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      searchString: ""
    };
    this.handleKeyUp = this.handleKeyUp.bind(this);

    if (this.props.value === undefined || this.props.value === null) {
      props.valueChanged([])
    }
  }

  handleKeyUp(e: any): void {
    if (e.key === "Escape") this.resetSearchString();
  }

  resetSearchString() {
    this.setState({ searchString: "" });
  }

  handleInput(e: any): void {
    this.setState({ searchString: e.target.value });
  }

  render() {
    const {
      choices,
      value,
      placeholder,
      valueChanged
    } = this.props;

    const selected = value || [];

    return (
      <div className={`${styles.SelectChoice} form-input`}>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <input
            tabIndex={-1}
            type="text"
            autoComplete="off"
            className={
              formStyles.FormControl +
              " " +
              (this.props.readOnly ? inputStyles.ReadOnly : "")
            }
            placeholder={placeholder}
            onChange={e => this.handleInput(e)}
            onKeyUp={event => {
              this.handleKeyUp(event);
            }}
            value={this.state.searchString}
            disabled={this.props.readOnly}
            readOnly={this.props.readOnly}
          />
          <div
            style={{
              transform: "translateX(-33px)",
              display: "flex",
              alignItems: "center",
              visibility: this.state.searchString === "" ? "hidden" : "visible"
            }}
          >
            <ClearButton
              onClick={() => {
                this.resetSearchString();
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex"
          }}
        >
          <div
            className={styles.Results}
            style={{
              marginRight: "20px"
            }}
          >
            <div className={`${styles.SelectedRow}`}>
              <b><FormattedMessage id="available" /></b>
            </div>
            <Scrollbars autoHeight autoHeightMin={400} autoHeightMax={400}>
              {choices
                .filter(choiceItem => {
                  if (this.props.readOnly) {
                    return false;
                  }
                  if (this.state.searchString === "") {
                    // if nothing is typed show all results
                    return true;
                  } else {
                    // if user typed search string only show those that contain string
                    // TODO sort by search string ?
                    return choiceItem
                      .display
                      .toLowerCase()
                      .includes(this.state.searchString.toLowerCase());
                  }
                })
                .map(({value, display}, i) => {
                  return (
                    <div
                      tabIndex={i + 1}
                      key={value + '_' + i}
                      className={`${styles.ResultRow} ${selected.includes(
                        value
                      )
                        ? styles.Active
                        : ""}`}
                      onMouseDown={() => {
                        if (
                          selected.filter(item => item === value).length === 0
                        ) {
                          const updatedSelected = selected.concat([value]);
                          valueChanged(updatedSelected);
                        } else {
                          valueChanged(
                            selected.filter(e => e !== value)
                          );
                        }
                      }}
                    >
                      {display}
                    </div>
                  );
                })}
            </Scrollbars>
          </div>
          <div
            className={styles.Results}
            style={{
              marginLeft: "20px"
            }}
          >
            <div className={`${styles.SelectedRow}`}>
              <b><FormattedMessage id="selected" /></b>
            </div>
            <Scrollbars autoHeight autoHeightMin={400} autoHeightMax={400}>
              {selected
                .map((selectedItem) => {
                  // lookup complete { value, display} object in choices array
                  return choices.filter(choice => choice.value === selectedItem)[0];
                })
                .map((choiceItem,i) => {
                  return (
                    <div
                      className={`${styles.SelectedRow} ${this.props.readOnly
                        ? styles.SelectedRowReadonly
                        : ""}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      key={choiceItem.value + '_' + i}
                    >
                      <div>{choiceItem.display}</div>
                      <ClearButton
                        onClick={() => {
                          valueChanged(
                            selected.filter(e => e !== choiceItem.value)
                          );
                        }}
                        style={{
                          visibility: this.props.readOnly ? "hidden" : "visible"
                        }}
                      />
                    </div>
                  );
                })}
            </Scrollbars>
          </div>
        </div>
      </div>
    );
  }
}
