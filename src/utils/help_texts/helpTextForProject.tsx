import {
  accessModifierHelpText,
  descriptionHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  supplierHelpText,
  uuidHelpText,
} from "./defaultHelpText";

export const projectFormHelpText: HelpText = {
  default: "Form to edit a project. Please select a field to get more information.",
  name: nameHelpText,
  uuid: uuidHelpText,
  code: "Project code.",
  description: descriptionHelpText,
  accessModifier: accessModifierHelpText,
  organisation: organisationHelpText,
  supplier: supplierHelpText,
};
