import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import AddToMonitoringNetworkModal from './AddToMonitoringNetworkModal';
import AuthorisationModal from '../../../components/AuthorisationModal';
import DeleteModal from '../../../components/DeleteModal';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { getAccessibiltyText } from '../../../form/AccessModifier';
import { defaultTableHelpText } from '../../../utils/help_texts/defaultHelpText';
import { fetchWithOptions } from '../../../utils/fetchWithOptions';
import tableStyles from "../../../components/Table.module.css";
import timeseriesIcon from "../../../images/timeseries_icon.svg";

export const baseUrl = "/api/v4/timeseries/";
const navigationUrl = "/data_management/timeseries/timeseries";

export const TimeseriesTable = (props: RouteComponentProps) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for set accessibility action
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // selected rows for adding timeseries to Monitoring network action
  const [selectedRowsToAddMN, setSelectedRowsToAddMN] = useState<any[]>([]);

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
          title={`${row.name} - UUID: ${row.uuid}`}
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
          style={{
            whiteSpace: "break-spaces",
            wordBreak: "break-all"
          }}
        >
          <span>{row.code || ""}</span>
        </span>
      ,
      orderingField: "code",
    },
    {
      titleRenderFunction: () => "Observation type",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={
            !row.observation_type ? undefined :
            row.observation_type.unit ? `${row.observation_type.code} (${row.observation_type.unit})` :
            row.observation_type.code
          }
        >
          {!row.observation_type? "" :
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
            whiteSpace: "break-spaces",
            wordBreak: "break-all"
          }}
          title={`name: ${row.location.name}, code: ${row.location.code}`}
        >
          {!row.location ? "" :
            row.location.code && row.location.code !==  row.location.name ? (
            <>
              <span>{row.location.name}</span>
              <span>{` (${row.location.code})`}</span>
            </>
          ) : (
            <span>{row.location.name}</span>
          )}
        </span>
      ,
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Accessibility",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.access_modifier}
        >
          {getAccessibiltyText(row.access_modifier)}
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
                // {
                //   displayValue: "Change right",
                //   actionFunction: (row: any) => setSelectedRows([row])
                // },
                {
                  displayValue: "Add to MN",
                  actionFunction: (row: any) => setSelectedRowsToAddMN([row])
                },
                {
                  displayValue: "Delete",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteActions([row], triggerReloadWithCurrentPage, null)
                  }
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
      headerText={"Time Series"}
      explanationText={defaultTableHelpText('Search or sort your time series here.')}
      backUrl={"/data_management/timeseries"}
    >
      <TableStateContainer
        gridTemplateColumns={"4fr 20fr 18fr 18fr 22fr 14fr 4fr"}
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
            displayValue: "Add to MN",
            actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
              setSelectedRowsToAddMN(rows);
              setResetTable(() => () => {
                // triggerReloadWithCurrentPage();
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
          {value: 'name__startswith=', label: 'Name *'},
          {value: 'location__name__startswith=', label: 'Location name *'},
          {value: 'location__code__startswith=', label: 'Location code *'},
        ]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
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
      {selectedRowsToAddMN.length > 0 ? (
        <AddToMonitoringNetworkModal
          timeseries={selectedRowsToAddMN}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRowsToAddMN([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
}