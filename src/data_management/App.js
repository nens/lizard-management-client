import React, { Component } from "react";
import { DataManagement as DataManagementHome } from "./DataManagement";
import { Raster as RasterApp } from "./rasters/Raster";
import { RasterSourceTable} from "./rasters/RasterSourceTable";
import { RasterLayerTable} from "./rasters/RasterLayerTable";

import { WmsLayer as WmsLayerApp } from "./wms_layers/WmsLayer";
import { Scenarios as ScenariosApp } from "./scenarios/Scenarios";
import { NewRaster } from "./rasters/NewRaster";
import { NewRaster2 } from "./rasters/NewRaster2";
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
      <>
        <Route exact path="/data_management" component={DataManagementHome} />
        <Route exact path="/data_management/old_rasters" component={RasterApp} /> 
        <Route exact path="/data_management/raster_sources" component={RasterSourceTable} />
        <Route exact path="/data_management/raster_layers" component={RasterLayerTable} />
        <Route exact path="/data_management/wms_layers" component={WmsLayerApp} />
        <Route exact path="/data_management/scenarios" component={ScenariosApp} />
        <Switch>
          <Route
            exact
            path="/data_management/rasters/new"
            component={NewRaster}
          />
          <Route
            exact
            path="/data_management/rasters/new2"
            component={NewRaster2}
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
      </>
    );
  }
}

App = withRouter(App);
export { App };
