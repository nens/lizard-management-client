import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import DeleteModal from '../../components/DeleteModal';
import AddToGroupModal from './AddToGroupModal';
import contactIcon from "../../images/contacts@3x.svg";
import tableStyles from "../../components/Table.module.css";

export const baseUrl = "/api/v4/contacts/";
const navigationUrl = "/alarms/contacts";

export const ContactTable: React.FC<RouteComponentProps> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);
  const [selectedRow, setSelectedRow] = useState<any | null>(null); // for adding contact to group modal

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

  // Helper function to get Django User or Contact User
  const getDjangoUserOrContactUser = (contact: any) => {
    // If contact.user is not null, that means a Django User is linked to this contact
    // so show contact.user.first_name etcetera
    // otherwise, no Django User is linked, so show contact.first_name etc.
    return contact.user ? contact.user : contact;
  };

  const columnDefinitions = [
    {
      titleRenderFunction: () => "First name",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).first_name}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{getDjangoUserOrContactUser(row).first_name}</NavLink>
        </span>,
      orderingField: "first_name",
    },
    {
      titleRenderFunction: () =>  "Last name",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).last_name}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{getDjangoUserOrContactUser(row).last_name}</NavLink>
        </span>,
      orderingField: "last_name",
    },
    {
      titleRenderFunction: () => "Email",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).email}
        >
          {getDjangoUserOrContactUser(row).email}
        </span>,
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "Telephone",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).phone_number}
        >
          {getDjangoUserOrContactUser(row).phone_number}
        </span>,
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
              editUrl={`${navigationUrl}/${row.id}`}
              actions={[
                {
                  displayValue: "Add to group",
                  actionFunction: (row: any) => setSelectedRow(row)
                },
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
    },
  ];

  const handleNewContactClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={contactIcon}
      imgAltDescription={"Contact icon"}
      headerText={"Contacts"}
      explanationText={"Your contacts contain an email address, phone number and a name. Add these contacts to group to send them alarm messages when your thresholds are triggered."}
      backUrl={"/alarms"}
    >
        <TableStateContainer
          gridTemplateColumns={"6% 18% 18% 32% 18% 8%"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`}
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
                deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes)
              }
            }
          ]}
          newItemOnClick={handleNewContactClick}
          filterOptions={[
            {
              value: 'first_name__icontains',
              label: 'First name'
            },
            {
              value: 'last_name__icontains',
              label: 'Last name'
            }
          ]}
        />
        {rowsToBeDeleted.length > 0 ? (
          <DeleteModal
            rows={rowsToBeDeleted}
            displayContent={[{name: "first_name", width: 20}, {name: "email", width: 50}, {name: "id", width: 30}]}
            fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
            resetTable={resetTable}
            handleClose={() => {
              setRowsToBeDeleted([]);
              setResetTable(null);
            }}
          />
        ) : null}
        {selectedRow ? (
          <AddToGroupModal
            contact={selectedRow}
            handleClose={() => setSelectedRow(null)}
          />
        ) : null}
     </ExplainSideColumn>
  );
}
