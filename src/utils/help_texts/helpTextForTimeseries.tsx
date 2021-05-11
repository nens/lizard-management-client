import {
  accessModifierHelpText,
  codeHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  supplierCodeHelpText,
  supplierHelpText
} from './defaultHelpText';

export const timeseriesFormHelpText: HelpText = {
  default: 'Form to edit time series. Please select a field to get more information.',
  name: nameHelpText,
  code: codeHelpText,
  observationType: 'Choose how the data is measured and its units.',
  location: 'Choose the location you want to add this timeseries to.',
  valueType: 'Specify what kind of data is supplied.',
  intervalCheckbox: 'Specify a time range between each time series step.',
  interval: 'Specify a time range between each time series step.',
  accessModifier: accessModifierHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
  supplierCode: supplierCodeHelpText,
}