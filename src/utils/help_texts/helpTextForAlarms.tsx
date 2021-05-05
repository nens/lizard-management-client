import {
  HelpText,
  nameHelpText,
} from './defaultHelpText';

export const rasterAlarmFormHelpText: HelpText = {
  default: 'Form to edit a raster alarm. Please select a field to get more information.',
  name: nameHelpText,
  raster: 'Select a temporal raster.',
  point: 'Select an asset or a location on the map.',
  geometry: 'Geometry of the location.',
}

export const timeseriesAlarmFormHelpText: HelpText = {
  default: 'Form to edit a time-series alarm. Please select a field to get more information.',
  name: nameHelpText,
  timeseries_asset: 'Select a location.',
  timeseries_nestedAsset: 'Select a nested asset if any.',
  timeseries: 'Select a time-series.',
}