import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import styles from "./SelectAsset.css";
import formStyles from "../styles/Forms.css";
import { Scrollbars } from "react-custom-scrollbars";

class SelectAsset extends Component {
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
    console.log("------>", result);
    this.setState(
      {
        input: `${result.title}, ${result.description} (${result.description})`,
        id: result.id,
        showResults: false
      },
      () => {
        this.props.setAsset(result.view);
      }
    );
  }
  render() {
    const { results, placeholderText, loading } = this.props;
    return (
      <div className={`${styles.SelectAsset} form-input`}>
        <input
          id="assetSelection"
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
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

        {results &&
        results.results &&
        results.results.length > 0 &&
        this.state.showResults ? (
          <div className={styles.Results}>
            <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={400}>
              {results.results.map((result, i) => {
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
                    {result.title}, {result.description} ({result.description})
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

export default SelectAsset;
