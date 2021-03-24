import React from 'react';

import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import tableStyles from "../../components/Table.module.css";
import timeseriesIcon from "../../images/timeseries_icon.svg";


const baseUrl = "/api/v4/timeseries/";
const navigationUrl = "/data_management/timeseries/timeseries";



const columnDefinitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.name}
      >
        <NavLink to={`${navigationUrl}/${row.uuid}`}>{!row.name? "(empty name)" : row.name }</NavLink>
      </span>
    ,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Uuid",
    renderFunction: (row: any) =>
      <span
        className={tableStyles.CellEllipsis}
        title={row.uuid}
      >
        {row.uuid}
      </span>
    ,
    orderingField: null,
  },
];

export const TimeseriesTable = (props:any) =>  {

  return (
    <ExplainSideColumn
      imgUrl={timeseriesIcon}
      imgAltDescription={"Timeseries icon"}
      headerText={"Timeseries"}
      explanationText={"Search or sort your timeseries here."}
      backUrl={"/data_management/timeseries"}
    >
      <TableStateContainer 
        gridTemplateColumns={"60% 40%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
      />
    </ExplainSideColumn>
  );
}