import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import { NavLink } from "react-router-dom";
import { deleteRasters, flushRasters } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layers_logo_explainbar.svg";



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
    <ExplainSideColumn
      imgUrl={rasterIcon}
      headerText={"Raster Layers"}
      explainationText={"Raster-Layer is a visual representation of a Raster-Source on the map. It contains among other things the styling of how the raster data should be visualized. One Raster-Source can contain multiple Raster-Layers."} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          tableData={rasterItems70Parsed} 
          gridTemplateColumns={"10% 24% 20% 21% 9% 8%"} 
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
     </ExplainSideColumn>
  );
}