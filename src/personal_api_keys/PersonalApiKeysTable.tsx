import React, {useState,} from 'react';

import TableStateContainer from '../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../components/ExplainSideColumn';
import tableStyles from "../components/Table.module.css";
import personalApiKeysIcon from "../images/personal_api_key_icon.svg";
import Modal from '../components/Modal';
import { ModalDeleteContent } from '../components/ModalDeleteContent';
import TableActionButtons from '../components/TableActionButtons';
import { personalApiKeysFormHelpText } from '../utils/helpTextForForms';

const baseUrl = "/api/v4/personalapikeys/";
const navigationUrl = "/personal_api_keys";

export const PersonalApiKeysTable = (props:any) =>  {

  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const deleteAction = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any) => {
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      return fetch(`/api/v4/personalapikeys/${row.prefix}/`, {
        credentials: 'same-origin',
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
      })
        .then(data => {
          // const status = data.status;
          setBusyDeleting(false);
          // TODO: do we need this callback or should we otherwise indicate that the record is deleted ?
          triggerReloadWithCurrentPage();
          return new Promise((resolve, _reject) => {
              resolve();
            });
          })
        })
  };

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
              actions={[
                {
                  displayValue: "delete",
                  actionFunction: deleteAction,
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
      imgUrl={personalApiKeysIcon}
      imgAltDescription={"Personal API keys icon"}
      headerText={"Personal API keys"}
      explanationText={personalApiKeysFormHelpText['default']}
      backUrl={"/"}
    >
      <TableStateContainer 
        gridTemplateColumns={"44% 24% 24% 8%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        textSearchBox={false}
        newItemOnClick={handleNewClick}
      />
      { 
        rowToBeDeleted?
           <Modal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
             deleteFunction && deleteFunction().then(()=>{
              setRowToBeDeleted(null);
              setDeleteFunction(null);
             });
             
           }}
           cancelAction={()=>{
             setRowToBeDeleted(null);
             setDeleteFunction(null);
           }}
           disableButtons={busyDeleting}
         >
           <p>Are you sure? Undoing is not possible. You are deleting the following personal API key:</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 65}, {name: "prefix", width: 25}])}
         </Modal>
        :
          null
        }
    </ExplainSideColumn>
  );
}