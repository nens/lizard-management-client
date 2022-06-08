import { Route, Switch } from "react-router-dom";
import { navigationLinkPages } from "./AppTileConfig";
import { App as Home } from "./App";
import { PersonalApiKeysTable } from "../personal_api_keys/PersonalApiKeysTable";
import { EditPersonalApiKey } from "../personal_api_keys/EditPersonalApiKey";
import { NewPersonalApiKey } from "../personal_api_keys/NewPersonalApiKey";
import { RasterSourceTable } from "../data_management/rasters/RasterSourceTable";
import { RasterLayerTable } from "../data_management/rasters/RasterLayerTable";
import { WmsLayerTable } from "../data_management/wms_layers/WmsLayerTable";
import { LabeltypesTable } from "../data_management/labels/LabeltypesTable";
import { NewRasterSource } from "../data_management/rasters/NewRasterSource";
import { NewRasterLayer } from "../data_management/rasters/NewRasterLayer";
import { EditRasterSource } from "../data_management/rasters/EditRasterSource";
import { EditRasterLayer } from "../data_management/rasters/EditRasterLayer";
import { ProjectTable } from "../data_management/scenarios/projects/ProjectTable";
import { EditProject } from "../data_management/scenarios/projects/EditProject";
import { NewProject } from "../data_management/scenarios/projects/NewProject";
import { ScenarioTable } from "../data_management/scenarios/scenarios/ScenarioTable";
import { EditScenario } from "../data_management/scenarios/scenarios/EditScenario";
import { NewScenario } from "../data_management/scenarios/scenarios/NewScenario";
import { EditResult } from "../data_management/scenarios/scenarios/results/EditResult";
import { EditWmsLayer } from "../data_management/wms_layers/EditWmsLayer";
import { NewWmsLayer } from "../data_management/wms_layers/NewWmsLayer";
import { TimeseriesTable } from "../data_management/timeseries/timeseries/TimeseriesTable";
import { EditTimeseries } from "../data_management/timeseries/timeseries/EditTimeseries";
import { NewTimeseries } from "../data_management/timeseries/timeseries/NewTimeseries";
import { MonitoringNetworksTable } from "../data_management/timeseries/monitoring_networks/MonitoringNetworksTable";
import { EditMonitoringNetwork } from "../data_management/timeseries/monitoring_networks/EditMonitoringNetwork";
import { NewMonitoringNetwork } from "../data_management/timeseries/monitoring_networks/NewMonitoringNetwork";
import { LocationsTable } from "../data_management/timeseries/locations/LocationsTable";
import { EditLocation } from "../data_management/timeseries/locations/EditLocation";
import { NewLocation } from "../data_management/timeseries/locations/NewLocation";
import { EditLabeltype } from "../data_management/labels/EditLabeltype";
import { RasterAlarmTable } from "../alarms/notifications/raster_alarms/RasterAlarmTable";
import { TimeseriesAlarmTable } from "../alarms/notifications/timeseries_alarms/TimeseriesAlarmTable";
import { NewRasterAlarm } from "../alarms/notifications/raster_alarms/NewRasterAlarm";
import { NewTimeseriesAlarm } from "../alarms/notifications/timeseries_alarms/NewTimeseriesAlarm";
import { EditRasterAlarm } from "../alarms/notifications/raster_alarms/EditRasterAlarm";
import { EditTimeseriesAlarm } from "../alarms/notifications/timeseries_alarms/EditTimeseriesAlarm";
import { TemplateTable } from "../alarms/alarmtemplates/TemplateTable";
import { ContactTable } from "../alarms/contacts/ContactTable";
import { GroupTable } from "../alarms/alarmgroups/GroupTable";
import { NewContact } from "../alarms/contacts/NewContact";
import { EditContact } from "../alarms/contacts/EditContact";
import { NewGroup } from "../alarms/alarmgroups/NewGroup";
import { EditGroup } from "../alarms/alarmgroups/EditGroup";
import { NewTemplate } from "../alarms/alarmtemplates/NewAlarmTemplate";
import { EditTemplate } from "../alarms/alarmtemplates/EditTemplate";
import MapViewer from "../components/Mapviewer";
import WmsAnimation from "../components/WmsAnimation";
import { UserTable } from "../users/UserTable";
import { EditUser } from "../users/EditUser";
import { NewUser } from "../users/NewUser";
import { LayerCollectionsTable } from "../data_management/layer_collections/LayerCollectionsTable";
import { EditLayerCollection } from "../data_management/layer_collections/EditLayerCollection";
import { NewLayerCollection } from "../data_management/layer_collections/NewLayerCollection";
import { GeoBlockTable } from "../data_management/geoblocks/GeoBlockTable";
import { NewGeoBlock } from "../data_management/geoblocks/NewGeoBlock";
import { EditGeoBlock } from "../data_management/geoblocks/EditGeoBlock";
import SpinnerIfStandardSelectorsNotLoaded from "../components/SpinnerIfStandardSelectorsNotLoaded";

