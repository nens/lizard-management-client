import React from 'react';
import {useState, useEffect}  from 'react';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {  deleteRasterSource, 
  // deleteRasterSources, flushRasters, flushRaster 
} from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterSourcesIcon from "../../images/raster_source_icon.svg";
import tableStyles from "../../components/Table.module.css";
import { bytesToDisplayValue } from '../../utils/byteUtils';
import Modal from '../../components/Modal';

import { ModalDeleteContent } from '../../components/ModalDeleteContent';
import DeleteRasterSourceNotAllowed  from './DeleteRasterSourceNotAllowed';
import MDSpinner from "react-md-spinner";
import { defaultRasterSourceExplanationTextTable } from '../../utils/helpTextForForms';
import {useSelector} from 'react-redux';
import {getScenarioTotalSize} from '../../reducers';



export const RasterSourceTable = (props:any) =>  {

  // const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [currentRowDetailView, setCurrentRowDetailView] = useState<null | any>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);
  const [showDeleteFailedModal, setShowDeleteFailedModal] = useState<boolean>(false);
  const rastersTotalSize = useSelector(getScenarioTotalSize);


  const baseUrl = "/api/v4/rastersources/";
  const navigationUrlRasters = "/data_management/rasters/sources";

  useEffect(() => { 
    if (rowToBeDeleted) {
      fetch(baseUrl + rowToBeDeleted.uuid)
        .then((result:any)=>{
          return result.json();
        })
        .then((detailView:any)=>{
          setCurrentRowDetailView(detailView);
        })
    }
  }, [rowToBeDeleted]);

  const deleteActionRaster = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      return deleteRasterSource(row.uuid)
      .then((result) => {
        setBusyDeleting(false);
        triggerReloadWithCurrentPage();
        return new Promise((resolve, _reject) => {
            resolve({result:result, row:row});
          });
        })
    })
    
  }

  // implement later
  // const deleteActionRasters = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
  //   setRowsToBeDeleted(rows);
  //   const uuids = rows.map(row=> row.uuid);
  //   setDeleteFunction(()=>()=>{
  //     setBusyDeleting(true);
  //     const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
  //       if (uuids.find((uuid)=> uuid === rowAllTables.uuid)) {
  //         return {...rowAllTables, markAsDeleted: true}
  //       } else{
  //         return {...rowAllTables};
  //       }
  //     })
  //     setTableData(tableDataDeletedmarker);
  //     return deleteRasterSources(uuids)
  //     .then((result) => {
  //       setBusyDeleting(false);
  //       if (setCheckboxes) {
  //         setCheckboxes([]);
  //       }
  //       triggerReloadWithCurrentPage();
  //       return new Promise((resolve, _reject) => {
  //         resolve(result);
  //       });
  //     })
  //   });
  // }

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
          <NavLink to={`${navigationUrlRasters}/${row.uuid}`}>{!row.name? "(empty name)" : row.name }</NavLink>
        </span>
      ,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Code",
      renderFunction: (row: any) =>
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
      orderingField: "size",
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
              editUrl={`${navigationUrlRasters}/${row.uuid}`}
              actions={[
                {
                  displayValue: "Delete",
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
      explanationText={defaultRasterSourceExplanationTextTable(bytesToDisplayValue(rastersTotalSize))} 
      backUrl={"/data_management/rasters"}
    >
      <TableStateContainer 
        // with checkboxes
        // gridTemplateColumns={"8% 29% 25% 10% 20% 8%"}
        gridTemplateColumns={"37% 25% 10% 20% 8%"}  
        columnDefinitions={rasterSourceColumnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[
          // implement later
          // {
          //   displayValue: "Flush Rasters",
          //   actionFunction: flushActionRasters,
          // },
          // {
          //   displayValue: "Delete",
          //   actionFunction: deleteActionRasters,
          // },
        ]}
        newItemOnClick={handleNewRasterClick}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
        defaultUrlParams={'&scenario__isnull=true'} // to exclude 3Di scenario rasters
      />
      {
        rowToBeDeleted && !currentRowDetailView ?
        <Modal
           title={'Loading'}
           cancelAction={()=>{
            setShowDeleteFailedModal(false);
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
           }}
         >
          <MDSpinner size={24} /><span style={{marginLeft: "40px"}}>Loading dependent objects for delete ..</span>
         </Modal>
        :
        null
      }
      {
        // next line is correctly commented out, use it for testing delete 412 error
        // false &&
        currentRowDetailView && (currentRowDetailView.layers.length !== 0 || currentRowDetailView.labeltypes.length !== 0) ?

        <DeleteRasterSourceNotAllowed 
          closeDialogAction={()=>{
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
            setDeleteFunction(null);
            // todo refresh table, because maybe user has in meanwhile deleted items. Or pass row instead and put logic for what modal is show inside modal component?
          }}
          rowToBeDeleted={rowToBeDeleted}
        />
        :
        null
      }
      { 
        currentRowDetailView && deleteFunction 
        && 
        (currentRowDetailView.layers.length === 0 && currentRowDetailView.labeltypes.length === 0) 
        ?
           <Modal
           title={'Are you sure?'}
           buttonConfirmName={'Delete'}
           onClickButtonConfirm={() => {
             deleteFunction && deleteFunction().then((resultObj:any)=>{
              if (resultObj.result.status === 412) {
                setShowDeleteFailedModal(true);
                setDeleteFunction(null);
              } else {
                setRowToBeDeleted(null);
                setCurrentRowDetailView(null);
                setDeleteFunction(null);
              }
              
             });
             
           }}
           cancelAction={()=>{
             setRowToBeDeleted(null);
             setCurrentRowDetailView(null);
             setDeleteFunction(null);
           }}
           disableButtons={busyDeleting}
         >
           <p>Are you sure? You are deleting the following raster-source:</p>
           {ModalDeleteContent([currentRowDetailView], busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}             
         </Modal>
        :
          null
        }
        { 
        currentRowDetailView &&  showDeleteFailedModal?
           <Modal
           title={'Not allowed'}
           closeDialogAction={()=>{
            setShowDeleteFailedModal(false);
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
           }}
         >
           <p>You are trying to delete the following raster-source:</p>
           {ModalDeleteContent([currentRowDetailView], busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           <p>But this raster-source is still in use by objects outside your organisation.</p>
           <p>{"Please contact "} 
             <a
              href="https://nelen-schuurmans.topdesk.net/tas/public/ssp"
              target="_blank"
              rel="noopener noreferrer"
            >support</a>
          </p>             
         </Modal>
        :
          null
        }
        {/* { 
        rowsToBeDeleted.length > 0?
           <Modal
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
           
         </Modal>
        :
          null
        } */}
    </ExplainSideColumn>
  );
}