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
    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  handleKeyUp(e) {
    if (e.key === "Escape") {
      this.props.onInput("");
      this.setState({
        input: "",
        showResults: false
      });
    }
  }
  handleInput(e) {
    if (e.target.value === this.state.input) {
      return false;
    }
    //this.props.onInput(e.target.value);
    this.setState({
      input: e.target.value,
      showResults: true
    });
  }
  handleSelect(result) {
    this.setState(
      {
        input: result.name,
        uuid: result.uuid,
        showResults: false
      },
      () => {
        fetch(`/api/v3/rasters/${result.uuid}/`, {
          credentials: "same-origin"
        })
          .then(response => response.json())
          .then(json => {
            this.props.setRaster(json);
          });
      }
    );
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
            {results.map((result, i) => {
              return (
                <div
                  tabIndex={i + 1}
                  key={i}
                  className={styles.ResultRow}
                  onClick={() => {
                    this.props.setValue(result);
                    this.setState({ showResults: false });
                  }}
                  // onKeyUp={e => {
                  //   if (e.key === "Enter") {
                  //     this.handleSelect(result);
                  //   }
                  // }}
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
