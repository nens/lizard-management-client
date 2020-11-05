import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import { deleteRasterSources, deleteRasterSource, flushRasters, flushRaster } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterSourcesIcon from "../../images/raster_sources_logo_explainbar.svg";
import tableStyles from "../../components/Table.module.css";

const baseUrl = "/api/v4/rastersources/";
const navigationUrlRasters = "/data_management/rasters";

const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
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
        {`${row.size? row.size: 0} Bytes`}
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
        gridTemplateColumns={"8% 29% 25% 10% 20% 8%"} 
        columnDefenitions={rasterSourceColumnDefenitions}
        baseUrl={`${baseUrl}?`} 
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