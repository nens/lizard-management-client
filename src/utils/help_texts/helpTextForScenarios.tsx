import React from 'react';

import {
  accessModifierHelpText,
  HelpText,
  organisationHelpText,
  supplierHelpText
} from './defaultHelpText';

export const defaultScenarioExplanationText = (usedSpaceString:string, organisation: string) => (
  <div
    style={{
      display:"grid",
      gridTemplateColumns: "1fr 1fr",
      columnGap: 5
    }}
  >
    <span>Organisation:</span>
    <span style={{ fontWeight: "bold" }}>{organisation}</span>
    <span>Used storage:</span>
    <span style={{ fontWeight: "bold" }}>{usedSpaceString}</span>
  </div>
);


export const scenarioFormHelpText: HelpText = {
  name: 'The scenario name comes from 3Di. This name can be changed for your convenience.',
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