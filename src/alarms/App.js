import { Alarms as AlarmsHome } from "./Alarms";
import { App as AlarmContactApp } from "./contacts/App";
import { App as AlarmGroupsApp } from "./alarmgroups/App";
import { App as AlarmTemplatesApp } from "./alarmtemplates/App";
import { App as NewAlarmGroupApp } from "./alarmgroups/NewAlarmGroup";
import { App as NewContactApp } from "./contacts/NewContact";
import { App as NewNotificationApp } from "./notifications/NewNotification";
import { App as NewTemplateApp } from "./alarmtemplates/NewTemplate";
import { App as NotificationsApp } from "./notifications/App";
import { Detail as AlarmGroupsDetail } from "./alarmgroups/Detail";
import { Detail as AlarmTemplatesDetail } from "./alarmtemplates/Detail";
import { Detail as NotificationsDetail } from "./notifications/Detail";
import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

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
        <Switch>
          <Route
            exact
            path="/alarms/notifications/new"
            component={NewNotificationApp}
          />
          <Route
            exact
            path="/alarms/notifications/:id"
            component={NotificationsDetail}
          />
        </Switch>
        <Route exact path="/alarms/groups" component={AlarmGroupsApp} />
        <Switch>
          <Route exact path="/alarms/groups/new" component={NewAlarmGroupApp} />
          <Route
            exact
            path="/alarms/groups/:id"
            component={AlarmGroupsDetail}
          />
        </Switch>

        <Route exact path="/alarms/contacts" component={AlarmContactApp} />
        <Switch>
          <Route exact path="/alarms/contacts/new" component={NewContactApp} />
          {/* <Route
            exact
            path="/alarms/contacts/:id"
            component={ContactDetail}
          /> */}
        </Switch>

        <Route exact path="/alarms/templates" component={AlarmTemplatesApp} />
        <Switch>
          <Route
            exact
            path="/alarms/templates/new"
            component={NewTemplateApp}
          />
          <Route
            exact
            path="/alarms/templates/:id"
            component={AlarmTemplatesDetail}
          />
        </Switch>
      </div>
    );
  }
}

App = withRouter(App);
export { App };
