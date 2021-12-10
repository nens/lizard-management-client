import React from 'react';
import {useState, }  from 'react';
import {useSelector} from 'react-redux';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import TableActionButtons from '../../components/TableActionButtons';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import threediIcon from "../../images/3di@3x.svg";
import tableStyles from "../../components/Table.module.css";
import {  getUsername } from "../../reducers";
import { bytesToDisplayValue } from '../../utils/byteUtils';
import { DefaultScenarioExplanationText } from '../../utils/help_texts/helpTextForScenarios';
import DeleteModal from '../../components/DeleteModal';
import AuthorisationModal from '../../components/AuthorisationModal';

const baseUrl = "/api/v4/scenarios/";
const navigationUrl = "/management/data_management/scenarios";

const fetchScenariosWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map (uuid => {
    return fetch(baseUrl + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches);
};

const fetchRawDataWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map (uuid => {
    return fetch(baseUrl + uuid + "/results/raw/", fetchOptions);
  });
  return Promise.all(fetches);
};

export const ScenarioTable = () =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowsWithRawDataToBeDeleted, setRowsWithRawDataToBeDeleted] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for action to change accessibility
  const [rowsToChangeAccess, setRowsToChangeAccess] = useState<any[]>([]);

  const userName = useSelector(getUsername);

  const deleteActions = (
    rows: any[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const deleteRawActions = (
    rows: any[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsWithRawDataToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

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
          style={{
            // Allow model name to break into multiple lines if too long
            whiteSpace: 'normal',
            wordBreak: 'break-all'
          }}
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
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteRawActions([row], triggerReloadWithCurrentPage, null)
                  }
                },
                {
                  displayValue: "Delete",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteActions([row], triggerReloadWithCurrentPage, null)
                  }
                }
              ] : [
                {
                  displayValue: "Delete",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteActions([row], triggerReloadWithCurrentPage, null)
                  }
                }
              ]}
            />
        );
      },
      orderingField: null,
    },
  ];

  return (
    <ExplainSideColumn
      imgUrl={threediIcon}
      imgAltDescription={"3Di icon"}
      headerText={"3Di Scenarios"}
      explanationText={<DefaultScenarioExplanationText />}
      backUrl={"/management/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"4fr 28fr 29fr 15fr 10fr 10fr 4fr"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Change rights",
              actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
                setRowsToChangeAccess(rows);
                setResetTable(() => () => {
                  triggerReloadWithCurrentPage();
                  setCheckboxes([]);
                });
              }
            },
            {
              displayValue: "Delete",
              actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
                deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes)
              }
            },{
              displayValue: "Delete raw",
              actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
                deleteRawActions(rows, triggerReloadWithCurrentPage, setCheckboxes)
              },
              checkIfActionIsApplicable: (row: any) => row.has_raw_results === true
            },
          ]}
          queryCheckBox={{
            text:"Only show own scenario's",
            adaptUrlFunction: (url:string) => {return userName? url + `&username__contains=${userName}` : url},
          }}
          filterOptions={[
            {value: 'name__icontains=', label: 'Name'},
            {value: 'uuid=', label: 'UUID'},
            {value: 'username__icontains=', label: 'Username'},
            {value: 'model_name__icontains=', label: 'Model name'},
          ]}
        />
        {rowsToBeDeleted.length > 0 ? (
          <DeleteModal
            rows={rowsToBeDeleted}
            displayContent={[{name: "name", width: 65}, {name: "uuid", width: 35}]}
            fetchFunction={fetchScenariosWithOptions}
            resetTable={resetTable}
            handleClose={() => {
              setRowsToBeDeleted([]);
              setResetTable(null);
            }}
          />
        ) : null}
        {rowsWithRawDataToBeDeleted.length > 0 ? (
          <DeleteModal
            rows={rowsWithRawDataToBeDeleted}
            displayContent={[{name: "name", width: 65}, {name: "uuid", width: 35}]}
            fetchFunction={fetchRawDataWithOptions}
            resetTable={resetTable}
            handleClose={() => {
              setRowsWithRawDataToBeDeleted([]);
              setResetTable(null);
            }}
            text={"Are you sure? You are deleting the RAW results of the following scenario(s):"}
          />
        ) : null}
        {rowsToChangeAccess.length > 0 ? (
          <AuthorisationModal
            rows={rowsToChangeAccess}
            fetchFunction={fetchScenariosWithOptions}
            resetTable={resetTable}
            handleClose={() => {
              setRowsToChangeAccess([]);
              setResetTable(null);
            }}
          />
        ) : null}
     </ExplainSideColumn>
  );
}