import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import classNames from "classnames";
import Dropzone from "react-dropzone";
import styles from "./UploadRasterData.css";
import { FormattedMessage } from "react-intl";

import buttonStyles from "../../styles/Buttons.css";

// // moment is required for datepicker
// eslint-disable-next-line
import moment from "moment"; // do not remove, is needed for datepicker!
import "moment/locale/nl";

// import {InputMoment} from 'react-input-moment';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Scrollbars } from "react-custom-scrollbars";

import Overlay from "../../components/Overlay";
import { uploadRasterFile } from "../../api/rasters";

class UploadRasterDataMultipleModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedFiles: [],
      rejectedFiles: [],
      saveAllButtonBusy: false,
      showOverlayAreYouSureToSaveFiles: false,
      showOverlayFilesSendToServer: false
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
    } else if (
      !file.name.toLowerCase().endsWith(".tif") ||
      !file.name.toLowerCase().endsWith(".tiff") ||
      !file.name.toLowerCase().endsWith(".geotiff")
    ) {
      return (
        <FormattedMessage
          id="rasters.file_selection_not_tiff"
          defaultMessage="Only .tif .tiff or .geotiff files are valid"
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
      this.setState({
        saveAllButtonBusy: false,
        showOverlayFilesSendToServer: true
      });
      console.log("sendAcceptedFilesRecursive stop recursion");
      return;
    }

    // else {
    //   this.setState({ saveAllButtonBusy: true });
    // }

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

    uploadRasterFile(
      this.props.match.params.id,
      e.file,
      this.props.currentRaster.temporal ? e.dateTime : undefined).then(responseData => {
        console.log("responseData post raster", responseData);

        const newAcceptedFiles = this.state.acceptedFiles.map(oldE => {
          if (this.filesAreEqual(e.file, oldE.file)) {
            console.log("responseData", responseData);
            if (responseData.status === 400) {
              oldE.sendingState = "FAILED";
              oldE.sendingMessage = responseData.detail;
              oldE.url = responseData.url;
            } else {
              oldE.url = responseData.url;
              oldE.sendingState = "SERVER_RECEIVED";
            }
            return oldE;
          } else {
            return oldE;
          }
        });

        this.setState({ acceptedFiles: newAcceptedFiles });

        // continue with next file
        if (this.state.saveAllButtonBusy === true) {
          console.log("response received, go to next file", e);
          this.sendAcceptedFilesRecursive(filesToSend);
          return;
        } else {
          console.log("response received, but actions aborted abort");
          return;
        }
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
      const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/gm;
      const regexUTC = /\d{8}T(\d{4}|\d{6})?/gm;
      const dateStrFromFile = (e.name + "").match(regex);
      
      //If user upload a file with file name in UTC format without the dash (-) sign then match it with regexUTC
      const dateStrFromUTCFile = (e.name + "").match(regexUTC);
      //Use moment.js to re-format the date string from YYYYMMDDTHHMM to YYYY-MM-DDTHH:MM
      const dateStrReformatted = dateStrFromUTCFile && moment(dateStrFromUTCFile[0]).format("YYYY-MM-DDTHH:mm")

      let dateObjFromFile;
      if (dateStrFromFile) {
        dateObjFromFile = new Date(dateStrFromFile[0])
      } else if (dateStrReformatted) {
        dateObjFromFile = new Date(dateStrReformatted)
      } else {
        dateObjFromFile = new Date()
      };

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
        {/* {this.state.showOverlayAreYouSureToSaveFiles
          ? this.renderOverLayAreYouSureToSaveFiles()
          : null}
        {this.state.showOverlayFilesSendToServer
          ? this.renderOverLayFilesSendToServer()
          : null} */}
        {this.renderDropZone(showSaveButton)}
        {this.renderPostDropZone(showSaveButton)}
      </div>
    );
  }

  renderOverLayAreYouSureToSaveFiles = () => {
    return (
      <Overlay
        handleClose={e =>
          this.setState({ showOverlayAreYouSureToSaveFiles: false })}
      >
        <h3>
          <FormattedMessage
            id="rasters.are_you_sure_about_uploading_files"
            defaultMessage="Are you sure about uploading the selected files?"
          />
        </h3>

        <div style={{ marginTop: "10px" }}>
          <span>
            <FormattedMessage
              id="rasters.overwriting_data_cannot_be_undone"
              defaultMessage="Please beware that the changes you are about to post to the database cannot be undone"
            />
            <FormattedMessage
              id="rasters.please_review_files_to_upload"
              defaultMessage="Please only proceed if you carefully review all the files you are about to upload."
            />
            <FormattedMessage
              id="rasters.proceed_file_upload_by_typing_upload"
              defaultMessage="Proceed by typing 'upload' in the field below"
            />
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "10px"
          }}
        >
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
              this.props.currentRaster
                ? { marginLeft: "10px" }
                : { marginLeft: "10px", visibility: "hidden" }
            }
            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
            onClick={_ => {
              this.props.history.push(
                "/data_management/rasters/" +
                  (this.props.currentRaster && this.props.currentRaster.uuid) +
                  "/"
              );

              ////////////////////////////////////////
            }}
          >
            <FormattedMessage
              id="rasters.back_to_raster_metadata"
              defaultMessage="Back to Metadata"
            />
          </button>
        </div>
      </Overlay>
    );
  };

  renderOverLayFilesSendToServer = () => {
    return (
      <Overlay
        handleClose={e =>
          this.setState({ showOverlayFilesSendToServer: false })}
      >
        <h3>
          <FormattedMessage
            id="rasters.following_files_upload_succes"
            defaultMessage="Following files where succesfully uploaded"
          />
        </h3>

        <div style={{ marginTop: "10px" }}>
          {this.state.acceptedFiles
            .filter(fileObj => fileObj.sendingState === "SERVER_RECEIVED")
            .map(fileObj => (
              <div key={fileObj.file.name + fileObj.file.size}>
                <div>{fileObj.file.name}</div>
                <div>
                  <a
                    href={fileObj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage
                      id="rasters.click_to_url_upload_task"
                      defaultMessage="Show asynchronous task"
                    />
                  </a>
                </div>
              </div>
            ))}
        </div>
        <div style={{ marginTop: "10px" }}>
          <span>
            <FormattedMessage
              id="rasters.uploading_takes_additional_time_on_server"
              defaultMessage="Please keep in mind that it might take a while before your changes are committed to the database."
            />
            <FormattedMessage
              id="rasters.check_url_for_progress_file_upload"
              defaultMessage="The urls behind the files can show the progress for each file."
            />
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "10px"
          }}
        >
          <button
            style={{}}
            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
            onClick={_ => {
              this.props.history.push("/data_management/rasters/");
            }}
          >
            <FormattedMessage
              id="rasters.back_to_rasters"
              defaultMessage="Back to Raster list"
            />
          </button>
          <button
            style={
              this.props.currentRaster
                ? { marginLeft: "10px" }
                : { marginLeft: "10px", visibility: "hidden" }
            }
            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
            onClick={_ => {
              this.props.history.push(
                "/data_management/rasters/" +
                  (this.props.currentRaster && this.props.currentRaster.uuid) +
                  "/"
              );
            }}
          >
            <FormattedMessage
              id="rasters.back_to_raster_metadata"
              defaultMessage="Back to Metadata"
            />
          </button>
        </div>
      </Overlay>
    );
  };

  renderDropZone() {
    return (
      <div style={this.state.saveAllButtonBusy ? { visibility: "hidden" } : {}}>
        <Dropzone onDrop={this.onDrop} accept={["image/tiff", ".geotiff"]}>
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
                            id="rasters.files_selected"
                            defaultMessage="Files Selected"
                          />
                        </h4>
                      </div>
                    )}

                    <button
                      className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                      style={{ marginTop: 10 }}
                      title="Timestamp filename format could be YYYY-MM-DDTHH:MM(:SS) or YYYYMMDDTHHMM(SS) with name prefixed or postfixed"
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
      </div>
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

            <div
              style={{
                borderBottom: "2px solid #ccc",
                borderTop: "2px solid #ccc"
              }}
            >
              <Scrollbars
                autoHeight
                autoHeightMin={"0rem"}
                autoHeightMax={"20rem"}
              >
                <table
                  style={{
                    width: "100%"
                  }}
                >
                  <tbody>
                    {this.state.rejectedFiles.map((e, i) => (
                      <tr
                        style={{
                          height: "3.5rem",
                          borderTop:
                            i === 0 ? "0px solid #ccc" : "1px solid #ccc"
                        }}
                        key={e.file.name + e.file.size}
                      >
                        <td
                          style={{
                            width: "40%",
                            padding: "1rem"
                          }}
                        >
                          {e.file.name}
                        </td>
                        <td
                          style={{
                            width: "40%",
                            padding: "1rem"
                          }}
                        >
                          {e.reason}
                        </td>
                        <td
                          style={{
                            width: "40%",
                            padding: "1rem",
                            verticalAlign: "center"
                          }}
                        >
                          <div
                            onClick={e => {
                              const rejectedFiles = this.state.rejectedFiles;
                              const newRejectedFiles = rejectedFiles.filter(
                                (e, iLoc) => i !== iLoc
                              );
                              this.setState({
                                rejectedFiles: newRejectedFiles
                              });
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end"
                            }}
                          >
                            <i className={`material-icons`}>clear</i>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Scrollbars>
            </div>
          </div>
        ) : null}

        {this.state.acceptedFiles.length === 0 &&
        this.props.currentRaster.temporal === true ? (
          // <h3>No files selected yet</h3>
          <div />
        ) : (
          <div>
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
              {/* scrollbars have problem with datepicker namely that the datepicker falls underneath the scroll */}
              {/* <Scrollbars autoHeight autoHeightMin={0} autoHeightMax={600}> */}
              {this.state.acceptedFiles.map((e, i) => (
                <div
                  key={e.file.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    flexFlow: "row nowrap",
                    justifyContent: "space-between",
                    minHeight: "60px",
                    padding: "13px",
                    borderBottom: "1px solid #ccc",
                    borderTop: i === 0 ? "1px solid #ccc" : "0px solid #ccc"
                  }}
                >
                  <div
                    style={{
                      flex: "2 0 0",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {e.file.name}
                  </div>
                  {this.props.currentRaster.temporal === true ? (
                    <div style={{ flex: 1 }}>
                      <Datetime
                        value={e.dateTime}
                        onChange={event_ => {
                          let jsDate;
                          // if not valid date react-datetime returns string
                          if (typeof event_ === "string") {
                            console.log("received string from react-datetime");
                            jsDate = event_;
                          } else {
                            // convert momentjs to js date
                            jsDate = event_.toDate();
                          }
                          let acceptedFiles = this.state.acceptedFiles;
                          acceptedFiles[i].dateTime = jsDate;
                          this.setState({ acceptedFiles: acceptedFiles });
                        }}
                        inputProps={
                          this.state.saveAllButtonBusy ||
                          e.sendingState === "SERVER_RECEIVED"
                            ? { readOnly: true }
                            : {}
                        }
                        open={
                          this.state.saveAllButtonBusy ||
                          e.sendingState === "SERVER_RECEIVED"
                            ? false
                            : undefined
                        }
                      />
                      {!this.isValidDateObj(e.dateTime) ? (
                        <span style={{ color: "red" }}>Date not valid</span>
                      ) : null}
                    </div>
                  ) : null}
                  <div style={{ flex: 2, marginLeft: "10px" }}>
                    {e.sendingState === "SEND" ? (
                      <div>
                        <FormattedMessage
                          id="rasters.selected_file_busy_uploading"
                          defaultMessage="File busy being uploaded"
                        />
                        <MDSpinner />
                      </div>
                    ) : null}
                    {e.sendingState === "NOT_SEND" &&
                    this.state.saveAllButtonBusy === false ? (
                      <FormattedMessage
                        id="rasters.selected_file_ready_to_send"
                        defaultMessage="file selected, ready to upload"
                      />
                    ) : null}
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
                          defaultMessage="File could not be uploaded, maybe try once more"
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
                  <div style={{ flex: 1 }}>
                    {e.url ? (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {" "}
                        <FormattedMessage
                          id="rasters.click_to_url_upload_task"
                          defaultMessage="Show asynchronous task"
                        />
                      </a>
                    ) : (
                      <span>{e.sendingMessage}</span>
                    )}
                  </div>

                  <div
                    style={
                      this.state.saveAllButtonBusy
                        ? {
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            visibility: "hidden"
                          }
                        : {
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end"
                          }
                    }
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
              {/* scrollbars have problem with datepicker namely that the datepicker falls underneath the scroll */}
              {/* </Scrollbars> */}
            </div>
          </div>
        )}

        <button
          style={
            showSaveButton
              ? {
                  marginRight: "10px",
                  marginTop: "10px",
                  marginBottom: "100px"
                } // MARGIN BOTTOM TO PUSH PAGE END DOWN SO DATEPICKER DOES NOT GET OF PAGE...
              : { display: "none" }
          }
          disabled={!showSaveButton}
          readOnly={!showSaveButton}
          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
          onClick={_ => {
            let acceptedFiles = this.state.acceptedFiles;

            this.setState({
              saveAllButtonBusy: true,
              showOverlayAreYouSureToSaveFiles: true
            });
            this.sendAcceptedFilesRecursive(acceptedFiles.slice());

            ////////////////////////////////////////
          }}
        >
          <FormattedMessage
            id="rasters.upload_selected_file"
            defaultMessage="Save all files"
          />
        </button>
        <button
          style={
            this.state.saveAllButtonBusy
              ? { marginRight: "10px", marginTop: "10px" }
              : { display: "none" }
          }
          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
          onClick={_ => {
            this.setState({ saveAllButtonBusy: false });
          }}
        >
          <FormattedMessage
            id="rasters.upload_abort_selected_file"
            defaultMessage="Abort"
          />
        </button>
      </div>
    );
  }
}

const UploadRasterDataMultiple = withRouter(
  connect()(UploadRasterDataMultipleModel)
);

export { UploadRasterDataMultiple };
