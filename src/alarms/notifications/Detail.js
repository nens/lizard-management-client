import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
import AddButton from "../../components/AddButton";
import pluralize from "pluralize";
import { connect } from "react-redux";
import {
  fetchNotificationDetailsById,
  removeAlarm,
  activateAlarm,
  deActivateAlarm
} from "../../actions";
import styles from "./Detail.css";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import { withRouter } from "react-router-dom";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { match, doFetchNotificationDetails } = this.props;
    doFetchNotificationDetails(match.params.id);
  }
  render() {
    const {
      notification,
      isFetching,
      doRemoveAlarm,
      doActivateAlarm,
      doDeActivateAlarm
    } = this.props;
    if (isFetching) {
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
    if (!notification.name) {
      return null;
    }

    const thresholds = notification.thresholds.map((threshold, i) => {
      let alarmName = "";
      let unit = "";
      try {
        alarmName = notification.observation_type.parameter.toLowerCase();
        unit = notification.observation_type.unit;
      } catch (e) {}
      return (
        <div key={i} className={styles.ThresHoldsList}>
          <div>
            <i
              style={{
                position: "relative",
                top: 5,
                left: 0
              }}
              className="material-icons"
            >
              access_time
            </i>&nbsp; Alarm when {alarmName} {notification.comparison}{" "}
            {threshold.value} {unit} ({threshold.warning_level.toLowerCase()})
          </div>
          <div>
            <button type="button" className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link} ${gridStyles.FloatRight}`}>
              Remove
            </button>
          </div>
        </div>
      );
    });

    return (
      <div className={gridStyles.Container}>
        <div className={gridStyles.Row}>
          <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
            <div className={styles.Header}>
              <div className={styles.HeaderLeft}>
                <div
                  className={`${notification.active
                    ? styles.Active
                    : styles.InActive} ${styles.ActiveIndicator}`}
                >
                  {notification.active ? "ACTIVE" : "INACTIVE"}
                </div>
                <div>
                  <p className={styles.Name}>{notification.name}</p>
                  <p className={`text-muted ${styles.Counts}`}>
                    {notification.thresholds.length}{" "}
                    {pluralize("threshold", notification.thresholds.length)},{" "}
                    {notification.messages.length}{" "}
                    {pluralize(
                      "recipient group",
                      notification.messages.length
                    )}{" "}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                onClick={() =>
                  notification.active
                    ? doDeActivateAlarm(notification.uuid)
                    : doActivateAlarm(notification.uuid)}
              >
                {notification.active ? "Deactivate" : "Activate"}
              </button>

              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                onClick={() => {
                  if (window.confirm("Are you sure?")) {
                    doRemoveAlarm(notification.uuid);
                    this.props.history.push("/alarms/notifications");
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <hr />

        <div className={gridStyles.Row}>
          <div className={`${gridStyles.colLg5} ${gridStyles.colMd5} ${gridStyles.colSm5} ${gridStyles.colXs12}`}>
            <h5>Notifications</h5>
            <p className="text-muted">No notifications</p>
          </div>
          <div className={`${gridStyles.colLg7} ${gridStyles.colMd7} ${gridStyles.colSm7} ${gridStyles.colXs12}`}>
            <div className={gridStyles.Row}>
              <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
                <AddButton
                  style={{ marginBottom: 10, float: "right" }}
                  handleClick={() => console.log("Add threshold")}
                  title="Add threshold"
                />
                <h5>Thresholds</h5>
              </div>
            </div>
            <div className={gridStyles.Row}>
              <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
                {thresholds}
              </div>
            </div>
            <hr />
            <div className={gridStyles.Row}>
              <div className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}>
                <AddButton
                  style={{ marginBottom: 10, float: "right" }}
                  handleClick={() => console.log("Add group")}
                  title="Add group"
                />
                <h5>Recipient groups</h5>
              </div>
              <div className={gridStyles.ColMd6}>

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  return {
    notification: state.alarms.alarm,
    isFetching: state.alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchNotificationDetails: id => {
      dispatch(fetchNotificationDetailsById(id));
    },
    doRemoveAlarm: uuid => dispatch(removeAlarm(uuid)),
    doActivateAlarm: uuid => dispatch(activateAlarm(uuid)),
    doDeActivateAlarm: uuid => dispatch(deActivateAlarm(uuid))
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };
