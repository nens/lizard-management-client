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


export const RasterLayerTable = (props:any) =>  {

  const baseUrl = "/api/v4/rasters/";
  const navigationUrlRasters = "/data_management/rasters/layers";

  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null)


  const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      updateTableRow({...row, markAsDeleted: true});
      deleteRasters([row.uuid])
      .then((_result) => {
      // TODO: do we need this callback or should we otherwise indicate that the record is deleted ?
      triggerReloadWithCurrentPage();
      })
    })
    // if (window.confirm(`Are you sure you want to delete raster with uuid: ${row.uuid} ?`)) {
    //   updateTableRow({...row, markAsDeleted: true});
    //   deleteRasters([row.uuid])
    //   .then((_result) => {
    //     // TODO: do we need this callback or should we otherwise indicate that the record is deleted ?
    //     triggerReloadWithCurrentPage();
    //   })
    // }
  }

  const deleteActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
    //@ts-ignore
    setRowsToBeDeleted(rows);
    const uuids = rows.map(row=> row.uuid);
    // if (window.confirm(`Are you sure you want to delete rasters with uuids? \n ${uuids.join("\n")}`)) {
    setDeleteFunction(()=>()=>{
      console.log('multiple confirm function');
      const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
        if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
          return {...rowAllTables, markAsDeleted: true}
        } else{
          return {...rowAllTables};
        }
      })
      setTableData(tableDataDeletedmarker);
      deleteRasters(uuids)
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
        // workaround instead:
        if (setCheckboxes) {
          setCheckboxes([]);
        }
        triggerReloadWithCurrentPage();
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

  return (
    <ExplainSideColumn
      imgUrl={rasterIcon}
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
             console.log('multiple confirm');
             deleteFunction && deleteFunction();
             setRowsToBeDeleted([]);
             setDeleteFunction(null);
           }}
           cancelAction={()=>{
            setRowsToBeDeleted([]);
            setDeleteFunction(null);
          }}
         >
           <p>Are you sure? You are deleting the following raster layers:</p>
           <ul>
           {
             rowsToBeDeleted.map(rasterLayerRow=>{
               return (
                  <li key={rasterLayerRow.uuid}>
                    {/* 
                    //@ts-ignore */}
                    <span title={rasterLayerRow.name} style={{width:"100px", textOverflow: "ellipsis"}}>{rasterLayerRow.name}</span>
                    {/* 
                    //@ts-ignore */}
                    <span title={rasterLayerRow.uuid} style={{width:"100px", textOverflow: "ellipsis"}}>{rasterLayerRow.uuid}</span>
                  </li>
               )
             })
            }
           </ul>
           
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
             deleteFunction && deleteFunction();
             setRowToBeDeleted(null);
             setDeleteFunction(null);
           }}
           cancelAction={()=>{
             setRowToBeDeleted(null);
             setDeleteFunction(null);
           }}
         >
           <p>Are you sure? You are deleting the following raster-layer:</p>
           <div>
                    {/* 
                    //@ts-ignore */}
                    <span title={rowToBeDeleted.name} style={{width:"100px", textOverflow: "ellipsis"}}>{rowToBeDeleted.name}</span>
                    {/* 
                    //@ts-ignore */}
                    <span title={rowToBeDeleted.uuid} style={{width:"100px", textOverflow: "ellipsis"}}>{rowToBeDeleted.uuid}</span>
            </div>
           
         </ConfirmModal>
        :
          null
        }
       
        
     </ExplainSideColumn>
  );
}