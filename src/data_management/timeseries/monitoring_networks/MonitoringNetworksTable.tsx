import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import AuthorisationModal from '../../../components/AuthorisationModal';
import DeleteModal from '../../../components/DeleteModal';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { getAccessibiltyText } from '../../../form/AccessModifier';
import { defaultTableHelpText } from '../../../utils/help_texts/defaultHelpText';
import monitoringNetworkIcon from "../../../images/monitoring_network_icon.svg";
import tableStyles from "../../../components/Table.module.css";

const baseUrl = "/api/v4/monitoringnetworks/";
const navigationUrl = "/data_management/timeseries/monitoring_networks";

const fetchMonitoringNetworksWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map (uuid => {
    return fetch(baseUrl + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches);
};

export const MonitoringNetworksTable = (props: RouteComponentProps) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for set accessibility action
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

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
      titleRenderFunction: () =>  "Accessibility",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={row.access_modifier}
        >
          {getAccessibiltyText(row.access_modifier)}
        </span>
      ,
      orderingField: null,
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
                // {
                //   displayValue: "Change right",
                //   actionFunction: (row: any) => setSelectedRows([row])
                // },
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
      explanationText={defaultTableHelpText('monitoring networks')}
      backUrl={"/data_management/timeseries"}
    >
      <TableStateContainer
        gridTemplateColumns={"10fr 60fr 20fr 10fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        newItemOnClick={handleNewClick}
        checkBoxActions={[
          {
            displayValue: "Change rights",
            actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
              setSelectedRows(rows);
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
          }
        ]}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
        ]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
          fetchFunction={fetchMonitoringNetworksWithOptions}
          resetTable={resetTable}
          handleClose={() => {
            setRowsToBeDeleted([]);
            setResetTable(null);
          }}
        />
      ) : null}
      {selectedRows.length > 0 ? (
        <AuthorisationModal
          rows={selectedRows}
          fetchFunction={fetchMonitoringNetworksWithOptions}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRows([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
}