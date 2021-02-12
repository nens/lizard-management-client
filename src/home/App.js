import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./App.module.css";
import AppTile from "../components/AppTile";
import { withRouter } from "react-router-dom";
import { Trail, animated } from "react-spring";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {appTiles} from './HomeAppTileConfig';

// import { FormattedMessage } from "react-intl";
// import alarmIcon from "../images/alarm@3x.svg";
// import userManagementIcon from "../images/userManagement.svg";
// import dataManagementIcon from "../images/database.svg";
// import personalApiKeysIcon from "../images/personal_api_key_icon.svg";
// import rasterIcon from "../images/raster_icon.svg";
// import wmsIcon from "../images/wms@3x.svg";
// import threediIcon from "../images/3di@3x.svg";
// import backArrowIcon from "../images/backArrow.svg";
// import labelIcon from "../images/labels_icon.svg";

import RasterManagement from "../data_management/rasters/RasterManagement";
import LabelManagement from "../data_management/labels/LabelManagement";
import { Raster as RasterApp } from "../data_management/rasters/Raster";
import { RasterSourceTable} from "../data_management/rasters/RasterSourceTable";
import { RasterLayerTable} from "../data_management/rasters/RasterLayerTable";
import { WmsLayerTable } from '../data_management/wms_layers/WmsLayerTable';
import { LabeltypesTable} from "../data_management/labels/LabeltypesTable";

import { WmsLayer as WmsLayerApp } from "../data_management/wms_layers/WmsLayer";
import { Scenarios as ScenariosApp } from "../data_management/scenarios/Scenarios";
import { NewRasterSource } from "../data_management/rasters/NewRasterSource";
import { NewRasterLayer } from "../data_management/rasters/NewRasterLayer";
import { EditRasterSource } from "../data_management/rasters/EditRasterSource";
import { EditRasterLayer } from "../data_management/rasters/EditRasterLayer";
import { ScenarioTable } from "../data_management/scenarios/ScenarioTable";
import { EditScenario } from "../data_management/scenarios/EditScenario";
import { EditWmsLayer } from "../data_management/wms_layers/EditWmsLayer";
import { NewWmsLayer } from "../data_management/wms_layers/NewWmsLayer";
import { UploadRasterData } from "../data_management/rasters/UploadRasterData";
import {EditLabeltype} from "../data_management/labels/EditLabeltype";

import { Route, Switch, /* withRouter */ } from "react-router-dom";






class App extends Component {
  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
    this.handleExternalLink = this.handleExternalLink.bind(this);
  }

  handleInternalLink(destination) {
    this.props.history.push(destination);
  }

  handleExternalLink(destination) {
    window.location.href = destination;
  }

  handleLink (linksToObject) {
    if (linksToObject.external === true) {
      this.handleExternalLink(linksToObject.path);
    } else {
      this.handleInternalLink(linksToObject.path);
    }
  }

  render() {

    const currentRelativeUrl = this.props.location.pathname;
    console.log('currentRelativeUrl app', currentRelativeUrl);

    const currentOrganisationRoles = (this.props.selectedOrganisation && this.props.selectedOrganisation.roles) || [];
    // const appTilesWithReadOnlyInfo = appTiles.map(appTile=>{
    //   return {
    //     ...appTile,
    //     readonly: !doArraysHaveEqualElement(appTile.requiredRoles, currentOrganisationRoles)
    //   }
    // });
    return (
      <div>
        {/* <Route exact path="/data_management" component={DataManagementHome} /> */}
        {/* <Route exact path="/data_management" component={App} /> */}
        <Route exact path="/data_management/rasters" component={RasterManagement} />
        <Route exact path="/data_management/old_rasters" component={RasterApp} /> 
        <Route exact path="/data_management/rasters/sources" component={RasterSourceTable} />
        <Route exact path="/data_management/rasters/layers" component={RasterLayerTable} />
        <Route exact path="/data_management/wms_layers_old" component={WmsLayerApp} />
        <Route exact path="/data_management/wms_layers" component={WmsLayerTable} />
        <Route exact path="/data_management/scenarios_old" component={ScenariosApp} />
        <Route exact path="/data_management/scenarios" component={ScenarioTable} />
        <Route exact path="/data_management/labels" component={LabelManagement} />
        <Route exact path="/data_management/labels/label_types" component={LabeltypesTable} />
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
          <Route
            exact
            path="/data_management/labels/label_types/:uuid"
            component={EditLabeltype}
          />
        </Switch>
        <div className="container">
          <div className="row">
            <div className={styles.Apps}>
              <Trail
                native
                from={{ opacity: 0, x: -5 }}
                to={{ opacity: 1, x: 0 }}
                keys={appTiles.map(item => item.key)}
              >
                {appTiles.filter(appTile=>{
                  return ( 
                    appTile.onPage === currentRelativeUrl ||
                    (appTile.onPage + '/') === currentRelativeUrl ||
                    appTile.onPage === ( currentRelativeUrl + '/')
                  );
                }).sort((appTileA, appTileB)=>{
                  return appTileA.order - appTileB.order;
                }).map((appTile) => ({ x, opacity }) => (
                  <animated.div
                    style={{
                      opacity,
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`)
                    }}
                  >
                    <AppTile
                      handleClick={()=>{ this.handleLink({
                        external: appTile.linksTo === "/management/users/" ? true : false,
                        path: appTile.linksTo
                      })}}
                      key={appTile.title + appTile.order + ""}
                      title={appTile.title}
                      icon={appTile.icon}
                      readonly={!doArraysHaveEqualElement(appTile.requiresOneOfRoles, currentOrganisationRoles)}
                      requiredRoles={appTile.requiresOneOfRoles}
                    />
                  </animated.div>
                ))}
              </Trail>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedOrganisation: state.organisations.selected,
  };
};

App = withRouter(connect(mapStateToProps, null)(
  App
));

export { App };
