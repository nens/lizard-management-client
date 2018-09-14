import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { RasterForm } from "./RasterForm";

class EditRasterModel extends Component {
  render() {
    return <RasterForm />;
  }
}

const EditRaster = withRouter(connect()(EditRasterModel));

export { EditRaster };
