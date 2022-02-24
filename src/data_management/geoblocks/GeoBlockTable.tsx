import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import DeleteModal from '../../components/DeleteModal';
import geoblockIcon from "../../images/geoblock.svg";
import tableStyles from "../../components/Table.module.css";
import { getAccessibiltyText } from '../../form/AccessModifier';
import { fetchWithOptions } from '../../utils/fetchWithOptions';
import { geoBlockHelpText } from '../../utils/help_texts/helpTextForGeoBlock';
import { openRasterInLizardViewer } from '../../utils/openRasterInViewer';
import { RasterLayerFromAPI } from '../../api/rasters';
import { ColumnDefinition } from '../../components/Table';

export const baseUrl = "/api/v4/rasters/";
const navigationUrl = "/management/data_management/geoblocks";

export const GeoBlockTable: React.FC<RouteComponentProps> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<RasterLayerFromAPI[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: RasterLayerFromAPI[],
    triggerReloadWithCurrentPage: Function,
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
      renderFunction: (row) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.name}
        >
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () => "Operations",
      renderFunction: (row) =>
        <span
          className={tableStyles.CellEllipsis}
          title={row.weight.toString()}
        >
          {row.weight}
        </span>,
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "User",
      renderFunction: (row) =>  
      <span
        className={tableStyles.CellEllipsis}
        title={row.supplier}
      >
        {row.supplier}
      </span>,
      orderingField: "supplier",
    },
    {
      titleRenderFunction: () =>  "Accessibility",
      renderFunction: (row) =>
        <span
          className={tableStyles.CellEllipsis}
          title={row.access_modifier}
        >
          {getAccessibiltyText(row.access_modifier)}
        </span>
      ,
      orderingField: null,
    },
    {
      titleRenderFunction: () =>  "",//"Actions",
      renderFunction: (row, _updateTableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage) => {
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
                    deleteActions([row], triggerReloadWithCurrentPage, null)
                  }
                },
                {
                  displayValue: "Open in Viewer",
                  actionFunction: (row) => openRasterInLizardViewer(row)
                }
              ]}
            />
        );
      },
      orderingField: null,
    },
  ];

  const handleNewClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={geoblockIcon}
      imgAltDescription={"GeoBlock icon"}
      headerText={"GeoBlocks"}
      explanationText={geoBlockHelpText['default']}
      backUrl={"/management/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"1fr 6fr 2fr 3fr 2fr 1fr"}
          columnDefinitions={columnDefinitions}
          baseUrl={`${baseUrl}?`} 
          checkBoxActions={[
            {
              displayValue: "Delete",
              actionFunction: (rows, _tableData, _setTableData, triggerReloadWithCurrentPage, _triggerReloadWithBasePage, setCheckboxes) => {
                deleteActions(rows, triggerReloadWithCurrentPage, setCheckboxes)
              }
            }
          ]}
          newItemOnClick={handleNewClick}
          filterOptions={[
            {value: 'name__icontains=', label: 'Name'},
            {value: 'uuid=', label: 'UUID'},
          ]}
          defaultUrlParams={'&scenario__isnull=true&is_geoblock=true'} // to only show geoblocks & to exclude 3Di result layers
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
     </ExplainSideColumn>
  );
}