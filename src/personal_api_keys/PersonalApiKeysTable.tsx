import React from 'react';

import TableStateContainer from '../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../components/ExplainSideColumn';
import tableStyles from "../components/Table.module.css";
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";

const baseUrl = "/api/v4/personalapikeys/";
const navigationUrl = "/personal_api_keys";

const columnDefinitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.name}
      >
        <NavLink to={`${navigationUrl}/${row.prefix}/`}>{!row.name? "(empty name)" : row.name }</NavLink>
      </span>
    ,
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Scope",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.scope}
      >
        {row.scope}
      </span>
    ,
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Created on",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.creatd}
      >
        {row.created}
      </span>
    ,
    orderingField: null,
  },
];

export const PersonalApiKeysTable = (props:any) =>  {

  const handleNewClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={personalApiKeysIcon}
      imgAltDescription={"Personal API keys icon"}
      headerText={"Label types"}
      explanationText={"Personal API keys can be used to authenticate external applications in Lizard"} 
      backUrl={"/"}
    >
      <TableStateContainer 
        gridTemplateColumns={"50% 25% 25%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        textSearchBox={false}
        newItemOnClick={handleNewClick}
      />
    </ExplainSideColumn>
  );
}