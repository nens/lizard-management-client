import React, { useState } from 'react';
import TableStateContainer from './TableStateContainer';
// import { NavLink, RouteComponentProps } from "react-router-dom";
import tableStyles from "./Table.module.css";
import buttonStyles from "../styles/Buttons.module.css";

export const baseUrl = "/api/v4/rasters/";
const navigationUrlRasters = "/data_management/rasters/layers";

interface Props {
  setSelectedRasters: (rasterLayers: any[]) => void
}

export const MapViewerRasterLayerTable: React.FC<Props> = ({setSelectedRasters}) =>  {

  const [selectedLayer, setSelectedLayer] = useState<string>('');

  const columnDefinitions = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          {/* <NavLink to={`${navigationUrlRasters}/${row.uuid}`}>{row.name}</NavLink> */}
          {row.name}
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
  ];

  return (
        <TableStateContainer 
          gridTemplateColumns={"8% 28% 22% 18% 16%"} 
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Add to map",
              actionFunction: (rows: any[], _tableData: any, _setTableData: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any, setCheckboxes: any) => {
                setSelectedRasters(rows);
              }
            },
          ]}
          filterOptions={[
            {value: 'name__icontains=', label: 'Name'},
            {value: 'uuid=', label: 'UUID'},
          ]}
          defaultUrlParams={'&scenario__isnull=true'} // to exclude 3Di scenario rasters
        />
  );
}