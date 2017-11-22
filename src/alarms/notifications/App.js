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
  deActivateAlarm,
  fetchPaginatedAlarms
} from "../../actions";
import PaginationBar from "./PaginationBar";
import styles from "./App.css";
import gridStyles from "../../styles/Grid.css";
import buttonStyles from "../../styles/Buttons.css";
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
    const query = new URLSearchParams(window.location.search);
    this.props.fetchPaginatedAlarms(query.get("page") || 1);
  }
  handleNewNotificationClick() {
    this.props.history.push("notifications/new");
  }
  render() {
    const {
      alarms,
      total,
      currentPage,
      isFetching,
      doRemoveAlarm,
      doActivateAlarm,
      doDeActivateAlarm
    } = this.props;

    let numberOfNotifications = 0;
    let results = [];
    if (total && total > 0) {
      numberOfNotifications = total;
      results = alarms
        .slice()
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
        .sort((a, b) => {
          return a.active === b.active ? 0 : a.active ? -1 : 1;
        });
    }

    const alarmsTable = results.map((alarm, i) => {
      const numberOfThresholds = alarm.thresholds.length;
      const numberOfRecipients = alarm.messages.length;
      return (
        <div key={i} className={styles.AlarmRow}>
          <div style={{ display: "flex" }}>
            <div
              className={`${alarm.active
                ? styles.Active
                : styles.InActive} ${styles.ActiveIndicator}`}
            >
              {alarm.active ? "ACTIVE" : "INACTIVE"}
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
                {numberOfThresholds}{" "}
                {pluralize("thresholds", numberOfThresholds)}
                {", "}
                {numberOfRecipients}{" "}
                {pluralize("recipient group", numberOfRecipients)}{" "}
              </small>
            </div>
          </div>
          <div style={{ width: 250, display: "flex" }}>
            <div style={{ width: "50%" }}>
              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                onClick={() =>
                  alarm.active
                    ? doDeActivateAlarm(alarm.uuid)
                    : doActivateAlarm(alarm.uuid)}
              >
                {alarm.active ? "Deactivate" : "Activate"}
              </button>
            </div>
            <div style={{ width: "50%" }}>
              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                onClick={() => {
                  if (window.confirm("Are you sure?")) {
                    doRemoveAlarm(alarm.uuid);
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className={gridStyles.Container}>
        <div
          className={gridStyles.Row}
          style={{
            padding: "0 0 25px 0",
            borderBottom: "1px solid #bababa"
          }}
        >
          <div
            style={{ color: "#858E9C" }}
            className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
          >
            {numberOfNotifications}{" "}
            {pluralize("NOTIFICATIONS", numberOfNotifications)}
          </div>
          <div
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4}`}
          >
            <button
              type="button"
              style={{ float: "right" }}
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
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
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            {isFetching ? (
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
              alarmsTable
            ) : (
              <div className={styles.NoResults}>
                <img src={alarmIcon} alt="Alarms" />
                <h5>No notifications configured...</h5>
              </div>
            )}
          </div>
        </div>
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <PaginationBar
              page={currentPage}
              pages={Math.ceil(total / 10)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentPage: state.alarms._alarms.currentPage,
    total: state.alarms._alarms.total,
    alarms: state.alarms._alarms.alarms,
    isFetching: state.alarms._alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchPaginatedAlarms: page => dispatch(fetchPaginatedAlarms(page)),
    doFetchAlarms: () => dispatch(fetchAlarms()),
    doRemoveAlarm: uuid => dispatch(removeAlarm(uuid)),
    doActivateAlarm: uuid => dispatch(activateAlarm(uuid)),
    doDeActivateAlarm: uuid => dispatch(deActivateAlarm(uuid))
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
