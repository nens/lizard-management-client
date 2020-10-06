import debounce from "lodash.debounce";
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
      showAssets: true,
      assets: null,
      loading: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleAssetSearchInput = debounce(
      this.handleAssetSearchInput.bind(this),
      450
    );
  }

  handleAssetSearchInput(value) {
    if (value === "") {
      this.setState({
        assets: []
      });
      return;
    }
    this.setState({
      loading: true
    });

    const NUMBER_OF_RESULTS = 50;

    let url = `/api/v3/search/?page_size=${NUMBER_OF_RESULTS}&q=${value}`;

    if (this.props.spatialBounds) {
      const { west, east, north, south } = this.props.spatialBounds;
      url += `&in_bbox=${west},${south},${east},${north}`;
    }

    return fetch(
      url,
      {credentials: "same-origin"}
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          assets: json
        });
      });
  }

  handleKeyUp(e) {
    if (e.key === "Escape") {
      this.handleAssetSearchInput("");
      this.setState({
        input: "",
        showAssets: false
      });
    }
  }
  handleInput(e) {
    if (e.target.value === this.state.input) {
      return false;
    }
    this.handleAssetSearchInput(e.target.value);
    this.setState({
      input: e.target.value,
      showAssets: true
    });
  }
  handleSelect(asset) {
    this.setState(
      {
        input: `${asset.title} (${asset.description})`,
        id: asset.id,
        showAssets: false
      },
      () => {
        if (asset && asset.view && asset.view.length >= 2) {
          this.props.setLocation({
            lat: asset.view[0],
            lon: asset.view[1]
          });
        }
      }
    );
  }
  render() {
    const { placeholderText } = this.props;
    const { assets, loading } = this.state;

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
          onFocus={() => this.setState({ showAssets: true })}
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

        {assets &&
        assets.results &&
        assets.results.length > 0 &&
        this.state.showAssets ? (
          <div className={styles.Assets}>
            <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={400}>
              {assets.results.map((result, i) => {
                return (
                  <div
                    tabIndex={i + 1}
                    key={result.id}
                    className={styles.ResultRow}
                    onClick={() => this.handleSelect(result)}
                    onKeyUp={e => {
                      if (e.key === "Enter") {
                        this.handleSelect(result);
                      }
                    }}
                  >
                    {result.title} ({result.description})
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
