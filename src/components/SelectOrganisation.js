import React, { Component } from "react";

import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import ClearInputButton from "../components/ClearInputButton.js";

import styles from "./SelectOrganisation.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";

class SelectOrganisation extends Component {
  constructor(props) {
    super(props);
    this.state = { query: "", mustShowResults: false };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    if (e.key === "Escape") this.resetQuery();
  }
  handleInput(e) {
    this.setState({ mustShowResults: true, query: e.target.value });
  }
  resetQuery() {
    this.setState({ mustShowResults: false, query: "" });
  }
  render() {
    const { organisations, placeholderText, loading } = this.props;
    const showOptions = organisations.length > 0 && this.state.mustShowResults;
    const valueInputField = this.state.query;
    return (
      <div className={`${styles.SelectOrganisation} form-input`}>
        <input
          id="rasterSelection"
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder={placeholderText}
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
          value={valueInputField} //{this.props.selected.name}
          onFocus={() => this.setState({ mustShowResults: true })}
        />
        {loading ? (
          <div lassName={styles.Spinner}>
            <MDSpinner size={18} />
          </div>
        ) : null}
        {valueInputField !== "" ? (
          <ClearInputButton
            onClick={() => {
              this.props.resetSelectedOrganisation();
              this.resetQuery();
            }}
          />
        ) : null}

        {/* {results.length > 0 && this.state.mustShowResults ? ( */}
        <div
          className={
            showOptions
              ? styles.Results
              : displayStyles.None + " " + styles.Results
          }
        >
          {/* <div className={styles.Results}> */}
          <Scrollbars autoHeight autoHeightMin={50} autoHeightMax={400}>
            {organisations
              .filter(org => {
                if (this.state.query === "") {
                  // if nothing is typed show all results
                  return true;
                } else if (this.props.selected.unique_id) {
                  // if value is prefilled show all results
                  return true;
                } else {
                  // if user typed search string only show those that contain string
                  // TODO sort by search string ?
                  return org.name.toLowerCase().includes(this.state.query);
                }
              })
              .map((org, i) => {
                return (
                  <div
                    tabIndex={i + 1}
                    key={i}
                    className={styles.ResultRow}
                    onClick={() => {
                      // User selected an organisation from the filtered ones:
                      this.props.setValue(org);
                      //this.resetQuery();
                      this.setState({
                        mustShowResults: false,
                        query: org.name
                      });
                    }}
                  >
                    {org.name}
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

export default SelectOrganisation;
