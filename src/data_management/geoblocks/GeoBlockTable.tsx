import React from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import geoblockIcon from "../../images/geoblock.svg";
import tableStyles from "../../components/Table.module.css";
import { getAccessibiltyText } from '../../form/AccessModifier';

export const baseUrl = "/api/v4/rasters/";
const navigationUrl = "/management/data_management/geoblocks";

export const GeoBlockTable: React.FC<RouteComponentProps> = (props) =>  {
  const columnDefinitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "User",
      renderFunction: (row: any) =>  
      <span
        className={tableStyles.CellEllipsis}
        title={row.supplier}
      >
        {row.supplier}
      </span>,
      orderingField: "supplier",
    },
    {
      titleRenderFunction: () =>  "Accessibility",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={row.access_modifier}
        >
          {getAccessibiltyText(row.access_modifier)}
        </span>
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
              editUrl={`${navigationUrl}/${row.uuid}`}
              actions={[]}
            />
        );
      },
      orderingField: null,
    },
  ];

  // const handleNewClick  = () => {
  //   const { history } = props;
  //   history.push(`${navigationUrl}/new`);
  // }

  return (
    <ExplainSideColumn
      imgUrl={geoblockIcon}
      imgAltDescription={"GeoBlock icon"}
      headerText={"Geo Blocks"}
      explanationText={'Geo Blocks'}
      backUrl={"/management/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"4fr 3fr 2fr 1fr"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[]}
          // newItemOnClick={handleNewClick}
          filterOptions={[
            {value: 'name__icontains=', label: 'Name'},
            {value: 'uuid=', label: 'UUID'},
          ]}
          defaultUrlParams={'&is_geoblock=true'} // to only show geoblocks
        />
     </ExplainSideColumn>
  );
}