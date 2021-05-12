import {
  accessModifierHelpText,
  descriptionHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  uuidHelpText,
} from './defaultHelpText';

export const monitoringNetworkFormHelpText: HelpText = {
  default: 'Form to edit a monitoring network. Please select a field to get more information.',
  name: nameHelpText,
  uuid: uuidHelpText,
  description: descriptionHelpText,
  timeseriesModal: 'Open modal to manage time series with option to remove them from the monitoring network.',
  accessModifier: accessModifierHelpText,
  organisation: organisationHelpText,
}