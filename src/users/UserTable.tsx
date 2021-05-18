import React from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../reducers';
import { ExplainSideColumn } from '../components/ExplainSideColumn';
import TableActionButtons from '../components/TableActionButtons';
import TableStateContainer from '../components/TableStateContainer';
import tableStyles from "../components/Table.module.css";
import userManagementIcon from "../images/userManagement.svg";
import { UserRoles } from '../form/UserRoles';
// import DeleteModal from '../components/DeleteModal';

export const UserTable = (props: RouteComponentProps) =>  {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const baseUrl = `/api/v4/organisations/${selectedOrganisation.uuid}/users/`;
  const navigationUrl = "/users";

  // const fetchWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  //   const fetches = uuids.map (uuid => {
  //     return fetch(baseUrl + uuid + "/", fetchOptions);
  //   });
  //   return Promise.all(fetches);
  // };

  // const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  // const [resetTable, setResetTable] = useState<Function | null>(null);

  // const deleteActions = (
  //   rows: any[],
  //   triggerReloadWithCurrentPage: Function,
  //   setCheckboxes: Function | null
  // ) => {
  //   console.log(rows[0])
  //   setRowsToBeDeleted(rows);
  //   setResetTable(() => () => {
  //     triggerReloadWithCurrentPage();
  //     setCheckboxes && setCheckboxes([]);
  //   });
  // };

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
      titleRenderFunction: () => "Role",
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
      explanationText={'User management'}
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
      {/* {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[{name: "username", width: 50}, {name: "email", width: 50}]}
          fetchFunction={fetchWithOptions}
          resetTable={resetTable}
          handleClose={() => {
            setRowsToBeDeleted([]);
            setResetTable(null);
          }}
        />
      ) : null} */}
    </ExplainSideColumn>
  );
}