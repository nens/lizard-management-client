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
import catalogIcon from "../images/magnifiying-glass.svg";
import managementIcon from "../images/settings.svg";
import viewerIcon from "../images/world.svg";
import codeIcon from "../images/code.svg";
import docsIcon from "../images/document2.svg";
import supportIcon from "../images/support.svg";
import agreementIcon from "../images/agreement.svg";

import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';


export type Role = "admin"| "supplier"| "manager"| "user"
export interface NavigationLinkPage {
  onUrl: string,
  needsAuthentication: boolean,
  needsOneOfRoles: Role[],
}

type LinkOrHome = "LINK" | "HOME"
export interface NavigationLinkTile{
  title: string,
  subtitle?: string,
  // title: (
  //   <FormattedMessage
  //     id="home.data_management"
  //     defaultMessage="Data Management"
  //   />
  // ),
  homePageIcon: boolean,
  homePageLinkOrHome?:  LinkOrHome,
  order: number,
  onUrl: string,
  linksToUrl: string,
  requiresOneOfRoles: Role[],
  linksToUrlExternal: boolean,
  icon: string,
}


export const getNavigationLinkPageFromUrlAndAllNavigationLinkPages = (urlPostFix:string, allNavigationLinkPages:NavigationLinkPage[]) => {
  return allNavigationLinkPages.find(navigationLinkPage => navigationLinkPage.onUrl === urlPostFix);
}

export const getNavigationLinkTileFromUrlAndAllNavigationLinkTiles = (urlPostFix:string, allNavigationLinkTiles:NavigationLinkTile[]) => {
  const homeAppTileOnCompleteUrl = allNavigationLinkTiles.find(navigationLinkTile => navigationLinkTile.linksToUrl === urlPostFix);
  if (homeAppTileOnCompleteUrl) {
    return homeAppTileOnCompleteUrl;
  } else {
    const urlMinusLastPart = urlPostFix.split("/").slice(0,-1).join("/");
    return allNavigationLinkTiles.find(navigationLinkTile => navigationLinkTile.linksToUrl === urlMinusLastPart); 
  }
}

export const getCurrentUrlPostfix = () => {
  let urlPostfix = window.location.pathname;
  if (urlPostfix !== "/" && urlPostfix[urlPostfix.length-1] === "/")  {
    urlPostfix = urlPostfix.substring(0, urlPostfix.length-1)
  }
  return urlPostfix;
}

export const getCurrentNavigationLinkPage = () => {
  const urlPostfix = getCurrentUrlPostfix();
  return getNavigationLinkPageFromUrlAndAllNavigationLinkPages(urlPostfix, navigationLinkPages)
}
export const getCurrentNavigationLinkTile = () => {
  const urlPostfix = getCurrentUrlPostfix();
  return getNavigationLinkTileFromUrlAndAllNavigationLinkTiles(urlPostfix, navigationLinkTiles)
}


export const getNavigationLinkTilesFromNavigationLinkPageAndAllNavigationLinkTiles = (navigationLinkPage: NavigationLinkPage, navigationLinkTiles: NavigationLinkTile[]) => {
  return navigationLinkTiles.filter(navigationLinkTile=>navigationLinkTile.onUrl === navigationLinkPage.onUrl)
}

export const getCurrentNavigationLinkTiles = () => {
  const currentPage = getCurrentNavigationLinkPage();
  if (currentPage) {
    return getNavigationLinkTilesFromNavigationLinkPageAndAllNavigationLinkTiles(currentPage,navigationLinkTiles);
  } else{
    return [];
  }
}

export const userHasCorrectRolesForCurrentNavigationLinkTile = (userRoles: string[]) => {
  const currentHomeAppTile = getCurrentNavigationLinkTile();
  return !currentHomeAppTile || currentHomeAppTile.requiresOneOfRoles.length === 0 || doArraysHaveEqualElement(userRoles, currentHomeAppTile.requiresOneOfRoles);
}




