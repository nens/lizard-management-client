import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import classNames from "classnames";
import Dropzone from "react-dropzone";
import styles from "./UploadRasterData.css";

class UploadRasterDataModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedFiles: [],
      rejectedFiles: []
    };
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    this.setState({
      acceptedFiles: this.state.acceptedFiles.concat(acceptedFiles),
      rejectedFiles: this.state.rejectedFiles.concat(rejectedFiles)
    });
  };

  render() {
    return (
      <div>
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
        {this.state.acceptedFiles.length === 0 ? (
          <h3>No files selected yet</h3>
        ) : (
          <h3>Selected files</h3>
        )}
        {this.state.acceptedFiles.map(e => <div key={e.name}>{e.name}</div>)}
        {this.state.rejectedFiles.length !== 0 ? (
          <h3>Following files could not be uploaded</h3>
        ) : null}
        {this.state.rejectedFiles.map(e => <div key={e.name}>{e.name}</div>)}
      </div>
    );
  }
}

const UploadRasterData = withRouter(connect()(UploadRasterDataModel));

export { UploadRasterData };
