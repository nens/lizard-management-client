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
    // this.handleInput = this.handleInput.bind(this);
    // this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  // componentDidMount() {
  //   this.setQuery(this.props);
  // }
  // componentWillReceiveProps(newProps) {
  //   if (newProps.validate()) {
  //     this.setState({ query: newProps.choice });
  //   }
  //   // this.setQuery(newProps);
  //   // if (newProps.selected.name)
  //   //   this.setState({ query: newProps.selected.name });
  // }
  handleKeyUp(e) {
    if (e.key === "Escape") this.resetQuery();
  }
  // handleInput(e) {
  //   this.setState({ mustShowChoices: true, query: e.target.value });
  //   // this.props.updateModelValue(e.target.value);
  // }
  // setQuery(props) {
  //   if (this.props.choice) {
  //     this.setState({
  //       query: this.props.transformChoiceToDisplayValue(this.props.choice)
  //     });
  //   }
  // }
  resetQuery() {
    this.setState({ query: "" });
  }
  render() {
    const {
      choices,
      selected,
      isFetching,
      placeholder,
      updateModelValue,
      onKeyUp,
      transformChoiceToDisplayValue
      // validate
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
                    return transformChoiceToDisplayValue(choiceItem)
                      .toLowerCase()
                      .includes(this.state.query.toLowerCase());
                  }
                })
                .sort((choiceItemA, choiceItemB) => {
                  const nameA = transformChoiceToDisplayValue(choiceItemA);
                  const nameB = transformChoiceToDisplayValue(choiceItemB);
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
                  const currentChoiceString = transformChoiceToDisplayValue(
                    choiceItem
                  );

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
                        // User selected a choice from the filtered ones:
                        // updateModelValue(selected.filter(e=>e.name !== choiceItem.name))
                        if (
                          selected.filter(e => e.name === choiceItem.name)
                            .length === 0
                        ) {
                          selected.push(choiceItem);
                          updateModelValue(selected);
                        } else {
                          updateModelValue(
                            selected.filter(e => e.name !== choiceItem.name)
                          );
                        }
                      }}
                      key={currentChoiceString}
                    >
                      {currentChoiceString}
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
                .sort((choiceItemA, choiceItemB) => {
                  const nameA = transformChoiceToDisplayValue(choiceItemA);
                  const nameB = transformChoiceToDisplayValue(choiceItemB);
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
                  const currentChoiceString = transformChoiceToDisplayValue(
                    choiceItem
                  );

                  return (
                    <div
                      className={`${styles.SelectedRow}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      key={currentChoiceString}
                    >
                      <div>{currentChoiceString}</div>
                      <ClearButton
                        onClick={() => {
                          updateModelValue(
                            selected.filter(e => e.name !== choiceItem.name)
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
