import React from 'react';

interface HelpText {
  [name: string]: string | JSX.Element
}

export const rasterSourceFormHelpText: HelpText = {
  default: 'Fill in the form to create a new Raster Source.',
  name: 'Choose a name that is findable and not too difficult.',
  description: 'Please give an accurate description of this object and its uses.',
  supplierCode: (
    <>
      <p>The FTP or Supplier code is used as reference to your own system.</p>
      <p><i>If this is a manual entry, it can be left empty.</i></p>
    </>
  ),
  temporal: 'Indicates if there are multiple rasters over a time period.',
  interval: (
    <>
      <p>Specify a time range between each raster image.</p>
      <p><i>(e.g. A temporal raster shows data every 5 minutes. The period specified here is the interval)</i></p>
    </>
  ),
  data: (
    <>
      <p>Upload your raster files here in .tif format. Lizard will recognize the timestamp if it is in the filename.</p>
      <p><i>(e.g. "20210101T0101.tiff" will be translated to "01/01/2021 01:01")</i></p>
    </>
  ),
  accessModifier: (
    <>
      <p>Choose an access modifier to decide who has access to this object. The default is private.</p>
      <p><i>Once the object is created, this field cannot be changed anymore.</i></p>
    </>
  ),
  organisation: (
    <>
      <p>The organisation which this object belongs to.</p>
      <p><i>If you are not an administrator, this field is always pre-filled with the current organisation.</i></p>
    </>
  ),
  supplier: 'The supplier of this object.',
}

export const rasterLayerFormHelpText: HelpText = {
  default: 'Create a layer to view your raster data in the portal.',
  name: 'Choose a name that is findable and not too difficult.',
  description: (
    <>
      <p>Please give an accurate description of this object and its uses.</p>
      <p><i>If this raster was created automatically from a source, there will be a reference to it.</i></p>
    </>
  ),
  dataset: (
    <>
      <p>Choose a dataset for this object.</p>
      <p><i>Datasets are used to group objects together and can be seen as tag or label.</i></p>
    </>
  ),
  rasterSource: (
    <>
      <p>Choose a (raster) source for this object.</p>
      <p><i>If you come from a source, this will be pre-filled and immutable.</i></p>
    </>
  ),
  aggregationType: (
    <>
      <p>Specify how data should be aggregated in the Lizard portal.</p>
      <p><i>This variable is only used in the "region selection" of the Lizard portal.</i></p>
    </>
  ),
  observationType: 'Choose the way the data is measured and the units.',
  colorMap: 'Choose a color range that is displayed on the Lizard portal.',
  colormap_minimum: 'Lowest value in the colorscale',
  colormap_maximum: 'Highest value in the colorscale',
  colorMap_rescalable: 'Make color map rescalable.',
  accessModifier: 'The access modifier of a layer is inherited from the selected source by default.',
  sharedWith: 'Specify if this object should be accessible by other organisations.',
  organisationsToSharedWith: 'Search and select organisations to share with.',
  organisation: (
    <>
      <p>The organisation which this object belongs to.</p>
      <p><i>This field is always pre-filled with the current organisation.</i></p>
    </>
  ),
  supplier: 'The supplier of this object.',
}

export const wmsFormHelpText: HelpText = {
  default: 'WMS layers allow to configure layers in Lizard even if they are hosted on another platform.',
  name: 'Choose a name that is findable and not too difficult.',
  description: 'Please give an accurate description of this object and its uses.',
  datasets: (
    <>
      <p>Choose a dataset for this object.</p>
      <p><i>Datasets are used to group objects together and can be seen as tag or label.</i></p>
    </>
  ),
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
  access_modifier: 'Choose an access modifier to decide who has access to this object. The default is private.',
  sharedWithCheckbox: 'Specify if this object should be accessible by other organisations.',
  shared_with: 'Search and select organisations to share with.',
  organisation: (
    <>
      <p>The organisation which this object belongs to.</p>
      <p><i>If you are not an administrator, this field is always pre-filled with the current organisation.</i></p>
    </>
  ),
  supplier: 'The supplier of this object.',
}

export const scenarioFormHelpText: HelpText = {
  default: 'Form to edit 3Di scenario.',
  name: 'The scenario name comes from 3Di. This name can be changed for your convenience.',
  modelName: 'The model that was used to create this scenario.',
  resultDeleteButton: (
    <>
      <p>Delete data that was saved in this scenario.</p>
      <p><i>Raw data takes up the most space, and deleting it will have no impact on the other layers created in this scenario.</i></p>
    </>
  ),
  organisation: (
    <>
      <p>The organisation which this object belongs to.</p>
      <p><i>If you are not an administrator, this field is always pre-filled with the current organisation.</i></p>
    </>
  ),
  supplier: 'The supplier of this object.',
}

export const lableTypeFormHelpText: HelpText = {
  default: "Label types are different types of labels that can exist in the system.",
  name: "Name of the label type.",
  uuid: "Unique identifier of this label type.",
  description: 'Please give an accurate description of this object and its uses.',
  organisation: (
    <>
      <p>The organisation which this object belongs to.</p>
      <p><i>If you are not an administrator, this field is always pre-filled with the current organisation.</i></p>
    </>
  ),
}

export const personalApiKeysFormHelpText: HelpText = {
  default: "Personal API keys can be used to authenticate external applications in Lizard",
  name: "Name of the personal api key",
  scope: "Defines what the personal api key can be used for",
}