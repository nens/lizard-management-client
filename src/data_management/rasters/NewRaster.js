import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

// import { RasterForm } from "./RasterForm";
import RasterSourceForm from "./RasterSourceForm";

class NewRasterModel extends Component {
  render() {
    if (
      this.props.organisations.isFetching === false &&
      this.props.observationTypes.isFetching === false &&
      this.props.colorMaps.isFetching === false &&
      this.props.supplierIds.isFetching === false
    ) {
      return <RasterSourceForm />;
    } else {
      return <div
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
    }
    
  }
}

const mapStateToProps = (state) => {
  return {
    organisations: state.organisations,
    observationTypes: state.observationTypes,
    colorMaps: state.colorMaps,
    supplierIds: state.supplierIds
  };
};

const NewRaster = withRouter(connect(mapStateToProps)(NewRasterModel));

export { NewRaster };
