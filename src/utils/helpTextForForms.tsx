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
      <p><i>If this raster was created automatically from a source there will be a reference to it.</i></p>
    </>
  ),
  dataset: 'Choose a dataset for this object. Datasets are used to group objects together and can be seen as a tag or label.',
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
  observationType: 'Choose the way the data is measured, and the units.',
  colorMap: 'Choose a color range that is displayed on the Lizard portal.',
  accessModifier: 'Choose an access modifier to decide who has access to this object. The default is private.',
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

}

export const scenarioFormHelpText: HelpText = {

}