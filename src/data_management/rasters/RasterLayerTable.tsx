import React, { useState } from "react";
import TableStateContainer from "../../components/TableStateContainer";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableActionButtons from "../../components/TableActionButtons";
import { ExplainSideColumn } from "../../components/ExplainSideColumn";
import rasterIcon from "../../images/raster_layer_icon.svg";
import tableStyles from "../../components/Table.module.css";
import buttonStyles from "../../styles/Buttons.module.css";
import { RasterSourceModal } from "./RasterSourceModal";
import { defaultRasterLayerHelpTextTable } from "../../utils/help_texts/helpTextForRasters";
import DeleteModal from "../../components/DeleteModal";
import { fetchWithOptions } from "../../utils/fetchWithOptions";
import { RasterLayerFromAPI } from "../../api/rasters";
import { ColumnDefinition } from "../../components/Table";

export const baseUrl = "/api/v4/rasters/";
const navigationUrlRasters = "/management/data_management/rasters/layers";

export const RasterLayerTable: React.FC<RouteComponentProps> = (props) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<RasterLayerFromAPI[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const [selectedLayer, setSelectedLayer] = useState<string>("");

  const deleteActions = (
    rows: RasterLayerFromAPI[],
    triggerReloadWithCurrentPage: () => void,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<RasterLayerFromAPI>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.name}>
          <NavLink to={`${navigationUrlRasters}/${row.uuid}`}>{row.name}</NavLink>
        </span>
      ),
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Based on",
      renderFunction: (row) => (
        <span
          className={tableStyles.CellEllipsis}
          title={row.is_geoblock ? "Geoblock" : "Raster source"}
        >
          <button
            className={buttonStyles.ButtonLink}
            onClick={() => setSelectedLayer(row.uuid)}
            style={{
              color: "var(--color-button)",
            }}
          >
            {row.is_geoblock ? "Geoblock" : "Raster source"}
          </button>
        </span>
      ),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "User",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.supplier}>
          {row.supplier}
        </span>
      ),
      orderingField: "supplier",
    },
    {
      titleRenderFunction: () => "Temporal",
      renderFunction: (row) => (row.temporal === true ? "Yes" : "No"),
      orderingField: "temporal",
    },
    {
      titleRenderFunction: () => "", //"Actions",
      renderFunction: (
        row,
        _updateTableRow,
        triggerReloadWithCurrentPage,
        triggerReloadWithBasePage
      ) => {
        return (
          <TableActionButtons
            tableRow={row}
            triggerReloadWithCurrentPage={triggerReloadWithCurrentPage}
            triggerReloadWithBasePage={triggerReloadWithBasePage}
            editUrl={`${navigationUrlRasters}/${row.uuid}`}
            actions={[
              {
                displayValue: "Delete",
                actionFunction: (row, triggerReloadWithCurrentPage, _triggerReloadWithBasePage) => {
                  deleteActions([row], triggerReloadWithCurrentPage, null);
                },
              },
            ]}
          />
        );
      },
      orderingField: null,
    },
  ];

  const handleNewRasterClick = () => {
    const { history } = props;
    history.push(`${navigationUrlRasters}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={rasterIcon}
      imgAltDescription={"Raster-Layer icon"}
      headerText={"Raster Layers"}
      explanationText={defaultRasterLayerHelpTextTable}
      backUrl={"/management/data_management/rasters"}
    >
      <TableStateContainer
        gridTemplateColumns={"8% 28% 22% 18% 16% 8%"}
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`}
        checkBoxActions={[
          {
            displayValue: "Delete",
            actionFunction: (
              rows,
              _tableData,
              _setTableData,
              triggerReloadWithCurrentPage,
              _triggerReloadWithBasePage,
              setCheckboxes
            ) => {
              deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes);
            },
          },
        ]}
        newItemOnClick={handleNewRasterClick}
        filterOptions={[
          { value: "name__icontains=", label: "Name" },
          { value: "uuid=", label: "UUID" },
        ]}
        defaultUrlParams={"&scenario__isnull=true"} // to exclude 3Di scenario rasters
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 40 },
            { name: "uuid", width: 60 },
          ]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setRowsToBeDeleted([]);
            setResetTable(null);
          }}
        />
      ) : null}
      {selectedLayer ? (
        <RasterSourceModal selectedLayer={selectedLayer} closeModal={() => setSelectedLayer("")} />
      ) : null}
    </ExplainSideColumn>
  );
};
