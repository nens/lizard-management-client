import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import { NavLink } from "react-router-dom";
import { deleteRasters, flushRasters } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';



const baseUrl = "/api/v4/rastersources/";
const navigationUrlRasters = "/data_management/rasters";

const deleteActionRaster = (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
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
    renderFunction: (row: any) => `${row.size}`,
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
                displayValue: "flushRasters",
                actionFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
                  const uuid = row.uuid;
                  // const tableDataCopy = tableData.map((row:any)=>{
                  //   return {...row}
                  // });
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

export const RasterSourceTable = (props:any) =>  {

  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push(`${navigationUrlRasters}/new`);
  }

  return (
    <TableStateContainer 
      tableData={rasterItems70Parsed} 
      gridTemplateColumns={"5% 20% 20% 20% 20% 10%"} 
      columnDefenitions={rasterSourceColumnDefenitions}
      // /api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
      // baseUrl={"/api/v4/rasters/?writable=${writable}&page_size=${page_size}&page=${page}&name__icontains=${name__icontains}&ordering=${ordering}&organisation__uuid=${organisation__uuid}"}
      baseUrl={`${baseUrl}?`} 
      showCheckboxes={true}
      checkBoxActions={[
        {
          displayValue: "Delete",
          actionFunction: deleteActionRasters,
        }
      ]}
      newItemOnClick={handleNewRasterClick}
      // should probably not use next lines of actions
      // actions={
      //   [
        // {
        //   titleRenderFunction: () =>  "Actions",
        //   renderFunction: (row: any) => {
        //     return (
        //       <div>
        //         <TableActionButtons
        //           uuid={row.uuid}
        //           actions={[
        //             {
        //               displayValue: "delete",
        //               actionFunction: (uuid:string)=>deleteRasters([uuid]),
        //               tableNeedsUpdate: true,
        //             }
        //           ]}
        //         />
        //       </div>
        //     );
        //   },
        //   orderingField: null,
        // },
    //   ]
    // }
    />
  );
}