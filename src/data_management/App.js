import React, { Component } from "react";
import { DataManagement as DataManagementHome } from "./DataManagement";
import RasterManagement from "./rasters/RasterManagement";
import LabelManagement from "./labels/LabelManagement";
import { Raster as RasterApp } from "./rasters/Raster";
import { RasterSourceTable} from "./rasters/RasterSourceTable";
import { RasterLayerTable} from "./rasters/RasterLayerTable";
import { WmsLayerTable } from './wms_layers/WmsLayerTable';
import { LabeltypesTable} from "./labels/LabeltypesTable";

import { WmsLayer as WmsLayerApp } from "./wms_layers/WmsLayer";
import { Scenarios as ScenariosApp } from "./scenarios/Scenarios";
import { NewRasterSource } from "./rasters/NewRasterSource";
import { NewRasterLayer } from "./rasters/NewRasterLayer";
import { EditRasterSource } from "./rasters/EditRasterSource";
import { EditRasterLayer } from "./rasters/EditRasterLayer";
import { ScenarioTable } from "./scenarios/ScenarioTable";
import { EditScenario } from "./scenarios/EditScenario";
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
        <Route exact path="/data_management/rasters" component={RasterManagement} />
        <Route exact path="/data_management/old_rasters" component={RasterApp} /> 
        <Route exact path="/data_management/rasters/sources" component={RasterSourceTable} />
        <Route exact path="/data_management/rasters/layers" component={RasterLayerTable} />
        <Route exact path="/data_management/wms_layers_old" component={WmsLayerApp} />
        <Route exact path="/data_management/wms_layers" component={WmsLayerTable} />
        <Route exact path="/data_management/scenarios_old" component={ScenariosApp} />
        <Route exact path="/data_management/scenarios" component={ScenarioTable} />
        <Route exact path="/data_management/labels" component={LabelManagement} />
        <Route exact path="/data_management/labels/labeltypes" component={LabeltypesTable} />
        <Switch>
          <Route
            exact
            path={`/data_management/rasters/sources/new`}
            component={NewRasterSource}
          />
          <Route
            exact
            path={`/data_management/rasters/layers/new`}
            component={NewRasterLayer}
          />
          <Route
            exact
            path="/data_management/rasters/sources/:uuid"
            component={EditRasterSource}
          />
          <Route
            exact
            path="/data_management/rasters/layers/:uuid"
            component={EditRasterLayer}
          />
          <Route
            exact
            path="/data_management/rasters/:id/data"
            component={UploadRasterData}
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
          <Route
            exact
            path="/data_management/scenarios/:uuid"
            component={EditScenario}
          />
        </Switch>
      </>
    );
  }
}

App = withRouter(App);
export { App };
