import React, { useState } from 'react';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { deleteRasters, /*flushRasters*/ } from "../../api/rasters";
import TableActionButtons from '../../components/TableActionButtons';
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layer_icon.svg";
import tableStyles from "../../components/Table.module.css";
import buttonStyles from "../../styles/Buttons.module.css";
import Modal from '../../components/Modal';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';
import { RasterSourceModal } from './RasterSourceModal';

export const RasterLayerTable: React.FC<RouteComponentProps> = (props) =>  {

  const baseUrl = "/api/v4/rasters/";
  const navigationUrlRasters = "/data_management/rasters/layers";

  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const [selectedLayer, setSelectedLayer] = useState<string>('');

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

  const columnDefinitions = [
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
          title={row.is_geoblock ? 'Geoblock' : 'Raster source'}
        >
          <button
            className={buttonStyles.ButtonLink}
            onClick={() => setSelectedLayer(row.uuid)}
            style={{
              color: 'var(--color-button)'
            }}
          >
            {row.is_geoblock ? 'Geoblock' : 'Raster source'}
          </button>
        </span>,
      orderingField: "is_geoblock",
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
      orderingField: "temporal",
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
      imgAltDescription={"Raster-Layer icon"}
      headerText={"Raster Layers"}
      explanationText={"Raster Layers are visual presentations of your raster data. Choose the prefered Raster Source so that the Raster Layer fetches the right data and give the Raster Layer a name, description, observation type and styling. Once published, your Raster Layer will be visible in the Catalogue and the Portal."}
      backUrl={"/data_management/rasters"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 28% 22% 18% 16% 8%"} 
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: deleteActionRasters,
            }
          ]}
          newItemOnClick={handleNewRasterClick}
          textSearchBox={true}
          defaultUrlParams={'&scenario__isnull=true'} // to exclude 3Di scenario rasters
        />
        { 
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
           
           <p>Are you sure? You are deleting the following raster layers:</p>
           
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
           
         </Modal>
        :
          null
        }

        { 
        rowToBeDeleted?
           <Modal
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
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
         </Modal>
        :
          null
        }

        {selectedLayer ? (
          <RasterSourceModal
            selectedLayer={selectedLayer}
            closeModal={() => setSelectedLayer('')}
          />
        ) : null}
     </ExplainSideColumn>
  );
}