import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import Scrollbars from "react-custom-scrollbars";
import ClearButton from "../components/ClearButton.js";

import styles from "./SlushBucket.css";
import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import displayStyles from "../styles/Display.css";


interface Props {
  title: string,
  name: string,
  placeholder: string,
  readonly: boolean | undefined,
  isFetching: boolean | undefined,
  value: string[],
  choices: string[],
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
  }

///////////////////////////////////////////////////////////////

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
      isFetching,
      placeholder,
      valueChanged
    } = this.props;

    const selected = value;
    const updateModelValue = valueChanged;

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
            // tabIndex="-1"
            type="text"
            autoComplete="false"
            className={
              formStyles.FormControl +
              " " +
              (this.props.readonly ? inputStyles.ReadOnly : "")
            }
            placeholder={placeholder}
            onChange={e => this.handleInput(e)}
            onKeyUp={event => {
              this.handleKeyUp(event);
            }}
            value={this.state.searchString}
            disabled={this.props.readonly}
            readOnly={this.props.readonly}
          />
          <div
            className={`${styles.Spinner} ${isFetching
              ? displayStyles.Block
              : displayStyles.None}`}
          >
            <MDSpinner size={18} />
          </div>

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
              <b>Available</b>
            </div>
            <Scrollbars autoHeight autoHeightMin={400} autoHeightMax={400}>
              {choices
                .filter(choiceItem => {
                  if (this.props.readonly) {
                    return false;
                  }
                  if (this.state.searchString === "") {
                    // if nothing is typed show all results
                    return true;
                  } else {
                    // if user typed search string only show those that contain string
                    // TODO sort by search string ?
                    return choiceItem
                      .toLowerCase()
                      .includes(this.state.searchString.toLowerCase());
                  }
                })
                .sort((nameA, nameB) => {
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  // names must be equal
                  return 0;
                })
                .map((choiceItem, i) => {
                  return (
                    <div
                      tabIndex={i + 1}
                      key={choiceItem + i}
                      className={`${styles.ResultRow} ${selected.includes(
                        choiceItem
                      )
                        ? styles.Active
                        : ""}`}
                      onMouseDown={() => {
                        if (
                          selected.filter(e => e === choiceItem).length === 0
                        ) {
                          selected.push(choiceItem);
                          updateModelValue(selected);
                        } else {
                          updateModelValue(
                            selected.filter(e => e !== choiceItem)
                          );
                        }
                      }}
                    >
                      {choiceItem}
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
              <b>Selected</b>
            </div>
            <Scrollbars autoHeight autoHeightMin={400} autoHeightMax={400}>
              {selected
                .sort((nameA, nameB) => {
                  if (nameA < nameB) {
                    return -1;
                  }
                  if (nameA > nameB) {
                    return 1;
                  }
                  // names must be equal
                  return 0;
                })
                .map((choiceItem, i) => {
                  return (
                    <div
                      className={`${styles.SelectedRow} ${this.props.readonly
                        ? styles.SelectedRowReadonly
                        : ""}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      key={choiceItem + i}
                    >
                      <div>{choiceItem}</div>
                      <ClearButton
                        onClick={() => {
                          updateModelValue(
                            selected.filter(e => e !== choiceItem)
                          );
                        }}
                        style={{
                          visibility: this.props.readonly ? "hidden" : "visible"
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
