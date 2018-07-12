import buttonStyles from "../../styles/Buttons.css";
import React, { Component } from "react";
import styles from "./AlarmRow.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter, NavLink } from "react-router-dom";

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      isActive: props.alarm.active
    };
    this.activateAlarm = this.activateAlarm.bind(this);
    this.deActivateAlarm = this.deActivateAlarm.bind(this);
  }

  activateAlarm(uuid) {
    const { addNotification } = this.props;

    fetch(`/api/v3/rasteralarms/${uuid}/`, {
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
        addNotification(`Alarm activated`, 2000);
      });
  }

  deActivateAlarm(uuid) {
    const { addNotification } = this.props;

    fetch(`/api/v3/rasteralarms/${uuid}/`, {
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
        addNotification(`Alarm deactivated`, 2000);
      });
  }

  removeAlarm(uuid) {
    const { loadAlarmsOnPage, addNotification } = this.props;

    fetch(`/api/v3/rasteralarms/${uuid}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        loadAlarmsOnPage(1);
        addNotification(`Alarm removed`, 2000);
      }
    });
  }

  render() {
    const { alarm } = this.props;
    const { isActive } = this.state;
    const numberOfThresholds = 1; //threshold not defined on raster remove feature later, but hardcode now just to test page //alarm.thresholds.length;
    const numberOfRecipients = 1; // iem // alarm.messages.length;
    return <div className={styles.AlarmRow}>{this.props.children}</div>;
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

Row = withRouter(connect(mapStateToProps, mapDispatchToProps)(Row));

export { Row };

/*
<div style={{ width: 250, display: "flex" }}>
          <div style={{ width: "50%" }}>
            <button
              type="button"
              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
              onClick={() =>
                isActive
                  ? this.deActivateAlarm(alarm.uuid)
                  : this.activateAlarm(alarm.uuid)}
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
                  this.removeAlarm(alarm.uuid);
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
        //*/
