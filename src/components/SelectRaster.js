import debounce from "lodash.debounce";
import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import styles from "./SelectRaster.css";
import formStyles from "../styles/Forms.css";
import { Scrollbars } from "react-custom-scrollbars";

class SelectRaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      uuid: null,
      showResults: true,
      rasters: [],
      loading: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleRasterSearchInput = debounce(
      this.handleRasterSearchInput.bind(this),
      450
    );
  }

  handleKeyUp(e) {
    if (e.key === "Escape") {
      this.handleRasterSearchInput("");
      this.setState({
        input: "",
        uuid: null,
        loading: false,
        showResults: false
      });
    }
  }
  handleInput(e) {
    if (e.target.value === this.state.input) {
      return false;
    }
    this.handleRasterSearchInput(e.target.value);
    this.setState({
      input: e.target.value,
      showResults: true
    });
  }
  handleRasterSearchInput(value) {
    if (value === "") {
      this.setState({
        rasters: []
      });
      this.props.setRaster(null);
      return;
    }
    this.setState({
      loading: true
    });
    return fetch(
      // show all temporal rasters the user has access to
      `/api/v3/rasters/?page_size=0&name__icontains=${value}&first_value_timestamp__isnull=false`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          rasters: json
        });
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
    const { rasters, loading, input, showResults } = this.state;
    return (
      <div className={`${styles.SelectRaster} form-input`}>
        <input
          id="rasterSelection"
          tabIndex="-1"
          type="text"
          autoComplete="false"
          className={formStyles.FormControl}
          placeholder="Type to search"
          onChange={this.handleInput}
          onKeyUp={this.handleKeyUp}
          value={input}
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

        {rasters.length > 0 && showResults ? (
          <div className={styles.Results}>
            <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={400}>
              {rasters.map((raster, i) => {
                return (
                  <div
                    tabIndex={i + 1}
                    key={raster.uuid}
                    className={styles.ResultRow}
                    onClick={() => this.handleSelect(raster)}
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        this.handleSelect(raster);
                      }
                    }}
                  >
                    {raster.name}
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
