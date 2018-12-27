import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import ClearButton from "../components/ClearButton.js";

import styles from "./SlushBucket.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";

class SlushBucket extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "" };
  }

  handleKeyUp(e) {
    if (e.key === "Escape") this.resetQuery();
  }

  resetQuery() {
    this.setState({ query: "" });
  }
  render() {
    const {
      choices,
      selected,
      isFetching,
      placeholder,
      updateModelValue
    } = this.props;

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
            tabIndex="-1"
            type="text"
            autoComplete="false"
            className={formStyles.FormControl}
            placeholder={placeholder}
            onChange={this.handleInput}
            onKeyUp={event => {
              this.handleKeyUp(event);
            }}
            value={this.state.query}
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
              visibility: this.state.query === "" ? "hidden" : "visible"
            }}
          >
            <ClearButton
              onClick={() => {
                this.resetQuery();
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
                  if (this.state.query === "") {
                    // if nothing is typed show all results
                    return true;
                  } else {
                    // if user typed search string only show those that contain string
                    // TODO sort by search string ?
                    return choiceItem
                      .toLowerCase()
                      .includes(this.state.query.toLowerCase());
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
                      key={i}
                      className={`${styles.ResultRow} ${this.props.selected.includes(
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
                      key={choiceItem}
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
                      className={`${styles.SelectedRow}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      key={choiceItem}
                    >
                      <div>{choiceItem}</div>
                      <ClearButton
                        onClick={() => {
                          updateModelValue(
                            selected.filter(e => e !== choiceItem)
                          );
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

export default SlushBucket;
