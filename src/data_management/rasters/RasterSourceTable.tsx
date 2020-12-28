import React from 'react';
import {useState, }  from 'react';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import { deleteRasterSources, deleteRasterSource, 
  // flushRasters, flushRaster 
} from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterSourcesIcon from "../../images/raster_source_icon.svg";
import tableStyles from "../../components/Table.module.css";
import { bytesToDisplayValue } from '../../utils/byteUtils';
import ConfirmModal from '../../components/ConfirmModal';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';

export const RasterSourceTable = (props:any) =>  {

  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const baseUrl = "/api/v4/rastersources/";
  const navigationUrlRasters = "/data_management/rasters/sources";

  const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      return deleteRasterSource(row.uuid)
      .then((_result) => {
        setBusyDeleting(false);
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
      return deleteRasterSources(uuids)
      .then((_result) => {
        setBusyDeleting(false);
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

  // const flushActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  //   const uuids = rows.map(row=> row.uuid);
  //   if (window.confirm(`Are you sure you want to flush rasters with uuids? \n ${uuids.join("\n")}`)) {
  //     const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
  //       if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
  //         return {...rowAllTables, markAsFlushed: true}
  //       } else{
  //         return {...rowAllTables};
  //       }
  //     })
  //     setTableData(tableDataDeletedmarker);
  //     flushRasters(uuids)
  //     .then((_result) => {
  //       // TODO: this is not preferred way. see delet function in raster layer table
  //       if (setCheckboxes) {
  //         setCheckboxes([]);
  //       }
  //       triggerReloadWithCurrentPage();
  //     })
  //   }
  // }

  const rasterSourceColumnDefinitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrlRasters}/${row.uuid}/`}>{!row.name? "(empty name)" : row.name }</NavLink>
        </span>
      ,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Code",
      renderFunction: (row: any) =>
      // (row: any) => {return !row.supplier_code ? "(empty 'supplier code')" : row.supplier_code },
        <span
          className={tableStyles.CellEllipsis}
          title={row.supplier_code}
        >
          {!row.supplier_code? "(empty code)" : row.supplier_code }
        </span>
      ,
      orderingField: "supplier_code",
    },
    {
      titleRenderFunction: () =>  "Temporal",
      renderFunction: (row: any) => 
        // row.temporal === true? "Yes" : "No"
        <span
          className={tableStyles.CellEllipsis}
        >
          {row.temporal === true? "Yes" : "No"}
        </span>
      ,
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "Size",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={`${row.size? row.size: 0} Bytes`}
        >
          {bytesToDisplayValue(row.size? row.size: 0)}
        </span>
      ,
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "",
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
                // implement later
                // {
                //   displayValue: "flush raster",
                //   actionFunction: (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
                //     if (window.confirm(`Are you sure you want to flush raster-source with uuid: ${row.uuid} ?`)) {
                //       const uuid = row.uuid;
                //       const flushedRow =  {...row, markAsFlushed: true}
                //       updateTableRow(flushedRow);
                //       flushRaster(uuid)
                //       .then((_result) => {
                //         triggerReloadWithCurrentPage();
                //       })
                //     }
                //   },
                // },
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
      imgUrl={rasterSourcesIcon}
      imgAltDescription={"Raster-Source icon"}
      headerText={"Raster Sources"}
      explainationText={"Raster Sources are the containers for your raster data. When your raster data is uploaded to a Raster Source, it can be published as a Raster Layer to be visualized in the Catalogue and the Portal or it can be used in a GeoBlocks model."} 
      backUrl={"/data_management/rasters"}
    >
      <TableStateContainer 
        gridTemplateColumns={"8% 29% 25% 10% 20% 8%"} 
        columnDefinitions={rasterSourceColumnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[
          // implement later
          // {
          //   displayValue: "Flush Rasters",
          //   actionFunction: flushActionRasters,
          // },
          {
            displayValue: "Delete",
            actionFunction: deleteActionRasters,
          },
          
        ]}
        newItemOnClick={handleNewRasterClick}
      />
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
           <p>Are you sure? You are deleting the following raster-source:</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
         </ConfirmModal>
        :
          null
        }
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
           
           <p>Are you sure? You are deleting the following raster-sources:</p>
           
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           
         </ConfirmModal>
        :
          null
        }
    </ExplainSideColumn>
  );
}