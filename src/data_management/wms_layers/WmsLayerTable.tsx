import React from 'react';

import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import wmsIcon from "../../images/wms@3x.svg";
import tableStyles from "../../components/Table.module.css";

const baseUrl = "/api/v4/wmslayers/";
const navigationUrl = "/data_management/wms_layers";

const fetchWmsLayerUuidsWithOptions = (uuids: string[], fetchOptions:any) => {
  const url = "/api/v4/wmslayers/";
  const fetches = uuids.map (wmsLayerUuid => {
    return (fetch(url + wmsLayerUuid + "/", fetchOptions));
  });
  return Promise.all(fetches)
}

const deleteActions = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  const uuids = rows.map(row=> row.uuid);
  if (window.confirm(`Are you sure you want to delete wms-layers with uuids? \n ${uuids.join("\n")}`)) {
    const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
      if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
        return {...rowAllTables, markAsDeleted: true}
      } else{
        return {...rowAllTables};
      }
    })
    setTableData(tableDataDeletedmarker);

      const opts = {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      fetchWmsLayerUuidsWithOptions(uuids, opts)
      .then((_result) => {
      if (setCheckboxes) {
        setCheckboxes([]);
      }
      triggerReloadWithCurrentPage();
    })
  }
}

const rasterSourceColumnDefenitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.name}
      >
        <NavLink to={`${navigationUrl}/${row.uuid}/`}>{row.name}</NavLink>
      </span>,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Description",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.description}
      >
        {row.description}
      </span>,
    orderingField: null,//"description",
  },
  {
    titleRenderFunction: () =>  "User",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.supplier}
      >
        {row.supplier}
      </span>,
    orderingField: "supplier",
  },
];

export const WmsLayerTable = (props:any) =>  {

  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      headerText={"WMS Layers"}
      explainationText={"WMS-Layers allow to configure layers in lizard even if they are hosted on another platform"} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 31% 36% 25%"} 
          columnDefenitions={rasterSourceColumnDefenitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteActions,
            }
          ]}
          newItemOnClick={handleNewRasterClick}
        />
     </ExplainSideColumn>
  );
}