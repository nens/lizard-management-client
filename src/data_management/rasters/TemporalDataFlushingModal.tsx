import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RasterSourceFromAPI } from '../../api/rasters';
import { addNotification } from './../../actions';
import Modal from './../../components/Modal';
import styles from './TemporalDataFlushingModal.module.css';

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

  const firstValueTimestamp = moment(row.first_value_timestamp);
  const lastValueTimestamp = moment(row.last_value_timestamp)
  const [start, setStart] = useState<Date | undefined>(firstValueTimestamp.toDate());
  const [stop, setStop] = useState<Date | undefined>(lastValueTimestamp.toDate());

  // Validators for start and stop date time
  const timeValidator = () => {
    if (!start || !stop) return false;
    if (start > stop) return 'Stop date must be after start date';
    return false;
  };
  const startValidator = () => {
    if (start && start > lastValueTimestamp.toDate()) return 'Start date must be before the last timestamp.';
    return false;
  };
  const stopValidator = () => {
    if (stop && stop < firstValueTimestamp.toDate()) return 'Stop date must be after the first timestamp.';
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
      if (res.status === 204) {
        props.handleClose();
        props.addNotification('Raster source partial data flushed successfully!', 2000);
      } else if (res.status === 403) {
        props.handleClose();
        props.addNotification('Permission denied! You do not have permission to flush data of this raster source.', 2000);
      } else {
        console.error('Error flushing partial data from the raster source: ', res);
        props.addNotification('An error occurred! Please try again!', 2000);
      }
    }).catch(console.error);
  };

  return (
    <Modal
      title={'Are you sure?'}
      buttonConfirmName={'Flush data partially'}
      onClickButtonConfirm={fetchWithOptions}
      cancelAction={props.handleClose}
      disableButtons={busyDeleting || !!timeValidator() || !!startValidator() || !!stopValidator()}
      height={500}
    >
      <p>Please select a time range to flush data from <b>{row.name}</b> raster source.</p>
      <em>Note: Selected time range must be in between the first timestamp and the last timestamp of the source.</em>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '10px 0',
        }}
      >
        <div>
          <span><b>First timestamp:</b></span><br />
          <span>{firstValueTimestamp.toLocaleString()}</span>
        </div>
        <div style={{textAlign: 'right'}}>
          <span><b>Last timestamp:</b></span><br />
          <span>{lastValueTimestamp.toLocaleString()}</span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
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
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout?: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TemporalDataFlushingModal);