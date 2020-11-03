import React, { Component } from "react";
import { DataManagement as DataManagementHome } from "./DataManagement";
import { Raster as RasterApp } from "./rasters/Raster";
import { WmsLayer as WmsLayerApp } from "./wms_layers/WmsLayer";
import { Scenarios as ScenariosApp } from "./scenarios/Scenarios";
import { NewRaster } from "./rasters/NewRaster";
import { EditRaster } from "./rasters/EditRaster";
import { EditWmsLayer } from "./wms_layers/EditWmsLayer";
import { NewWmsLayer } from "./wms_layers/NewWmsLayer";
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
        <Route exact path="/data_management/wms_layers" component={WmsLayerApp} />
        <Route exact path="/data_management/scenarios" component={ScenariosApp} />
        <Switch>
          <Route
            exact
            path={`/data_management/:rasterType/new`}
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
          <Route
            exact
            path="/data_management/wms_layers/new"
            component={NewWmsLayer}
          />
          <Route
            exact
            path="/data_management/wms_layers/:id"
            component={EditWmsLayer}
          />
        </Switch>
      </div>
    );
  }
}

App = withRouter(App);
export { App };
