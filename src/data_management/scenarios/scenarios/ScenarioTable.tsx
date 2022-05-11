import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import TableStateContainer from "../../../components/TableStateContainer";
import TableActionButtons from "../../../components/TableActionButtons";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { ColumnDefinition } from "../../../components/Table";
import { Scenario } from "../../../types/scenarioType";
import { getUsername } from "../../../reducers";
import { bytesToDisplayValue } from "../../../utils/byteUtils";
import { DefaultScenarioExplanationText } from "../../../utils/help_texts/helpTextForScenarios";
import { getLocalDateString } from "../../../utils/dateUtils";
import DeleteModal from "../../../components/DeleteModal";
import AuthorisationModal from "../../../components/AuthorisationModal";
import AddToProjectModal from "./AddToProjectModal";
import threediIcon from "../../../images/3di@3x.svg";
import tableStyles from "../../../components/Table.module.css";

const baseUrl = "/api/v4/scenarios/";
const navigationUrl = "/management/data_management/scenarios/scenarios";

const fetchScenariosWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map((uuid) => {
    return fetch(baseUrl + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches);
};

const fetchRawDataWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map((uuid) => {
    return fetch(baseUrl + uuid + "/results/raw/", fetchOptions);
  });
  return Promise.all(fetches);
};

export const ScenarioTable = () => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<Scenario[]>([]);
  const [rowsWithRawDataToBeDeleted, setRowsWithRawDataToBeDeleted] = useState<Scenario[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  // Get query param of project__uuid from the URL if there is
  // to show a list of scenarios for a specific project
  const projectUuid = new URLSearchParams(window.location.search).get("project__uuid");

  // selected rows for action to change accessibility
  const [rowsToChangeAccess, setRowsToChangeAccess] = useState<Scenario[]>([]);

  // selected rows for adding scenarios to project action
  const [selectedRowsToAddToProject, setSelectedRowsToAddToProject] = useState<Scenario[]>([]);

  const userName = useSelector(getUsername);

  const deleteActions = (
    rows: Scenario[],
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
    rows: Scenario[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsWithRawDataToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<Scenario>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
          style={{
            // Allow name to break into multiple lines if too long
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
        >
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
        </span>
      ),
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Based on",
      renderFunction: (row) => (
        <span
          className={tableStyles.CellEllipsis}
          title={row.model_name}
          style={{
            // Allow model name to break into multiple lines if too long
            whiteSpace: "normal",
            wordBreak: "break-all",
          }}
        >
          {row.model_name}
        </span>
      ),
      orderingField: "model_name",
    },
    {
      titleRenderFunction: () => "Raw data",
      renderFunction: (row) => (row.has_raw_results === true ? "Yes" : "No"),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Last update",
      renderFunction: (row) => getLocalDateString(row.last_modified),
      orderingField: "last_modified",
    },
    {
      titleRenderFunction: () => "Size",
      renderFunction: (row) => (
        <span
          className={tableStyles.CellEllipsis}
          title={`${row.total_size ? row.total_size : 0} Bytes`}
        >
          {`${row.total_size ? bytesToDisplayValue(row.total_size) : 0}`}
        </span>
      ),
      orderingField: "total_size",
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
            actions={
              row.has_raw_results
                ? [
                    {
                      displayValue: "Add to Project",
                      actionFunction: (row) => setSelectedRowsToAddToProject([row]),
                    },
                    {
                      displayValue: "Delete raw data",
                      actionFunction: (
                        row,
                        triggerReloadWithCurrentPage,
                        _triggerReloadWithBasePage
                      ) => {
                        deleteRawActions([row], triggerReloadWithCurrentPage, null);
                      },
                    },
                    {
                      displayValue: "Delete",
                      actionFunction: (
                        row,
                        triggerReloadWithCurrentPage,
                        _triggerReloadWithBasePage
                      ) => {
                        deleteActions([row], triggerReloadWithCurrentPage, null);
                      },
                    },
                  ]
                : [
                    {
                      displayValue: "Add to Project",
                      actionFunction: (row) => setSelectedRowsToAddToProject([row]),
                    },
                    {
                      displayValue: "Delete",
                      actionFunction: (
                        row,
                        triggerReloadWithCurrentPage,
                        _triggerReloadWithBasePage
                      ) => {
                        deleteActions([row], triggerReloadWithCurrentPage, null);
                      },
                    },
                  ]
            }
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
      backUrl={"/management/data_management/scenarios"}
    >
      <TableStateContainer
        gridTemplateColumns={"4fr 25fr 30fr 10fr 14fr 10fr 4fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?${projectUuid ? `project__uuid=${projectUuid}&` : ''}`}
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
              setRowsToChangeAccess(rows);
              setResetTable(() => () => {
                triggerReloadWithCurrentPage();
                setCheckboxes([]);
              });
            },
          },
          {
            displayValue: "Add to Project",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              _triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              setSelectedRowsToAddToProject(rows);
              setResetTable(() => () => setCheckboxes([]));
            }
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
          {
            displayValue: "Delete raw",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              deleteRawActions(rows, triggerReloadWithCurrentPage, setCheckboxes);
            },
            checkIfActionIsApplicable: (row) => row.has_raw_results === true,
          },
        ]}
        queryCheckBox={{
          text: "Only show own scenarios",
          adaptUrlFunction: (url: string) => {
            return userName ? url + `&supplier__username=${userName}` : url;
          },
        }}
        filterOptions={[
          { value: "name__icontains=", label: "Name" },
          { value: "uuid=", label: "UUID" },
          { value: "username__icontains=", label: "Username" },
          { value: "model_name__icontains=", label: "Model name" },
        ]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 65 },
            { name: "uuid", width: 35 },
          ]}
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
          displayContent={[
            { name: "name", width: 65 },
            { name: "uuid", width: 35 },
          ]}
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
      {selectedRowsToAddToProject.length > 0 ? (
        <AddToProjectModal
          scenarios={selectedRowsToAddToProject}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRowsToAddToProject([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
};
