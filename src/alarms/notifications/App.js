import alarmIcon from "../../images/alarm@3x.svg";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import PaginationBar from "./PaginationBar";
import { AlarmRow } from "./AlarmRow";
import React, { Component } from "react";
import styles from "./App.css";
import { addNotification, updateAlarmType } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import { simpleJSONFetch } from "../../utils/simpleJSONFetch.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      alarms: [],
      total: 0,
      page: 1
    };
    this.handleNewNotificationClick = this.handleNewNotificationClick.bind(
      this
    );
    this.loadAlarmsOnPage = this.loadAlarmsOnPage.bind(this);
    this.activateAlarm = this.activateAlarm.bind(this);
    this.deActivateAlarm = this.deActivateAlarm.bind(this);
    this.removeAlarm = this.removeAlarm.bind(this);
  }
  componentDidMount() {
    this.loadAlarmsOnPage(this.state, this.props);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextProps.selectedOrganisation.uuid !==
      this.props.selectedOrganisation.uuid
    ) {
      this.setState({
        page: 1
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.page !== prevState.page ||
      this.props.selectedOrganisation.uuid !==
        prevProps.selectedOrganisation.uuid ||
      this.props.alarmType !== prevProps.alarmType
    ) {
      this.loadAlarmsOnPage(this.state, this.props);
    }
  }

  loadAlarmsOnPage(state, props) {
    this.setState({
      isFetching: true
    });

    let apiAlarmName = "";
    if (props.alarmType === "RASTERS") {
      apiAlarmName = "rasteralarms";
    } else {
      // else if (props.alarmType === "TIMESERIES")
      apiAlarmName = "timeseriesalarms";
    }
    fetch(
      `/api/v4/${apiAlarmName}/?page=${state.page}&organisation__uuid=${props
        .selectedOrganisation.uuid}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetching: false,
          alarms: data.results,
          total: data.count
        });
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  urlFromAlarm(alarm) {
    if (alarm.url.includes("timeseriesalarms"))
      return `/api/v4/timeseriesalarms/${alarm.uuid}/`; //(alarm.type==='RasterAlarm')
    else return `/api/v4/rasteralarms/${alarm.uuid}/`;
  }

  activateAlarm(alarm) {
    const { addNotification } = this.props;

    simpleJSONFetch(this.urlFromAlarm(alarm), "PATCH", {
      active: true
    }).then(data => {
      this.loadAlarmsOnPage(this.state, this.props);
      addNotification(`Alarm activated`, 2000);
    });
  }

  deActivateAlarm(alarm) {
    const { addNotification } = this.props;

    simpleJSONFetch(this.urlFromAlarm(alarm), "PATCH", {
      active: false
    }).then(data => {
      this.loadAlarmsOnPage(this.state, this.props);
      addNotification(`Alarm deactivated`, 2000);
    });
  }

  removeAlarm(alarm) {
    const { addNotification } = this.props;

    fetch(this.urlFromAlarm(alarm), {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        this.loadAlarmsOnPage(this.state, this.props);
        addNotification(`Alarm removed`, 2000);
      }
    });
  }

  handleNewNotificationClick() {
    const { history } = this.props;
    history.push("notifications/new");
  }

  createAlarmRows(alarms) {
    return alarms
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
      })
      .map((alarm, i) => {
        return (
          <AlarmRow
            key={alarm.uuid}
            alarm={alarm}
            activateAlarm={this.activateAlarm}
            deActivateAlarm={this.deActivateAlarm}
            removeAlarm={this.removeAlarm}
          />
        );
      });
  }

  createRasterTimeseriesSwitchGUI(alarmType) {
    const { updateAlarmType } = this.props;

    return (
      <div className={styles.ChoicesContainer}>
        <div
          className={classNames(
            styles.ChoiceContainer,
            styles.ChoiceContainerLeft
          )}
          onClick={e => {
            this.setState({
              page: 1
            });
            updateAlarmType("RASTERS")
          }}
        >
          <input
            className={styles.ChoiceRadio}
            type="radio"
            name="alarm_type"
            value="raster_alarms"
            checked={alarmType === "RASTERS"}
          />
          <label className={styles.ChoiceLabel}>
            <FormattedMessage
              id="notifications_app.raster_alarms"
              defaultMessage="Raster Alarms"
            />
          </label>
        </div>
        <div
          className={styles.ChoiceContainer}
          onClick={e => {
            this.setState({
              page: 1
            });
            updateAlarmType("TIMESERIES")
          }}
        >
          <input
            className={styles.ChoiceRadio}
            type="radio"
            name="alarm_type"
            value="timeseries_alarms"
            checked={alarmType === "TIMESERIES"}
          />
          <label className={styles.ChoiceLabel}>
            <FormattedMessage
              id="notifications_app.timeseries_alarms"
              defaultMessage="Timeseries Alarms"
            />
          </label>
        </div>
      </div>
    );
  }

  render() {
    const numberOfNotifications = this.state.total;
    const alarmsTable = this.createAlarmRows(this.state.alarms);

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
            <FormattedMessage
              id="notifications_app.number_of_notifications"
              defaultMessage={`{numberOfNotifications, number} {numberOfNotifications, plural,
                one {NOTIFICATION}
                other {NOTIFICATIONS}}`}
              values={{ numberOfNotifications }}
            />
            {this.createRasterTimeseriesSwitchGUI(
              this.props.alarmType
            )}
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
            {this.state.isFetching ? (
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
            ) : this.state.total > 0 ? (
              alarmsTable
            ) : (
              <div className={styles.NoResults}>
                <img src={alarmIcon} alt="Alarms" />
                <h5>
                  <FormattedMessage
                    id="notifications_app.no_notifications"
                    defaultMessage="No notifications configured..."
                  />
                </h5>
              </div>
            )}
          </div>
        </div>
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <PaginationBar
              setPage={page => {
                this.setState({
                  page: page
                });
              }}
              page={this.state.page}
              pages={Math.ceil(this.state.total / 10)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedOrganisation: state.organisations.selected,
    isFetchingOrganisations: state.organisations.isFetching,
    alarmType: state.alarmType
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    },
    updateAlarmType: (alarmType) => {
      dispatch(updateAlarmType(alarmType));
    }
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
