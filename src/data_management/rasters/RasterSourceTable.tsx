import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import { NavLink } from "react-router-dom";
import { deleteRasterSources, deleteRasterSource, flushRasters, flushRaster } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterSourcesIcon from "../../images/raster_sources_logo_explainbar.svg";




const baseUrl = "/api/v4/rastersources/";
const navigationUrlRasters = "/data_management/rasters";

const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
  // const uuid = row.uuid;
  // const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
  //   if (uuid === rowAllTables.uuid) {
  //     return {...rowAllTables, markAsDeleted: true}
  //   } else{
  //     return {...rowAllTables};
  //   }
  // })
  // setTableData(tableDataDeletedmarker);
  // deleteRasters([uuid])
  // .then((_result) => {
  //   triggerReloadWithCurrentPage();
  // })

  // deleteActionRasters([row], tableData, setTableData, triggerReloadWithCurrentPage, triggerReloadWithBasePage, null)
  if (window.confirm(`Are you sure you want to delete raster-source with uuid: ${row.uuid} ?`)) {
    updateTableRow({...row, markAsDeleted: true});
    deleteRasterSource(row.uuid)
    .then((_result) => {
      // TODO: do we need this callback or should we otherwise indicate that the record is deleted ?
      triggerReloadWithCurrentPage();
    })
  }
  
}

const deleteActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  const uuids = rows.map(row=> row.uuid);
  if (window.confirm(`Are you sure you want to delete rasters with uuids? \n ${uuids.join("\n")}`)) {
    const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
      if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
        return {...rowAllTables, markAsDeleted: true}
      } else{
        return {...rowAllTables};
      }
    })
    setTableData(tableDataDeletedmarker);
    deleteRasterSources(uuids)
    .then((_result) => {
      // TODO: this is not preferred way. see delet function in raster layer table
      if (setCheckboxes) {
        setCheckboxes([]);
      }
      triggerReloadWithCurrentPage();
    })
  }
}

const flushActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  const uuids = rows.map(row=> row.uuid);
  if (window.confirm(`Are you sure you want to flush rasters with uuids? \n ${uuids.join("\n")}`)) {
    const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
      if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
        return {...rowAllTables, markAsFlushed: true}
      } else{
        return {...rowAllTables};
      }
    })
    setTableData(tableDataDeletedmarker);
    flushRasters(uuids)
    .then((_result) => {
      // TODO: this is not preferred way. see delet function in raster layer table
      if (setCheckboxes) {
        setCheckboxes([]);
      }
      triggerReloadWithCurrentPage();
    })
  }
}

const rasterSourceColumnDefenitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => <NavLink to={`${navigationUrlRasters}/${row.uuid}/`}>{!row.name? "(empty name)" : row.name }</NavLink>,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Code",
    renderFunction: (row: any) => {return !row.supplier_code ? "(empty 'supplier code')" : row.supplier_code },
    orderingField: "supplier_code",
  },
  {
    titleRenderFunction: () =>  "Temporal",
    renderFunction: (row: any) => row.temporal === true? "Yes" : "No",
    orderingField: null,
  },
  {
    titleRenderFunction: () =>  "Size",
    renderFunction: (row: any) => `${row.size? row.size: 0} Bytes`,
    orderingField: null,
  },
  {
    titleRenderFunction: () =>  "Actions",
    renderFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any) => {
      return (
          <TableActionButtons
            tableRow={row} 
            tableData={tableData}
            setTableData={setTableData} 
            triggerReloadWithCurrentPage={triggerReloadWithCurrentPage} 
            triggerReloadWithBasePage={triggerReloadWithBasePage}
            
            // uuid={row.uuid}
            actions={[
              {
                displayValue: "delete",
                // actionFunction: (uuid:string)=>deleteRasters([uuid]),
                actionFunction: deleteActionRaster,
              },
              {
                displayValue: "flush raster",
                actionFunction: (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
                  if (window.confirm(`Are you sure you want to flush raster-source with uuid: ${row.uuid} ?`)) {
                    const uuid = row.uuid;
                    const flushedRow =  {...row, markAsFlushed: true}
                    updateTableRow(flushedRow);
                    flushRaster(uuid)
                    .then((_result) => {
                      triggerReloadWithCurrentPage();
                    })
                  }
                },
              },
            ]}
          />
      );
    },
    orderingField: null,
  },
];

export const RasterSourceTable = (props:any) =>  {

  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push(`${navigationUrlRasters}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={rasterSourcesIcon}
      headerText={"Raster Sources"}
      explainationText={"Raster-source contains the actual data belonging to the raster."} 
      backUrl={"/data_management"}
    >
      <TableStateContainer 
        tableData={rasterItems70Parsed} 
        gridTemplateColumns={"10% 20% 20% 20% 10% 20%"} 
        columnDefenitions={rasterSourceColumnDefenitions}
        // /api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
        // baseUrl={"/api/v4/rasters/?writable=${writable}&page_size=${page_size}&page=${page}&name__icontains=${name__icontains}&ordering=${ordering}&organisation__uuid=${organisation__uuid}"}
        baseUrl={`${baseUrl}?`} 
        showCheckboxes={true}
        checkBoxActions={[
          {
            displayValue: "Flush Rasters",
            actionFunction: flushActionRasters,
          },
          {
            displayValue: "Delete",
            actionFunction: deleteActionRasters,
          },
          
        ]}
        newItemOnClick={handleNewRasterClick}
      />
    </ExplainSideColumn>
  );
}