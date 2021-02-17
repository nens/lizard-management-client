import React, { Component } from "react";
import { Alarms as AlarmsHome } from "./Alarms";
import { ContactTable } from "./contacts/ContactTable";
import { App as AlarmGroupsApp } from "./alarmgroups/App";
import { App as AlarmTemplatesApp } from "./alarmtemplates/App";
import { App as NewAlarmGroupApp } from "./alarmgroups/NewAlarmGroup";
import { App as NewContactApp } from "./contacts/NewContact";
import { App as NewNotificationApp } from "./notifications/NewNotification";
import { App as NewTemplateApp } from "./alarmtemplates/NewTemplate";
import { App as NotificationsApp } from "./notifications/App";
import { App as EditNotificationApp } from "./notifications/EditNotification";
import { Detail as AlarmGroupsDetail } from "./alarmgroups/Detail";
import { Detail as AlarmTemplatesDetail } from "./alarmtemplates/Detail";
import { Detail as ContactDetail } from "./contacts/Detail";
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
      <>
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
            component={EditNotificationApp}
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

        <Route exact path="/alarms/contacts" component={ContactTable} />
        <Switch>
          <Route exact path="/alarms/contacts/new" component={NewContactApp} />
          <Route exact path="/alarms/contacts/:id" component={ContactDetail} />
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
      </>
    );
  }
}

App = withRouter(App);
export { App };
