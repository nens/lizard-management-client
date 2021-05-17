import alarmIcon from "../images/alarm@3x.svg";
import userManagementIcon from "../images/userManagement.svg";
import dataManagementIcon from "../images/database.svg";
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";
import rasterIcon from "../images/raster_icon.svg";
import wmsIcon from "../images/wms@3x.svg";
import threediIcon from "../images/3di@3x.svg";
import backArrowIcon from "../images/backArrow.svg";
import labelIcon from "../images/labels_icon.svg";
import rasterSourcesIcon from "../images/raster_source_icon.svg";
import rasterLayersIcon from "../images/raster_layer_icon.svg";
import labeltypesIcon from "../images/labeltypes_icon.svg";
import alarmsIcon from "../images/alarm@3x.svg";
import groupsIcon from "../images/group.svg";
import contactsIcon from "../images/contacts@3x.svg";
import templatesIcon from "../images/templates@3x.svg";
import timeseriesIcon from "../images/timeseries_icon.svg";
import monitoringsNetworkicon from "../images/monitoring_network_icon.svg";
import locationsIcon from "../images/locations_icon.svg";


export const appTiles = [
  { 
    title: "data",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    order: 100,
    onPage: "/",
    linksTo: "/data_management",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: dataManagementIcon,
  },
  { 
    title: "users",
    // title: (
    //   <FormattedMessage
    //     id="home.users"
    //     defaultMessage="Users"
    //   />
    // ),
    order: 200,
    onPage: "/",
    linksTo: "/users",
    linksToExternal: false,
    requiresOneOfRoles: ["manager"],
    icon: userManagementIcon,
  },
  { 
    title: "alarms",
    // title: (
    //   <FormattedMessage id="home.alarms" defaultMessage="Alarms" />
    // ),
    order: 300,
    onPage: "/",
    linksTo: "/alarms",
    requiresOneOfRoles: ["admin"],
    icon: alarmIcon,
  },
  { 
    title: "Personal API keys",
    // title: (
    //   <FormattedMessage
    //     id="home.personal_api_keys"
    //     defaultMessage="Personal API keys"
    //   />
    // ),
    order: 400,
    onPage: "/",
    linksTo: "/personal_api_keys",
    requiresOneOfRoles: ["user", "admin", "supplier", "manager"],
    icon: personalApiKeysIcon,
  },
  { 
    title: "rasters",
    // title: (
    //   <FormattedMessage
    //     id="data_management.rasters"
    //     defaultMessage="Rasters"
    //   />
    // ),
    order: 100,
    onPage: "/data_management",
    linksTo: "/data_management/rasters",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: rasterIcon,
  },
  {
    title: "WMS layers",
    // title: (
    //   <FormattedMessage
    //     id="data_management.wms_layers"
    //     defaultMessage="WMS layers"
    //   />
    // ),
    order: 200,
    onPage: "/data_management",
    linksTo: "/data_management/wms_layers",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: wmsIcon
  },
  {
    title: "Time Series",
    // title: (
    //   <FormattedMessage
    //     id="data_management.wms_layers"
    //     defaultMessage="WMS layers"
    //   />
    // ),
    order: 250,
    onPage: "/data_management",
    linksTo: "/data_management/timeseries",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: timeseriesIcon,
  },
  {
    title: "3Di Scenarios",
    // title: (
    //   <FormattedMessage
    //     id="home.scenarios"
    //     defaultMessage="3Di Scenarios"
    //   />
    // ),
    order: 300,
    onPage: "/data_management",
    linksTo: "/data_management/scenarios",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: threediIcon
  },
  {
    title: "Labels",
    // title: (
    //   <FormattedMessage
    //     id="home.labels"
    //     defaultMessage="Labels"
    //   />
    // ),
    order: 400,
    onPage: "/data_management",
    linksTo: "/data_management/labels",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: labelIcon
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management",
    linksTo: "/",
    requiresOneOfRoles: ["admin", "supplier","user", "manager"],
    icon: backArrowIcon
  },
  {
    title: "Rasters Sources",
    // title: (
    //   <FormattedMessage
    //     id="data_management.rasters_sources"
    //     defaultMessage="Rasters Sources"
    //   />
    // ),
    order: 100,
    onPage: "/data_management/rasters",
    linksTo: "/data_management/rasters/sources",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: rasterSourcesIcon
  },
  {
    title: "Rasters Layers",
    // title: (
    //   <FormattedMessage
    //     id="data_management.raster_layers"
    //     defaultMessage="Raster Layers"
    //   />
    // ),
    order: 200,
    onPage: "/data_management/rasters",
    linksTo: "/data_management/rasters/layers",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: rasterLayersIcon,
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management/rasters",
    linksTo: "/data_management",
    requiresOneOfRoles: ["admin", "supplier","user", "manager"],
    icon: backArrowIcon
  },
  {
    title: "Label types",
    // title: (
    //   <FormattedMessage
    //     id="data_management.labeltypes"
    //     defaultMessage="Label types"
    //   />
    // ),
    order: 100,
    onPage: "/data_management/labels",
    linksTo: "/data_management/labels/label_types",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: labeltypesIcon
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management/labels",
    linksTo: "/data_management",
    requiresOneOfRoles: ["admin", "supplier","user", "manager"],
    icon: backArrowIcon
  },
  {
    title: "Time Series",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management/timeseries",
    linksTo: "/data_management/timeseries/timeseries",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: timeseriesIcon
  },
  {
    title: "Monitoring Networks",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management/timeseries",
    linksTo: "/data_management/timeseries/monitoring_networks",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: monitoringsNetworkicon,
  },
  {
    title: "Locations",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management/timeseries",
    linksTo: "/data_management/timeseries/locations",
    requiresOneOfRoles: ["admin", "supplier",],
    icon: locationsIcon,
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 400,
    onPage: "/data_management/timeseries",
    linksTo: "/data_management",
    requiresOneOfRoles: ["admin", "supplier","user", "manager"],
    icon: backArrowIcon
  },
  {
    title: "Notifications",
    // title: (
    //   <FormattedMessage
    //     id="alarms.notifications"
    //     defaultMessage="Notifications"
    //   />
    // ),
    order: 100,
    onPage: "/alarms",
    linksTo: "/alarms/notifications",
    requiresOneOfRoles: ["admin",],
    icon: alarmsIcon,
  },
  {
    title: "Groups",
    // title: (
    //   <FormattedMessage
    //     id="alarms.recipients"
    //     defaultMessage="Recipients"
    //   />
    // ),
    order: 200,
    onPage: "/alarms",
    linksTo: "/alarms/groups",
    requiresOneOfRoles: ["admin",],
    icon: groupsIcon
  },
  {
    title: "Contacts",
    // title: (
    //   <FormattedMessage
    //     id="alarms.alarms_contacts"
    //     defaultMessage="Contacts"
    //   />
    // ),
    order: 300,
    onPage: "/alarms",
    linksTo: "/alarms/contacts",
    requiresOneOfRoles: ["admin",],
    icon: contactsIcon
  },
  {
    title: "Templates",
    // title: (
    //   <FormattedMessage
    //     id="alarms.alarms_templates"
    //     defaultMessage="Templates"
    //   />
    // ),
    order: 400,
    onPage: "/alarms",
    linksTo: "/alarms/templates",
    requiresOneOfRoles: ["admin",],
    icon: templatesIcon,
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 500,
    onPage: "/alarms",
    linksTo: "/",
    requiresOneOfRoles: ["admin", "supplier","user", "manager"],
    icon: backArrowIcon
  },
  {
    title: "Raster Alarms",
    // title: (
    //   <FormattedMessage
    //     id="alarms.raster_alarms"
    //     defaultMessage="Raster Alarms"
    //   />
    // ),
    order: 100,
    onPage: "/alarms/notifications",
    linksTo: "/alarms/notifications/raster_alarms",
    requiresOneOfRoles: ["admin",],
    icon: alarmsIcon,
  },
  {
    title: "Time Series Alarms",
    // title: (
    //   <FormattedMessage
    //     id="alarms.timeseries_alarms"
    //     defaultMessage="Timeseries Alarms"
    //   />
    // ),
    order: 200,
    onPage: "/alarms/notifications",
    linksTo: "/alarms/notifications/timeseries_alarms",
    requiresOneOfRoles: ["admin",],
    icon: alarmsIcon,
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    order: 300,
    onPage: "/alarms/notifications",
    linksTo: "/alarms",
    requiresOneOfRoles: ["admin", "supplier","user", "manager"],
    icon: backArrowIcon
  },
];
