import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectOrganisation.css";
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
      "[F] componentDidMount; this.props.selected.name =",
      this.props.choice && this.props.choice[this.props.choicesDisplayField]
    );
    this.setQuery(this.props);
    // if (this.props.selected.name)
    //   this.setState({ query: this.props.selected.name });
  }
  componentWillReceiveProps(newProps) {
    console.log("[F] componentWillReceiveProps =", this.props.choice);
    // this.setQuery(newProps);
    // if (newProps.selected.name)
    //   this.setState({ query: newProps.selected.name });
  }
  handleKeyUp(e) {
    if (e.key === "Escape") this.resetQuery();
  }
  handleInput(e) {
    console.log("[F] handle input ");
    this.setState({ mustShowChoices: true, query: e.target.value });
  }
  setQuery(props) {
    if (this.props.choice) {
      if (this.props.choicesDisplayField) {
        this.setState({
          query: this.props.choice[this.props.choicesDisplayField]
        });
      } else {
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
      placeholderText,
      loading,
      updateModelValue,
      inputId
    } = this.props;
    const showOptions = choices.length > 0 && this.state.mustShowChoices;
    const valueInputField = this.state.query;

    console.log(
      "this.state.mustShowChoices; ",
      this.state.mustShowChoices,
      "showOptions",
      showOptions
    );
    return (
      <div className={`${styles.SelectOrganisation} form-input`}>
        <input
          id={inputId}
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder={placeholderText}
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
          value={this.state.query}
          onClick={() => this.setState({ mustShowChoices: true })}
          //onFocus={() => this.setState({ mustShowChoices: true })}
        />
        {loading ? (
          <div lassName={styles.Spinner}>
            <MDSpinner size={18} />
          </div>
        ) : null}
        {/* {valueInputField !== "" ? (
          <ClearInputButton
            onClick={() => {
              this.props.resetSelectedOrganisation();
              this.resetQuery();
            }}
          />
        ) : null} */}

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
                  if (this.props.choicesDisplayField) {
                    return choiceItem[this.props.choicesDisplayField]
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
                return (
                  <div
                    tabIndex={i + 1}
                    key={i}
                    className={styles.ResultRow}
                    onClick={() => {
                      // User selected a choice from the filtered ones:
                      updateModelValue(choiceItem);
                      //this.resetQuery();
                      console.log("[ONCLICK] select search", choiceItem);
                      this.setState({
                        mustShowChoices: false,
                        query: this.props.choicesDisplayField
                          ? choiceItem[this.props.choicesDisplayField]
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
