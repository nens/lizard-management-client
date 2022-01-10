// Functions to open a Raster Layer or a GeoBlock in Lizard Viewer
// reuse from the openRasterInLizard function in the Lizard Catalogue repo
// @ https://github.com/nens/lizard-catalogue/blob/master/src/utils/url.ts

import { latLngBounds } from "leaflet";
import { RasterLayerFromAPI } from "../api/rasters";
import { SpatialBounds } from "../types/mapTypes";

const getBounds = (raster: RasterLayerFromAPI) => {
  const bounds = raster.spatial_bounds ? raster.spatial_bounds : {
      north: 85, east: 180, south: -85, west: -180
  };
  return bounds;
};

const getCenterPoint = (bounds: SpatialBounds) => {
  const { north, east, south, west } = bounds;
  const spatialBounds = latLngBounds([north, east], [south, west]);
  return spatialBounds.getCenter();
};

const zoomLevelCalculation = (bounds: SpatialBounds) => {
  const { north, east, south, west } = bounds;
  const GLOBE_WIDTH = 256; // a constant in Google's map projection
  let angle = east - west;
  if (angle < 0) angle += 360;
  let angle2 = north - south;
  if (angle2 > angle) angle = angle2;
  return Math.round(Math.log(960 * 360 / angle / GLOBE_WIDTH) / Math.LN2);
};

export const openRasterInLizardViewer = (raster: RasterLayerFromAPI) => {
  const bounds = getBounds(raster);
  const centerPoint = getCenterPoint(bounds);
  const zoom = zoomLevelCalculation(bounds);

  window.open(`/viewer/nl/map/topography,raster$${raster.uuid.substring(0, 7)}/point/@${centerPoint.lat},${centerPoint.lng},${zoom}`);
};