export const navigationLinkPages: NavigationLinkPage[] = [
  {
    onUrl: "/",
    needsAuthentication: false,
    needsOneOfRoles: [],
  },
  {
    onUrl: "/management",
    needsAuthentication: true,
    needsOneOfRoles: ["admin", "supplier", "manager", "user"],
  },
  {
    onUrl: "/management/data_management",
    needsAuthentication: true,
    needsOneOfRoles: ["admin", "supplier"],
  },
  {
    onUrl: "/management/data_management/rasters",
    needsAuthentication: true,
    needsOneOfRoles: ["admin", "supplier"],
  },
  {
    onUrl: "/management/data_management/timeseries",
    needsAuthentication: true,
    needsOneOfRoles: ["admin", "supplier"],
  },
  {
    onUrl: "/management/data_management/labels",
    needsAuthentication: true,
    needsOneOfRoles: ["admin", "supplier"],
  },
  {
    onUrl: "/management/alarms",
    needsAuthentication: true,
    needsOneOfRoles: ["admin"],
  },
  {
    onUrl: "/management/alarms/notifications",
    needsAuthentication: true,
    needsOneOfRoles: ["admin"],
  },
];


export const navigationLinkTiles: NavigationLinkTile[] = [
  
  { 
    title: "catalogue",
    subtitle: "Search for your data",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: true,
    homePageLinkOrHome: "HOME",
    order: 100,
    onUrl: "/",
    linksToUrl: "/catalogue",
    linksToUrlExternal: true,
    requiresOneOfRoles: [],
    icon: catalogIcon,
  },
  { 
    title: "viewer",
    subtitle: "Explore your data",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: true,
    homePageLinkOrHome: "HOME",
    order: 100,
    onUrl: "/",
    linksToUrl: "/viewer",
    linksToUrlExternal: true,
    requiresOneOfRoles: [],
    icon: viewerIcon,
  },
  { 
    title: "management",
    subtitle: "Manage your data, users, alarms and GeoBlocks.",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: true,
    homePageLinkOrHome: "HOME",
    order: 100,
    onUrl: "/",
    linksToUrl: "/management",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["admin", "supplier", "manager", "user"],
    icon: managementIcon,
  },
  { 
    title: "api",
    subtitle: "Query your data",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: true,
    homePageLinkOrHome: "HOME",
    order: 100,
    onUrl: "/",
    linksToUrl: "/api",
    linksToUrlExternal: true,
    requiresOneOfRoles: [],
    icon: codeIcon,
  },
  { 
    title: "documentation",
    subtitle: "Read the docs.",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: true,
    homePageLinkOrHome: "LINK",
    order: 100,
    onUrl: "/",
    linksToUrl: "https://docs.lizard.net/a_lizard.html",
    linksToUrlExternal: true,
    requiresOneOfRoles: [],
    icon: docsIcon,
  },
  { 
    title: "support",
    subtitle: "Need help?",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: true,
    homePageLinkOrHome: "LINK",
    order: 100,
    onUrl: "/",
    linksToUrl: "https://nelen-schuurmans.topdesk.net/tas/public/ssp",
    linksToUrlExternal: true,
    requiresOneOfRoles: [],
    icon: supportIcon,
  },
  { 
    title: "data",
    // title: (
    //   <FormattedMessage
    //     id="home.data_management"
    //     defaultMessage="Data Management"
    //   />
    // ),
    homePageIcon: false,
    order: 100,
    onUrl: "/management",
    linksToUrl: "/management/data_management",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 200,
    onUrl: "/management",
    linksToUrl: "/management/users",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["manager"],
    icon: userManagementIcon,
  },
  { 
    title: "alarms",
    // title: (
    //   <FormattedMessage id="home.alarms" defaultMessage="Alarms" />
    // ),
    homePageIcon: false,
    order: 300,
    onUrl: "/management",
    linksToUrl: "/management/alarms",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management",
    linksToUrl: "/management/personal_api_keys",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["admin"],
    icon: personalApiKeysIcon,
  },
  { 
    title: "Contract",
    // title: (
    //   <FormattedMessage
    //     id="home.personal_api_keys"
    //     defaultMessage="Personal API keys"
    //   />
    // ),
    homePageIcon: false,
    order: 500,
    onUrl: "/management",
    linksToUrl: "/management/contract",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["user", "admin", "supplier", "manager"],
    icon: agreementIcon,
  },
  { 
    title: "Map viewer",
    // title: (
    //   <FormattedMessage
    //     id="home.personal_api_keys"
    //     defaultMessage="Personal API keys"
    //   />
    // ),
    homePageIcon: false,
    order: 600,
    onUrl: "/management",
    linksToUrl: "/management/map_viewer",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["user", "admin", "supplier", "manager"],
    icon: rasterIcon,
  },
  // {
  //   title: "Go Back",
  //   // title: (
  //   //   <FormattedMessage
  //   //     id="go_back"
  //   //     defaultMessage="Go Back"
  //   //   />
  //   // ),
  //   homePageIcon: false,
  //   order: 600,
  //   onUrl: "/management",
  //   linksToUrl: "/",
  //   linksToUrlExternal: false,
  //   requiresOneOfRoles: [],
  //   icon: backArrowIcon
  // },
  { 
    title: "rasters",
    // title: (
    //   <FormattedMessage
    //     id="data_management.rasters"
    //     defaultMessage="Rasters"
    //   />
    // ),
    homePageIcon: false,
    order: 100,
    onUrl: "/management/data_management",
    linksToUrl: "/management/data_management/rasters",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 200,
    onUrl: "/management/data_management",
    linksToUrl: "/management/data_management/wms_layers",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 250,
    onUrl: "/management/data_management",
    linksToUrl: "/management/data_management/timeseries",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    onUrl: "/management/data_management",
    linksToUrl: "/management/data_management/scenarios",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management",
    linksToUrl: "/management/data_management/labels",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management",
    linksToUrl: "/management",
    linksToUrlExternal: false,
    requiresOneOfRoles: [],
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
    homePageIcon: false,
    order: 100,
    onUrl: "/management/data_management/rasters",
    linksToUrl: "/management/data_management/rasters/sources",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 200,
    onUrl: "/management/data_management/rasters",
    linksToUrl: "/management/data_management/rasters/layers",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management/rasters",
    linksToUrl: "/management/data_management",
    linksToUrlExternal: false,
    requiresOneOfRoles: [],
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
    homePageIcon: false,
    order: 100,
    onUrl: "/management/data_management/labels",
    linksToUrl: "/management/data_management/labels/label_types",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management/labels",
    linksToUrl: "/management/data_management",
    linksToUrlExternal: false,
    requiresOneOfRoles: [],
    icon: backArrowIcon
  },
  {
    title: "Locations",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management/timeseries",
    linksToUrl: "/management/data_management/timeseries/locations",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["admin", "supplier",],
    icon: locationsIcon,
  },
  {
    title: "Time Series",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management/timeseries",
    linksToUrl: "/management/data_management/timeseries/timeseries",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management/timeseries",
    linksToUrl: "/management/data_management/timeseries/monitoring_networks",
    linksToUrlExternal: false,
    requiresOneOfRoles: ["admin", "supplier",],
    icon: monitoringsNetworkicon,
  },
  {
    title: "Go Back",
    // title: (
    //   <FormattedMessage
    //     id="go_back"
    //     defaultMessage="Go Back"
    //   />
    // ),
    homePageIcon: false,
    order: 400,
    onUrl: "/management/data_management/timeseries",
    linksToUrl: "/management/data_management",
    linksToUrlExternal: false,
    requiresOneOfRoles: [],
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
    homePageIcon: false,
    order: 100,
    onUrl: "/management/alarms",
    linksToUrl: "/management/alarms/notifications",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 200,
    onUrl: "/management/alarms",
    linksToUrl: "/management/alarms/groups",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 300,
    onUrl: "/management/alarms",
    linksToUrl: "/management/alarms/contacts",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 400,
    onUrl: "/management/alarms",
    linksToUrl: "/management/alarms/templates",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 500,
    onUrl: "/management/alarms",
    linksToUrl: "/management",
    linksToUrlExternal: false,
    requiresOneOfRoles: [],
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
    homePageIcon: false,
    order: 100,
    onUrl: "/management/alarms/notifications",
    linksToUrl: "/management/alarms/notifications/raster_alarms",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 200,
    onUrl: "/management/alarms/notifications",
    linksToUrl: "/management/alarms/notifications/timeseries_alarms",
    linksToUrlExternal: false,
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
    homePageIcon: false,
    order: 300,
    onUrl: "/management/alarms/notifications",
    linksToUrl: "/management/alarms",
    linksToUrlExternal: false,
    requiresOneOfRoles: [],
    icon: backArrowIcon
  },
];
