import React from 'react';
import {useState, }  from 'react';
import {useSelector} from 'react-redux';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import threediIcon from "../../images/3di@3x.svg";
import tableStyles from "../../components/Table.module.css";
import {getSelectedOrganisation, getUsername} from "../../reducers";
import { bytesToDisplayValue } from '../../utils/byteUtils';
import Modal from '../../components/Modal';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';
import { defaultScenarioExplanationText } from '../../utils/form_help_texts/helpTextForScenarios';
import {getScenarioTotalSize} from '../../reducers';

export const ScenarioTable = () =>  {

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
    setDeleteRawFunction(()=>()=>{
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

    setRowsToBeDeleted(rows);
    const uuids = rows.map(row=> row.uuid);
    setDeleteRawFunction(()=>()=>{
      setBusyDeleting(true);
      const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
        if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
          return {...rowAllTables, markAsDeleted: true}
        } else{
          return {...rowAllTables};
        }
      })
      setTableData(tableDataDeletedmarker);
      return Promise.all(uuids.map((uuid)=>{
            const fetchOptions = {
              credentials: "same-origin",
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({})
            };
            return fetch(baseUrl + uuid + "/results/raw", fetchOptions as RequestInit)
      }))
      .then((_result) => {
        setBusyDeleting(false);
        if (setCheckboxes) {
          setCheckboxes([]);
        }
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
          resolve();
        });
      })
    });
  }

  const deleteMultiple =  (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
    setRowsToBeDeleted(rows);
    const uuids = rows.map(row=> row.uuid);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
        if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
          return {...rowAllTables, markAsDeleted: true}
        } else{
          return {...rowAllTables};
        }
      })
      setTableData(tableDataDeletedmarker);
      return Promise.all(uuids.map((uuid)=>{
            const fetchOptions = {
              credentials: "same-origin",
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({})
            };
            return fetch(baseUrl + uuid + "/", fetchOptions as RequestInit)
      }))
      .then((_result) => {
        setBusyDeleting(false);
        if (setCheckboxes) {
          setCheckboxes([]);
        }
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
          resolve();
        });
      })
    });
  }

  const columnDefinitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
          style={{
            // Allow name to break into multiple lines if too long
            whiteSpace: 'normal',
            wordBreak: 'break-all'
          }}
        >
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
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
              editUrl={`${navigationUrl}/${row.uuid}`}
              actions={row.has_raw_results ? [
                {
                  displayValue: "Delete raw data",
                  actionFunction: deleteRawDataSingle,
                },
                {
                  displayValue: "Delete",
                  actionFunction: deleteSingle,
                }
              ] : [
                {
                  displayValue: "Delete",
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
  const scenarioTotalSize = useSelector(getScenarioTotalSize);

  const userName = useSelector(getUsername);
  const selectedOrganisation = useSelector(getSelectedOrganisation);

  return (
    <ExplainSideColumn
      imgUrl={threediIcon}
      imgAltDescription={"3Di icon"}
      headerText={"3Di Scenarios"}
      explanationText={defaultScenarioExplanationText(bytesToDisplayValue(scenarioTotalSize), selectedOrganisation.name)}
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"4fr 38fr 19fr 15fr 10fr 10fr 4fr"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteMultiple,
            },{
              displayValue: "Delete raw",
              actionFunction: deleteRawDataMultiple,
              checkIfActionIsApplicable: (row: any) => row.has_raw_results === true
            },
          ]}
          // new item not supported for scenarios
          // newItemOnClick={handleNewRasterClick}
          queryCheckBox={{
            text:"Only show own scenario's",
            adaptUrlFunction: (url:string) => {return userName? url + `&username__contains=${userName}` : url},
          }}
          filterOptions={[
            {value: 'name__icontains=', label: 'Name'},
            {value: 'uuid=', label: 'UUID'},
            {value: 'username__icontains=', label: 'Username'},
            {value: 'model_name__icontains=', label: 'Model name'},
            // not needed for now
            // {value: 'model_revision__icontains=', label: 'Model revision'},
          ]}
        />
        { 
        rowsToBeDeleted.length > 0 && deleteFunction?
           <Modal
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
           
         </Modal>
        :
          null
        }

        { 
        rowToBeDeleted && deleteFunction?
           <Modal
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
         </Modal>
        :
          null
        }

        { 
        rowsToBeDeleted.length > 0 && deleteRawFunction?
           <Modal
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
           
         </Modal>
        :
          null
        }

        { 
        rowToBeDeleted && deleteRawFunction?
           <Modal
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
         </Modal>
        :
          null
        }
     </ExplainSideColumn>
  );
}