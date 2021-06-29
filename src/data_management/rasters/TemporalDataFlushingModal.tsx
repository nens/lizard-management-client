import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RasterSourceFromAPI } from '../../api/rasters';
import { addNotification } from './../../actions';
import Modal from './../../components/Modal';
import styles from './TemporalDataFlushingModal.module.css';
import MDSpinner from "react-md-spinner";

import moment from "moment";
import "moment/locale/nl";

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

interface MyProps {
  row: RasterSourceFromAPI,
  handleClose: () => void,
}

function TemporalDataFlushingModal (props: MyProps & DispatchProps) {
  const { row } = props;

  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const firstValueTimestamp = row.first_value_timestamp ? moment(row.first_value_timestamp) : null;
  const lastValueTimestamp = row.last_value_timestamp ? moment(row.last_value_timestamp) : null;
  const [start, setStart] = useState<Date | undefined>(firstValueTimestamp ? firstValueTimestamp.toDate() : undefined);
  const [stop, setStop] = useState<Date | undefined>(lastValueTimestamp ? lastValueTimestamp.toDate() : undefined);

  // Validators for start and stop date time
  const timeValidator = () => {
    if (!start || !stop) return false;
    if (start > stop) return 'Stop date must be after start date';
    return false;
  };
  const startValidator = () => {
    if (start && lastValueTimestamp && start > lastValueTimestamp.toDate()) return 'Start date must be before the last timestamp.';
    return false;
  };
  const stopValidator = () => {
    if (stop && firstValueTimestamp && stop < firstValueTimestamp.toDate()) return 'Stop date must be after the first timestamp.';
    return false;
  };

  const fetchWithOptions = () => {
    if (!start || !stop) return; // start & stop are both required
    setBusyDeleting(true);
    return fetch(`/api/v4/rastersources/${row.uuid}/data/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        start: start.toISOString(),
        stop: stop.toISOString(),
      })
    }).then(res => {
      setBusyDeleting(false);
      if (res.status === 200) {
        props.handleClose();
        props.addNotification('Raster source partial data flushed successfully!', 2000);
      } else if (res.status === 403) {
        props.handleClose();
        props.addNotification('Permission denied! You do not have permission to flush data of this raster source.', 2000);
      } else {
        console.error('Error flushing partial data from the raster source: ', res);
        props.addNotification('An error occurred! Please try again.', 2000);
      }
    }).catch(console.error);
  };

  return (
    <Modal
      title={'Are you sure?'}
      buttonConfirmName={'Flush data partially'}
      onClickButtonConfirm={fetchWithOptions}
      cancelAction={props.handleClose}
      disabledConfirmAction={
        busyDeleting ||
        !start ||
        !stop ||
        !!timeValidator() ||
        !!startValidator() ||
        !!stopValidator()
      }
      disabledCancelAction={busyDeleting}
      height={500}
    >
      <p style={{ marginBottom: 10 }}>Please select a time range to flush data from <b>{row.name}</b> raster source.</p>
      <em>Note: Selected time range must be in between the first timestamp and the last timestamp.</em>
      <div className={styles.GridContainer}>
        <div>
          <span><b>First timestamp:</b></span><br />
          <span>{firstValueTimestamp ? firstValueTimestamp.toLocaleString() : '(No data)'}</span>
        </div>
        <div>
          <span><b>Last timestamp:</b></span><br />
          <span>{lastValueTimestamp ? lastValueTimestamp.toLocaleString() : '(No data)'}</span>
        </div>
      </div>
      <div className={styles.GridContainer}>
        <div><b>Start:</b></div>
        <div><b>Stop:</b></div>
        <Datetime
          value={start}
          onChange={event => {
            setStart(moment(event).toDate());
          }}
          inputProps={{
            className: timeValidator() || startValidator() ? styles.DateTimeInvalid : undefined,
          }}
          // isValidDate={currentDate => currentDate <= lastValueTimestamp}
        />
        <Datetime
          value={stop}
          onChange={event => {
            setStop(moment(event).toDate());
          }}
          inputProps={{
            className: timeValidator() || stopValidator() ? styles.DateTimeInvalid : undefined,
          }}
          // isValidDate={current => current >= firstValueTimestamp}
        />
      </div>
      <div style={{ color: 'red', marginTop: 5 }}>{timeValidator() || startValidator() || stopValidator()}</div>
      {busyDeleting ? (
        <div style={{position:"absolute", top:0, left:0, width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems: "center"}} >
          <MDSpinner size={96} />
          <span style={{marginLeft: "20px", fontSize: "19px", fontWeight: "bold"}}>Deleting ...</span>
        </div>
      ) : null}
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout?: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TemporalDataFlushingModal);