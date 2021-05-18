import React from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import { UserRoles } from '../form/UserRoles';
import { userTableHelpText } from '../utils/help_texts/helpTextForUsers';
import TableActionButtons from '../components/TableActionButtons';
import TableStateContainer from '../components/TableStateContainer';
import tableStyles from "../components/Table.module.css";
import userManagementIcon from "../images/userManagement.svg";

export const UserTable = (props: RouteComponentProps) =>  {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const baseUrl = `/api/v4/organisations/${selectedOrganisation.uuid}/users/`;
  const navigationUrl = "/users";

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
      orderingField: null,
    },
    {
      titleRenderFunction: () => "First name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.first_name}
        >
          {row.first_name}
        </span>
      ,
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Last name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.last_name}
        >
          {row.last_name}
        </span>
      ,
      orderingField: null,
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
      orderingField: null,
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
              actions={[]}
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
        gridTemplateColumns={"15fr 12fr 12fr 30fr 27fr 4fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[]}
        newItemOnClick={handleNewClick}
        filterOptions={[
          {
            value: 'username__icontains=',
            label: 'Username'
          }
        ]}
      />
    </ExplainSideColumn>
  );
}