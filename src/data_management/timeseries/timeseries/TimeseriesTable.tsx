import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import AddToMonitoringNetworkModal from './AddToMonitoringNetworkModal';
import Modal from '../../../components/Modal';
import { ModalDeleteContent } from '../../../components/ModalDeleteContent';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import tableStyles from "../../../components/Table.module.css";
import timeseriesIcon from "../../../images/timeseries_icon.svg";

const baseUrl = "/api/v4/timeseries/";
const navigationUrl = "/data_management/timeseries/timeseries";

const fetchTimeseriesWithOptions = (uuids: string[], fetchOptions:any) => {
  const fetches = uuids.map (uuid => {
    return (fetch(baseUrl + uuid + "/", fetchOptions));
  });
  return Promise.all(fetches);
};

export const TimeseriesTable = (props:any) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<Function | null>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const deleteActions = (rows: any[], tableData: any, setTableData: any, triggerReloadWithCurrentPage: any, triggerReloadWithBasePage: any, setCheckboxes: any) => {
    setRowsToBeDeleted(rows);
    const uuids = rows.map(row => row.uuid);
    setDeleteFunction(() => () => {
      setBusyDeleting(true);
      const tableDataDeletedmarker = tableData.map((rowAllTables: any) => {
        if (uuids.find(uuid => uuid === rowAllTables.uuid)) {
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
      return fetchTimeseriesWithOptions(uuids, opts)
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

  const deleteAction = (row: any, updateTableRow: any, triggerReloadWithCurrentPage: any, triggerReloadWithBasePage: any) => {
    setRowToBeDeleted(row);
    setDeleteFunction(() => () => {
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      const opts = {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      return fetchTimeseriesWithOptions([row.uuid], opts)
      .then((_result) => {
        setBusyDeleting(false);
        // TODO: do we need this callback or should we otherwise indicate that the record is deleted ?
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
            resolve();
          });
        })
    })
  };

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
                {
                  displayValue: "Add to MN",
                  actionFunction: (row: any) => setSelectedRows([row])
                },
                {
                  displayValue: "Delete",
                  actionFunction: deleteAction,
                },
              ]}
            />
        );
      },
      orderingField: null,
    },
  ];

  const handleNewClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={timeseriesIcon}
      imgAltDescription={"Timeseries icon"}
      headerText={"Timeseries"}
      explanationText={"Search or sort your timeseries here."}
      backUrl={"/data_management/timeseries"}
    >
      <TableStateContainer 
        gridTemplateColumns={"4fr 24fr 22fr 26fr 16fr 8fr"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        newItemOnClick={handleNewClick}
        checkBoxActions={[
          {
            displayValue: "Add to MN",
            actionFunction: (rows: any[]) => setSelectedRows(rows)
          },
          {
            displayValue: "Delete",
            actionFunction: deleteActions
          }
        ]}
        filterOptions={[
          {value: 'name__startswith=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
      />

      {rowsToBeDeleted.length > 0 ? (
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
          <p>Are you sure? You are deleting the following time-series:</p>
          {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 40}, {name: "uuid", width: 60}])}
        </Modal>
      ) : null}

      {rowToBeDeleted ? (
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
          <p>Are you sure? You are deleting the following time-series:</p>
          {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 40}, {name: "uuid", width: 60}])}
        </Modal>
      ) : null}

      {selectedRows.length > 0 ? (
        <AddToMonitoringNetworkModal
          timeseries={selectedRows}
          handleClose={() => setSelectedRows([])}
        />
      ) : null}
    </ExplainSideColumn>
  );
}