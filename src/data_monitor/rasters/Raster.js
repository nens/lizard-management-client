import alarmIcon from "../../images/alarm@3x.svg";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import PaginationBar from "./PaginationBar";
import { Row } from "./Row";
import React, { Component } from "react";
import styles from "./App.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";

class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      rasters: [],
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
    fetch(
      `/api/v3/rasters/?page=${page}`, // &organisation__unique_id=${organisationId},
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetching: false,
          total: data.count,
          rasters: data.results,
          page: page
        });
      });
  }

  handleNewNotificationClick() {
    const { history } = this.props;
    history.push("rasters/new");
  }

  sortList(list) {
    const sortedList = list
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
    return sortedList;
  }

  render() {
    const { rasters, isFetching, total, page } = this.state;

    const numberOfRasters = total;
    const rasterRows = this.sortList(rasters);

    const htmlRasterTable = rasterRows.map((alarm, i) => {
      return (
        <Row key={i} alarm={alarm} loadAlarmsOnPage={this.loadAlarmsOnPage}>
          <NavLink
            to={`/alarms/notifications/${alarm.uuid}`}
            style={{
              color: "#333"
            }}
          >
            {alarm.name}
          </NavLink>
          <NavLink
            to={`/alarms/notifications/${alarm.uuid}`}
            style={{
              color: "#333"
            }}
          >
            {alarm.description}
          </NavLink>
          <button
            type="button"
            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
            onClick={() => {
              if (window.confirm("Are you sure?")) {
                this.removeAlarm(alarm.uuid);
              }
            }}
          >
            <FormattedMessage
              id="notifications_app.remove_alarm"
              defaultMessage="edit"
            />
          </button>
        </Row>
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
              defaultMessage={`{numberOfRasters, number} {numberOfRasters, plural, 
                one {Raster}
                other {Rasters}}`}
              values={{ numberOfRasters }}
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
                id="notifications_app.new_raster"
                defaultMessage="New raster"
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
            ) : rasterRows.length > 0 ? (
              htmlRasterTable
            ) : (
              <div className={styles.NoResults}>
                <img src={alarmIcon} alt="Alarms" />
                <h5>
                  <FormattedMessage
                    id="notifications_app.no_notifications"
                    defaultMessage="No rasters configured..."
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

Raster = withRouter(connect(mapStateToProps, mapDispatchToProps)(Raster));

export { Raster };
