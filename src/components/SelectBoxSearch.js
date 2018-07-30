import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectBoxSearch.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";

class SelectBoxSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "", mustShowChoices: false };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  componentDidMount() {
    console.log(
      "[F] componentDidMount",
      this.props.choice && this.props.choice[this.props.choicesDisplayField]
    );
    this.setQuery(this.props);
  }
  componentWillReceiveProps(newProps) {
    console.log("[F] componentWillReceiveProps");
    if (newProps.validate()) {
      console.log("*** newProps =", newProps);
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
    // console.log("[F] handle input ");
    this.setState({ mustShowChoices: true, query: e.target.value });
  }
  setQuery(props) {
    if (this.props.choice) {
      if (this.props.choicesDisplayField) {
        console.log(
          "[F] setQuery this.props.choicesDisplayField ",
          this.props.choice[this.props.choicesDisplayField]
        );
        this.setState({
          query: this.props.choice[this.props.choicesDisplayField]
        });
      } else {
        console.log("[F] setQuery this.props.choice ", this.props.choice);
        this.setState({ query: this.props.choice });
      }
    }
  }
  resetQuery() {
    this.setState({ mustShowChoices: false, query: "" });
  }
  render() {
    const {
      choices,
      choice,
      isFetching,
      placeholder,
      updateModelValue,
      resetModelValue,
      onKeyUp,
      inputId,
      choicesDisplayField,
      validate
    } = this.props;
    const showOptions = choices.length > 0 && this.state.mustShowChoices;
    const mustShowClearButton = validate(choice);

    return (
      <div className={`${styles.SelectChoice} form-input`}>
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
          onClick={() => this.setState({ mustShowChoices: true })}
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

        {mustShowClearButton ? (
          <ClearInputButton
            onClick={() => {
              resetModelValue();
              this.resetQuery();
            }}
          />
        ) : null}

        {/* {results.length > 0 && this.state.mustShowChoices ? ( */}
        <div
          className={
            showOptions
              ? styles.Results
              : displayStyles.None + " " + styles.Results
          }
        >
          {/* <div className={styles.Results}> */}
          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {choices
              .filter(choiceItem => {
                if (this.state.query === "") {
                  // if nothing is typed show all results
                  return true;
                  // } else if (this.props.selected.unique_id) {
                  //   // if value is prefilled show all results
                  //   return true;
                } else {
                  // if user typed search string only show those that contain string
                  // TODO sort by search string ?
                  if (choicesDisplayField) {
                    console.log("[F]");
                    return choiceItem[choicesDisplayField]
                      .toLowerCase()
                      .includes(this.state.query.toLowerCase());
                  } else {
                    return choiceItem
                      .toLowerCase()
                      .includes(this.state.query.toLowerCase());
                  }
                }
              })
              .map((choiceItem, i) => {
                const currentChoiceString =
                  (choicesDisplayField && choiceItem[choicesDisplayField]) ||
                  choiceItem;
                //console.log(currentChoiceString, choice)
                return (
                  <div
                    tabIndex={i + 1}
                    key={i}
                    className={`${styles.ResultRow} ${currentChoiceString ===
                    choice
                      ? styles.Active
                      : styles.Inactive}`}
                    onMouseDown={() => {
                      // User selected a choice from the filtered ones:
                      updateModelValue(choiceItem);
                      //this.resetQuery();
                      console.log("[onMouseDown] select search", choiceItem);
                      this.setState({
                        mustShowChoices: false,
                        query: choicesDisplayField
                          ? choiceItem[choicesDisplayField]
                          : choiceItem
                      });
                    }}
                  >
                    {this.props.choicesDisplayField
                      ? choiceItem[this.props.choicesDisplayField]
                      : choiceItem}
                  </div>
                );
              })}
          </Scrollbars>
        </div>
        {/* ) : null} */}
      </div>
    );
  }
}

export default SelectBoxSearch;
