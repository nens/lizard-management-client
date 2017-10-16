import React, { Component } from "react";
import Notifications from "./notifications/Notifications";
import NewNotification from "./notifications/NewNotification";
import { Alarms as AlarmsHome } from "./Alarms";
import AlarmGroups from "./alarmgroups/AlarmGroups";
import AlarmTemplates from "./alarmtemplates/AlarmTemplates";
// import { FormattedMessage } from "react-intl";
import { Route, withRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
    this.handleExternalLink = this.handleExternalLink.bind(this);
  }

  handleLink(destination) {
    this.props.history.push(destination);
  }

  handleExternalLink(destination) {
    window.location.href = destination;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div>
            <Route exact path="/alarms" component={AlarmsHome} />
            <Route
              exact
              path="/alarms/notifications"
              component={Notifications}
            />
            <Route exact path="/alarms/groups" component={AlarmGroups} />
            <Route exact path="/alarms/templates" component={AlarmTemplates} />
            <Route
              exact
              path="/alarms/notifications/new"
              component={NewNotification}
            />
          </div>
        </div>
      </div>
    );
  }
}

App = withRouter(App);
export { App };
