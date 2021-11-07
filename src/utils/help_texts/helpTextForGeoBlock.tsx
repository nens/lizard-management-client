import React from 'react';
import {
  accessModifierHelpText,
  descriptionHelpText,
  HelpText,
  layercollectionHelpText,
  nameHelpText,
  organisationHelpText,
  organisationsToSharedWithHelpText,
  sharedWithCheckboxHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';

export const geoBlockHelpText: HelpText = {
  default: 'GeoBlocks management.',
  name: nameHelpText,
  uuid: uuidHelpText,
  description: descriptionHelpText,
  layercollections: layercollectionHelpText,
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
  geoBlockBuildModal: 'Open modal to build this GeoBlock.',
  accessModifier: accessModifierHelpText,
  sharedWith: sharedWithCheckboxHelpText,
  organisationsToSharedWith: organisationsToSharedWithHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
};