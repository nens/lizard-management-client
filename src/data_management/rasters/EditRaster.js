import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import { RasterForm } from "./RasterForm";

class EditRasterModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRaster: null
    };
  }

  componentDidMount() {
    const { match } = this.props;
    console.log(match.params.id);

    (async () => {
      const currentRaster = await fetch(`/api/v3/rasters/${match.params.id}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      console.log("currentRaster", currentRaster);

      this.setState({ currentRaster });
    })();
  }

  render() {
    if (this.state.currentRaster)
      return <RasterForm currentRaster={this.state.currentRaster} />;
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
}

const EditRaster = withRouter(connect()(EditRasterModel));

export { EditRaster };
