import React, { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from "../../components/TableStateContainer";
import TableActionButtons from "../../components/TableActionButtons";
import tableStyles from "../../components/Table.module.css";
import { ExplainSideColumn } from "../../components/ExplainSideColumn";
import { fetchWithOptions } from "../../utils/fetchWithOptions";
import { ContactGroup } from "../../types/contactGroupType";
import DeleteModal from "../../components/DeleteModal";
import groupIcon from "../../images/group.svg";
import { ColumnDefinition } from "../../components/Table";

export const baseUrl = "/api/v4/contactgroups/";
const navigationUrl = "/management/alarms/groups";

export const GroupTable: React.FC<RouteComponentProps> = (props) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<ContactGroup[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: ContactGroup[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<ContactGroup>[] = [
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
      titleRenderFunction: () => "Size",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis}>
          {row.contacts.length} {row.contacts.length > 1 ? "Contacts" : "Contact"}
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
      imgUrl={groupIcon}
      imgAltDescription={"Group icon"}
      headerText={"Groups"}
      explanationText={
        "Groups are made of your contacts. In this screen, you can manage them by adding or deleting contacts. You can also add or delete groups for your alarm messages."
      }
      backUrl={"/management/alarms"}
    >
      <TableStateContainer
        gridTemplateColumns={"10% 60% 20% 10%"}
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
            { name: "id", width: 70 },
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
