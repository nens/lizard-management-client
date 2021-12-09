import React from 'react';
import { useSelector} from 'react-redux';
import {
  getScenarioTotalSize,
  getScenarioAvailableSizeDefinedByContract,
  getSelectedOrganisation
} from '../../reducers';
import {
  accessModifierHelpText,
  HelpText,
  organisationHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';
import UsagePieChart from './../../components/UsagePieChart';

export const DefaultScenarioExplanationText = () => {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const scenarioTotalSize = useSelector(getScenarioTotalSize);
  const scenarioAvailableSizeDefinedByContract = useSelector(getScenarioAvailableSizeDefinedByContract);
  return (
    <div>
      <div
        style={{
          display:"flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{marginBottom: "16px",}}>
          {`Scenario storage used for`}
          <div style={{fontWeight: "bold"}}>{selectedOrganisation.name}</div>
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
  name: 'The scenario name comes from 3Di. This name can be changed for your convenience.',
  uuid: uuidHelpText,
  modelName: 'The model that was used to create this scenario.',
  resultDeleteButton: (
    <>
      <p>Delete data that was saved in this scenario.</p>
      <p><i>Raw data takes up the most space, and deleting it will have no impact on the other layers created in this scenario.</i></p>
    </>
  ),
  organisation: organisationHelpText,
  supplier: supplierHelpText,
  accessModifier: accessModifierHelpText,
}