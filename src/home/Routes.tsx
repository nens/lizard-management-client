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
import { TemplateTable } from "../alarms/alarmtemplates/TemplateTable";
import { ContactTable } from "../alarms/contacts/ContactTable";
import { GroupTable } from "../alarms/alarmgroups/GroupTable";
import { App as NewNotificationApp } from "../alarms/notifications/NewNotification";
import { App as NotificationsApp } from "../alarms/notifications/App";
import { App as EditNotificationApp } from "../alarms/notifications/EditNotification";
import  { NewContact } from "../alarms/contacts/NewContact"
import { EditContact } from "../alarms/contacts/EditContact";
import { NewGroup } from "../alarms/alarmgroups/NewGroup";
import { EditGroup } from "../alarms/alarmgroups/EditGroup";
import { NewTemplate } from "../alarms/alarmtemplates/NewAlarmTemplate";
import { EditTemplate } from "../alarms/alarmtemplates/EditTemplate";

export const Routes = () => {

  // The AppTileConfig.ts contains all the Tiles in the app. (in the future this list should come from backend, become data driven instead of hardcoded)
  // The  router should show the 'Home' component if:
  // the current-url is in the 'onPage' field for one or more tile. Namely this means those tile(s) need to be shown on current page 

  return ( 
      <Switch>
        {
          appTiles.map(appTile=> appTile.onPage).filter((value, index, self) => {
            return self.indexOf(value) === index;
          }).map(appTilePage=>{
            return <Route key={appTilePage} exact path={appTilePage} component={Home} />
          })
        }

        <Route exact path="/personal_api_keys" component={PersonalApiKeysTable} />
        <Route exact path="/personal_api_keys/new" component={NewPersonalApiKey} />
        <Route exact path="/personal_api_keys/:uuid" component={EditPersonalApiKey} />

        <Route exact path="/data_management/rasters/sources" component={RasterSourceTable} />
        <Route exact path="/data_management/rasters/sources/new" component={NewRasterSource} />
        <Route exact path="/data_management/rasters/sources/:uuid" component={EditRasterSource} />
        <Route exact path="/data_management/rasters/:id/data" component={UploadRasterData} />

        <Route exact path="/data_management/rasters/layers" component={RasterLayerTable} />
        <Route exact path="/data_management/rasters/layers/new" component={NewRasterLayer} />
        <Route exact path="/data_management/rasters/layers/:uuid" component={EditRasterLayer} />

        <Route exact path="/data_management/wms_layers" component={WmsLayerTable} />
        <Route exact path="/data_management/wms_layers/new" component={NewWmsLayer} />
        <Route exact path="/data_management/wms_layers/:id" component={EditWmsLayer} />

        <Route exact path="/data_management/scenarios" component={ScenarioTable} />
        <Route exact path="/data_management/scenarios/:uuid" component={EditScenario} />

        <Route exact path="/data_management/labels/label_types" component={LabeltypesTable} />
        <Route exact path="/data_management/labels/label_types/:uuid" component={EditLabeltype} />

        <Route exact path="/alarms/notifications" component={NotificationsApp} />
        <Route exact path="/alarms/notifications/new" component={NewNotificationApp} />
        <Route exact path="/alarms/notifications/:id" component={EditNotificationApp} />

        <Route exact path="/alarms/groups" component={GroupTable} />
        <Route exact path="/alarms/groups/new" component={NewGroup} />
        <Route exact path="/alarms/groups/:id" component={EditGroup} />

        <Route exact path="/alarms/contacts" component={ContactTable} />
        <Route exact path="/alarms/contacts/new" component={NewContact} />
        <Route exact path="/alarms/contacts/:id" component={EditContact} />

        <Route exact path="/alarms/templates" component={TemplateTable} />
        <Route exact path="/alarms/templates/new" component={NewTemplate} />
        <Route exact path="/alarms/templates/:id" component={EditTemplate} />
      </Switch>
  );
}