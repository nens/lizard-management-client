import React, { useState } from 'react';
import { connect } from 'react-redux';
import { NavLink, RouteComponentProps } from "react-router-dom";
import TableStateContainer from '../../../components/TableStateContainer';
import TableActionButtons from '../../../components/TableActionButtons';
import tableStyles from "../../../components/Table.module.css";
import { ExplainSideColumn } from '../../../components/ExplainSideColumn';
import { ModalDeleteContent } from '../../../components/ModalDeleteContent';
import { addNotification } from '../../../actions';
import Modal from '../../../components/Modal';
import alarmIcon from "../../../images/alarm@3x.svg";

export const RasterAlarmTableComponent: React.FC<DispatchProps & RouteComponentProps> = (props) =>  {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<any[]>([]);
  const [rowToBeDeleted, setRowToBeDeleted] = useState<any | null>(null);
  const [deleteFunction, setDeleteFunction] = useState<null | Function>(null);
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const baseUrl = "/api/v4/rasteralarms/";
  const navigationUrl = "/alarms/notifications/raster_alarms";

  const fetchRasterAlarmsWithOptions = (uuids: string[], fetchOptions:any) => {
    const fetches = uuids.map (uuid => {
      return (fetch(baseUrl + uuid + "/", fetchOptions));
    });
    return Promise.all(fetches);
  };

  const deleteActions = (rows: any[], tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any, setCheckboxes: any)=>{
    setRowsToBeDeleted(rows);
    const uuids = rows.map(row=> row.id);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      const tableDataDeletedmarker = tableData.map((rowAllTables:any)=>{
        if (uuids.find(uuid => uuid === rowAllTables.uuid)) {
          return {...rowAllTables, markAsDeleted: true}
        } else{
          return {...rowAllTables};
        }
      })
      setTableData(tableDataDeletedmarker);
      const opts = {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      return fetchRasterAlarmsWithOptions(uuids, opts)
      .then((_result) => {
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

  const deleteAction = (row: any, updateTableRow:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any)=>{
    setRowToBeDeleted(row);
    setDeleteFunction(()=>()=>{
      setBusyDeleting(true);
      updateTableRow({...row, markAsDeleted: true});
      const opts = {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      return fetchRasterAlarmsWithOptions([row.uuid], opts)
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

  const setAlarmActive = (row: any, updateTableRow: any, triggerReloadWithCurrentPage: any) => {
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
                  actionFunction: deleteAction,
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
              actionFunction: deleteActions,
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
           
           <p>Are you sure? You are deleting the following raster alarms:</p>
           {ModalDeleteContent(rowsToBeDeleted, busyDeleting, [{name: "name", width: 40}, {name: "uuid", width: 60}])}
           
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
           <p>Are you sure? You are deleting the following raster alarm:</p>
           {ModalDeleteContent([rowToBeDeleted], busyDeleting, [{name: "name", width: 40}, {name: "uuid", width: 60}])}

         </Modal>
        :
          null
        }
     </ExplainSideColumn>
  );
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const RasterAlarmTable = connect(null, mapDispatchToProps)(RasterAlarmTableComponent);