import React, { Component } from "react";
import { DataManagement as DataManagementHome } from "./DataManagement";
import { Raster as RasterApp } from "./rasters/Raster";
import { NewRaster } from "./rasters/NewRaster";
import { EditRaster } from "./rasters/EditRaster";
import { UploadRasterData } from "./rasters/UploadRasterData";

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
          <Route
            exact
            path="/data_management/rasters/:id/data"
            component={UploadRasterData}
          />
          <Route
            exact
            path="/data_management/rasters/:id"
            component={EditRaster}
          />
        </Switch>
      </div>
    );
  }
}

App = withRouter(App);
export { App };
