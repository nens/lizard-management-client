import React from 'react';

import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import tableStyles from "../../components/Table.module.css";
import timeseriesIcon from "../../images/timeseries_icon.svg";
import TableActionButtons from '../../components/TableActionButtons';



const baseUrl = "/api/v4/timeseries/";
const navigationUrl = "/data_management/timeseries/timeseries";



const columnDefinitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={`${row.name} - UUID: ${row.uuid}`}
      >
        <NavLink to={`${navigationUrl}/${row.uuid}`}>{!row.name? "(empty name)" : row.name }</NavLink>
      </span>
    ,
    orderingField: "name",
  },
  {
    titleRenderFunction: () => "Observation type",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
      >
        {!row.observation_type? "(empty observation type)" : 
          row.observation_type.unit? <>{row.observation_type.code}{" "} <span style={{fontWeight:600,}}>{`(${row.observation_type.unit})`}</span></> : 
          row.observation_type.code 
        }
      </span>
    ,
    orderingField: "observation_type",
  },
  {
    titleRenderFunction: () => "Location",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        style={{
          // overflowX: "hidden",
          // display: "flex",
          // overwrite default behaviour tableStyles.CellEllipsis 
          whiteSpace: "break-spaces",
        }}
        title={`name: ${row.location.name}, code: ${row.location.code}`}
      >
        {
        !row.location? "(empty location)" : 
        row.location.code && row.location.code !==  row.location.name? 
        <> 
          <span
            // className={tableStyles.CellEllipsis}
            // style={{
            //   // display: "flex", 
            //   // flexBasis: "content", 
            //   // flexShrink: 0,
            //   minWidth: "10px",
            // }}
          >
            {row.location.name}
          </span>
          <span
            // className={tableStyles.CellEllipsis}
            // style={{
            //   display: "flex", 
            //   flexBasis: "content", 
            //   flexShrink: 0,
            // }}
          >
          {` (${row.location.code})`} 
          </span>
        </> 
        :
        row.location.name
        }
      </span>
    ,
    orderingField: "location",
  },
  {
    titleRenderFunction: () => "Accessibility",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.access_modifier}
      >
        {row.access_modifier }
      </span>
    ,
    orderingField: "access_modifier",
  },
  // // uuid for now not needed
  // {
  //   titleRenderFunction: () =>  "Uuid",
  //   renderFunction: (row: any) =>
  //     <span
  //       className={tableStyles.CellEllipsis}
  //       title={row.uuid}
  //     >
  //       {row.uuid}
  //     </span>
  //   ,
  //   orderingField: null,
  // },
  {
    titleRenderFunction: () =>  "",//"Actions",
    renderFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any) => {
      return (
          <TableActionButtons
            tableRow={row} 
            tableData={tableData}
            setTableData={setTableData} 
            triggerReloadWithCurrentPage={triggerReloadWithCurrentPage} 
            triggerReloadWithBasePage={triggerReloadWithBasePage}
            editUrl={`${navigationUrl}/${row.uuid}`}
            actions={[
              // {
              //   displayValue: "Delete",
              //   actionFunction: deleteActionRaster,
              // },
            ]}
          />
      );
    },
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
        gridTemplateColumns={"24% 22% 24% 22% 8%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        filterOptions={[
          {value: 'name__startswith=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
      />
    </ExplainSideColumn>
  );
}