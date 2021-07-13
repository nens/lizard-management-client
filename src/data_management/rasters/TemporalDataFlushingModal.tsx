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
    if (start > stop) return 'End date must be after start date';
    return false;
  };
  const startValidator = () => {
    if (start && !moment(start).isValid()) return 'Wrong date format (DD-MM-YYYY hh:mm)';
    if (start && lastValueTimestamp && start > lastValueTimestamp.toDate()) return 'Start date must be before the last timestamp.';
    return false;
  };
  const stopValidator = () => {
    if (stop && !moment(stop).isValid()) return 'Wrong date format (DD-MM-YYYY hh:mm)';
    if (stop && firstValueTimestamp && stop < firstValueTimestamp.toDate()) return 'End date must be after the first timestamp.';
    return false;
  };

  const fetchWithOptions = () => {
    if (!start || !stop) return; // start & stop are both required

    const confirmToFlushRange = window.confirm('Are you sure?');
    if (!confirmToFlushRange) return; // don't do anything

    // If user confirms to flush the data
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
      title={'Select a time range to flush data'}
      buttonConfirmName={'Flush range'}
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
      <em>Note: Selected time range must be in between the first timestamp and the last timestamp of the source.</em>
      <div className={styles.GridContainer}>
        <div>
          <span><b>First timestamp of the source:</b></span><br />
          <span>{firstValueTimestamp ? firstValueTimestamp.toLocaleString() : '(No data)'}</span>
        </div>
        <div>
          <span><b>Last timestamp of the source:</b></span><br />
          <span>{lastValueTimestamp ? lastValueTimestamp.toLocaleString() : '(No data)'}</span>
        </div>
      </div>
      <div className={styles.GridContainer}>
        <div><b>Start of time range:</b></div>
        <div><b>End of time range:</b></div>
        <Datetime
          initialValue={start}
          onChange={event => {
            setStart(moment(event).toDate());
          }}
          inputProps={{
            className: startValidator() || timeValidator() ? styles.DateTimeInvalid : undefined,
          }}
          renderInput={(props) => {
            return (
              <div>
                <input {...props} />
                <button
                  title={'Reselect first timestamp'}
                  onClick={() => props.onChange({ target: { value: firstValueTimestamp } })}
                >
                  <i className='fa fa-undo' />
                </button>
              </div>
            )
          }}
          isValidDate={currentDate => currentDate >= moment(row.first_value_timestamp).subtract(1, 'd') && currentDate <= moment(row.last_value_timestamp)}
        />
        <Datetime
          initialValue={stop}
          onChange={event => {
            setStop(moment(event).toDate());
          }}
          inputProps={{
            className: stopValidator() || timeValidator() ? styles.DateTimeInvalid : undefined,
          }}
          renderInput={(props) => {
            return (
              <div>
                <input {...props} />
                <button
                  title={'Reselect last timestamp'}
                  onClick={() => props.onChange({ target: { value: lastValueTimestamp } })}
                >
                  <i className='fa fa-undo' />
                </button>
              </div>
            )
          }}
          isValidDate={currentDate => currentDate >= moment(row.first_value_timestamp).subtract(1, 'd') && currentDate <= moment(row.last_value_timestamp)}
        />
        <div style={{ color: 'red', marginTop: 5 }}>{startValidator() || timeValidator()}</div>
        <div style={{ color: 'red', marginTop: 5 }}>{stopValidator()}</div>
      </div>
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