import React from "react";
import { Route, Switch, } from "react-router-dom";

import {appTiles} from './AppTileConfig';
import { App as Home } from "./App";

import {PersonalApiKeysTable} from '../personal_api_keys/PersonalApiKeysTable';
import { EditPersonalApiKey } from '../personal_api_keys/EditPersonalApiKey';
import { NewPersonalApiKey } from '../personal_api_keys/NewPersonalApiKey';
import { RasterSourceTable} from "../data_management/rasters/RasterSourceTable";
import { RasterLayerTable} from "../data_management/rasters/RasterLayerTable";
import { WmsLayerTable } from '../data_management/wms_layers/WmsLayerTable';
import { LabeltypesTable} from "../data_management/labels/LabeltypesTable";
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
import { App as AlarmContactApp } from "../alarms/contacts/App";
import { App as AlarmGroupsApp } from "../alarms/alarmgroups/App";
import { App as AlarmTemplatesApp } from "../alarms/alarmtemplates/App";
import { App as NewAlarmGroupApp } from "../alarms/alarmgroups/NewAlarmGroup";
import { App as NewContactApp } from "../alarms/contacts/NewContact";
import { App as NewNotificationApp } from "../alarms/notifications/NewNotification";
import { App as NewTemplateApp } from "../alarms/alarmtemplates/NewTemplate";
import { App as NotificationsApp } from "../alarms/notifications/App";
import { App as EditNotificationApp } from "../alarms/notifications/EditNotification";
import { Detail as AlarmGroupsDetail } from "../alarms/alarmgroups/Detail";
import { Detail as AlarmTemplatesDetail } from "../alarms/alarmtemplates/Detail";
import { Detail as ContactDetail } from "../alarms/contacts/Detail";

interface Props {
}

export const Routes: React.FC<Props> = () => {
  return ( 
    <>
      {
        appTiles.map(appTile=> appTile.linksTo).concat(appTiles.map(appTile=> appTile.onPage)).filter((value, index, self) => {
          return self.indexOf(value) === index;
        }).map(appTilePage=>{
          return <Route exact path={appTilePage} component={Home} />
        })
      }
      <Switch>
        <Route exact path="/personal_api_keys" component={PersonalApiKeysTable} />
        <Route
          exact
          path={`/personal_api_keys/new`}
          component={NewPersonalApiKey}
        />
        <Route
          exact
          path="/personal_api_keys/:uuid"
          component={EditPersonalApiKey}
        />
      </Switch>
      <Route exact path="/data_management/rasters/sources" component={RasterSourceTable} />
      <Route exact path="/data_management/rasters/layers" component={RasterLayerTable} />
      <Route exact path="/data_management/wms_layers" component={WmsLayerTable} />
      <Route exact path="/data_management/scenarios" component={ScenarioTable} />
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

      <Route exact path="/alarms/contacts" component={AlarmContactApp} />
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