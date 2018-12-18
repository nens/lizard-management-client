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
      rejectedFiles: [],
      saveAllButtonBusy: false
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

  filesArrayContainsFile(files, file) {
    return files.some(oneFile => this.filesAreEqual(oneFile, file));
  }

  filesAreEqual(a, b) {
    return a.name === b.name && a.size === b.size;
  }

  getFileClientsideRejectionReason(file) {
    var acceptedFiles = this.state.acceptedFiles.map(e => e.file);

    if (this.filesArrayContainsFile(acceptedFiles, file)) {
      return (
        <FormattedMessage
          id="rasters.file_already_selected"
          defaultMessage="A file with this name and size was already selected"
        />
      );
    } else if (!file.name.endsWith(".tif")) {
      return (
        <FormattedMessage
          id="rasters.file_selection_not_tiff"
          defaultMessage="Only .tif files are valid"
        />
      );
    } else {
      return (
        <FormattedMessage
          id="rasters.file_selection_failed_unknown_reason"
          defaultMessage="Reason not known"
        />
      );
    }
  }

  sendAcceptedFilesRecursive(filesToSend) {
    // end recursion if filesToSend is empty array
    if (filesToSend.length === 0) {
      this.setState({ saveAllButtonBusy: false });
      console.log("sendAcceptedFilesRecursive stop recursion");
      return;
    } else {
      this.setState({ saveAllButtonBusy: true });
    }

    const e = filesToSend.shift();
    // skip this file if any of the following is true
    if (
      !e ||
      !this.isValidDateObj(e.dateTime) ||
      (e.sendingState !== "NOT_SEND" && e.sendingState !== "FAILED")
    ) {
      console.log("sendAcceptedFilesRecursive skip file", e);
      this.sendAcceptedFilesRecursive(filesToSend);
      return;
    }

    // else proceed sending the file
    // first mark file as "SEND"
    const acceptedFilesMarkedSend = this.state.acceptedFiles.map(oldE => {
      // if (e.file.size === oldE.file.size && e.file.name === oldE.file.name) {
      if (this.filesAreEqual(e.file, oldE.file)) {
        oldE.sendingState = "SEND";
        return oldE;
      } else {
        return oldE;
      }
    });
    this.setState({ acceptedFiles: acceptedFilesMarkedSend });

    var form = new FormData();
    form.append("file", e.file);
    if (this.props.currentRaster.temporal === true) {
      form.append("timestamp", e.dateTime.toISOString());
    }
    const url = "/api/v4/rasters/" + this.props.match.params.id + "/data/";
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
        console.log("responseData post raster", responseData);

        const newAcceptedFiles = this.state.acceptedFiles.map(oldE => {
          // if (
          //   e.file.size === oldE.file.size &&
          //   e.file.name === oldE.file.name
          // ) {
          if (this.filesAreEqual(e.file, oldE.file)) {
            console.log("responseData", responseData);
            if (responseData.status === 400) {
              oldE.sendingState = "FAILED";
              oldE.sendingMessage = responseData.detail;
            } else {
              oldE.sendingState = "SERVER_RECEIVED";
            }
            return oldE;
          } else {
            return oldE;
          }
        });

        this.setState({ acceptedFiles: newAcceptedFiles });

        // continue with next file
        console.log("response received, go to next file", e);
        this.sendAcceptedFilesRecursive(filesToSend);
      });
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const oldAcceptedFiles = this.state.acceptedFiles.map(e => e.file);

    // ensure newAcceptedFilesNonDuplicates are unique by name and size (not yet in oldacceptedfiles)
    const newAcceptedFilesNonDuplicates = acceptedFiles.filter(file => {
      return !this.filesArrayContainsFile(oldAcceptedFiles, file);
    });
    const duplicateFiles = acceptedFiles.filter(file => {
      return this.filesArrayContainsFile(oldAcceptedFiles, file);
    });

    const concatedRejectedFiles = rejectedFiles.concat(duplicateFiles);
    const rejectedFilesPlusReason = concatedRejectedFiles.map(file => {
      return {
        file: file,
        reason: this.getFileClientsideRejectionReason(file)
      };
    });

    // convert acceptedFilesToobjectsWithDate
    const acceptedFilesData = newAcceptedFilesNonDuplicates.map(e => {
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
      rejectedFiles: this.state.rejectedFiles.concat(rejectedFilesPlusReason)
    });
  };

  render() {
    const showSaveButton =
      this.state.acceptedFiles.filter(e => {
        if (
          (e.sendingState === "NOT_SEND" || e.sendingState === "FAILED") &&
          this.isValidDateObj(e.dateTime)
        ) {
          return true;
        } else {
          return false;
        }
      }).length !== 0 && this.state.saveAllButtonBusy === false;

    return (
      <div>
        {this.renderDropZone(showSaveButton)}
        {this.renderPostDropZone(showSaveButton)}
      </div>
    );
  }

  renderDropZone() {
    return (
      <Dropzone onDrop={this.onDrop} accept="image/tiff">
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

  renderPostDropZone(showSaveButton) {
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

            {this.state.rejectedFiles.map((e, i) => (
              <div className={gridStyles.Row} key={e.name}>
                <div
                  className={classNames(
                    gridStyles.colMd5,
                    gridStyles.colSm5,
                    gridStyles.colXs5
                  )}
                >
                  {e.file.name}
                </div>
                <div
                  className={classNames(
                    gridStyles.colMd5,
                    gridStyles.colSm5,
                    gridStyles.colXs5
                  )}
                >
                  {e.reason}
                </div>
                <div
                  className={classNames(
                    gridStyles.colMd2,
                    gridStyles.colSm2,
                    gridStyles.colXs2
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

            {/* {this.state.rejectedFiles.length > 1 ? (
              <h3>
                <FormattedMessage
                  id="rasters.files_non_temporal_upload_multiple_files_not_allowed"
                  defaultMessage="For non-temporal rasters it is not possible to upload more than 1 file"
                />
              </h3>
            ) : null} */}
            {/* {(this.state.rejectedFiles[0].name + "").indexOf(
              ".tif",
              (this.state.rejectedFiles[0].name + "").length - ".tiff".length
            ) === -1 ? (
              <h3>
                <FormattedMessage
                  id="rasters.file_selection_not_tiff"
                  defaultMessage="Only .tiff files are valid"
                />
              </h3>
            ) : null} */}
            {/* {(
              <h3>
                <FormattedMessage
                  id="rasters.file_selection_failed_unknown_reason"
                  defaultMessage="Reason not known"
                />
              </h3>
            )} */}
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
              {this.state.acceptedFiles.length > 0 ? (
                <h3>
                  <FormattedMessage
                    id="rasters.upload_selected_files"
                    defaultMessage="Selected files"
                  />
                </h3>
              ) : null}
              {this.state.acceptedFiles.map((e, i) => (
                <div
                  key={e.file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    flexFlow: "row nowrap",
                    justifyContent: "space-between",
                    height: "60px"
                  }}
                >
                  <div style={{ flex: 2 }}>{e.file.name}</div>
                  {this.props.currentRaster.temporal === true ? (
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
                      {!this.isValidDateObj(e.dateTime) ? (
                        <span style={{ color: "red" }}>Date not valid</span>
                      ) : null}
                    </div>
                  ) : null}
                  {/* <div style={{ flex: 1 }}>
                    <button
                      style={
                        (e.sendingState === "FAILED" ||
                          e.sendingState === "NOT_SEND") &&
                        this.isValidDateObj(e.dateTime)
                          ? {}
                          : { visibility: "hidden" }
                      }
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      onClick={eventClick => {
                        let acceptedFiles = this.state.acceptedFiles;
                        acceptedFiles[i].sendingState = "SEND";
                        this.setState({ acceptedFiles: acceptedFiles });

                        var form = new FormData();
                        form.append("file", e.file);
                        if (
                          this.props.currentRaster.temporal === true
                        ) {
                          form.append("timestamp", e.dateTime.toISOString());
                        }
                        
                        const url =
                          "/api/v4/rasters/" +
                          this.props.match.params.id +
                          "/data/";
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
                            console.log(
                              "responseData post raster",
                              responseData
                            );
                            // this.props.history.push("/data_management/rasters/");

                            const newAcceptedFiles = this.state.acceptedFiles.map(
                              oldE => {
                                if (
                                  e.file.size === oldE.file.size &&
                                  e.file.name === oldE.file.name
                                ) {
                                  console.log("responseData", responseData);
                                  if (responseData.status == 400) {
                                    oldE.sendingState = "FAILED";
                                    oldE.sendingMessage = responseData.detail;
                                  } else {
                                    oldE.sendingState = "SERVER_RECEIVED";
                                  }
                                  return oldE;
                                } else {
                                  return oldE;
                                }
                              }
                            );

                            this.setState({ acceptedFiles: newAcceptedFiles });
                          });
                      }}
                    >
                      <FormattedMessage
                        id="rasters.upload_selected_file"
                        defaultMessage="Save"
                      />
                    </button>
                  </div> */}
                  <div style={{ flex: 2, marginLeft: "10px" }}>
                    {e.sendingState === "SEND" ? <MDSpinner /> : null}
                    {/* {e.sendingState === "NOT_SEND" ? <MDSpinner /> : e.sendingState} */}
                    {e.sendingState === "SERVER_RECEIVED" ? (
                      <span style={{ color: "green" }}>
                        <FormattedMessage
                          id="rasters.selected_file_succesfully uploaded"
                          defaultMessage="File succesfully uploaded to server"
                        />
                      </span>
                    ) : null}
                    {e.sendingState === "FAILED" ? (
                      <span style={{ color: "red" }}>
                        <FormattedMessage
                          id="rasters.selected_file_failed_upload"
                          defaultMessage="File could not be uploaded"
                        />
                      </span>
                    ) : null}
                    {e.sendingState === "NOT_SEND" &&
                    this.state.saveAllButtonBusy === true ? (
                      <span style={{ color: "blue" }}>
                        <FormattedMessage
                          id="rasters.selected_file_in queue"
                          defaultMessage="File waiting to be uploaded"
                        />
                      </span>
                    ) : null}
                  </div>
                  <div style={{ flex: 1 }}>{e.sendingMessage}</div>
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

        <button
          style={showSaveButton ? {} : { visibility: "hidden" }}
          disabled={!showSaveButton}
          readOnly={!showSaveButton}
          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
          onClick={_ => {
            let acceptedFiles = this.state.acceptedFiles;

            this.sendAcceptedFilesRecursive(acceptedFiles.slice());

            ////////////////////////////////////////
          }}
        >
          <FormattedMessage
            id="rasters.upload_selected_file"
            defaultMessage="Save all files"
          />
        </button>
        <MDSpinner
          style={this.state.saveAllButtonBusy ? {} : { visibility: "hidden" }}
        />
      </div>
    );
  }
}

const UploadRasterDataMultiple = withRouter(
  connect()(UploadRasterDataMultipleModel)
);

export { UploadRasterDataMultiple };
