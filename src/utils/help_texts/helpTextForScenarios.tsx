import React from 'react';

import {
  accessModifierHelpText,
  HelpText,
  organisationHelpText,
  supplierHelpText,
  uuidHelpText
} from './defaultHelpText';
import { bytesToDisplayValue } from '../../utils/byteUtils';



export const defaultScenarioExplanationText = (usedSpace:number, totalAvailableSpace: number, organisation: string) => {
  console.log('totalAvailableSpace', totalAvailableSpace)
  const usedSpaceString = bytesToDisplayValue(usedSpace);
  const totalAvailableSpaceString = bytesToDisplayValue(totalAvailableSpace); 
  const availableSpaceLeft = totalAvailableSpace - usedSpace
  const availableSpaceLeftString = bytesToDisplayValue(availableSpaceLeft); 

  const barchartHeight = 340;
  const fractionUsed = usedSpace / totalAvailableSpace;
  const fractionNotUsed = (totalAvailableSpace - usedSpace) / totalAvailableSpace;
  return (
    <div
      // style={{
      //   display:"grid",
      //   gridTemplateColumns: "1fr 1fr",
      //   columnGap: 5
      // }}
    >
      {/* <span>Organisation:</span>
      <span style={{ fontWeight: "bold" }}>{organisation}</span>
      <span>Used storage:</span>
      <span style={{ fontWeight: "bold" }}>{usedSpaceString}</span>
      <span>Available storage:</span>
      <span style={{ fontWeight: "bold" }}>{availableSpace}</span> */}
      {/* <span>Used storage:</span>
      <span style={{ fontWeight: "bold" }}>{usedSpaceString}</span>
      <span>Storage left:</span>
      <span style={{ fontWeight: "bold" }}>{availableSpaceLeft}</span> */}
      <div>
        <div
          style={{
            display:"grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 5
          }}
        >
          <span>Total available: </span>
          <span style={{ fontWeight: "bold" }}>{totalAvailableSpaceString}</span>
        </div>
      
        </div>
        <svg width="264" height="400" viewBox="0 0 264 400">
          <rect
            x="10"
            y="50"
            width="80"
            height={barchartHeight}
            fill="blue"
          />
          <rect
            x="10"
            y={50+fractionNotUsed}
            width="80"
            height={fractionUsed*340}
            fill="red"
          />
          <g transform="translate(0 200)">
            <text x="0" y="0">
              <tspan x="0" dy="1.2em">Total space</tspan>
              <tspan x="0" dy="1.2em">{totalAvailableSpace}</tspan>
            </text>
          </g>
        </svg>
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