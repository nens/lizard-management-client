import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import AddToMonitoringNetworkModal from './AddToMonitoringNetworkModal';
import AuthorisationModal from '../../../components/AuthorisationModal';
import DeleteModal from '../../../components/DeleteModal';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { getAccessibiltyText } from '../../../form/AccessModifier';
import { TimeseriesTableHelptext } from '../../../utils/help_texts/helpTextForTimeseries';
import { fetchWithOptions } from '../../../utils/fetchWithOptions';
import tableStyles from "../../../components/Table.module.css";
import timeseriesIcon from "../../../images/timeseries_icon.svg";
import { ColumnDefinition } from '../../../components/Table';
import { TimeseriesFromTimeseriesEndpoint } from '../../../types/timeseriesType';

export const baseUrl = "/api/v4/timeseries/";
const navigationUrl = "/management/data_management/timeseries/timeseries";

export const TimeseriesTable = (props: RouteComponentProps) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<TimeseriesFromTimeseriesEndpoint[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for set accessibility action
  const [selectedRows, setSelectedRows] = useState<TimeseriesFromTimeseriesEndpoint[]>([]);

  // selected rows for adding timeseries to Monitoring network action
  const [selectedRowsToAddMN, setSelectedRowsToAddMN] = useState<TimeseriesFromTimeseriesEndpoint[]>([]);

  const deleteActions = (
    rows: TimeseriesFromTimeseriesEndpoint[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<TimeseriesFromTimeseriesEndpoint>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => 
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
      renderFunction: (row) =>
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
      renderFunction: (row) => 
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
      renderFunction: (row) => 
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
      renderFunction: (row) => 
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
      renderFunction: (row, _updateTableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage) => {
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
                  displayValue: "Add to MN",
                  actionFunction: (row) => setSelectedRowsToAddMN([row])
                },
                {
                  displayValue: "Delete",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
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
      explanationText={<TimeseriesTableHelptext />}
      backUrl={"/management/data_management/timeseries"}
    >
      <TableStateContainer
        gridTemplateColumns={"4fr 20fr 18fr 18fr 22fr 14fr 4fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        newItemOnClick={handleNewClick}
        checkBoxActions={[
          {
            displayValue: "Change rights",
            actionFunction: (rows, _tableData, _setTableData, triggerReloadWithCurrentPage, _triggerReloadWithBasePage, setCheckboxes) => {
              setSelectedRows(rows);
              setResetTable(() => () => {
                triggerReloadWithCurrentPage();
                setCheckboxes([]);
              });
            }
          },
          {
            displayValue: "Add to MN",
            actionFunction: (rows, _tableData, _setTableData, _triggerReloadWithCurrentPage, _triggerReloadWithBasePage, setCheckboxes) => {
              setSelectedRowsToAddMN(rows);
              setResetTable(() => () => {
                // triggerReloadWithCurrentPage();
                setCheckboxes([]);
              });
            }
          },
          {
            displayValue: "Delete",
            actionFunction: (rows, _tableData, _setTableData, triggerReloadWithCurrentPage, _triggerReloadWithBasePage, setCheckboxes) => {
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