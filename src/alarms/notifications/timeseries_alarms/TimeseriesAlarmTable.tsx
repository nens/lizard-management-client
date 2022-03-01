import { useState } from "react";
import { connect } from "react-redux";
import { NavLink, RouteComponentProps } from "react-router-dom";
import { AppDispatch } from "../../..";
import { TimeseriesAlarm } from "../../../types/alarmType";
import TableStateContainer from "../../../components/TableStateContainer";
import TableActionButtons from "../../../components/TableActionButtons";
import tableStyles from "../../../components/Table.module.css";
import { ExplainSideColumn } from "../../../components/ExplainSideColumn";
import { addNotification } from "../../../actions";
import { fetchWithOptions } from "../../../utils/fetchWithOptions";
import { ColumnDefinition } from "../../../components/Table";
import DeleteModal from "../../../components/DeleteModal";
import alarmIcon from "../../../images/alarm@3x.svg";

export const baseUrl = "/api/v4/timeseriesalarms/";
const navigationUrl = "/management/alarms/notifications/timeseries_alarms";

export const TimeseriesAlarmTableComponent: React.FC<DispatchProps & RouteComponentProps> = (
  props
) => {
  const [rowsToBeDeleted, setRowsToBeDeleted] = useState<TimeseriesAlarm[]>([]);
  const [resetTable, setResetTable] = useState<Function | null>(null);

  const deleteActions = (
    rows: TimeseriesAlarm[],
    triggerReloadWithCurrentPage: Function,
    setCheckboxes: Function | null
  ) => {
    setRowsToBeDeleted(rows);
    setResetTable(() => () => {
      triggerReloadWithCurrentPage();
      setCheckboxes && setCheckboxes([]);
    });
  };

  const setAlarmActive = (row: TimeseriesAlarm, triggerReloadWithCurrentPage: () => void) => {
    fetchWithOptions(baseUrl, [row.uuid], {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: !row.active,
      }),
    }).then((response) => {
      const alarmResponse = response[0];
      if (alarmResponse.status === 200) {
        triggerReloadWithCurrentPage();
        props.addNotification(`Alarm ${row.active ? "Deactivated" : "Activated"}`, 2000);
      } else {
        console.error(response);
        props.addNotification(`Failed to ${row.active ? "deactivate" : "activate"} alarm`, 2000);
      }
    });
  };

  const columnDefinitions: ColumnDefinition<TimeseriesAlarm>[] = [
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
      titleRenderFunction: () => "Recipients",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis}>{row.messages.length}</span>
      ),
      orderingField: null,
    },
    {
      titleRenderFunction: () => "Status",
      renderFunction: (row) => (
        <span className={tableStyles.CellEllipsis}>{row.active ? "ON" : "OFF"}</span>
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
                displayValue: row.active ? "Deactivate" : "Activate",
                actionFunction: setAlarmActive,
              },
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

  const handleNewContactClick = () => {
    const { history } = props;
    history.push(`${navigationUrl}/new`);
  };

  return (
    <ExplainSideColumn
      imgUrl={alarmIcon}
      imgAltDescription={"Alarm icon"}
      headerText={"Time series Alarms"}
      explanationText={
        "Alarms consist of a name, template, thresholds and recipients. You can create, (de)activate or delete your alarms here."
      }
      backUrl={"/management/alarms/notifications"}
    >
      <TableStateContainer
        gridTemplateColumns={"10% 40% 20% 20% 10%"}
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
        newItemOnClick={handleNewContactClick}
        filterOptions={[
          {
            value: "name__icontains=",
            label: "Name",
          },
        ]}
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
    </ExplainSideColumn>
  );
};

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addNotification: (message: string, timeout: number) =>
    dispatch(addNotification(message, timeout)),
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const TimeseriesAlarmTable = connect(
  null,
  mapDispatchToProps
)(TimeseriesAlarmTableComponent);
