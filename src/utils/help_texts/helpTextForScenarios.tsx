import React from 'react';

import {
  accessModifierHelpText,
  HelpText,
  organisationHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';
import UsagePieChart from './../../components/UsagePieChart';




export const defaultScenarioExplanationText = (usedSpace:number, totalAvailableSpace: number, organisation: string) => {
  return (
    <div>
      {/* <div
        style={{
          display:"grid",
          gridTemplateColumns: "1fr 1fr",
          columnGap: 5,
          marginBottom: "32px",
        }}
      >
        <span>Organisation:</span>
        <span style={{ fontWeight: "bold" }}>{organisation}</span>
      </div> */}
      <div
        style={{
          display:"flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{marginBottom: "16px",}}>
          {`Scenario storage used for organisation `}
          <div style={{fontWeight: "bold"}}>{organisation}</div>
        </div>
        <UsagePieChart
          used={usedSpace}
          available={totalAvailableSpace}
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