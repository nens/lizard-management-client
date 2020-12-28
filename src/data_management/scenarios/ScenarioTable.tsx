import React from 'react';
import {useState, }  from 'react';
import {useSelector} from 'react-redux';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layer_icon.svg";
import tableStyles from "../../components/Table.module.css";
import {getUsername} from "../../reducers";
import { bytesToDisplayValue } from '../../utils/byteUtils';
import ConfirmModal from '../../components/ConfirmModal';
import { ModalDeleteContent } from '../../components/ModalDeleteContent'

export const ScenarioTable = (props:any) =>  {

  const baseUrl = "/api/v4/scenarios/";
  const navigationUrl = "/data_management/scenarios";

  const deleteSingle = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
        const fetchOptions = {
          credentials: "same-origin",
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        };
      return fetch(baseUrl + row.uuid + "/", fetchOptions as RequestInit)
      .then((_result) => {
        setBusyDeleting(false);
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
            resolve();
          });
        })
    })
  }

  const deleteRawDataSingle = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
        const fetchOptions = {
          credentials: "same-origin",
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        };
      return fetch(baseUrl + row.uuid + "/results/raw", fetchOptions as RequestInit)
      .then((_result) => {
        setBusyDeleting(false);
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
            resolve();
          });
        })
    })
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
      // alert("not supported yet");
      Promise.all(uuids.map((uuid)=>{
        const fetchOptions = {
          credentials: "same-origin",
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        };
        // @ts-ignore
        return fetch(baseUrl + uuid + "/results/raw", fetchOptions)
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

  const columnDefinitions = [
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
      renderFunction: (row: any) => row.has_raw_results === true? "Yes" : "No",
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "Size",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={`${row.total_size? row.total_size: 0} Bytes`}
        >
          {`${row.total_size? bytesToDisplayValue(row.total_size): 0}`}
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
                  displayValue: "delete raw data",
                  actionFunction: deleteRawDataSingle,
                },
                {
                  displayValue: "delete",
                  actionFunction: deleteSingle,
                }
              ]}
            />
        );
      },
      orderingField: null,
    },
  ];

  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [deleteRawFunction, setDeleteRawFunction] = useState<null | Function>(null);


  const userName = useSelector(getUsername);

  return (
    <ExplainSideColumn
      imgUrl={rasterIcon}
      imgAltDescription={"Scenario icon"}
      headerText={"Scenarios"}
      explainationText={"Scenarios are created in 3di."} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 20% 18% 18% 14% 14% 8%"} 
          columnDefinitions={columnDefinitions}
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
        { 
        rowsToBeDeleted.length > 0 && deleteFunction?
           <ConfirmModal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
              deleteFunction && deleteFunction().then(()=>{
              setRowsToBeDeleted([]);
              setDeleteFunction(null);
             });
           }}
           cancelAction={()=>{
            setRowsToBeDeleted([]);
            setDeleteFunction(null);
          }}
          disableButtons={busyDeleting}
         >
           
           <p>Are you sure? You are deleting the following scenario's:</p>
           
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           
         </ConfirmModal>
        :
          null
        }

        { 
        rowToBeDeleted && deleteFunction?
           <ConfirmModal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
             deleteFunction && deleteFunction().then(()=>{
              setRowToBeDeleted(null);
              setDeleteFunction(null);
             });
             
           }}
           cancelAction={()=>{
             setRowToBeDeleted(null);
             setDeleteFunction(null);
           }}
           disableButtons={busyDeleting}
         >
           <p>Are you sure? You are deleting the following scenario:</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
         </ConfirmModal>
        :
          null
        }

        { 
        rowsToBeDeleted.length > 0 && deleteRawFunction?
           <ConfirmModal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
            deleteRawFunction && deleteRawFunction().then(()=>{
              setRowsToBeDeleted([]);
              setDeleteRawFunction(null);
             });
           }}
           cancelAction={()=>{
            setRowsToBeDeleted([]);
            setDeleteRawFunction(null);
          }}
          disableButtons={busyDeleting}
         >
           
           <p>Are you sure? You are deleting the RAW results of the following scenario's:</p>
           
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           
         </ConfirmModal>
        :
          null
        }

        { 
        rowToBeDeleted && deleteRawFunction?
           <ConfirmModal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
             deleteRawFunction && deleteRawFunction().then(()=>{
              setRowToBeDeleted(null);
              setDeleteRawFunction(null);
             });
             
           }}
           cancelAction={()=>{
             setRowToBeDeleted(null);
             setDeleteRawFunction(null);
           }}
           disableButtons={busyDeleting}
         >
           <p>Are you sure? You are deleting the RAW results of the following scenario::</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
         </ConfirmModal>
        :
          null
        }
     </ExplainSideColumn>
  );
}