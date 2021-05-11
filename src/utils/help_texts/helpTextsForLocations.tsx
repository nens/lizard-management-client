import {
  accessModifierHelpText,
  codeHelpText,
  HelpText,
  nameHelpText,
} from './defaultHelpText';

export const locationFormHelpText: HelpText = {
  default: 'Form to edit a location. Please select a field to get more information.',
  name: nameHelpText,
  code: codeHelpText,
  assetType: 'Specify a type of asset.',
  assetLocation: 'Select an asset or a point on the map',
  geometry: 'Geometry of the location.',
  accessModifier: accessModifierHelpText,
}