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

  onDrop = (acceptedFiles, rejectedFiles) => {
    // Do something with files
    this.setState({
      acceptedFiles: this.state.acceptedFiles.concat(acceptedFiles),
      rejectedFiles: this.state.rejectedFiles.concat(rejectedFiles)
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

  renderFileUpload() {
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
          <div>
            <button
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
              Upload selected files
            </button>
            <h3>Selected files</h3>
          </div>
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
