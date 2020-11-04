import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import { NavLink } from "react-router-dom";
import { deleteRasters, /*flushRasters*/ } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layers_logo_explainbar.svg";
import tableStyles from "../../components/Table.module.css";



const baseUrl = "/api/v4/scenarios/";
const navigationUrl = "/data_management/scenarios";

const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
  if (window.confirm(`Are you sure you want to delete raster with uuid: ${row.uuid} ?`)) {
    updateTableRow({...row, markAsDeleted: true});
    deleteRasters([row.uuid])
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
        <NavLink to={`${navigationUrl}/${row.uuid}/`}>{row.name}</NavLink>
      </span>,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Based on",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.model_name}
      >
        {row.model_name}
      </span>,
    orderingField: "model_name",
  },
  {
    titleRenderFunction: () =>  "User",
    renderFunction: (row: any) =>  
    <span
      className={tableStyles.CellEllipsis}
      title={row.username}
    >
      {row.username}
    </span>,
    orderingField: "username",
  },
  // {
  //   titleRenderFunction: () =>  "Raw data",
  //   renderFunction: (row: any) => row.hasRawData === true? "Yes" : "No",
  //   orderingField: null,
  // },
  {
    titleRenderFunction: () =>  "Size",
    renderFunction: (row: any) => 
      <span
        className={tableStyles.CellEllipsis}
        title={`${row.total_size? row.total_size: 0} Bytes`}
      >
        {`${row.total_size? row.total_size: 0} Bytes`}
      </span>
    ,
    orderingField: "total_size",
  },
  // {
  //   titleRenderFunction: () =>  "",//"Actions",
  //   renderFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any) => {
  //     return (
  //         <TableActionButtons
  //           tableRow={row} 
  //           tableData={tableData}
  //           setTableData={setTableData} 
  //           triggerReloadWithCurrentPage={triggerReloadWithCurrentPage} 
  //           triggerReloadWithBasePage={triggerReloadWithBasePage}
  //           actions={[
  //             {
  //               displayValue: "delete",
  //               actionFunction: deleteActionRaster,
  //             },
  //             // {
  //             //   displayValue: "flushRasters",
  //             //   actionFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
  //             //     const uuid = row.uuid;
  //             //     const tableDataFlushedmarker = tableData.map((rowAllTables:any)=>{
  //             //       if (uuid === rowAllTables.uuid) {
  //             //         return {...rowAllTables, markAsFlushed: true}
  //             //       } else{
  //             //         return {...rowAllTables};
  //             //       }
  //             //     })
  //             //     setTableData(tableDataFlushedmarker);
  //             //     flushRasters([uuid])
  //             //     .then((_result) => {
  //             //       triggerReloadWithCurrentPage();
  //             //     })
  //             //   },
  //             // },
  //           ]}
  //         />
  //     );
  //   },
  //   orderingField: null,
  // },
];

export const ScenarioTable = (props:any) =>  {

  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={rasterIcon}
      headerText={"Scenarios"}
      explainationText={"Scenarios are created in 3di."} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          tableData={rasterItems70Parsed} 
          gridTemplateColumns={"8% 30% 24% 20% 10%"} 
          columnDefenitions={rasterSourceColumnDefenitions}
          baseUrl={`${baseUrl}?`} 
          showCheckboxes={true}
          checkBoxActions={[
            // {
            //   displayValue: "Delete",
            //   actionFunction: deleteActionRasters,
            // }
          ]}
          // newItemOnClick={handleNewRasterClick}
          queryCheckBox={{
            text:"Show only own data",
            adaptUrlFunction: (url:string) => {return url + `&username__contains=${"tom.deboer"}`},
          }}
        />
     </ExplainSideColumn>
  );
}