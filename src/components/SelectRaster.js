import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import styles from "./SelectRaster.css";
import { Scrollbars } from "react-custom-scrollbars";

class SelectRaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      uuid: null,
      showResults: true
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  componentDidMount() {}
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
    this.props.onInput(e.target.value);
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
        fetch(`/api/v3/rasters/${result.uuid}/`)
          .then(response => response.json())
          .then(json => {
            this.props.setRaster(json);
          });
      }
    );
  }
  render() {
    const { results, placeholderText, loading } = this.props;
    return (
      <div className={`${styles.SelectRaster} form-input`}>
        <input
          id="rasterName"
          tabIndex="-1"
          type="text"
          autocomplete="off"
          className="form-control"
          placeholder={placeholderText}
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
          value={this.state.input}
          onFocus={() => this.setState({ showResults: true })}
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

        {results.length > 0 && this.state.showResults ? (
          <div className={styles.Results}>
            <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={400}>
              {results.map((result, i) => {
                return (
                  <div
                    tabIndex={i + 1}
                    key={i}
                    className={styles.ResultRow}
                    onClick={() => this.handleSelect(result)}
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        this.handleSelect(result);
                      }
                    }}
                  >
                    {result.name}
                  </div>
                );
              })}
            </Scrollbars>
          </div>
        ) : null}
      </div>
    );
  }
}

export default SelectRaster;
