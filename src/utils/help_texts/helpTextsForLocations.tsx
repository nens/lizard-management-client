import React from 'react';

import {
  accessModifierHelpText,
  codeHelpText,
  HelpText,
  nameHelpText,
  uuidHelpText,
} from './defaultHelpText';

export const locationFormHelpText: HelpText = {
  default: 'Form to edit a location. Please select a field to get more information.',
  name: nameHelpText,
  uuid: uuidHelpText,
  code: codeHelpText,
  assetType: 'Specify a type of asset.',
  assetLocation: 'Select an asset or a point on the map',
  geometry: 'Geometry of the location.',
  extraMetadata: (
    <>
      <p>Free JSON field to add information to this object.</p>
      <p><i>e.g. {'{“Location description”: “Near weir with code KST-43668”}'}</i></p>
    </>
  ),
  accessModifier: accessModifierHelpText,
}