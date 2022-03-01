import React, { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from "../../components/TableStateContainer";
import TableActionButtons from "../../components/TableActionButtons";
import tableStyles from "../../components/Table.module.css";
import { ExplainSideColumn } from "../../components/ExplainSideColumn";
import { fetchWithOptions } from "../../utils/fetchWithOptions";
import { Message } from "../../types/messageType";
import DeleteModal from "../../components/DeleteModal";
import templateIcon from "../../images/templates@3x.svg";
import { ColumnDefinition } from "../../components/Table";

export const baseUrl = "/api/v4/messages/";
const navigationUrl = "/management/alarms/templates";

export const TemplateTable: React.FC<RouteComponentProps> = (props) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<Message[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: Message[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<Message>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.name}>
          <NavLink to={`${navigationUrl}/${row.id}`}>{row.name}</NavLink>
        </span>
      ),
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Type",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.type}>
          {row.type.toUpperCase()}
        </span>
      ),
      orderingField: "type",
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
            editUrl={`${navigationUrl}/${row.id}`}
            actions={[
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

  const handleNewContactClick = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={templateIcon}
      imgAltDescription={"Template icon"}
      headerText={"Templates"}
      explanationText={
        "Templates are used to create messages for your alarms. You can choose between an email or text message."
      }
      backUrl={"/management/alarms"}
    >
      <TableStateContainer
        gridTemplateColumns={"10% 70% 10% 10%"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
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
          },
        ]}
        newItemOnClick={handleNewContactClick}
        filterOptions={[
          {
            value: "name__icontains=",
            label: "Name",
          },
        ]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 30 },
            { name: "type", width: 20 },
            { name: "id", width: 50 },
          ]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
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
