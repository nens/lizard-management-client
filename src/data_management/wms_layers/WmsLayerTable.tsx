import React, { useState } from "react";
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from "../../components/TableStateContainer";
import TableActionButtons from "../../components/TableActionButtons";
import DeleteModal from "../../components/DeleteModal";
import { ExplainSideColumn } from "../../components/ExplainSideColumn";
import { fetchWithOptions } from "../../utils/fetchWithOptions";
import wmsIcon from "../../images/wms@3x.svg";
import tableStyles from "../../components/Table.module.css";
import { ColumnDefinition } from "../../components/Table";
import { WmsLayerReceivedFromApi } from "../../types/WmsLayerType";

export const baseUrl = "/api/v4/wmslayers/";
const navigationUrl = "/management/data_management/wms_layers";

export const WmsLayerTable = (props: RouteComponentProps) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<WmsLayerReceivedFromApi[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: WmsLayerReceivedFromApi[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const columnDefinitions: ColumnDefinition<WmsLayerReceivedFromApi>[] = [
    {
      titleRenderFunction: () => "Name",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.name}>
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
        </span>
      ),
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Description",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis} title={row.description}>
          {row.description}
        </span>
      ),
      orderingField: null,
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
            editUrl={`${navigationUrl}/${row.uuid}`}
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
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      imgAltDescription={"WMS-Layer icon"}
      headerText={"WMS Layers"}
      explanationText={
        "WMS-Layers allow to configure layers in lizard even if they are hosted on another platform"
      }
      backUrl={"/management/data_management"}
    >
      <TableStateContainer
        gridTemplateColumns={"8% 29% 55% 8%"}
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
          // not needed for now
          // {value: 'layer_collections__slug__icontains=', label: 'Layer collections slug'},
          { value: "uuid=", label: "UUID" },
        ]}
      />
      {rowsToBeDeleted.length > 0 ? (
        <DeleteModal
          rows={rowsToBeDeleted}
          displayContent={[
            { name: "name", width: 65 },
            { name: "uuid", width: 35 },
          ]}
          fetchFunction={(uuids, fetchOptions) => fetchWithOptions(baseUrl, uuids, fetchOptions)}
          resetTable={resetTable}
          handleClose={() => {
            setRowsToBeDeleted([]);
            setResetTable(null);
          }}
        />
      ) : null}
    </ExplainSideColumn>
  );
};
