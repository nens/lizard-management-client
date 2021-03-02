import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import tableStyles from "../../components/Table.module.css";
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';
import Modal from '../../components/Modal';
import contactIcon from "../../images/contacts@3x.svg";

export const ContactTable: React.FC<any> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const baseUrl = "/api/v4/contacts/";
  const navigationUrl = "/alarms/contacts";

  // Reset busyDeleting state when there is no row to be deleted
  useEffect(() => {
    if (!rowToBeDeleted && rowsToBeDeleted.length === 0 && busyDeleting) {
      setBusyDeleting(false);
    };
  }, [rowToBeDeleted, rowsToBeDeleted.length, busyDeleting]);

  const fetchContactsWithOptions = (ids: string[], fetchOptions:any) => {
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
      return fetchContactsWithOptions(ids, opts)
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
      return fetchContactsWithOptions([row.id], opts)
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

  // Helper function to get Django User or Contact User
  const getDjangoUserOrContactUser = (contact: any) => {
    // If contact.user is not null, that means a Django User is linked to this contact
    // so show contact.user.first_name etcetera
    // otherwise, no Django User is linked, so show contact.first_name etc.
    return contact.user ? contact.user : contact;
  };

  const columnDefinitions = [
    {
      titleRenderFunction: () => "First name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).first_name}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{getDjangoUserOrContactUser(row).first_name}</NavLink>
        </span>,
      orderingField: "first_name",
    },
    {
      titleRenderFunction: () =>  "Last name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).last_name}
        >
          <NavLink to={`${navigationUrl}/${row.id}`}>{getDjangoUserOrContactUser(row).last_name}</NavLink>
        </span>,
      orderingField: "last_name",
    },
    {
      titleRenderFunction: () => "Email",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).email}
        >
          {getDjangoUserOrContactUser(row).email}
        </span>,
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "Telephone",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={getDjangoUserOrContactUser(row).phone_number}
        >
          {getDjangoUserOrContactUser(row).phone_number}
        </span>,
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
      imgUrl={contactIcon}
      imgAltDescription={"Contact icon"}
      headerText={"Contacts"}
      explanationText={"Your contacts contain an email address, phone number and a name. Add these contacts to group to send them alarm messages when your thresholds are triggered."} 
      backUrl={"/alarms"}
    >
        <TableStateContainer 
          gridTemplateColumns={"6% 18% 18% 32% 18% 8%"} 
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
              value: 'first_name__icontains=',
              label: 'First name'
            },
            {
              value: 'last_name__icontains=',
              label: 'Last name'
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
           
           <p>Are you sure? You are deleting the following contacts:</p>
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "first_name", width: 20}, {name: "email", width: 50}, {name: "id", width: 30}])}

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
           <p>Are you sure? You are deleting the following contact:</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "first_name", width: 20}, {name: "email", width: 50}, {name: "id", width: 30}])}

         </Modal>
        :
          null
        }
     </ExplainSideColumn>
  );
}