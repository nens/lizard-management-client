import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { RasterForm } from "./RasterForm";

class NewRasterModel extends Component {
  render() {
    return <RasterForm />;
  }
}

const NewRaster = withRouter(connect()(NewRasterModel));

export { NewRaster };
