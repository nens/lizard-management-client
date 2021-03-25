import React from 'react';
import { NavLink } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import tableStyles from "../../../components/Table.module.css";
import monitoringNetworkIcon from "../../../images/monitoring_network_icon.svg";

const baseUrl = "/api/v4/monitoringnetworks/";
const navigationUrl = "/data_management/timeseries/monitoring_networks";

const columnDefinitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.name}
      >
        <NavLink to={`${navigationUrl}/${row.uuid}`}>{!row.name? "(empty name)" : row.name }</NavLink>
      </span>
    ,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Uuid",
    renderFunction: (row: any) =>
      <span
        className={tableStyles.CellEllipsis}
        title={row.uuid}
      >
        {row.uuid}
      </span>
    ,
    orderingField: null,
  },
];

export const MonitoringNetworksTable = (props:any) =>  {

  return (
    <ExplainSideColumn
      imgUrl={monitoringNetworkIcon}
      imgAltDescription={"Monitoring-Network icon"}
      headerText={"Monitoring Networks"}
      explanationText={"Search or sort your monitoring-networks here."}
      backUrl={"/data_management/timeseries"}
    >
      <TableStateContainer 
        gridTemplateColumns={"60% 40%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
      />
    </ExplainSideColumn>
  );
}