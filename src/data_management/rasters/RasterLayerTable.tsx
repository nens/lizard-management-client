import React, { useState } from 'react';
import TableStateContainer from '../../components/TableStateContainer';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableActionButtons from '../../components/TableActionButtons';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import rasterIcon from "../../images/raster_layer_icon.svg";
import tableStyles from "../../components/Table.module.css";
import buttonStyles from "../../styles/Buttons.module.css";
import { RasterSourceModal } from './RasterSourceModal';
import { defaultRasterLayerHelpTextTable } from '../../utils/help_texts/helpTextForRasters';
import DeleteModal from '../../components/DeleteModal';
import { fetchWithOptions } from '../../utils/fetchWithOptions';

export const baseUrl = "/api/v4/rasters/";
const navigationUrlRasters = "/data_management/rasters/layers";

export const RasterLayerTable: React.FC<RouteComponentProps> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const [selectedLayer, setSelectedLayer] = useState<string>('');

  const deleteActions = (
    rows: any[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) =>
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrlRasters}/${row.uuid}`}>{row.name}</NavLink>
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
      orderingField: null,
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
              editUrl={`${navigationUrlRasters}/${row.uuid}`}
              actions={[
                {
                  displayValue: "Delete",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteActions([row], triggerReloadWithCurrentPage, null)
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
      imgUrl={rasterIcon}
      imgAltDescription={"Raster-Layer icon"}
      headerText={"Raster Layers"}
      explanationText={defaultRasterLayerHelpTextTable}
      backUrl={"/data_management/rasters"}
    >
        <TableStateContainer
          gridTemplateColumns={"8% 28% 22% 18% 16% 8%"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`}
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
                deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes)
              }
            }
          ]}
          newItemOnClick={handleNewRasterClick}
          filterOptions={[
            {value: 'name__icontains', label: 'Name'},
            {value: 'uuid', label: 'UUID'},
          ]}
          defaultUrlParams={{scenario__isnull: 'true'}} // to exclude 3Di scenario rasters
        />
        {rowsToBeDeleted.length > 0 ? (
          <DeleteModal
            rows={rowsToBeDeleted}
            displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
            fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
            resetTable={resetTable}
            handleClose={() => {
              setRowsToBeDeleted([]);
              setResetTable(null);
            }}
          />
        ) : null}
        {selectedLayer ? (
          <RasterSourceModal
            selectedLayer={selectedLayer}
            closeModal={() => setSelectedLayer('')}
          />
        ) : null}
     </ExplainSideColumn>
  );
}
