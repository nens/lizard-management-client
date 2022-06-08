import {
  codeHelpText,
  descriptionHelpText,
  HelpText,
  nameHelpText,
} from "./defaultHelpText";

export const scenarioResultFormHelpText: HelpText = {
  default: "Form to edit a scenario result. Please select a field to get more information.",
  name: nameHelpText,
  id: "ID of this object.",
  description: descriptionHelpText,
  code: codeHelpText,
  scenario: "Scenario source.",
  raster: "Connected raster layer.",
  family: "Different result types: R - Raw, B - Basic, A - Arrival, D - Damage.",
};
