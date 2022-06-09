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
      <p>Pleaes select a scenario result type.</p>
      <ul>
        <li>B - Basic</li>
        <li>A - Arrival</li>
        <li>D - Damage</li>
      </ul>
      <em>Note: Raw is not available for selection yet.</em>
    </>
  ),
};
