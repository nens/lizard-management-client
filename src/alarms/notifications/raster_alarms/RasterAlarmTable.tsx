import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import tableStyles from "../../../components/Table.module.css";
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { addNotification } from '../../../actions';
import DeleteModal from '../../../components/DeleteModal';
import alarmIcon from "../../../images/alarm@3x.svg";

const baseUrl = "/api/v4/rasteralarms/";
const navigationUrl = "/alarms/notifications/raster_alarms";

const fetchRasterAlarmsWithOptions = (uuids: string[], fetchOptions: RequestInit) => {
  const fetches = uuids.map (uuid => {
    return fetch(baseUrl + uuid + "/", fetchOptions);
  });
  return Promise.all(fetches);
};

export const RasterAlarmTableComponent: React.FC<DispatchProps & RouteComponentProps> = (props) =>  {
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

  const setAlarmActive = (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any) => {
    fetchRasterAlarmsWithOptions([row.uuid], {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: !row.active
      })
    })
    .then(response => {
      const alarmResponse = response[0];
      if (alarmResponse.status === 200) {
        triggerReloadWithCurrentPage();
        props.addNotification(`Alarm ${row.active ? 'Deactivated' : 'Activated'}`, 2000);
      } else {
        console.error(response);
        props.addNotification(`Failed to ${row.active ? 'deactivate' : 'activate'} alarm`, 2000);
      };
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
      titleRenderFunction: () =>  "Recipients",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
        >
          {row.messages.length}
        </span>,
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Status",
      renderFunction: (row: any) => 
        <span
          className={tableStyles.CellEllipsis}
        >
          {row.active ? 'ON' : 'OFF'}
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
                  displayValue: row.active ? 'Deactivate' : 'Activate',
                  actionFunction: setAlarmActive
                },
                {
                  displayValue: "Delete",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteActions([row], triggerReloadWithCurrentPage, null)
                  }
                }
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
      imgUrl={alarmIcon}
      imgAltDescription={"Alarm icon"}
      headerText={"Raster Alarms"}
      explanationText={"Alarms consist of a name, template, thresholds and recipients. You can create, (de)activate or delete your alarms here."} 
      backUrl={"/alarms/notifications"}
    >
        <TableStateContainer 
          gridTemplateColumns={"10% 40% 20% 20% 10%"} 
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
            displayContent={[{name: "name", width: 40}, {name: "uuid", width: 60}]}
            fetchFunction={fetchRasterAlarmsWithOptions}
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

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const RasterAlarmTable = connect(null, mapDispatchToProps)(RasterAlarmTableComponent);