import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import { WmsLayerForm } from "./WmsLayerForm";

class ViewWmsLayerModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWmsLayer: null
    };
  }

  componentDidMount() {
    const { match } = this.props;

    (async () => {
      const currentWmsLayer = await fetch(`/api/v3/wmslayers/${match.params.id}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      this.setState({ currentWmsLayer });
    })();
  }

  render() {
    if (
      this.state.currentWmsLayer
    ) {
      return <WmsLayerForm 
        currentWmsLayer={this.state.currentWmsLayer}
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
  };
};

const ViewWmsLayer = withRouter(connect(mapStateToProps)(ViewWmsLayerModel));

export { ViewWmsLayer };
