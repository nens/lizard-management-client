import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import { deleteRasters, /*flushRasters*/ } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layer_icon.svg";
import tableStyles from "../../components/Table.module.css";

import {useState, }  from 'react';
import ConfirmModal from '../../components/ConfirmModal';
// Spinner for modal
import MDSpinner from "react-md-spinner";



export const RasterLayerTable = (props:any) =>  {

  const baseUrl = "/api/v4/rasters/";
  const navigationUrlRasters = "/data_management/rasters/layers";

  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);


  const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      return deleteRasters([row.uuid])
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

  const deleteActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
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
      return deleteRasters(uuids)
      .then((_result) => {
        // TODO: problem: triggerReloadWithCurrentPage requires a promise to set the checkboxes once the promise settles,
        // but somehow triggerReloadWithCurrentPage is sometimes undefined leading to the error ".then of undefined"
        // Workaround for now is to set the checkboxes before the promise returns.
        // the function triggerReloadWithCurrentPage is actually the function fetchWithUrl 
        // desired way would be:
        // triggerReloadWithCurrentPage().then(()=>{
        //   if (setCheckboxes) {
        //     setCheckboxes([]);
        //   }
        // });
        setBusyDeleting(false);
        // workaround instead:
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

  const rasterSourceColumnDefenitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrlRasters}/${row.uuid}/`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Based on",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.raster_sources[0]}
        >
          {row.raster_sources[0]}
        </span>,
      orderingField: "raster_sources",
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
      titleRenderFunction: () =>  "Temporal",
      renderFunction: (row: any) => row.temporal === true? "Yes" : "No",
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
                  actionFunction: deleteActionRaster,
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
    history.push(`${navigationUrlRasters}/new`);
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
      imgUrl={rasterIcon}
      imgAltDescription={"Raster-Layer icon"}
      headerText={"Raster Layers"}
      explainationText={"Raster Layers are visual presentations of your raster data. Choose the prefered Raster Source so that the Raster Layer fetches the right data and give the Raster Layer a name, description, observation type and styling. Once published, your Raster Layer will be visible in the Catalogue and the Portal."}
      backUrl={"/data_management/rasters"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 30% 24% 20% 10% 8%"} 
          columnDefenitions={rasterSourceColumnDefenitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteActionRasters,
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
           
           <p>Are you sure? You are deleting the following raster layers:</p>
           
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
           <p>Are you sure? You are deleting the following raster-layer:</p>
           {modalDeleteContent([rowToBeDeleted], busyDeleting)}
         </ConfirmModal>
        :
          null
        }
     </ExplainSideColumn>
  );
}