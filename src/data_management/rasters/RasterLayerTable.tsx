import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import { NavLink } from "react-router-dom";
import { deleteRasters, flushRasters } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';



const baseUrl = "/api/v4/rasters/";
const navigationUrlRasters = "/data_management/rasters";

const deleteActionRaster = (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
  deleteActionRasters([row], tableData, setTableData, triggerReloadWithCurrentPage, triggerReloadWithBasePage, null)
}

const deleteActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  const uuids = rows.map(row=> row.uuid);
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
    triggerReloadWithCurrentPage().then(()=>{
      if (setCheckboxes) {
        setCheckboxes([]);
      }
    });
  })
}

const rasterSourceColumnDefenitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => <NavLink to={`${navigationUrlRasters}/${row.uuid}/`}>{row.name}</NavLink>,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Based on",
    renderFunction: (row: any) => row.raster_sources[0],
    orderingField: "raster_sources",
  },
  {
    titleRenderFunction: () =>  "User",
    renderFunction: (row: any) => row.supplier,
    orderingField: "supplier",
  },
  {
    titleRenderFunction: () =>  "Temporal",
    renderFunction: (row: any) => row.temporal === true? "Yes" : "No",
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
            actions={[
              {
                displayValue: "delete",
                actionFunction: deleteActionRaster,
              },
              {
                displayValue: "flushRasters",
                actionFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
                  const uuid = row.uuid;
                  const tableDataFlushedmarker = tableData.map((rowAllTables:any)=>{
                    if (uuid === rowAllTables.uuid) {
                      return {...rowAllTables, markAsFlushed: true}
                    } else{
                      return {...rowAllTables};
                    }
                  })
                  setTableData(tableDataFlushedmarker);
                  flushRasters([uuid])
                  .then((_result) => {
                    triggerReloadWithCurrentPage();
                  })
                },
              },
            ]}
          />
      );
    },
    orderingField: null,
  },
];

export const RasterLayerTable = (props:any) =>  {

  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push(`${navigationUrlRasters}/new`);
  }

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <button>{"<--"} </button>
        <img></img>
        <h2>Raster Layers</h2>
        <div>
          Some raster layer text
        </div>

      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >

      
        <TableStateContainer 
          tableData={rasterItems70Parsed} 
          gridTemplateColumns={"3% 25% 25% 20% 12% 10%"} 
          // gridTemplateColumns={"calc(10% - 78px) calc(25% - 78px) calc(25% - 78px) calc(20% - 78px) calc(10% - 78px) calc(8% - 78px)"}  
          // gridTemplateColumns={"10px 100px 100px 100px 30px 50px"} 
          columnDefenitions={rasterSourceColumnDefenitions}
          baseUrl={`${baseUrl}?`} 
          showCheckboxes={true}
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteActionRasters,
            }
          ]}
          newItemOnClick={handleNewRasterClick}
        />
      </div>
    </div>
  );
}