import {
  HelpText,
  accessModifierHelpText,
} from './defaultHelpText';

export const locationFormHelpText: HelpText = {
  default: "Select a field to get more info.",
  name: "Name of the location.",
  code: "Code of the location.",
  selectedAssetObj: "Select an asset or point on the map",
  // geometry is for now part of "selectedAssetObj". Change this?
  // gemetry: "Geometry of the location.",
  accessModifier: accessModifierHelpText,
}