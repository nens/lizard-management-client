import React from 'react';

import {
  accessModifierHelpText,
  datasetHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  organisationsToSharedWithHelpText,
  sharedWithCheckboxHelpText,
  supplierCodeHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';

export const defaultRasterSourceExplanationTextTable = (usedSpaceString:string) => {
  return (
    <div>
      <div style={{marginBottom: "16px"}}>Raster Sources are the containers for your raster data. When your raster data is uploaded to a Raster Source, it can be published as a Raster Layer to be visualized in the Catalogue and the Portal or it can be used in a GeoBlocks model.</div>
      <div 
        style={{display:"flex", justifyContent: "space-between",}}
      >
        <span>Used storage: </span>
        <span style={{fontWeight: "bold",}}>{usedSpaceString}</span>
      </div>
    </div>
  );
}

export const defaultRasterLayerHelpTextTable = "Raster Layers are visual presentations of your raster data. Choose the prefered Raster Source so that the Raster Layer fetches the right data and give the Raster Layer a name, description, observation type and styling. Once published, your Raster Layer will be visible in the Catalogue and the Portal.";

export const rasterSourceFormHelpText: HelpText = {
  default: 'Fill in the form to create a new Raster Source.',
  name: nameHelpText,
  uuid: uuidHelpText,
  description: 'Please give an accurate description of the content of this raster source.',
  supplierCode: supplierCodeHelpText,
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
  accessModifier: accessModifierHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
}

export const rasterLayerFormHelpText: HelpText = {
  default: 'Create a layer to view your raster data in the portal.',
  name: nameHelpText,
  uuid: uuidHelpText,
  description: (
    <>
      <p>Please give an accurate description of this object and its uses.</p>
      <p><i>If this raster was created automatically from a source, there will be a reference to it.</i></p>
    </>
  ),
  datasets: datasetHelpText,
  rasterSourceModal: 'Open modal to view connected sources of this layer.',
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
  accessModifier: 'The accessibility of a layer is inherited from the selected source by default.',
  sharedWith: sharedWithCheckboxHelpText,
  organisationsToSharedWith: organisationsToSharedWithHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
}