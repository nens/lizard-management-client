import React from 'react';

import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import wmsIcon from "../../images/wms@3x.svg";
import tableStyles from "../../components/Table.module.css";
import TableActionButtons from '../../components/TableActionButtons';

import {useState, }  from 'react';
import ConfirmModal from '../../components/ConfirmModal';
// Spinner for modal
import MDSpinner from "react-md-spinner";

export const WmsLayerTable = (props:any) =>  {

  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const baseUrl = "/api/v4/wmslayers/";
  const navigationUrl = "/data_management/wms_layers";

  const fetchWmsLayerUuidsWithOptions = (uuids: string[], fetchOptions:any) => {
    const url = "/api/v4/wmslayers/";
    const fetches = uuids.map (wmsLayerUuid => {
      return (fetch(url + wmsLayerUuid + "/", fetchOptions));
    });
    return Promise.all(fetches)
  }

  const deleteActions = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
    setRowsToBeDeleted(rows);
    const uuids = rows.map(row=> row.uuid);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
        if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
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
      return fetchWmsLayerUuidsWithOptions(uuids, opts)
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
      return fetchWmsLayerUuidsWithOptions([row.uuid], opts)
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

  const rasterSourceColumnDefenitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrl}/${row.uuid}/`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Description",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.description}
        >
          {row.description}
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



  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  const modalDeleteContent = (rows: any[], spinner: boolean) => {
    return (
      <div>
      <ul>
          {
          rows.map(row=>{
              return (
              <li style={{fontStyle: "italic", listStyleType: "square", height: "80px"}}>
                <span style={{display:"flex", flexDirection: "row",justifyContent: "space-between", alignItems: "center"}}>
                {/* 
                //@ts-ignore */}
                <span title={row.name} style={{width:"65%", textOverflow: "ellipsis", overflow: "hidden"}}>{row.name}</span>
                
                {/* 
                //@ts-ignore */}
                <span title={row.uuid} style={{width:"25%", textOverflow: "ellipsis", overflow: "hidden"}}>{row.uuid}</span>
                </span>
              </li>
              )
            })
          }
          </ul>
          
          {spinner === true?
          <div style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems: "center"}} >
              <MDSpinner size={96} />
              <span style={{marginLeft: "20px", fontSize: "19px", fontWeight: "bold"}}>Deleting ...</span>
            </div>
            :
            null}
            </div>
        )
      }

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      imgAltDescription={"WMS-Layer icon"}
      headerText={"WMS Layers"}
      explainationText={"WMS-Layers allow to configure layers in lizard even if they are hosted on another platform"} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 29% 55% 8%"} 
          columnDefenitions={rasterSourceColumnDefenitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteActions,
            }
          ]}
          newItemOnClick={handleNewRasterClick}
        />
        { 
        rowsToBeDeleted.length > 0?
           <ConfirmModal
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
           
           <p>Are you sure? You are deleting the following WMS-layers:</p>
           
           {modalDeleteContent(rowsToBeDeleted, busyDeleting)}
           
         </ConfirmModal>
        :
          null
        }

        { 
        rowToBeDeleted?
           <ConfirmModal
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
           <p>Are you sure? You are deleting the following WMS-layer:</p>
           {modalDeleteContent([rowToBeDeleted], busyDeleting)}
         </ConfirmModal>
        :
          null
        }
     </ExplainSideColumn>
  );
}