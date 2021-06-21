import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import WmsLayerForm from "./WmsLayerForm";

class NewWmsLayerModel extends Component {
  render() {
    if (
      this.props.organisations.isFetching === false
    ) {
      return <WmsLayerForm />;
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
    organisations: state.organisations
  };
};

const NewWmsLayer = withRouter(connect(mapStateToProps)(NewWmsLayerModel));

export { NewWmsLayer };
