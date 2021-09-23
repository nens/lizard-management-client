// import React from 'react';
import {
  accessModifierHelpText,
  descriptionHelpText,
  HelpText,
  nameHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';

export const geoBlockHelpText: HelpText = {
  default: 'GeoBlocks management.',
  name: nameHelpText,
  uuid: uuidHelpText,
  description: descriptionHelpText,
  rasterSourceModal: 'Open modal to view connected raster source(s) of this layer.',
  observationType: 'Choose the way the data is measured and the units.',
  accessModifier: accessModifierHelpText,
  supplier: supplierHelpText,
};