import { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from "../../../components/TableStateContainer";
import TableActionButtons from "../../../components/TableActionButtons";
import DeleteModal from "../../../components/DeleteModal";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { defaultTableHelpText } from "../../../utils/help_texts/defaultHelpText";
import { ColumnDefinition } from "../../../components/Table";
import { Project } from "../../../types/projectType";
import { getAccessibiltyText } from "../../../form/AccessModifier";
import projectIcon from "../../../images/project.svg";
import tableStyles from "../../../components/Table.module.css";

const baseUrl = "/api/v4/projects/";
const navigationUrl = "/management/data_management/scenarios/projects";

const fetchProjectsWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map((uuid) => {
    return fetch(baseUrl + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches);
};

export const ProjectTable = (props: RouteComponentProps) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<Project[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: Project[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<Project>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.name}>
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
        </span>
      ),
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Supplier",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.supplier}>
          {row.supplier}
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
              {
                displayValue: "Delete",
                actionFunction: (
                  row,
                  triggerReloadWithCurrentPage,
                  _triggerReloadWithBasePage
                ) => {
                  deleteActions([row], triggerReloadWithCurrentPage, null);
                },
              }
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
      imgUrl={projectIcon}
      imgAltDescription={"Project"}
      headerText={"Projects"}
      explanationText={defaultTableHelpText(
        "Projects are used to group and give insights on 3Di scenarios."
      )}
      backUrl={"/management/data_management/scenarios"}
    >
      <TableStateContainer
        gridTemplateColumns={"10fr 40fr 20fr 20fr 10fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        newItemOnClick={handleNewClick}
        checkBoxActions={[
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
          }
        ]}
        filterOptions={[
          { value: "name__icontains=", label: "Name" }
        ]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 65 },
            { name: "uuid", width: 35 },
          ]}
          fetchFunction={fetchProjectsWithOptions}
          resetTable={resetTable}
          handleClose={() => {
            setRowsToBeDeleted([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
};
