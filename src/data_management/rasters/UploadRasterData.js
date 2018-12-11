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
      console.log("currentRaster", currentRaster);
    })();
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    // event.stopPropagation()
    this.setState({
      acceptedFiles: this.state.acceptedFiles.concat(acceptedFiles),
      rejectedFiles: this.state.rejectedFiles.concat(rejectedFiles)
    });
  };

  onDropSingle = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    // event.stopPropagation()
    this.setState({
      acceptedFiles: acceptedFiles,
      rejectedFiles: rejectedFiles
    });
  };

  render() {
    if (this.state.currentRaster) return this.renderFileUpload();
    else
      return (
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
      );
  }

  renderDropZone() {
    if (this.state.currentRaster.temporal === true) {
      console.log("render for temporal");
      return (
        <Dropzone onDrop={this.onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => {
            return (
              <div
                {...getRootProps()}
                className={classNames(
                  "dropzone",
                  { "dropzone--isActive": isDragActive },
                  styles.UploadBox
                )}
              >
                <input {...getInputProps()} />
                {/* {
                isDragActive ?
                  <p>Drop files here...</p> :
                  <div>
                    <p>Try dropping some files here</p>
                    <button>Browse</button>
                  </div>
              } */}
                <p>Try dropping some files here</p>
                <button>Browse</button>
              </div>
            );
          }}
        </Dropzone>
      );
    } else {
      console.log("render for single");
      return (
        <Dropzone onDrop={this.onDropSingle} multiple={false}>
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
                            <div className={gridStyles.colSm9}>{e.name}</div>
                            <div className={gridStyles.colSm3}>
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
                  </div>
                )}
              </div>
            );
          }}
        </Dropzone>
        // </div>
      );
    }
  }

  renderPostDropZone() {
    return (
      <div>
        {this.state.acceptedFiles.length === 0 &&
        this.state.currentRaster.temporal === true ? (
          <h3>No files selected yet</h3>
        ) : (
          <div>
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              style={{ marginTop: 10 }}
              onClick={e => {
                var form = new FormData();
                form.append("file", this.state.acceptedFiles[0]);
                const url =
                  "/api/v4/rasters/" + this.props.match.params.id + "/data/";
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
                  });
              }}
            >
              <FormattedMessage
                id="rasters.upload_selected_file"
                defaultMessage="Save"
              />
            </button>
            {this.state.currentRaster.temporal === true ? (
              <div>
                <h3>Selected files</h3>
                {this.state.acceptedFiles.map(e => (
                  <div key={e.name}>{e.name}</div>
                ))}
              </div>
            ) : null}
          </div>
        )}
        {this.state.rejectedFiles.length !== 0 ? (
          <div
            style={{
              color: "red",
              marginTop: "10px"
            }}
          >
            <h3>Following files could not be uploaded</h3>
            {this.state.rejectedFiles.map(e => (
              <div key={e.name}>{e.name}</div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  renderFileUpload() {
    return (
      <div>
        <div>
          <h3 className={`mt-0 text-muted`}>
            Upload raster data for <b>{this.state.currentRaster.name}</b>
          </h3>
        </div>
        {this.renderDropZone()}
        {this.renderPostDropZone()}
      </div>
    );
  }
}

const UploadRasterData = withRouter(connect()(UploadRasterDataModel));

export { UploadRasterData };
