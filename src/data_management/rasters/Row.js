import React, { Component } from "react";
import styles from "./Row.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return <div className={styles.Row}>{this.props.children}</div>;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    bootstrap: state.bootstrap
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

Row = withRouter(connect(mapStateToProps, mapDispatchToProps)(Row));

export { Row };
