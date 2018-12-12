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

  // check for valid date
  // https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
  isValidDateObj(d) {
    if (Object.prototype.toString.call(d) === "[object Date]") {
      // it is a date
      if (isNaN(d.getTime())) {
        // d.valueOf() could also work
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // convert acceptedFilesToobjectsWithDate
    const acceptedFilesData = acceptedFiles.map(e => {
      const dateStrFromFile = (e.name + "").split(".")[0];
      const dateObjFromFile = new Date(dateStrFromFile);
      const fileDateValid = this.isValidDateObj(dateObjFromFile);
      return {
        file: e,
        dateTime: (fileDateValid && dateObjFromFile) || new Date(),
        sendingState: "NOT_SEND", // NOT_SEND, SEND, RECEIVED_BY_SERVER, FAILED
        sendingMessage: ""
      };
    });

    this.setState({
      acceptedFiles: this.state.acceptedFiles.concat(acceptedFilesData),
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

        {this.state.acceptedFiles.length === 0 &&
        this.props.currentRaster.temporal === true ? (
          // <h3>No files selected yet</h3>
          <div />
        ) : (
          <div>
            {this.state.acceptedFiles.length > 0
              ? // <button
                //   className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                //   style={{ marginTop: 10 }}
                //   onClick={e => {
                //     var form = new FormData();
                //     form.append("file", this.state.acceptedFiles[0].file);
                //     const url =
                //       "/api/v4/rasters/" + this.props.match.params.id + "/data/";
                //     const opts = {
                //       credentials: "same-origin",
                //       method: "POST",
                //       headers: {
                //         mimeType: "multipart/form-data"
                //       },
                //       body: form
                //     };

                //     fetch(url, opts)
                //       .then(responseObj => responseObj.json())
                //       .then(responseData => {
                //         console.log(responseData);
                //         this.props.history.push("/data_management/rasters/");
                //       });
                //   }}
                // >
                //   <FormattedMessage
                //     id="rasters.upload_selected_file"
                //     defaultMessage="Save"
                //   />
                // </button>
                null
              : null}
            <br />
            <div
              style={{
                marginTop: "10px"
              }}
            >
              <h3>Selected files</h3>
              {this.state.acceptedFiles.map((e, i) => (
                <div
                  key={e.file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    flexFlow: "row nowrap",
                    justifyContent: "space-between",
                    height: "45px"
                  }}
                >
                  <div style={{ flex: 1 }}>{e.file.name}</div>
                  <div style={{ flex: 1 }}>
                    <Datetime
                      value={e.dateTime}
                      onChange={e => {
                        let jsDate;
                        // if not valid date react-datetime returns string
                        if (typeof e === "string") {
                          console.log("received string from react-datetime");
                          jsDate = e;
                        } else {
                          // convert momentjs to js date
                          jsDate = e.toDate();
                        }
                        let acceptedFiles = this.state.acceptedFiles;
                        acceptedFiles[i].dateTime = jsDate;
                        this.setState({ acceptedFiles: acceptedFiles });
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <button
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      // style={{ marginTop: 10 }}
                      // onClick={e => {
                      //   var form = new FormData();
                      //   form.append("file", this.state.acceptedFiles[0].file);
                      //   const url =
                      //     "/api/v4/rasters/" + this.props.match.params.id + "/data/";
                      //   const opts = {
                      //     credentials: "same-origin",
                      //     method: "POST",
                      //     headers: {
                      //       mimeType: "multipart/form-data"
                      //     },
                      //     body: form
                      //   };

                      //   fetch(url, opts)
                      //     .then(responseObj => responseObj.json())
                      //     .then(responseData => {
                      //       console.log(responseData);
                      //       this.props.history.push("/data_management/rasters/");
                      //     });
                      // }}
                    >
                      <FormattedMessage
                        id="rasters.upload_selected_file"
                        defaultMessage="Save"
                      />
                    </button>
                  </div>
                  <div
                    style={{ flex: 1 }}
                    // className={this.props.className}
                    onClick={e => {
                      const acceptedFiles = this.state.acceptedFiles;
                      const newAcceptedFiles = acceptedFiles.filter(
                        (e, iLoc) => i !== iLoc
                      );
                      this.setState({ acceptedFiles: newAcceptedFiles });
                    }}
                  >
                    <i className={`material-icons`}>clear</i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const UploadRasterDataMultiple = withRouter(
  connect()(UploadRasterDataMultipleModel)
);

export { UploadRasterDataMultiple };
