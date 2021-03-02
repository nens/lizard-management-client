import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import tableStyles from "../../components/Table.module.css";
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';
import Modal from '../../components/Modal';
import templateIcon from "../../images/templates@3x.svg";

export const TemplateTable: React.FC<any> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const baseUrl = "/api/v4/messages/";
  const navigationUrl = "/alarms/templates";

  // Reset busyDeleting state when there is no row to be deleted
  useEffect(() => {
    if (!rowToBeDeleted && rowsToBeDeleted.length === 0 && busyDeleting) {
      setBusyDeleting(false);
    };
  }, [rowToBeDeleted, rowsToBeDeleted.length, busyDeleting]);

  const fetchTemplatesWithOptions = (ids: string[], fetchOptions:any) => {
    const fetches = ids.map (id => {
      return (fetch(baseUrl + id + "/", fetchOptions));
    });
    return Promise.all(fetches)
  }

  const deleteActions = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
    setRowsToBeDeleted(rows);
    const ids = rows.map(row=> row.id);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
        if (ids.find(id => id === rowAllTables.id)) {
          return {...rowAllTables, markAsDeleted: true}
        } else{
          return {...rowAllTables};
        }
      })
      setTableData(tableDataDeletedmarker);
      const opts = {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      return fetchTemplatesWithOptions(ids, opts)
      .then((_result) => {
        if (setCheckboxes) {
          setCheckboxes([]);
        }
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
          resolve();
        });
      })
    });
  }

  const deleteAction = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      const opts = {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      return fetchTemplatesWithOptions([row.id], opts)
      .then((_result) => {
        setBusyDeleting(false);
        // TODO: do we need this callback or should we otherwise indicate that the record is deleted ?
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
            resolve();
          });
        })
      
    })
  }

  const columnDefinitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Type",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.type}
        >
          {row.type.toUpperCase()}
        </span>,
      orderingField: "type",
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
                  displayValue: "Delete",
                  actionFunction: deleteAction,
                },
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
      imgUrl={templateIcon}
      imgAltDescription={"Template icon"}
      headerText={"Templates"}
      explanationText={"Templates are used to create messages for your alarms. You can choose between an email or text message."} 
      backUrl={"/alarms"}
    >
        <TableStateContainer 
          gridTemplateColumns={"10% 70% 10% 10%"} 
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteActions,
            }
          ]}
          newItemOnClick={handleNewContactClick}
          filterOptions={[
            {
              value: 'name__icontains=',
              label: 'Name'
            }
          ]}
        />
        { 
        rowsToBeDeleted.length > 0?
           <Modal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
              deleteFunction && deleteFunction().then(()=>{
              setRowsToBeDeleted([]);
              setDeleteFunction(null);
             });
           }}
           cancelAction={()=>{
            setRowsToBeDeleted([]);
            setDeleteFunction(null);
          }}
          disableButtons={busyDeleting}
         >
           
           <p>Are you sure? You are deleting the following templates:</p>
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 30}, {name: "type", width: 20}, {name: "id", width: 50}])}
           
         </Modal>
        :
          null
        }

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
           <p>Are you sure? You are deleting the following template:</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 30}, {name: "type", width: 20}, {name: "id", width: 50}])}

         </Modal>
        :
          null
        }
     </ExplainSideColumn>
  );
}