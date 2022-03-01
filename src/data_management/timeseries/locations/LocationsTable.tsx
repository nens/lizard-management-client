import React, { useState } from "react";
import TableStateContainer from "../../../components/TableStateContainer";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { getAccessibiltyText } from "../../../form/AccessModifier";
import { defaultTableHelpText } from "../../../utils/help_texts/defaultHelpText";
import { fetchWithOptions } from "../../../utils/fetchWithOptions";
import { useRecursiveFetch } from "../../../api/hooks";
import TableActionButtons from "../../../components/TableActionButtons";
import AuthorisationModal from "../../../components/AuthorisationModal";
import DeleteLocationNotAllowed from "./DeleteLocationNotAllowed";
import DeleteModal from "../../../components/DeleteModal";
import Modal from "../../../components/Modal";
import tableStyles from "../../../components/Table.module.css";
import locationIcon from "../../../images/locations_icon.svg";
import MDSpinner from "react-md-spinner";
import { ColumnDefinition } from "../../../components/Table";
import { LocationFromAPI } from "../../../types/locationFormTypes";

export const baseUrl = "/api/v4/locations/";
const navigationUrl = "/management/data_management/timeseries/locations";

export const LocationsTable = (props: RouteComponentProps) => {
  const [rowToBeDeleted, setRowToBeDeleted] = useState<LocationFromAPI | null>(null);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // selected rows for set accessibility action
  const [selectedRows, setSelectedRows] = useState<LocationFromAPI[]>([]);

  const { data: dependentTimeseries } = useRecursiveFetch(
    "/api/v4/timeseries/",
    { location__uuid: rowToBeDeleted ? rowToBeDeleted.uuid : "" },
    { enabled: !!rowToBeDeleted }
  );

  const deleteActions = (
    row: LocationFromAPI,
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowToBeDeleted(row);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<LocationFromAPI>[] = [
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
      titleRenderFunction: () => "Code",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.code}>
          {row.code}
        </span>
      ),
      orderingField: null,
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
                  deleteActions(row, triggerReloadWithCurrentPage, null);
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
      imgUrl={locationIcon}
      imgAltDescription={"Locations icon"}
      headerText={"Locations"}
      explanationText={defaultTableHelpText("Search or sort your locations here.")}
      backUrl={"/management/data_management/timeseries"}
    >
      <TableStateContainer
        gridTemplateColumns={"4fr 36fr 36fr 16fr 8fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
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
        ]}
        newItemOnClick={handleNewClick}
        filterOptions={[
          { value: "name__startswith=", label: "Name *" },
          { value: "code__startswith=", label: "Code *" },
        ]}
      />
      {rowToBeDeleted && !dependentTimeseries ? (
        <Modal title={"Loading"} cancelAction={() => setRowToBeDeleted(null)}>
          <MDSpinner size={24} />
          <span style={{ marginLeft: 40 }}>Loading dependent time series ...</span>
        </Modal>
      ) : null}
      {rowToBeDeleted && dependentTimeseries && dependentTimeseries.length === 0 ? (
        <DeleteModal
          rows={[rowToBeDeleted]}
          displayContent={[
            { name: "name", width: 40 },
            { name: "uuid", width: 60 },
          ]}
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
          uuids={dependentTimeseries.map((ts) => ts.uuid)}
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
};
