import React from 'react';
import {useSelector} from 'react-redux';



import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layers_logo_explainbar.svg";
import tableStyles from "../../components/Table.module.css";
import {getUsername} from "../../reducers";



const baseUrl = "/api/v4/scenarios/";
const navigationUrl = "/data_management/scenarios";

const deleteSingle = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
  if (window.confirm(`Are you sure you want to detele scenario with name: ${row.name} ?`)) {
    const uuid = row.uuid;
    const flushedRow =  {...row, markAsDeleted: true}
    updateTableRow(flushedRow);
    const fetchOptions = {
      //Not permanently deleted, this will be implemented in backend
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    };
    // @ts-ignore
    fetch(baseUrl + uuid + "/", fetchOptions).then(()=>{
      triggerReloadWithCurrentPage();
    });
  }
}

const deleteRawDataSingle = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
  if (window.confirm(`Are you sure you want to delete the raw data of scenario with name: ${row.name} ?`)) {
    // const uuid = row.uuid;
    const markAsDeletedRaw =  {...row, markAsDeletedRaw: true}
    updateTableRow(markAsDeletedRaw);
    // const fetchOptions = {
    //   //Not permanently deleted, this will be implemented in backend
    //   credentials: "same-origin",
    //   method: "DELETE",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({})
    // };
    alert("not implemented yet");
    // @ts-ignore
    // fetch(baseUrl + uuid + "/", fetchOptions).then(()=>{
    //   triggerReloadWithCurrentPage();
    // });
  }
}

const deleteRawDataMultiple = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{

  const uuids = rows.map(row=> row.uuid);
  const names = rows.map(row=> row.name);
  if (window.confirm(`Are you sure you want to delete the raw data of scenario's with names? \n ${names.join("\n")}`)) {
    const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
      if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
        return {...rowAllTables, markAsDeletedRaw: true}
      } else{
        return {...rowAllTables};
      }
    })
    setTableData(tableDataDeletedmarker);
    alert("not supported yet");
    // Promise.all(uuids.map((uuid)=>{
    //   const fetchOptions = {
    //     //Not permanently deleted, this will be implemented in backend
    //     credentials: "same-origin",
    //     method: "DELETE",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({})
    //   };
    //   // @ts-ignore
    //   return fetch(baseUrl + uuid + "/", fetchOptions)
    // }))
    // .then((_result) => {
    //   // TODO: this is not preferred way. see delet function in raster layer table
    //   if (setCheckboxes) {
    //     setCheckboxes([]);
    //   }
    //   triggerReloadWithCurrentPage();
    // })
  }
}

const deleteMultiple =  (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  const uuids = rows.map(row=> row.uuid);
  const names = rows.map(row=> row.name);
  if (window.confirm(`Are you sure you want to delete scenario's with names? \n ${names.join("\n")}`)) {
    const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
      if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
        return {...rowAllTables, markAsDeleted: true}
      } else{
        return {...rowAllTables};
      }
    })
    setTableData(tableDataDeletedmarker);
    Promise.all(uuids.map((uuid)=>{
      const fetchOptions = {
        //Not permanently deleted, this will be implemented in backend
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      // @ts-ignore
      return fetch(baseUrl + uuid + "/", fetchOptions)
    }))
    .then((_result) => {
      // TODO: this is not preferred way. see delet function in raster layer table
      if (setCheckboxes) {
        setCheckboxes([]);
      }
      triggerReloadWithCurrentPage();
    })
  }
}

const columnDefenitions = [
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
    titleRenderFunction: () =>  "Based on",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.model_name}
      >
        {row.model_name}
      </span>,
    orderingField: "model_name",
  },
  {
    titleRenderFunction: () =>  "User",
    renderFunction: (row: any) =>  
    <span
      className={tableStyles.CellEllipsis}
      title={row.username}
    >
      {row.username}
    </span>,
    orderingField: "username",
  },
  {
    titleRenderFunction: () =>  "Raw data",
    renderFunction: (row: any) => row.hasRawData === true? "Yes" : "No",
    orderingField: null,
  },
  {
    titleRenderFunction: () =>  "Size",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={`${row.total_size? row.total_size: 0} Bytes`}
      >
        {`${row.total_size? row.total_size: 0} Bytes`}
      </span>
    ,
    orderingField: "total_size",
  },
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
            actions={[
              {
                displayValue: "delete",
                actionFunction: deleteSingle,
              },
              {
                displayValue: "delete raw data",
                actionFunction: deleteRawDataSingle,
              }
            ]}
          />
      );
    },
    orderingField: null,
  },
];

export const ScenarioTable = (props:any) =>  {

  const userName = useSelector(getUsername);

  return (
    <ExplainSideColumn
      imgUrl={rasterIcon}
      headerText={"Scenarios"}
      explainationText={"Scenarios are created in 3di."} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 20% 18% 18% 14% 14% 8%"} 
          columnDefenitions={columnDefenitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteMultiple,
            },{
              displayValue: "Delete raw",
              actionFunction: deleteRawDataMultiple
            },
          ]}
          // new item not supported for scenarios
          // newItemOnClick={handleNewRasterClick}
          queryCheckBox={{
            text:"Only show own scenario's",
            adaptUrlFunction: (url:string) => {return userName? url + `&username__contains=${userName}` : url},
          }}
        />
     </ExplainSideColumn>
  );
}