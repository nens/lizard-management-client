import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import classNames from "classnames";
import Dropzone from "react-dropzone";
import styles from "./UploadRasterData.css";
import { FormattedMessage } from "react-intl";

import ClearInputButton from "../../components/ClearInputButton.js";

import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";
import inputStyles from "../../styles/Input.css";
import gridStyles from "../../styles/Grid.css";

class UploadRasterDataSingleModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedFiles: [],
      rejectedFiles: []
    };
  }

  onDropSingle = (acceptedFiles, rejectedFiles) => {
    const newAcceptedFiles =
      (acceptedFiles.length === 1 && acceptedFiles) || this.state.acceptedFiles;

    this.setState({
      acceptedFiles: newAcceptedFiles,
      rejectedFiles: rejectedFiles
    });
  };

  render() {
    return (
      <div>
        {this.renderDropZone()}
        {this.renderPostDropZone()}
      </div>
    );
  }

  renderDropZone() {
    console.log("render for single");
    return (
      <Dropzone onDrop={this.onDropSingle} multiple={false} accept="image/tiff">
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <div
              {...getRootProps()}
              className={classNames(
                styles.DropZoneContainer,
                "dropzone",
                { "dropzone--isActive": isDragActive },
                styles.UploadBox
              )}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <h4 className={styles.GreyedText}>
                  <FormattedMessage
                    id="rasters.file_dropping"
                    defaultMessage="Drop files here..."
                  />
                </h4>
              ) : (
                <div>
                  {this.state.acceptedFiles.length === 0 ? (
                    <div>
                      <h3>
                        <FormattedMessage
                          id="rasters.drop_file_here"
                          defaultMessage="Drop single file"
                        />
                      </h3>
                      <h4 className={styles.GreyedText}>
                        <FormattedMessage
                          id="rasters.no_file_selected"
                          defaultMessage="No file selected yet"
                        />
                      </h4>
                    </div>
                  ) : (
                    <div>
                      <h3>Selected file</h3>
                      {this.state.acceptedFiles.map(e => (
                        <div className={gridStyles.Row} key={e.name}>
                          <div
                            className={classNames(
                              gridStyles.colMd9,
                              gridStyles.colSm9,
                              gridStyles.colXs6
                            )}
                          >
                            {e.name}
                          </div>
                          <div
                            className={classNames(
                              gridStyles.colMd3,
                              gridStyles.colSm3,
                              gridStyles.colXs3
                            )}
                          >
                            <div
                              // className={this.props.className}
                              onClick={e => {
                                this.setState({ acceptedFiles: [] });
                                e.stopPropagation();
                              }}
                            >
                              <i className={`material-icons`}>clear</i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                    style={{ marginTop: 10 }}
                  >
                    <FormattedMessage
                      id="rasters.raster_upload_browse"
                      defaultMessage="Browse"
                    />
                  </button>
                  {/* this input field is preferred for styling but can currently npot get is to work with preventdefault */}
                  {/* <input
                      type="file"
                      id="upload-raster-button"
                      onClick={e=>{e.preventDefault()}}
                      onChange={e => this.validateAndSaveToParent(e.target.value)}
                      value={this.state.filePath}
                      accept=".tiff,.tif,.geotiff,.geotiff"
                    /> */}
                </div>
              )}
            </div>
          );
        }}
      </Dropzone>
    );
  }

  renderPostDropZone() {
    return (
      <div>
        <div>
          {this.state.acceptedFiles.length > 0 ? (
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              style={{ marginTop: 10 }}
              onClick={e => {
                var form = new FormData();
                form.append("file", this.state.acceptedFiles[0]);
                const url =
                  "/api/v4/rasters/" + this.props.currentRaster.uuid + "/data/";
                const opts = {
                  credentials: "same-origin",
                  method: "POST",
                  headers: {
                    mimeType: "multipart/form-data"
                  },
                  body: form
                };

                fetch(url, opts)
                  .then(responseObj => responseObj.json())
                  .then(responseData => {
                    console.log(responseData);
                    this.props.history.push("/data_management/rasters/");
                  });
              }}
            >
              <FormattedMessage
                id="rasters.upload_selected_file"
                defaultMessage="Save"
              />
            </button>
          ) : null}
        </div>

        {this.state.rejectedFiles.length !== 0 ? (
          <div
            style={{
              color: "red",
              marginTop: "10px"
            }}
          >
            <h3>
              <FormattedMessage
                id="rasters.files_unable_to_select"
                defaultMessage="Following files could not be selected"
              />
            </h3>

            {this.state.rejectedFiles.map((e, i) => (
              <div className={gridStyles.Row} key={e.name}>
                <div
                  className={classNames(
                    gridStyles.colMd9,
                    gridStyles.colSm9,
                    gridStyles.colXs6
                  )}
                >
                  {e.name}
                </div>
                <div
                  className={classNames(
                    gridStyles.colMd3,
                    gridStyles.colSm3,
                    gridStyles.colXs3
                  )}
                >
                  <div
                    // className={this.props.className}
                    onClick={e => {
                      const rejectedFiles = this.state.rejectedFiles;
                      const newRejectedFiles = rejectedFiles.filter(
                        (e, iLoc) => i !== iLoc
                      );
                      this.setState({ rejectedFiles: newRejectedFiles });
                    }}
                  >
                    <i className={`material-icons`}>clear</i>
                  </div>
                </div>
              </div>
            ))}

            {this.state.rejectedFiles.length > 1 ? (
              <h3>
                <FormattedMessage
                  id="rasters.files_non_temporal_upload_multiple_files_not_allowed"
                  defaultMessage="For non-temporal rasters it is not possible to upload more than 1 file"
                />
              </h3>
            ) : (this.state.rejectedFiles[0].name + "").indexOf(
              ".tiff",
              (this.state.rejectedFiles[0].name + "").length - ".tiff".length
            ) === -1 ? (
              <h3>
                <FormattedMessage
                  id="rasters.file_selection_not_tiff"
                  defaultMessage="Only .tiff files are valid"
                />
              </h3>
            ) : (
              <h3>
                <FormattedMessage
                  id="rasters.file_selection_failed_unknown_reason"
                  defaultMessage="Reason not known"
                />
              </h3>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

const UploadRasterDataSingle = withRouter(
  connect()(UploadRasterDataSingleModel)
);

export { UploadRasterDataSingle };
