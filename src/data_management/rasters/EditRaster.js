import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import { RasterForm } from "./RasterForm";
import { fetchRasterV4 } from "../../api/rasters";

class EditRasterModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRaster: null
    };
  }

  componentDidMount() {
    const { match } = this.props;

    (async () => {
      const currentRaster = await fetchRasterV4(match.params.id);
      this.setState({ currentRaster });
    })();
  }

  render() {
    if (
      this.state.currentRaster &&
      this.props.organisations.isFetching === false &&
      this.props.observationTypes.isFetching === false &&
      this.props.colorMaps.isFetching === false &&
      this.props.supplierIds.isFetching === false
    ) {
      return <RasterForm 
        currentRaster={this.state.currentRaster}
        wizardStyle={false} 
      />;
    }
    else {
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
}

const mapStateToProps = (state) => {
  return {
    organisations: state.organisations,
    observationTypes: state.observationTypes,
    colorMaps: state.colorMaps,
    supplierIds: state.supplierIds
  };
};

const EditRaster = withRouter(connect(mapStateToProps)(EditRasterModel));

export { EditRaster };
