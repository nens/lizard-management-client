import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { Contact } from '../../types/contactGroupType';
import DeleteModal from '../../components/DeleteModal';
import AddToGroupModal from './AddToGroupModal';
import contactIcon from "../../images/contacts@3x.svg";
import tableStyles from "../../components/Table.module.css";
import { ColumnDefinition } from '../../components/Table';

export const baseUrl = "/api/v4/contacts/";
const navigationUrl = "/management/alarms/contacts";

export const ContactTable: React.FC<RouteComponentProps> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<Contact[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);
  const [selectedRow, setSelectedRow] = useState<Contact | null>(null); // for adding contact to group modal

  const deleteActions = (
    rows: Contact[],
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
  const getDjangoUserOrContactUser = (contact: Contact) => {
    // If contact.user is not null, that means a Django User is linked to this contact
    // so show contact.user.first_name etcetera
    // otherwise, no Django User is linked, so show contact.first_name etc.
    return contact.user ? contact.user : contact;
  };

  const columnDefinitions: ColumnDefinition<Contact>[] = [
    {
      titleRenderFunction: () => "First name",
      renderFunction: (row) => 
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
      renderFunction: (row) => 
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
      renderFunction: (row) => 
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
      renderFunction: (row) => 
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
      renderFunction: (row, _updateTableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage) => {
        return (
            <TableActionButtons
              tableRow={row}
              triggerReloadWithCurrentPage={triggerReloadWithCurrentPage}
              triggerReloadWithBasePage={triggerReloadWithBasePage}
              editUrl={`${navigationUrl}/${row.id}`}
              actions={[
                {
                  displayValue: "Add to group",
                  actionFunction: (row) => setSelectedRow(row)
                },
                {
                  displayValue: "Delete",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
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
      backUrl={"/management/alarms"}
    >
        <TableStateContainer 
          gridTemplateColumns={"6% 18% 18% 32% 18% 8%"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: (rows, _tableData, _setTableData, triggerReloadWithCurrentPage, _triggerReloadWithBasePage, setCheckboxes) => {
                deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes)
              }
            }
          ]}
          newItemOnClick={handleNewContactClick}
          filterOptions={[
            {
              value: 'first_name__icontains=',
              label: 'First name'
            },
            {
              value: 'last_name__icontains=',
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