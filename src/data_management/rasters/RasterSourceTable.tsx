import { useState, useEffect } from 'react';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableActionButtons from '../../components/TableActionButtons';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import rasterSourcesIcon from "../../images/raster_source_icon.svg";
import tableStyles from "../../components/Table.module.css";
import { bytesToDisplayValue } from '../../utils/byteUtils';
import Modal from '../../components/Modal';
import { ModalDeleteContent } from '../../components/ModalDeleteContent';
import DeleteRasterSourceNotAllowed  from './DeleteRasterSourceNotAllowed';
import MDSpinner from "react-md-spinner";
import { DefaultRasterSourceExplanationTextTable } from '../../utils/help_texts/helpTextForRasters';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import DeleteModal from '../../components/DeleteModal';
import DataFlushingModal from './DataFlushingModal';
import TemporalDataFlushingModal from './TemporalDataFlushingModal';
import { ColumnDefinition } from '../../components/Table';
import { RasterSourceFromAPI } from '../../api/rasters';

export const baseUrl = "/api/v4/rastersources/";
const navigationUrlRasters = "/management/data_management/rasters/sources";

export const RasterSourceTable = (props: RouteComponentProps) => {
  const [rowToFlushData, setRowToFlushData] = useState<RasterSourceFromAPI | null>(null);
  const [rowToFlushDataPartially, setRowToFlushDataPartially] = useState<RasterSourceFromAPI | null>(null);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<RasterSourceFromAPI | null>(null);
  const [resetTable, setResetTable] = useState<Function | null>(null);
  const [currentRowDetailView, setCurrentRowDetailView] = useState<RasterSourceFromAPI | null>(null);
  const [showDeleteFailedModal, setShowDeleteFailedModal] = useState<boolean>(false);


  useEffect(() => { 
    if (rowToBeDeleted) {
      fetch(baseUrl + rowToBeDeleted.uuid)
        .then(res => res.json())
        .then(detailView => setCurrentRowDetailView(detailView))
    };
  }, [rowToBeDeleted]);

  const deleteAction = (
    row: RasterSourceFromAPI,
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowToBeDeleted(row);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const flushDataAction = (
    row: RasterSourceFromAPI,
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowToFlushData(row);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const flushDataPartiallyAction = (
    row: RasterSourceFromAPI,
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowToFlushDataPartially(row);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const rasterSourceColumnDefinitions: ColumnDefinition<RasterSourceFromAPI>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => 
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
      renderFunction: (row) =>
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
      renderFunction: (row) => 
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
      renderFunction: (row) => 
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
      renderFunction: (row, _updateTableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage) => {
        return (
            <TableActionButtons
              tableRow={row}
              triggerReloadWithCurrentPage={triggerReloadWithCurrentPage} 
              triggerReloadWithBasePage={triggerReloadWithBasePage}
              editUrl={`${navigationUrlRasters}/${row.uuid}`}
              actions={row.temporal ? [
                {
                  displayValue: "Delete",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                    deleteAction(row, triggerReloadWithCurrentPage, null);
                  }
                },
                {
                  displayValue: "Flush data",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                    flushDataAction(row, triggerReloadWithCurrentPage, null);
                  }
                },
                {
                  displayValue: "Flush range",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                    flushDataPartiallyAction(row, triggerReloadWithCurrentPage, null);
                  }
                },
              ] : [
                {
                  displayValue: "Delete",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                    deleteAction(row, triggerReloadWithCurrentPage, null);
                  }
                },
                {
                  displayValue: "Flush data",
                  actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                    flushDataAction(row, triggerReloadWithCurrentPage, null);
                  }
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
      imgUrl={rasterSourcesIcon}
      imgAltDescription={"Raster-Source icon"}
      headerText={"Raster Sources"}
      explanationText={<DefaultRasterSourceExplanationTextTable />}
      backUrl={"/management/data_management/rasters"}
    >
      <TableStateContainer
        gridTemplateColumns={"37% 25% 10% 20% 8%"}  
        columnDefinitions={rasterSourceColumnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        newItemOnClick={handleNewRasterClick}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
        defaultUrlParams={'&scenario__isnull=true'} // to exclude 3Di scenario rasters
      />
      {rowToBeDeleted && !currentRowDetailView ? (
        <Modal
           title={'Loading'}
           cancelAction={()=>{
            setShowDeleteFailedModal(false);
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
           }}
         >
          <MDSpinner size={24} />
          <span style={{marginLeft: "40px"}}>Loading dependent objects for delete ..</span>
         </Modal>
      ) : null}
      {rowToBeDeleted && currentRowDetailView && (currentRowDetailView.layers.length !== 0 || currentRowDetailView.labeltypes.length !== 0) ? (
        <DeleteRasterSourceNotAllowed 
          rowToBeDeleted={rowToBeDeleted}
          handleClose={() => {
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
            setResetTable(null);
            // todo refresh table, because maybe user has in meanwhile deleted items. Or pass row instead and put logic for what modal is show inside modal component?
          }}
        />
      ) : null}
      {rowToBeDeleted && currentRowDetailView && (currentRowDetailView.layers.length === 0 && currentRowDetailView.labeltypes.length === 0) ? (
        <DeleteModal
          rows={[rowToBeDeleted]}
          displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
            setResetTable(null);
          }}
        />
      ) : null}
      {currentRowDetailView && showDeleteFailedModal ? (
        <Modal
          title={'Not allowed'}
          cancelAction={()=>{
            setShowDeleteFailedModal(false);
            setRowToBeDeleted(null);
            setCurrentRowDetailView(null);
          }}
        >
          <p>You are trying to delete the following raster-source:</p>
          {ModalDeleteContent([currentRowDetailView], false, [{name: "name", width: 65}, {name: "uuid", width: 25}])}
          <p>But this raster-source is still in use by objects outside your organisation.</p>
          <p>{"Please contact "}
            <a
              href="https://nelen-schuurmans.topdesk.net/tas/public/ssp"
              target="_blank"
              rel="noopener noreferrer"
            >
              support
            </a>
          </p>             
        </Modal>
      ) : null}
      {rowToFlushData ? (
        <DataFlushingModal
          row={rowToFlushData}
          displayContent={[{name: "name", width: 50}, {name: "uuid", width: 50}]}
          handleClose={() => {
            setRowToFlushData(null);
            setCurrentRowDetailView(null);
            setResetTable(null);
          }}
        />
      ) : null}
      {rowToFlushDataPartially ? (
        <TemporalDataFlushingModal
        row={rowToFlushDataPartially}
        handleClose={() => {
          setRowToFlushDataPartially(null);
          setCurrentRowDetailView(null);
          setResetTable(null);
        }}
      />
      ) : null}
    </ExplainSideColumn>
  );
}