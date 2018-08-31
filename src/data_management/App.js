import React, { Component } from "react";
import { DataManagement as DataManagementHome } from "./DataManagement";
import { Raster as RasterApp } from "./rasters/Raster";
import { NewRaster } from "./rasters/NewRaster";
/*
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
import { Detail as ContactDetail } from "./contacts/Detail";
import { Detail as NotificationsDetail } from "./notifications/Detail";
//*/
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
        <Route exact path="/data_management" component={DataManagementHome} />
        <Route exact path="/data_management/rasters" component={RasterApp} />
        <Switch>
          <Route
            exact
            path="/data_management/rasters/new"
            component={NewRaster}
          />
        </Switch>
      </div>
    );
  }
}

App = withRouter(App);
export { App };
