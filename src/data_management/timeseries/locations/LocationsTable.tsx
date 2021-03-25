import React from 'react';

import TableStateContainer from '../../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../../components/ExplainSideColumn';
import tableStyles from "../../../components/Table.module.css";
import locationIcon from "../../../images/locations_icon.svg";
import TableActionButtons from '../../../components/TableActionButtons';

const baseUrl = "/api/v4/locations/";
const navigationUrl = "/data_management/timeseries/locations";



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
    titleRenderFunction: () => "Code",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.code}
      >
        {row.code}
      </span>
    ,
    orderingField: "code",
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

export const LocationsTable = (props:any) =>  {

  const handleNewClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={locationIcon}
      imgAltDescription={"Locations icon"}
      headerText={"Locations"}
      explanationText={"Search or sort your locations here."}
      backUrl={"/data_management/locations"}
    >
      <TableStateContainer 
        gridTemplateColumns={"40% 40% 12% 8%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        newItemOnClick={handleNewClick}
        filterOptions={[
          {value: 'name__startswith=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
      />
    </ExplainSideColumn>
  );
}