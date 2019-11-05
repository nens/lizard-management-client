import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectBoxSearch.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";
import inputStyles from "../styles/Input.css";

class SelectTimeseriesSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "", mustShowChoices: false };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    if (e.key === "Escape") this.resetQuery();
  }
  handleInput(e) {
    this.setState({ mustShowChoices: true, query: e.target.value });
    this.props.updateModelValue(e.target.value);
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
      transformChoiceToDisplayValue,
      validate,
      readonly,
      valueChanged
    } = this.props;
    const showOptions = choices.length > 0 && this.state.mustShowChoices;
    const mustShowClearButton =
      (validate(choice) || this.state.query !== "") &&
      !readonly &&
      transformChoiceToDisplayValue(choice) !==
        transformChoiceToDisplayValue(this.props.noneValue);

    const filteredSortedChoices = choices
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
      });

    const choicesWithNoneValue = this.props.noneValue
      ? [this.props.noneValue].concat(filteredSortedChoices)
      : filteredSortedChoices;

    return (
      <div className={`${styles.SelectChoice} form-input`}>
        <input
          id={inputId}
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={
            formStyles.FormControl +
            " " +
            (readonly ? " " + inputStyles.ReadOnly : null)
          }
          placeholder={placeholder}
          onChange={this.handleInput}
          onKeyUp={event => {
            onKeyUp(event);
            this.handleKeyUp(event);
          }}
          value={
            (!this.state.mustShowChoices &&
              transformChoiceToDisplayValue(choice)) ||
            this.state.query
          }
          onClick={() => !readonly && this.setState({ mustShowChoices: true })}
          //onFocus={() => this.setState({ mustShowChoices: true })}
          onBlur={() => this.setState({ mustShowChoices: false })}
          readOnly={readonly}
          disabled={readonly}
        />
        <div
          className={`${styles.Spinner} ${isFetching && !readonly
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
              valueChanged(null);
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
            {choicesWithNoneValue.map((choiceItem, i) => {
              const currentChoiceString = transformChoiceToDisplayValue(
                choiceItem
              );
              const SelectedChoiceString = transformChoiceToDisplayValue(
                choice
              );

              return (
                <div
                  tabIndex={i + 1}
                  key={currentChoiceString + i}
                  className={`${styles.ResultRow} ${currentChoiceString ===
                  SelectedChoiceString
                    ? styles.Active
                    : styles.Inactive}`}
                  onMouseDown={() => {
                    // User selected a choice from the filtered ones:
                    updateModelValue(choiceItem);
                    this.setState({
                      mustShowChoices: false,
                      query: ""
                    });
                    valueChanged(choiceItem && choiceItem.uuid)
                  }}
                >
                  {currentChoiceString}
                </div>
              );
            })}
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default SelectTimeseriesSearch;