const authenticatedRoutes = () => {
  return (
    <SpinnerIfStandardSelectorsNotLoaded>
      <Switch>
        <Route exact path="/management/map_viewer" component={MapViewer} />
        <Route exact path="/management/animation" component={WmsAnimation} />
        <Route exact path="/management/users" component={UserTable} />
        <Route exact path="/management/users/new" component={NewUser} />
        <Route exact path="/management/users/:id" component={EditUser} />

        <Route exact path="/management/personal_api_keys" component={PersonalApiKeysTable} />
        <Route exact path="/management/personal_api_keys/new" component={NewPersonalApiKey} />
        <Route exact path="/management/personal_api_keys/:uuid" component={EditPersonalApiKey} />

        {/* <Route exact path="/management/contract" component={ViewContract} /> */}

        <Route
          exact
          path="/management/data_management/rasters/sources"
          component={RasterSourceTable}
        />
        <Route
          exact
          path="/management/data_management/rasters/sources/new"
          component={NewRasterSource}
        />
        <Route
          exact
          path="/management/data_management/rasters/sources/:uuid"
          component={EditRasterSource}
        />

        <Route
          exact
          path="/management/data_management/rasters/layers"
          component={RasterLayerTable}
        />
        <Route
          exact
          path="/management/data_management/rasters/layers/new"
          component={NewRasterLayer}
        />
        <Route
          exact
          path="/management/data_management/rasters/layers/:uuid"
          component={EditRasterLayer}
        />

        <Route exact path="/management/data_management/geoblocks" component={GeoBlockTable} />
        <Route exact path="/management/data_management/geoblocks/new" component={NewGeoBlock} />
        <Route exact path="/management/data_management/geoblocks/:uuid" component={EditGeoBlock} />

        <Route exact path="/management/data_management/wms_layers" component={WmsLayerTable} />
        <Route exact path="/management/data_management/wms_layers/new" component={NewWmsLayer} />
        <Route exact path="/management/data_management/wms_layers/:id" component={EditWmsLayer} />

        <Route
          exact
          path="/management/data_management/layer_collections"
          component={LayerCollectionsTable}
        />
        <Route
          exact
          path="/management/data_management/layer_collections/new"
          component={NewLayerCollection}
        />
        <Route
          exact
          path="/management/data_management/layer_collections/:slug"
          component={EditLayerCollection}
        />

        <Route
          exact
          path="/management/data_management/timeseries/timeseries"
          component={TimeseriesTable}
        />
        <Route
          exact
          path="/management/data_management/timeseries/timeseries/new"
          component={NewTimeseries}
        />
        <Route
          exact
          path="/management/data_management/timeseries/timeseries/:uuid"
          component={EditTimeseries}
        />

        <Route
          exact
          path="/management/data_management/timeseries/monitoring_networks"
          component={MonitoringNetworksTable}
        />
        <Route
          exact
          path="/management/data_management/timeseries/monitoring_networks/new"
          component={NewMonitoringNetwork}
        />
        <Route
          exact
          path="/management/data_management/timeseries/monitoring_networks/:uuid"
          component={EditMonitoringNetwork}
        />

        <Route
          exact
          path="/management/data_management/timeseries/locations"
          component={LocationsTable}
        />
        <Route
          exact
          path="/management/data_management/timeseries/locations/new"
          component={NewLocation}
        />
        <Route
          exact
          path="/management/data_management/timeseries/locations/:uuid"
          component={EditLocation}
        />

        <Route
          exact
          path="/management/data_management/scenarios/scenarios"
          component={ScenarioTable}
        />
        <Route
          exact
          path="/management/data_management/scenarios/scenarios/new"
          component={NewScenario}
        />
        <Route
          exact
          path="/management/data_management/scenarios/scenarios/:uuid"
          component={EditScenario}
        />
        <Route
          exact
          path="/management/data_management/scenarios/scenarios/:uuid/:id"
          component={EditResult}
        />
        <Route
          exact
          path="/management/data_management/scenarios/projects"
          component={ProjectTable}
        />
        <Route
          exact
          path="/management/data_management/scenarios/projects/new"
          component={NewProject}
        />
        <Route
          exact
          path="/management/data_management/scenarios/projects/:uuid"
          component={EditProject}
        />
        {/* Temporal solution to keep scenario form backwards compatible with previous URL link */}
        {/* Once the links to scenario in the lizard catalogue and the result email are updated to the new URL, we can remove this part. */}
        <Route
          exact
          path="/management/data_management/scenarios/:uuid"
          component={EditScenario}
        />
        {/* END */}

        <Route
          exact
          path="/management/data_management/labels/label_types"
          component={LabeltypesTable}
        />
        <Route
          exact
          path="/management/data_management/labels/label_types/:uuid"
          component={EditLabeltype}
        />

        <Route
          exact
          path="/management/alarms/notifications/raster_alarms"
          component={RasterAlarmTable}
        />
        <Route
          exact
          path="/management/alarms/notifications/raster_alarms/new"
          component={NewRasterAlarm}
        />
        <Route
          exact
          path="/management/alarms/notifications/raster_alarms/:uuid"
          component={EditRasterAlarm}
        />

        <Route
          exact
          path="/management/alarms/notifications/timeseries_alarms"
          component={TimeseriesAlarmTable}
        />
        <Route
          exact
          path="/management/alarms/notifications/timeseries_alarms/new"
          component={NewTimeseriesAlarm}
        />
        <Route
          exact
          path="/management/alarms/notifications/timeseries_alarms/:uuid"
          component={EditTimeseriesAlarm}
        />

        <Route exact path="/management/alarms/groups" component={GroupTable} />
        <Route exact path="/management/alarms/groups/new" component={NewGroup} />
        <Route exact path="/management/alarms/groups/:id" component={EditGroup} />

        <Route exact path="/management/alarms/contacts" component={ContactTable} />
        <Route exact path="/management/alarms/contacts/new" component={NewContact} />
        <Route exact path="/management/alarms/contacts/:id" component={EditContact} />

        <Route exact path="/management/alarms/templates" component={TemplateTable} />
        <Route exact path="/management/alarms/templates/new" component={NewTemplate} />
        <Route exact path="/management/alarms/templates/:id" component={EditTemplate} />
      </Switch>
    </SpinnerIfStandardSelectorsNotLoaded>
  );
};

export const Routes = () => {
  // The AppTileConfig.ts contains all the Tiles in the app. (in the future this list should come from backend, become data driven instead of hardcoded)
  // The  router should show the 'Home' component if:
  // the current-url is in the 'onUrl' field for one or more tile. Namely this means those tile(s) need to be shown on current page

  return (
    <Switch>
      {navigationLinkPages.map((navigationLinkPage) => {
        return (
          <Route
            key={navigationLinkPage.onUrl}
            exact
            path={navigationLinkPage.onUrl}
            component={Home}
          />
        );
      })}
      <Route path="/management" component={authenticatedRoutes} />
    </Switch>
  );
};
