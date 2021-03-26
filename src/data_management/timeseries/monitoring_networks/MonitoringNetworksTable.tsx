import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { ModalDeleteContent } from '../../../components/ModalDeleteContent';
import Modal from '../../../components/Modal';
import monitoringNetworkIcon from "../../../images/monitoring_network_icon.svg";
import tableStyles from "../../../components/Table.module.css";

const baseUrl = "/api/v4/monitoringnetworks/";
const navigationUrl = "/data_management/timeseries/monitoring_networks";

const fetchMonitoringNetworksWithOptions = (uuids: string[], fetchOptions:any) => {
  const fetches = uuids.map (uuid => {
    return (fetch(baseUrl + uuid + "/", fetchOptions));
  });
  return Promise.all(fetches);
};

export const MonitoringNetworksTable = (props: RouteComponentProps) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<Function | null>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const deleteActions = (rows: any[], tableData: any, setTableData: any, triggerReloadWithCurrentPage: any, triggerReloadWithBasePage: any, setCheckboxes: any) => {
    setRowsToBeDeleted(rows);
    const uuids = rows.map(row=> row.uuid);
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
      return fetchMonitoringNetworksWithOptions(uuids, opts)
      .then((_result) => {
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
      return fetchMonitoringNetworksWithOptions([row.uuid], opts)
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
          title={row.name}
        >
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{!row.name? "(empty name)" : row.name }</NavLink>
        </span>
      ,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Access modifier",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={row.access_modifier}
        >
          {row.access_modifier}
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
                  displayValue: "Delete",
                  actionFunction: deleteAction
                }
              ]}
            />
        );
      },
      orderingField: null,
    }
  ];

  const handleNewClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={monitoringNetworkIcon}
      imgAltDescription={"Monitoring-Network icon"}
      headerText={"Monitoring Networks"}
      explanationText={"Search or sort your monitoring-networks here."}
      backUrl={"/data_management/timeseries"}
    >
      <TableStateContainer
        gridTemplateColumns={"10fr 60fr 20fr 10fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        newItemOnClick={handleNewClick}
        checkBoxActions={[
          {
            displayValue: "Delete",
            actionFunction: deleteActions
          }
        ]}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'}
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
          <p>Are you sure? You are deleting the following monitoring networks:</p>
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
          <p>Are you sure? You are deleting the following monitoring network:</p>
          {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 40}, {name: "uuid", width: 60}])}
        </Modal>
      ) : null}
    </ExplainSideColumn>
  );
}