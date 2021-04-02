import React, { useState } from 'react';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import DeleteModal from '../../components/DeleteModal';
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import wmsIcon from "../../images/wms@3x.svg";
import tableStyles from "../../components/Table.module.css";

const baseUrl = "/api/v4/wmslayers/";
const navigationUrl = "/data_management/wms_layers";

const fetchWmsLayerUuidsWithOptions = (uuids: string[], fetchOptions:any) => {
  const url = "/api/v4/wmslayers/";
  const fetches = uuids.map (wmsLayerUuid => {
    return (fetch(url + wmsLayerUuid + "/", fetchOptions));
  });
  return Promise.all(fetches)
};

export const WmsLayerTable = (props: RouteComponentProps) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

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
          <NavLink to={`${navigationUrl}/${row.uuid}`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Description",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.description}
        >
          {row.description}
        </span>,
      orderingField: null,
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
              editUrl={`${navigationUrl}/${row.uuid}`}
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
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={wmsIcon}
      imgAltDescription={"WMS-Layer icon"}
      headerText={"WMS Layers"}
      explanationText={"WMS-Layers allow to configure layers in lizard even if they are hosted on another platform"} 
      backUrl={"/data_management"}
    >
        <TableStateContainer 
          gridTemplateColumns={"8% 29% 55% 8%"} 
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
            {value: 'name__icontains=', label: 'Name'},
            // not needed for now
            // {value: 'datasets__slug__icontains=', label: 'Datasets slug'},
            {value: 'uuid=', label: 'UUID'},
          ]}
        />
        {rowsToBeDeleted.length > 0 ? (
          <DeleteModal
            rows={rowsToBeDeleted}
            displayContent={[{name: "name", width: 65}, {name: "uuid", width: 35}]}
            fetchFunction={fetchWmsLayerUuidsWithOptions}
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