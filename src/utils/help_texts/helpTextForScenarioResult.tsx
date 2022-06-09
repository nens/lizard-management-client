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
  raster: "Please select a raster layer.",
  family: (
    <>
      <p>Please select a scenario result type.</p>
      <ul>
        <li>R - Raw</li>
        <li>B - Basic</li>
        <li>A - Arrival</li>
        <li>D - Damage</li>
      </ul>
      <em>Note: Raw selection is not supported yet.</em>
    </>
  ),
};
