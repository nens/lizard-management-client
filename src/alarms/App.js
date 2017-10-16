import React, { Component } from "react";
import { Alarms as AlarmsHome } from "./Alarms";
import { App as NotificationsApp } from "./notifications/App";
import { App as NewNotificationApp } from "./notifications/NewNotification";
import { App as AlarmGroupsApp } from "./alarmgroups/App";
import { App as AlarmTemplatesApp } from "./alarmtemplates/App";
import { Detail as AlarmGroupsDetail } from "./alarmgroups/Detail";
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
      <div>
          <Route exact path="/alarms" component={AlarmsHome} />
          <Route
            exact
            path="/alarms/notifications"
            component={NotificationsApp}
          />
          <Route
            exact
            path="/alarms/notifications/new"
            component={NewNotificationApp}
          />
          <Route exact path="/alarms/groups" component={AlarmGroupsApp} />
          <Route exact path="/alarms/groups/:id" component={AlarmGroupsDetail} />
          <Route exact path="/alarms/templates" component={AlarmTemplatesApp} />
      </div>
    );
  }
}

App = withRouter(App);
export { App };
