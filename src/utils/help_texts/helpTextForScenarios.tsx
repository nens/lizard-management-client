import { useSelector } from "react-redux";
import {
  getScenarioTotalSize,
  getScenarioAvailableSizeDefinedByContract,
  getSelectedOrganisation,
} from "../../reducers";
import {
  accessModifierHelpText,
  descriptionHelpText,
  HelpText,
  nameHelpText,
  organisationHelpText,
  supplierHelpText,
  uuidHelpText,
} from "./defaultHelpText";
import UsagePieChart from "./../../components/UsagePieChart";

export const DefaultScenarioExplanationText = () => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const scenarioTotalSize = useSelector(getScenarioTotalSize);
  const scenarioAvailableSizeDefinedByContract = useSelector(
    getScenarioAvailableSizeDefinedByContract
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          {`Scenario storage used for`}
          <div style={{ fontWeight: "bold" }}>{selectedOrganisation.name}</div>
        </div>
        <UsagePieChart
          used={scenarioTotalSize}
          available={scenarioAvailableSizeDefinedByContract}
        />
      </div>
    </div>
  );
};

export const scenarioFormHelpText: HelpText = {
  default: "View and manage a scenario.",
  name: nameHelpText,
  uuid: uuidHelpText,
  description: descriptionHelpText,
  source: "Source of the scenario.",
  project: "Project to group and give insights on scenarios.",
  simulationStart: "Start time of the simulation",
  simulationEnd: "End time of the simulation",
  simulationIdentifier: "Identifier of the simulation",
  modelName: "The model that was used to create this scenario.",
  modelIdentifier: "Identifier of the source model.",
  modelRevision: "Revision number of the source model.",
  resultDeleteButton: (
    <>
      <p>Delete data that was saved in this scenario.</p>
      <p>
        <i>
          Raw data takes up the most space, and deleting it will have no impact on the other layers
          created in this scenario.
        </i>
      </p>
    </>
  ),
  resultAddButton: "Add new result to the scenario.",
  organisation: organisationHelpText,
  supplier: supplierHelpText,
  accessModifier: accessModifierHelpText,
  extraMetadata: (
    <>
      <p>Free JSON field to add information to this object.</p>
      <p>
        <i>e.g. {"{“Location description”: “Near weir with code KST-43668”}"}</i>
      </p>
    </>
  ),
};
