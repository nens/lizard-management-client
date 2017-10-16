import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import Ink from "react-ink";
import { FormattedMessage } from "react-intl";
import pluralize from "pluralize";
import { connect } from "react-redux";
import { fetchAlarms, removeAlarm } from "../../actions";
import styles from "./App.css";
import { withRouter } from "react-router-dom";

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
    const { alarms, doRemoveAlarm } = this.props;
    let numberOfNotifications = 0;
    let results = [];
    if (alarms.alarms.count > 0) {
      numberOfNotifications = alarms.alarms.results.length;
      results = alarms.alarms.results;
    }

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
                <tbody>
                  {results.map((alarm, i) => {
                    const numberOfThresholds = alarm.thresholds.length;
                    return (
                      <tr key={i} className={styles.AlarmRow}>
                        <td className="col-md-6" onClick={() => console.log(`Go to detail page of ${alarm.name}`)}>
                          {alarm.name}
                          <br />
                          <small className="text-muted">
                            {numberOfThresholds}{" "}
                            {pluralize("thresholds", numberOfThresholds)}
                          </small>
                        </td>
                        <td className="col-md-1">
                          <button type="button" className="btn btn-sm btn-link">
                            Deactivate
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
                  })}
                </tbody>
              </table>
            ) : (
              <div className={styles.NoResults}>
                <img src="/images/alarm@3x.svg" alt="Alarms" />
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
    doRemoveAlarm: uuid => dispatch(removeAlarm(uuid))
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
