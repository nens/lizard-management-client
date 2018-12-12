import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import classNames from "classnames";
import Dropzone from "react-dropzone";
import styles from "./UploadRasterData.css";
import { FormattedMessage } from "react-intl";

import formStyles from "../../styles/Forms.css";
import buttonStyles from "../../styles/Buttons.css";
import inputStyles from "../../styles/Input.css";
import gridStyles from "../../styles/Grid.css";
// // moment is required for datepicker
import moment from "moment";
import "moment/locale/nl";

// import {InputMoment} from 'react-input-moment';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

class UploadRasterDataMultipleModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedFiles: [],
      rejectedFiles: []
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    // event.stopPropagation()
    this.setState({
      acceptedFiles: this.state.acceptedFiles.concat(acceptedFiles),
      rejectedFiles: this.state.rejectedFiles.concat(rejectedFiles)
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
    return (
      <Dropzone onDrop={this.onDrop}>
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
                  <h3>
                    <FormattedMessage
                      id="rasters.drop_file_here"
                      defaultMessage="Drop Files here"
                    />
                  </h3>
                  {this.state.acceptedFiles.length === 0 ? (
                    <h4 className={styles.GreyedText}>
                      <FormattedMessage
                        id="rasters.no_file_selected"
                        defaultMessage="No file selected yet"
                      />
                    </h4>
                  ) : (
                    <div>
                      <h4>
                        {this.state.acceptedFiles.length + " "}
                        <FormattedMessage
                          id="rasters.no_file_selected"
                          defaultMessage="Files Selected"
                        />
                      </h4>
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
    );
  }

  renderPostDropZone() {
    return (
      <div>
        {this.state.acceptedFiles.length === 0 &&
        this.props.currentRaster.temporal === true ? (
          // <h3>No files selected yet</h3>
          <div />
        ) : (
          <div>
            {this.state.acceptedFiles.length > 0 ? (
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
            <br />
            <div
              style={{
                marginTop: "10px"
              }}
            >
              <h3>Selected files</h3>
              {this.state.acceptedFiles.map(e => (
                <div key={e.name}>
                  <div>{e.name}</div>
                  <div>
                    {/* <InputMoment
                      moment={moment}
                      onChange={e=>{true;}}
                      showSeconds={true}
                      locale="en"
                    /> */}
                    <Datetime />
                  </div>
                  <div
                    // className={this.props.className}
                    onClick={e => {
                      // this.setState({ acceptedFiles: [] });
                      // e.stopPropagation();
                    }}
                  >
                    <i className={`material-icons`}>clear</i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
            {this.state.rejectedFiles.map(e => (
              <div key={e.name}>{e.name}</div>
            ))}
            {this.state.rejectedFiles.length > 1 &&
            this.props.currentRaster.temporal === false ? (
              <h3>
                <FormattedMessage
                  id="rasters.files_non_temporal_upload_multiple_files_not_allowed"
                  defaultMessage="For non-temporal rasters it is not possible to upload more than 1 file"
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

const UploadRasterDataMultiple = withRouter(
  connect()(UploadRasterDataMultipleModel)
);

export { UploadRasterDataMultiple };
