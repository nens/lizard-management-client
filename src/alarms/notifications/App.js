import alarmIcon from "../../images/alarm@3x.svg";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import PaginationBar from "./PaginationBar";
import { AlarmRow } from "./AlarmRow";
import React, { Component } from "react";
import styles from "./App.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingRasterAlarms: true,
      isFetchingTimeseriesAlarms: true,
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
    const { page } = this.state;
    this.loadAlarmsOnPage(page);
  }

  loadAlarmsOnPage(page, newProps) {
    this.setState({
      isFetchingTimeseriesAlarms: true,
      isFetchingRasterAlarms: true,
      total: 0,
      alarms: []
    });

    this.loadRasterAlarms(page, newProps);
    this.loadTimeseriesAlarms(page, newProps);
  }

  loadRasterAlarms(page, newProps) {
    const { selectedOrganisation } = newProps || this.props;
    const organisationId = selectedOrganisation.uuid;
    fetch(
      `/api/v3/rasteralarms/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetchingRasterAlarms: false,
          total: this.state.total + data.count,
          alarms: this.state.alarms.concat(
            data.results.map(e => {
              e.type = "RasterAlarm";
              return e;
            })
          ),
          page: page
        });
      });
  }

  loadTimeseriesAlarms(page, newProps) {
    const { selectedOrganisation } = newProps || this.props;
    const organisationId = selectedOrganisation.uuid;

    fetch(
      `/api/v3/timeseriesalarms/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetchingTimeseriesAlarms: false,
          total: this.state.total + data.count,
          alarms: this.state.alarms.concat(
            data.results.map(e => {
              e.type = "TimeseriesAlarm";
              return e;
            })
          ),
          page: page
        });
      });
  }

  urlFromAlarm(alarm) {
    if (alarm.type === "TimeseriesAlarm")
      return `/api/v3/timeseriesalarms/${alarm.uuid}/`; //(alarm.type==='RasterAlarm')
    else return `/api/v3/rasteralarms/${alarm.uuid}/`;
  }

  activateAlarm(alarm) {
    const { addNotification } = this.props;

    fetch(this.urlFromAlarm(alarm), {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: true
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          isActive: true
        });
        this.loadAlarmsOnPage(this.state.page);
        addNotification(`Alarm activated`, 2000);
      });
  }

  deActivateAlarm(alarm) {
    const { addNotification } = this.props;

    fetch(this.urlFromAlarm(alarm), {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: false
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          isActive: false
        });
        this.loadAlarmsOnPage(this.state.page);
        addNotification(`Alarm deactivated`, 2000);
      });
  }

  removeAlarm(alarm) {
    const { loadAlarmsOnPage, addNotification } = this.props;

    fetch(this.urlFromAlarm(alarm), {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        loadAlarmsOnPage(this.state.page);
        addNotification(`Alarm removed`, 2000);
      }
    });
  }

  handleNewNotificationClick() {
    const { history } = this.props;
    history.push("notifications/new");
  }

  render() {
    const {
      alarms,
      isFetchingRasterAlarms,
      isFetchingTimeseriesAlarms,
      total,
      page
    } = this.state;

    let numberOfNotifications = 0;
    let alarmRows = [];
    if (total && total > 0) {
      numberOfNotifications = total;
      alarmRows = alarms
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

    const alarmsTable = alarmRows.map((alarm, i) => {
      return (
        <AlarmRow
          key={i}
          alarm={alarm}
          loadAlarmsOnPage={this.loadAlarmsOnPage}
          activateAlarm={this.activateAlarm}
          deActivateAlarm={this.deActivateAlarm}
          removeAlarm={this.removeAlarm}
        />
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
            <FormattedMessage
              id="notifications_app.number_of_notifications"
              defaultMessage={`{numberOfNotifications, number} {numberOfNotifications, plural, 
                one {NOTIFICATION}
                other {NOTIFICATIONS}}`}
              values={{ numberOfNotifications }}
            />
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
            {isFetchingRasterAlarms || isFetchingTimeseriesAlarms ? (
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
            ) : alarmRows.length > 0 ? (
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
              loadAlarmsOnPage={this.loadAlarmsOnPage}
              page={page}
              pages={Math.ceil(total / 10)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("[F] mapStateToProps state.organisations ", state.organisations);
  return {
    selectedOrganisation: state.organisations.selected,
    isFetchingOrganisations: state.organisations.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
