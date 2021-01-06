import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import tableStyles from "../../components/Table.module.css";
import labeltypesIcon from "../../images/labeltypes_icon.svg";


const baseUrl = "/api/v3/labeltypes/";
const navigationUrl = "/data_management/labels/labeltypes";



const columnDefinitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.name}
      >
        <NavLink to={`${navigationUrl}/${row.uuid}/`}>{!row.name? "(empty name)" : row.name }</NavLink>
      </span>
    ,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Uuid",
    renderFunction: (row: any) =>
    // (row: any) => {return !row.supplier_code ? "(empty 'supplier code')" : row.supplier_code },
      <span
        className={tableStyles.CellEllipsis}
        title={row.supplier_code}
      >
        {row.uuid}
      </span>
    ,
    orderingField: null,
  },
];

export const LabeltypesTable = (props:any) =>  {

  return (
    <ExplainSideColumn
      imgUrl={labeltypesIcon}
      imgAltDescription={"Label-types icon"}
      headerText={"Label-types"}
      explainationText={"Labeltypes are the different types of labels that can exist in the system"} 
      backUrl={"/data_management/labels"}
    >
      <TableStateContainer 
        gridTemplateColumns={"60% 40%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
      />
    </ExplainSideColumn>
  );
}