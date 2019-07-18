import buttonStyles from "../../styles/Buttons.css";
import React, { Component } from "react";
import styles from "./AlarmRow.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter, NavLink } from "react-router-dom";

class AlarmRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      isActive: props.alarm.active
    };
  }

  render() {
    const { alarm } = this.props;
    const { isActive } = this.state;
    const numberOfThresholds = alarm.thresholds.length;
    const numberOfRecipients = alarm.messages.length;
    return (
      <div className={styles.AlarmRow}>
        <div style={{ display: "flex" }}>
          <div
            className={`${isActive
              ? styles.Active
              : styles.InActive} ${styles.ActiveIndicator}`}
          >
            {isActive ? (
              <FormattedMessage
                id="notifications_app.is_active"
                defaultMessage="ACTIVE"
              />
            ) : (
              <FormattedMessage
                id="notifications_app.is_inactive"
                defaultMessage="INACTIVE"
              />
            )}
          </div>

          <div>
            <NavLink
              to={`/alarms/notifications/${alarm.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {alarm.name}
            </NavLink>

            <br />
            <small className="text-muted">
              <FormattedMessage
                id="notifications_app.number_of_thresholds"
                defaultMessage={`{numberOfThresholds, number} {numberOfThresholds, plural, 
                  one {threshold}
                  other {thresholds}}`}
                values={{ numberOfThresholds }}
              />
              {", "}
              <FormattedMessage
                id="notifications_app.number_of_recipients"
                defaultMessage={`{numberOfRecipients, number} {numberOfRecipients, plural, 
                  one {recipient}
                  other {recipients}}`}
                values={{ numberOfRecipients }}
              />
            </small>
          </div>
        </div>
        <div style={{ width: 250, display: "flex" }}>
          <div style={{ width: "50%" }}>
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
              onClick={() =>
                isActive
                  ? this.props.deActivateAlarm(alarm)
                  : this.props.activateAlarm(alarm)}
            >
              {isActive ? (
                <FormattedMessage
                  id="notifications_app.deactivate_alarm"
                  defaultMessage="Deactivate"
                />
              ) : (
                <FormattedMessage
                  id="notifications_app.activate_alarm"
                  defaultMessage="Activate"
                />
              )}
            </button>
          </div>
          <div style={{ width: "50%" }}>
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
              onClick={() => {
                if (window.confirm("Are you sure?")) {
                  this.props.removeAlarm(alarm);
                }
              }}
            >
              <FormattedMessage
                id="notifications_app.remove_alarm"
                defaultMessage="Remove"
              />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

AlarmRow = withRouter(connect(mapStateToProps, mapDispatchToProps)(AlarmRow));

export { AlarmRow };
