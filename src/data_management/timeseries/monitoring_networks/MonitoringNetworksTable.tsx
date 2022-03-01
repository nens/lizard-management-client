import React, { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from "../../../components/TableStateContainer";
import TableActionButtons from "../../../components/TableActionButtons";
import AuthorisationModal from "../../../components/AuthorisationModal";
import DeleteModal from "../../../components/DeleteModal";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { getAccessibiltyText } from "../../../form/AccessModifier";
import { defaultTableHelpText } from "../../../utils/help_texts/defaultHelpText";
import { fetchWithOptions } from "../../../utils/fetchWithOptions";
import monitoringNetworkIcon from "../../../images/monitoring_network_icon.svg";
import tableStyles from "../../../components/Table.module.css";
import { ColumnDefinition } from "../../../components/Table";
import { MonitoringNetwork } from "../../../types/monitoringNetworkType";

export const baseUrl = "/api/v4/monitoringnetworks/";
const navigationUrl = "/management/data_management/timeseries/monitoring_networks";

export const MonitoringNetworksTable = (props: RouteComponentProps) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<MonitoringNetwork[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for set accessibility action
  const [selectedRows, setSelectedRows] = useState<MonitoringNetwork[]>([]);

  const deleteActions = (
    rows: MonitoringNetwork[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<MonitoringNetwork>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.name}>
          <NavLink to={`${navigationUrl}/${row.uuid}`}>
            {!row.name ? "(empty name)" : row.name}
          </NavLink>
        </span>
      ),
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Accessibility",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.access_modifier}>
          {getAccessibiltyText(row.access_modifier)}
        </span>
      ),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "", //"Actions",
      renderFunction: (
        row,
        _updateTableRow,
        triggerReloadWithCurrentPage,
        triggerReloadWithBasePage
      ) => {
        return (
          <TableActionButtons
            tableRow={row}
            triggerReloadWithCurrentPage={triggerReloadWithCurrentPage}
            triggerReloadWithBasePage={triggerReloadWithBasePage}
            editUrl={`${navigationUrl}/${row.uuid}`}
            actions={[
              // {
              //   displayValue: "Change right",
              //   actionFunction: (row) => setSelectedRows([row])
              // },
              {
                displayValue: "Delete",
                actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                  deleteActions([row], triggerReloadWithCurrentPage, null);
                },
              },
            ]}
          />
        );
      },
      orderingField: null,
    },
  ];

  const handleNewClick = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={monitoringNetworkIcon}
      imgAltDescription={"Monitoring-Network icon"}
      headerText={"Monitoring Networks"}
      explanationText={defaultTableHelpText(
        "Monitoring networks are used to group and give insights on time series."
      )}
      backUrl={"/management/data_management/timeseries"}
    >
      <TableStateContainer
        gridTemplateColumns={"10fr 60fr 20fr 10fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        newItemOnClick={handleNewClick}
        checkBoxActions={[
          {
            displayValue: "Change rights",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              setSelectedRows(rows);
              setResetTable(() => () => {
                triggerReloadWithCurrentPage();
                setCheckboxes([]);
              });
            },
          },
          {
            displayValue: "Delete",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes);
            },
          },
        ]}
        filterOptions={[{ value: "name__icontains=", label: "Name" }]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 40 },
            { name: "uuid", width: 60 },
          ]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
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
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRows([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
};
