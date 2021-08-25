import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { useSelector } from 'react-redux';
import { getSelectedOrganisation } from '../../reducers';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { UserRoles } from '../../form/UserRoles';
import { layerCollectionTableHelpText } from '../../utils/help_texts/helpTextForLayercollections';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { useRecursiveFetch } from '../../api/hooks';
import TableActionButtons from '../../components/TableActionButtons';
import TableStateContainer from '../../components/TableStateContainer';
import DeleteModal from '../../components/DeleteModal';
import tableStyles from "../../components/Table.module.css";
import userManagementIcon from "../images/userManagement.svg";
import { getAccessibiltyText } from '../../form/AccessModifier';
import layerCollectionIcon from "../../images/layer_collection_icon.svg";



export const LayerCollectionsTable = (props: RouteComponentProps) =>  {
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const baseUrl = `/api/v4/layercollections/`;
  const navigationUrl = "/management/layer_collections";

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);


  const columnDefinitions = [
    {
      titleRenderFunction: () => "Slug",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.slug}
        >
          {row.slug}
        </span>
      ,
      orderingField: 'slug',
    },
    // {
    //   titleRenderFunction: () => "Accessibility",
    //   renderFunction: (row: any) => 
    //     <span
    //       className={tableStyles.CellEllipsis}
    //       title={row.access_modifier}
    //     >
    //       {getAccessibiltyText(row.access_modifier)}
    //     </span>
    //   ,
    //   orderingField: 'access_modifier',
    // },
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
                // {
                //   displayValue: "Deactivate",
                //   actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                //     deactivateActions([row], triggerReloadWithCurrentPage, null)
                //   }
                // },
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
      imgUrl={layerCollectionIcon}
      imgAltDescription={"Layer collection icon"}
      headerText={"Layer collections"}
      explanationText={layerCollectionTableHelpText}
      backUrl={"/management/data_management"}
    >
      <TableStateContainer
        gridTemplateColumns={"33fr 33fr"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[]}
        newItemOnClick={handleNewClick}
        // customTableButton={{
        //   name: (
        //     invitationListIsFetching ? 'Loading' :
        //     invitationList ? `${invitationList.length} Pending ${invitationList.length > 1 ? 'Users' : 'User'}` :
        //     '0 Pending User'
        //   ),
        //   disabled: !invitationList || invitationList.length === 0 || invitationListIsFetching,
        //   onClick: () => {
        //     setInvitationModal(true);
        //     setRefetchInvitationList(false);
        //   }
        // }}
        filterOptions={[
          {
            value: 'slug__icontains=',
            label: 'Slug'
          },
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
      {/* {invitationModal && invitationList ? (
        <InvitationModal
          handleClose={() => {
            setInvitationModal(false);
            setRefetchInvitationList(true);
          }}
        />
      ) : null} */}
    </ExplainSideColumn>
  );
}