import React, { Component } from "react";
import styles from "./Row.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isFetching: true,
      //isActive: props.alarm.active
    };
    //this.activateAlarm = this.activateAlarm.bind(this);
    //this.deActivateAlarm = this.deActivateAlarm.bind(this);
  }

  // activateAlarm(uuid) {
  //   const { addNotification } = this.props;

  //   fetch(`/api/v3/rasteralarms/${uuid}/`, {
  //     credentials: "same-origin",
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       active: true
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       this.setState({
  //         isActive: true
  //       });
  //       addNotification(`Alarm activated`, 2000);
  //     });
  // }

  // deActivateAlarm(uuid) {
  //   const { addNotification } = this.props;

  //   fetch(`/api/v3/rasteralarms/${uuid}/`, {
  //     credentials: "same-origin",
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       active: false
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       this.setState({
  //         isActive: false
  //       });
  //       addNotification(`Alarm deactivated`, 2000);
  //     });
  // }

  // removeAlarm(uuid) {
  //   const { loadAlarmsOnPage, addNotification } = this.props;

  //   fetch(`/api/v3/rasteralarms/${uuid}/`, {
  //     credentials: "same-origin",
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({})
  //   }).then(response => {
  //     if (response.status === 204) {
  //       loadAlarmsOnPage(1);
  //       addNotification(`Alarm removed`, 2000);
  //     }
  //   });
  // }

  render() {
    return <div className={styles.Row}>{this.props.children}</div>;
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
