import React from "react";
import { FormattedMessage } from "react-intl";
import { connect, useSelector } from "react-redux";
import { dismissNotification } from "../actions";
import { getNotifications } from "../reducers";
import styles from "./Snackbar.module.css";

interface PropsFromDispatch {
  dismiss: (idx: number) => void
};

// Generate different messages based on returned API status code
const generateMessage = (notification: number | string) => {
  if (typeof notification === 'number') {
    const status = notification;
    if (status === 201 || status === 200) {
      return "Success! Your data was uploaded successfully.";
    } else if (status.toString().startsWith('4')) {
      return `Error! Please check the form and your internet settings. Error code is ${status}`;
    } else if (status.toString().startsWith('5')) {
      return `Error! Please contact support. Error code is ${status}`;
    };
  } else {
    return notification;
  };
};

const Snackbar: React.FC<PropsFromDispatch> = (props) => {
  const notifications = useSelector(getNotifications);
  const { dismiss } = props;

  return (
    <div className={styles.SnackbarWrapper}>
      <div
        className={`${styles.Snackbar} ${notifications.length > 0
          ? styles.Show
          : styles.Hide}`}
      >
        <span className={styles.SnackbarMessage}>
          {generateMessage(notifications[notifications.length - 1]) || ""}
        </span>
        <div
          className={styles.DismissButton}
          onClick={() => dismiss(notifications.length - 1)}
        >
          <FormattedMessage
            id="components_snackbar.dismiss"
            defaultMessage="Dismiss"
          />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch: any) => ({
  dismiss: (idx: number) => dispatch(dismissNotification(idx))
});

export default connect(null, mapDispatchToProps)(Snackbar);
