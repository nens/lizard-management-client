import React, { useEffect, useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { UserRoles } from '../form/UserRoles';
import { userTableHelpText } from '../utils/help_texts/helpTextForUsers';
import { fetchWithOptions } from '../utils/fetchWithOptions';
import TableActionButtons from '../components/TableActionButtons';
import TableStateContainer from '../components/TableStateContainer';
import InvitationModal from './InvitationModal';
import DeleteModal from '../components/DeleteModal';
import tableStyles from "../components/Table.module.css";
import userManagementIcon from "../images/userManagement.svg";

export const UserTable = (props: RouteComponentProps) =>  {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const baseUrl = `/api/v4/organisations/${selectedOrganisation.uuid}/users/`;
  const navigationUrl = "/users";

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const [invitationModal, setInvitationModal] = useState<boolean>(false);
  const [invitationList, setInvitationList] = useState<any[] | null>(null);

  useEffect(() => {
    fetch('/api/v4/invitations/?page_size=0', {
      credentials: 'same-origin'
    }).then(
      res => res.json()
    ).then(
      data => setInvitationList(data)
    ).catch(
      console.error
    );
  }, []);

  const deactivateActions = (
    rows: any[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setSelectedRows(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions = [
    {
      titleRenderFunction: () => "Username",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.username}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{row.username }</NavLink>
        </span>
      ,
      orderingField: 'username',
    },
    {
      titleRenderFunction: () => "Email",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.email}
        >
          {row.email}
        </span>
      ,
      orderingField: 'email',
    },
    {
      titleRenderFunction: () => "Roles",
      renderFunction: (row: any) =>
        <UserRoles
          title={''}
          name={'roles'}
          value={row.roles}
          valueChanged={() => null}
          currentUser={row}
          forTable
        />
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
              editUrl={`${navigationUrl}/${row.id}`}
              actions={[
                {
                  displayValue: "Deactivate",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deactivateActions([row], triggerReloadWithCurrentPage, null)
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
      imgUrl={userManagementIcon}
      imgAltDescription={"User icon"}
      headerText={"Users"}
      explanationText={userTableHelpText}
      backUrl={"/"}
    >
      <TableStateContainer
        gridTemplateColumns={"33fr 33fr 30fr 4fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[]}
        newItemOnClick={handleNewClick}
        customTableButton={{
          name: invitationList ? `${invitationList.length} Pending Invitations` : '0 Pending Invitations',
          disabled: !invitationList || invitationList.length === 0,
          onClick: () => setInvitationModal(true)
        }}
        filterOptions={[
          {
            value: 'username__icontains=',
            label: 'Username'
          },
          {
            value: 'first_name__icontains=',
            label: 'First name'
          },
          {
            value: 'last_name__icontains=',
            label: 'Last name'
          },
          {
            value: 'email__icontains=',
            label: 'Email'
          }
        ]}
      />
      {selectedRows.length > 0 ? (
        <DeleteModal
          rows={selectedRows}
          displayContent={[{name: "username", width: 40}, {name: "email", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setSelectedRows([]);
            setResetTable(null);
          }}
          text={'You are deactivating the following user. Please make sure that s/he is not a member of any other organisation before continue.'}
        />
      ) : null}
      {invitationModal && invitationList ? (
        <InvitationModal
          invitations={invitationList}
          handleClose={() => setInvitationModal(false)}
        />
      ) : null}
    </ExplainSideColumn>
  );
}