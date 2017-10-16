import React, { Component } from "react";
// import MDSpinner from "react-md-spinner";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
// import pluralize from "pluralize";
import { connect } from "react-redux";
// import styles from "./App.css";
import { withRouter } from "react-router-dom";

class App extends Component {
  componentDidMount() {
  }
  render() {

    return (
      <div className="container">
        <div
          className="row align-items-center"
          style={{
            padding: "0 0 25px 0",
            borderBottom: "1px solid #bababa"
          }}
        >
          Test
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
