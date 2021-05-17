import React from 'react';

import {
  accessModifierHelpText,
  datasetHelpText,
  descriptionHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  organisationsToSharedWithHelpText,
  sharedWithCheckboxHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';

export const wmsFormHelpText: HelpText = {
  default: 'WMS layers allow to configure layers in Lizard even if they are hosted on another platform.',
  name: nameHelpText,
  uuid: uuidHelpText,
  description: descriptionHelpText,
  datasets: datasetHelpText,
  wms_url: 'Specify which URL is used to retrieve the image data.',
  slug: '',
  download_url: 'Specify which URL is used to download the data. This will enable the download button in the Lizard Catalogue.',
  legend_url: 'Specify which URL is used to show the legend of this layer.',
  get_feature_info_url: (
    <>
      <p>Optional URL to retrieve feature info data.</p>
      <p><i>Do not use the GeoWebCache (GWC) URL here.</i></p>
    </>
  ),
  tiled: (
    <>
      <p>Specifies whether the layer is tiled (for better performance).</p>
      <p><i>Enabled by default unless this layer is a "Temporal Raster" and needs to be animated. Only for "TMS" and "WMS".</i></p>
    </>
  ),
  min_zoom: 'Closest view point in this WMS layer.',
  max_zoom: 'Furthest view point in this WMS layer.',
  spatial_bounds: (
    <>
      <p>Specify the extent of this layer on the map.</p>
      <p><i>If the source is from a GeoServer, the "Get From GeoServer" button can be used to automatically obtain this information.</i></p>
    </>
  ),
  options: (
    <>
      <p>Extra options of this layer, specfied in JSON.</p>
      <p><i>e.g. {'{"transparent": "True"}'}</i></p>
    </>
  ),
  access_modifier: accessModifierHelpText,
  sharedWithCheckbox: sharedWithCheckboxHelpText,
  shared_with: organisationsToSharedWithHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
}