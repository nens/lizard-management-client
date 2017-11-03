import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import {
  fetchAlarms,
  removeAlarm,
  activateAlarm,
  deActivateAlarm
} from "../../actions";
import styles from "./App.css";
import { withRouter, NavLink } from "react-router-dom";
import alarmIcon from "../../images/alarm@3x.svg";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleNewNotificationClick = this.handleNewNotificationClick.bind(
      this
    );
  }
  componentDidMount() {
    this.props.doFetchAlarms();
  }
  handleNewNotificationClick() {
    this.props.history.push("notifications/new");
  }
  render() {
    const {
      alarms,
      doRemoveAlarm,
      doActivateAlarm,
      doDeActivateAlarm
    } = this.props;
    let numberOfNotifications = 0;
    let results = [];
    if (alarms.alarms.count > 0) {
      numberOfNotifications = alarms.alarms.results.length;
      results = alarms.alarms.results.slice()
        .sort((a,b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
        .sort((a,b) => {
          return (a.active === b.active)? 0 : a.active? -1 : 1;
        });
    }

    const alarmsTable = results.map((alarm, i) => {
      const numberOfThresholds = alarm.thresholds.length;
      const numberOfRecipients = alarm.messages.length;
      return (
        <tr key={i} className={styles.AlarmRow}>
          <td
            className="col-md-6"
            onClick={() => console.log(`Go to detail page of ${alarm.name}`)}
          >
            <div
              className={`${alarm.active
                ? styles.Active
                : styles.InActive} ${styles.ActiveIndicator}`}
            >
              {alarm.active ? "ACTIVE" : "INACTIVE"}
            </div>
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
              {numberOfThresholds} {pluralize("thresholds", numberOfThresholds)}
              {", "}{numberOfRecipients}{" "}
              {pluralize(
                "recipient group",
                numberOfRecipients
              )}{" "}
            </small>
          </td>
          <td className="col-md-1">
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() =>
                alarm.active
                  ? doDeActivateAlarm(alarm.uuid)
                  : doActivateAlarm(alarm.uuid)}
            >
              {alarm.active ? "Deactivate" : "Activate"}
            </button>
          </td>
          <td className="col-md-1">
            <button
              type="button"
              className="btn btn-sm btn-link"
              onClick={() => {
                if (window.confirm("Are you sure?")) {
                  doRemoveAlarm(alarm.uuid);
                }
              }}
            >
              Remove
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="container">
        <div
          className="row align-items-center"
          style={{
            padding: "0 0 25px 0",
            borderBottom: "1px solid #bababa"
          }}
        >
          <div className="col-sm-8 justify-content-center text-muted">
            {numberOfNotifications}{" "}
            {pluralize("NOTIFICATIONS", numberOfNotifications)}
          </div>
          <div className="col-sm-4">
            <button
              type="button"
              className="btn btn-success float-right"
              onClick={this.handleNewNotificationClick}
            >
              <FormattedMessage
                id="notifications_app.new_notification"
                defaultMessage="New notification"
              />
              <Ink />
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {alarms.isFetching ? (
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
            ) : results.length > 0 ? (
              <table className="table table-responsive">
                <tbody>{alarmsTable}</tbody>
              </table>
            ) : (
              <div className={styles.NoResults}>
                <img src={alarmIcon} alt="Alarms" />
                <h5>No notifications configured...</h5>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    alarms: state.alarms,
    isFetching: state.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchAlarms: () => dispatch(fetchAlarms()),
    doRemoveAlarm: uuid => dispatch(removeAlarm(uuid)),
    doActivateAlarm: uuid => dispatch(activateAlarm(uuid)),
    doDeActivateAlarm: uuid => dispatch(deActivateAlarm(uuid))
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
