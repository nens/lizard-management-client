import { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { UserRoles } from '../form/UserRoles';
import { userTableHelpText } from '../utils/help_texts/helpTextForUsers';
import { fetchWithOptions } from '../utils/fetchWithOptions';
import { useRecursiveFetch } from '../api/hooks';
import { ColumnDefinition } from '../components/Table';
import { User } from '../types/userType';
import TableActionButtons from '../components/TableActionButtons';
import TableStateContainer from '../components/TableStateContainer';
import InvitationModal from './InvitationModal';
import DeleteModal from '../components/DeleteModal';
import tableStyles from "../components/Table.module.css";
import userManagementIcon from "../images/userManagement.svg";

export const UserTable: React.FC<RouteComponentProps> = (props) =>  {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const baseUrl = `/api/v4/organisations/${selectedOrganisation.uuid}/users/`;
  const navigationUrl = "/management/users";

  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const [invitationModal, setInvitationModal] = useState<boolean>(false);

  const [refetchInvitationList, setRefetchInvitationList] = useState<boolean>(true);
  const {
    data: invitationList,
    isFetching: invitationListIsFetching
  } = useRecursiveFetch(
    '/api/v4/invitations/',
    { organisation__uuid: selectedOrganisation.uuid },
    {
      enabled: refetchInvitationList,
      cacheTime: 0
    }
  );

  const deactivateActions = (
    rows: User[],
    triggerReloadWithCurrentPage: () => void,
    setCheckboxes: Function | null
  ) => {
    setSelectedRows(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<User>[] = [
    {
      titleRenderFunction: () => "Username",
      renderFunction: row => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.username}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{row.username}</NavLink>
        </span>
      ,
      orderingField: 'username',
    },
    {
      titleRenderFunction: () => "Email",
      renderFunction: row => 
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
      renderFunction: row =>
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
      // @ts-ignore
      renderFunction: (row, tableData: any, setTableData: any, triggerReloadWithCurrentPage, triggerReloadWithBasePage) => {
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
                actionFunction: (row, tableData, setTableData, triggerReloadWithCurrentPage) => {
                  // @ts-ignore
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
      backUrl={"/management"}
    >
      <TableStateContainer
        gridTemplateColumns={"33fr 33fr 30fr 4fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[]}
        newItemOnClick={handleNewClick}
        customTableButton={{
          name: (
            invitationListIsFetching ? 'Loading' :
            invitationList ? `${invitationList.length} Pending ${invitationList.length > 1 ? 'Users' : 'User'}` :
            '0 Pending User'
          ),
          disabled: !invitationList || invitationList.length === 0 || invitationListIsFetching,
          onClick: () => {
            setInvitationModal(true);
            setRefetchInvitationList(false);
          }
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
          deleteButtonName={'Deactivate'}
          text={'You are deactivating the following user. Please make sure that s/he is not a member of any other organisation before continue.'}
        />
      ) : null}
      {invitationModal && invitationList ? (
        <InvitationModal
          handleClose={() => {
            setInvitationModal(false);
            setRefetchInvitationList(true);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
}