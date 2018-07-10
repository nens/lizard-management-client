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
      isFetching: true,
      alarms: [],
      total: 0,
      page: 1
    };
    this.handleNewNotificationClick = this.handleNewNotificationClick.bind(
      this
    );
    this.loadAlarmsOnPage = this.loadAlarmsOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadAlarmsOnPage(page);
  }

  loadAlarmsOnPage(page) {
    const { bootstrap } = this.props;
    const organisationId = bootstrap.organisation.unique_id;

    fetch(
      `/api/v3/rasteralarms/?page=${page}`, // &organisation__unique_id=${organisationId},
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetching: false,
          total: data.count,
          alarms: data.results,
          page: page
        });
      });
  }

  handleNewNotificationClick() {
    const { history } = this.props;
    history.push("notifications/new");
  }

  render() {
    const { alarms, isFetching, total, page } = this.state;

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

App = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

export { App };
