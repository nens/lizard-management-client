import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import classNames from "classnames";
import Dropzone from "react-dropzone";
import styles from "./UploadRasterData.css";
import { FormattedMessage } from "react-intl";

import { UploadRasterDataSingle } from "./UploadRasterDataSingle";
import { UploadRasterDataMultiple } from "./UploadRasterDataMultiple";

import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";
import inputStyles from "../../styles/Input.css";
import gridStyles from "../../styles/Grid.css";

class UploadRasterDataModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedFiles: [],
      rejectedFiles: [],
      currentRaster: null
    };
  }

  componentDidMount() {
    const { match } = this.props;

    (async () => {
      const currentRaster = await fetch(`/api/v3/rasters/${match.params.id}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      this.setState({ currentRaster });
    })();
  }

  render() {
    return (
      <div>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1 }}>
            <h2 className={`mt-0 text-muted`}>Upload raster data</h2>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{}}
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={_ => {
                this.props.history.push("/data_management/rasters/");

                ////////////////////////////////////////
              }}
            >
              <FormattedMessage
                id="rasters.back_to_rasters"
                defaultMessage="Back to Raster list"
              />
            </button>
            <button
              style={
                this.state.currentRaster
                  ? { marginLeft: "10px" }
                  : { marginLeft: "10px", visibility: "hidden" }
              }
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={_ => {
                this.props.history.push(
                  "/data_management/rasters/" +
                    (this.state.currentRaster &&
                      this.state.currentRaster.uuid) +
                    "/"
                );

                ////////////////////////////////////////
              }}
            >
              <FormattedMessage
                id="rasters.back_to_rasters"
                defaultMessage="Back to Metadata"
              />
            </button>
          </div>
        </div>
        <div className={gridStyles.Row}>
          <div
            className={classNames(
              gridStyles.colMd3,
              gridStyles.colSm6,
              gridStyles.colXs6
            )}
          >
            <FormattedMessage
              id="rasters.data_for"
              defaultMessage="for raster"
            />
          </div>
          <div
            className={classNames(
              gridStyles.colMd6,
              gridStyles.colSm6,
              gridStyles.colXs6
            )}
          >
            <b>
              {(this.state.currentRaster && this.state.currentRaster.name) ||
                ""}
            </b>
          </div>
        </div>
        {this.state.currentRaster ? (
          <div>
            {/* {this.state.currentRaster.temporal === true ? (
              <UploadRasterDataMultiple
                currentRaster={this.state.currentRaster}
              />
            ) : (
              <UploadRasterDataSingle
                currentRaster={this.state.currentRaster}
              />
            )} */}
            <UploadRasterDataMultiple
              currentRaster={this.state.currentRaster}
            />
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              top: 50,
              height: 300,
              bottom: 50,
              marginLeft: "50%"
            }}
          >
            <MDSpinner size={24} />
          </div>
        )}
      </div>
    );
  }
}

const UploadRasterData = withRouter(connect()(UploadRasterDataModel));

export { UploadRasterData };
