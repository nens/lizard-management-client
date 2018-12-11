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

  // render() {
  //   return (
  //     <div>
  //       <div>
  //         <h2 className={`mt-0 text-muted`}>Upload raster data</h2>
  //       </div>
  //       <div className={gridStyles.Row}>
  //         <div
  //           className={classNames(
  //             gridStyles.colMd3,
  //             gridStyles.colSm6,
  //             gridStyles.colXs6
  //           )}
  //         >
  //           <FormattedMessage
  //             id="rasters.data for"
  //             defaultMessage="for raster with name"
  //           />
  //         </div>
  //         <div
  //           className={classNames(
  //             gridStyles.colMd6,
  //             gridStyles.colSm6,
  //             gridStyles.colXs6
  //           )}
  //         >
  //           <b>
  //             {(this.state.currentRaster && this.state.currentRaster.name) ||
  //               ""}
  //           </b>
  //         </div>
  //       </div>
  //       {this.state.currentRaster ? (
  //         <div>{this.renderFileUpload()}</div>
  //       ) : (
  //         <div
  //           style={{
  //             position: "relative",
  //             top: 50,
  //             height: 300,
  //             bottom: 50,
  //             marginLeft: "50%"
  //           }}
  //         >
  //           <MDSpinner size={24} />
  //         </div>
  //       )}
  //     </div>
  //   );
  // }

  // renderDropZone() {
  //   if (this.state.currentRaster.temporal === true) {
  //     console.log("render for temporal");
  //     return (
  //       <Dropzone onDrop={this.onDrop}>
  //         {({ getRootProps, getInputProps, isDragActive }) => {
  //           return (
  //             <div
  //               {...getRootProps()}
  //               className={classNames(
  //                 "dropzone",
  //                 { "dropzone--isActive": isDragActive },
  //                 styles.UploadBox
  //               )}
  //             >
  //               <input {...getInputProps()} />
  //               {/* {
  //               isDragActive ?
  //                 <p>Drop files here...</p> :
  //                 <div>
  //                   <p>Try dropping some files here</p>
  //                   <button>Browse</button>
  //                 </div>
  //             } */}
  //               <p>Try dropping some files here</p>
  //               <button>Browse</button>
  //             </div>
  //           );
  //         }}
  //       </Dropzone>
  //     );

  //     );
  //   }
  // }

  // renderPostDropZone() {

  //   return (
  //     <div>
  //       {this.state.acceptedFiles.length === 0 &&
  //       this.state.currentRaster.temporal === true ? (
  //         <h3>No files selected yet</h3>
  //       ) : (
  //         <div>
  //           {this.state.acceptedFiles.length > 0 ? (
  //             <button
  //               className={`${buttonStyles.Button} ${buttonStyles.Success}`}
  //               style={{ marginTop: 10 }}
  //               onClick={e => {
  //                 var form = new FormData();
  //                 form.append("file", this.state.acceptedFiles[0]);
  //                 const url =
  //                   "/api/v4/rasters/" + this.props.match.params.id + "/data/";
  //                 const opts = {
  //                   credentials: "same-origin",
  //                   method: "POST",
  //                   headers: {
  //                     mimeType: "multipart/form-data"
  //                   },
  //                   body: form
  //                 };

  //                 fetch(url, opts)
  //                   .then(responseObj => responseObj.json())
  //                   .then(responseData => {
  //                     console.log(responseData);
  //                     this.props.history.push("/data_management/rasters/");
  //                   });
  //               }}
  //             >
  //               <FormattedMessage
  //                 id="rasters.upload_selected_file"
  //                 defaultMessage="Save"
  //               />
  //             </button>
  //           ) : null}
  //           {this.state.currentRaster.temporal === true ? (
  //             <div>
  //               <h3>Selected files</h3>
  //               {this.state.acceptedFiles.map(e => (
  //                 <div key={e.name}>{e.name}</div>
  //               ))}
  //             </div>
  //           ) : null}
  //         </div>
  //       )}
  //       {this.state.rejectedFiles.length !== 0 ? (
  //         <div
  //           style={{
  //             color: "red",
  //             marginTop: "10px"
  //           }}
  //         >
  //           <h3>
  //             <FormattedMessage
  //               id="rasters.files_unable_to_select"
  //               defaultMessage="Following files could not be selected"
  //             />
  //           </h3>
  //           {this.state.rejectedFiles.map(e => (
  //             <div key={e.name}>{e.name}</div>
  //           ))}
  //           {this.state.rejectedFiles.length > 1 &&
  //           this.state.currentRaster.temporal === false ? (
  //             <h3>
  //               <FormattedMessage
  //                 id="rasters.files_non_temporal_upload_multiple_files_not_allowed"
  //                 defaultMessage="For non-temporal rasters it is not possible to upload more than 1 file"
  //               />
  //             </h3>
  //           ) : (
  //             <h3>
  //               <FormattedMessage
  //                 id="rasters.file_selection_failed_unknown_reason"
  //                 defaultMessage="Reason not known"
  //               />
  //             </h3>
  //           )}
  //         </div>
  //       ) : null}
  //     </div>
  //   );
  // }

  // renderFileUpload() {
  //   return (
  //     <div>
  //       {this.renderDropZone()}
  //       {this.renderPostDropZone()}
  //     </div>
  //   );
  // }
  render() {
    return <div />;
  }
}

const UploadRasterDataMultiple = withRouter(
  connect()(UploadRasterDataMultipleModel)
);

export { UploadRasterDataMultiple };
