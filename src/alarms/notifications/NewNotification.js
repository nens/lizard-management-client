import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MDSpinner from "react-md-spinner";

import { NotificationForm } from "./NotificationForm";

class NewNotificationModel extends Component {
  render() {
    if (
      this.props.organisations.isFetching === false
    ) {
      return <NotificationForm 
                wizardStyle={true}
            />;
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

const App = withRouter(connect(mapStateToProps)(NewNotificationModel));

export { App };
