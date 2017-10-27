import React, { Component } from "react";
import { connect } from "react-redux";
import { dismissNotification } from "../actions";

import styles from "./Snackbar.css";

class Snackbar extends Component {
  render() {
    const { notifications } = this.props.notifications;
    const { dismiss } = this.props;
    return (
      <div className={styles.SnackbarWrapper}>
        <div
          className={`${styles.Snackbar} ${notifications.length > 0
            ? styles.Show
            : styles.Hide}`}
        >
          {notifications[notifications.length - 1] || ""}
          <div
            className={styles.DismissButton}
            onClick={() => dismiss(notifications.length - 1)}
          >
            dismiss
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dismiss: idx => dispatch(dismissNotification(idx))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
