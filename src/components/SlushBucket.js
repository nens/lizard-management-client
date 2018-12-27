import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
// import ClearInputButton from "../components/ClearInputButton.js";
import ClearButton from "../components/ClearButton.js";

import styles from "./SlushBucket.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";

class SlushBucket extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "", mustShowChoices: false };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  componentDidMount() {
    this.setQuery(this.props);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.validate()) {
      this.setState({ query: newProps.choice });
    }
    // this.setQuery(newProps);
    // if (newProps.selected.name)
    //   this.setState({ query: newProps.selected.name });
  }
  handleKeyUp(e) {
    if (e.key === "Escape") this.resetQuery();
  }
  handleInput(e) {
    this.setState({ mustShowChoices: true, query: e.target.value });
    // this.props.updateModelValue(e.target.value);
  }
  setQuery(props) {
    if (this.props.choice) {
      this.setState({
        query: this.props.transformChoiceToDisplayValue(this.props.choice)
      });
    }
  }
  resetQuery() {
    this.setState({ mustShowChoices: false, query: "" });
  }
  render() {
    const {
      choices,
      selected,
      isFetching,
      placeholder,
      updateModelValue,
      resetModelValue,
      onKeyUp,
      inputId,
      transformChoiceToDisplayValue,
      validate
    } = this.props;
    const showOptions = choices.length > 0 && this.state.mustShowChoices;
    const mustShowClearButton = validate(selected);

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
            id={inputId}
            tabIndex="-1"
            type="text"
            autoComplete="false"
            className={formStyles.FormControl}
            placeholder={placeholder}
            onChange={this.handleInput}
            onKeyUp={event => {
              onKeyUp(event);
              this.handleKeyUp(event);
            }}
            value={this.state.query}
            // onClick={() => this.setState({ mustShowChoices: true })}
            //onFocus={() => this.setState({ mustShowChoices: true })}
            onBlur={() => this.setState({ mustShowChoices: false })}
          />
          <div
            className={`${styles.Spinner} ${isFetching
              ? displayStyles.Block
              : displayStyles.None}`}
          >
            <MDSpinner size={18} />
          </div>

          {/* {this.state.query !== '' ? ( */}
          <div
            style={{
              transform: "translateX(-24px)",
              display: "flex",
              alignItems: "center",
              visibility: this.state.query === "" ? "hidden" : "visible"
            }}
          >
            <ClearButton
              onClick={() => {
                resetModelValue();
                this.resetQuery();
              }}
            />
          </div>
          {/* ) : null} */}
        </div>

        {/* {results.length > 0 && this.state.mustShowChoices ? ( */}
        <div
          style={{
            display: "flex"
          }}
        >
          {/* <div className={styles.Results}> */}
          <div
            className={styles.Results}
            style={{
              marginRight: "20px"
            }}
          >
            <div className={`${styles.ResultRow}`}>
              <b>Available Organisations</b>
            </div>
            <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
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
                  // const SelectedChoiceString = transformChoiceToDisplayValue(
                  //   choice
                  // );

                  return (
                    <div
                      tabIndex={i + 1}
                      key={i}
                      // className={`${styles.ResultRow} ${
                      //   currentChoiceString === SelectedChoiceString
                      //     ? styles.Active
                      //     : styles.Inactive
                      // }`}
                      className={`${styles.ResultRow}`}
                      onMouseDown={() => {
                        // User selected a choice from the filtered ones:
                        // updateModelValue(selected.filter(e=>e.name !== choiceItem.name))
                        if (
                          selected.filter(e => e.name === choiceItem.name)
                            .length === 0
                        ) {
                          selected.push(choiceItem);
                        }
                        updateModelValue(selected);
                      }}
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
            <div className={`${styles.ResultRow}`}>
              <b>Selected organisations</b>
            </div>
            <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
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
                  // const SelectedChoiceString = transformChoiceToDisplayValue(
                  //   choice
                  // );

                  return (
                    <div
                      className={`${styles.ResultRow} ${styles.Inactive}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div
                        tabIndex={i + 1}
                        key={i}
                        // className={`${styles.ResultRow} ${
                        //   currentChoiceString === SelectedChoiceString
                        //     ? styles.Active
                        //     : styles.Inactive
                        // }`}

                        onMouseDown={() => {
                          // User selected a choice from the filtered ones:
                          // updateModelValue(choiceItem);
                          // // this.resetQuery();
                          // this.setState({
                          //   mustShowChoices: false,
                          //   query: currentChoiceString
                          // });
                          // updateModelValue(
                          //   selected.filter(e => e.name !== choiceItem.name)
                          // );
                        }}
                      >
                        {currentChoiceString}
                      </div>
                      <ClearButton
                        onClick={() => {
                          // resetModelValue();
                          // this.resetQuery();
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
