import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import TableStateContainer from '../../components/TableStateContainer';
import TableActionButtons from '../../components/TableActionButtons';
import tableStyles from "../../components/Table.module.css";
import { ExplainSideColumn } from '../../components/ExplainSideColumn';
import DeleteModal from '../../components/DeleteModal';
import templateIcon from "../../images/templates@3x.svg";

const baseUrl = "/api/v4/messages/";
const navigationUrl = "/alarms/templates";

const fetchTemplatesWithOptions = (ids: string[], fetchOptions:any) => {
  const fetches = ids.map (id => {
    return (fetch(baseUrl + id + "/", fetchOptions));
  });
  return Promise.all(fetches)
};

export const TemplateTable: React.FC<any> = (props) =>  {
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
          <NavLink to={`${navigationUrl}/${row.id}`}>{row.name}</NavLink>
        </span>,
      orderingField: "name",
    },
    {
      titleRenderFunction: () =>  "Type",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
          title={row.type}
        >
          {row.type.toUpperCase()}
        </span>,
      orderingField: "type",
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
              editUrl={`${navigationUrl}/${row.id}`}
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

  const handleNewContactClick  = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  }

  return (
    <ExplainSideColumn
      imgUrl={templateIcon}
      imgAltDescription={"Template icon"}
      headerText={"Templates"}
      explanationText={"Templates are used to create messages for your alarms. You can choose between an email or text message."} 
      backUrl={"/alarms"}
    >
        <TableStateContainer 
          gridTemplateColumns={"10% 70% 10% 10%"} 
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
          newItemOnClick={handleNewContactClick}
          filterOptions={[
            {
              value: 'name__icontains=',
              label: 'Name'
            }
          ]}
        />

        {rowsToBeDeleted.length > 0 ? (
          <DeleteModal
            rows={rowsToBeDeleted}
            displayContent={[{name: "name", width: 30}, {name: "type", width: 20}, {name: "id", width: 50}]}
            fetchFunction={fetchTemplatesWithOptions}
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