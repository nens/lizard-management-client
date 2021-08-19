import React, { useState } from 'react';
import TableStateContainer from '../../../components/TableStateContainer';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { getAccessibiltyText } from '../../../form/AccessModifier';
import { defaultTableHelpText } from '../../../utils/help_texts/defaultHelpText';
import { fetchWithOptions } from '../../../utils/fetchWithOptions';
import { useRecursiveFetch } from '../../../api/hooks';
import TableActionButtons from '../../../components/TableActionButtons';
import AuthorisationModal from '../../../components/AuthorisationModal';
import DeleteLocationNotAllowed from './DeleteLocationNotAllowed';
import DeleteModal from '../../../components/DeleteModal';
import Modal from '../../../components/Modal';
import tableStyles from "../../../components/Table.module.css";
import locationIcon from "../../../images/locations_icon.svg";
import MDSpinner from 'react-md-spinner';

export const baseUrl = "/api/v4/locations/";
const navigationUrl = "/management/data_management/timeseries/locations";

export const LocationsTable = (props: RouteComponentProps) =>  {
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for set accessibility action
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const { data: dependentTimeseries } = useRecursiveFetch(
    '/api/v4/timeseries/',
    { location__uuid: rowToBeDeleted ? rowToBeDeleted.uuid : '' },
    { enabled: !!rowToBeDeleted }
  );

  const deleteActions = (
    row: any,
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowToBeDeleted(row);
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
      titleRenderFunction: () => "Code",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.code}
        >
          {row.code}
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
                    deleteActions(row, triggerReloadWithCurrentPage, null)
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
  }

  return (
    <ExplainSideColumn
      imgUrl={locationIcon}
      imgAltDescription={"Locations icon"}
      headerText={"Locations"}
      explanationText={defaultTableHelpText('Search or sort your locations here.')}
      backUrl={"/management/data_management/timeseries"}
    >
      <TableStateContainer 
        gridTemplateColumns={"4fr 36fr 36fr 16fr 8fr"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
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
        ]}
        newItemOnClick={handleNewClick}
        filterOptions={[
          {value: 'name__startswith=', label: 'Name *'},
          {value: 'code__startswith=', label: 'Code *'},
        ]}
      />
      {rowToBeDeleted && !dependentTimeseries ? (
        <Modal
          title={'Loading'}
          cancelAction={() => setRowToBeDeleted(null)}
        >
          <MDSpinner size={24} /><span style={{ marginLeft: 40 }}>Loading dependent time series ...</span>
        </Modal>
      ) : null}
      {rowToBeDeleted && dependentTimeseries && dependentTimeseries.length === 0  ? (
        <DeleteModal
          rows={[rowToBeDeleted]}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setRowToBeDeleted(null);
            setResetTable(null);
          }}
        />
      ) : null}
      {rowToBeDeleted && dependentTimeseries && dependentTimeseries.length ? (
        <DeleteLocationNotAllowed
          name={rowToBeDeleted.name}
          uuids={dependentTimeseries.map(ts => ts.uuid)}
          closeDialogAction={() => setRowToBeDeleted(null)}
        />
      ) : null}
      {selectedRows.length ? (
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
}