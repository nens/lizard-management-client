import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import styles from "./SelectRaster.css";
import formStyles from "../styles/Forms.css";
import displayStyles from "../styles/Display.css";
import { Scrollbars } from "react-custom-scrollbars";

class SelectOrganisation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      uuid: null,
      showResults: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    if (e.key === "Escape") {
      this.setState({
        showResults: false
      });
    }
  }
  handleInput(e) {
    // if (e.target.value === this.state.input) {
    //   return false;
    // }
    //this.props.onInput(e.target.value);
    this.setState({
      //input: e.target.value,
      showResults: true
    });
    this.props.setValue({ name: e.target.value });
  }

  render() {
    const { results, placeholderText, loading } = this.props;
    const showOptions = results.length > 0 && this.state.showResults;
    return (
      <div className={`${styles.SelectRaster} form-input`}>
        <input
          id="rasterSelection"
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder={placeholderText}
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
          value={this.props.selected.name}
          onFocus={() => this.setState({ showResults: true })}
          // onBlur={() => this.setState({ showResults: false })}
          // onBlur={() => {
          //   const that = this;
          //   setTimeout(function(){ that.setState({ showResults: false }) }, 500);
          // }
          // }
        />
        {loading ? (
          <div
            style={{
              position: "absolute",
              top: 7,
              right: 10
            }}
          >
            <MDSpinner size={18} />
          </div>
        ) : null}

        {/* {results.length > 0 && this.state.showResults ? ( */}
        <div
          className={
            showOptions
              ? styles.Results
              : displayStyles.None + " " + styles.Results
          }
        >
          {/* <div className={styles.Results}> */}
          <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={400}>
            {results
              .filter(result => {
                // if nothing is typed show all results
                if (this.props.selected.name === "") {
                  return true;
                } else if (this.props.selected.unique_id) {
                  // if value is prefilled show all results
                  return true;
                } else {
                  // if user typed search string only show those that contain string
                  // TODO sort by search string ?
                  if (
                    result.name
                      .toLowerCase()
                      .includes(this.props.selected.name.toLowerCase())
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
              })
              .map((result, i) => {
                return (
                  <div
                    tabIndex={i + 1}
                    key={i}
                    className={styles.ResultRow}
                    onClick={() => {
                      this.props.setValue(result);
                      this.setState({ showResults: false });
                    }}
                  >
                    {result.name}
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
