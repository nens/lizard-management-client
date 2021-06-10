import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RasterSourceFromAPI } from '../../api/rasters';
import { addNotification } from './../../actions';
import Modal from './../../components/Modal';

import moment from "moment";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

interface MyProps {
  row: RasterSourceFromAPI,
  handleClose: () => void,
}

function TemporalDataFlushingModal (props: MyProps & DispatchProps) {
  const { row } = props;
  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);
  const [start, setStart] = useState<Date | undefined>(row.first_value_timestamp ? moment(row.first_value_timestamp).toDate() : undefined);
  const [stop, setStop] = useState<Date | undefined>(row.last_value_timestamp ? moment(row.last_value_timestamp).toDate() : undefined);
  console.log(row.first_value_timestamp)
  console.log('start', start?.toISOString())

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
      disableButtons={busyDeleting || !start || !stop}
      height={400}
    >
      <p>Please select a time range to flush data from <b>{row.name}</b> raster source:</p>
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
        />
        <Datetime
          value={stop}
          onChange={event => {
            setStop(moment(event).toDate());
          }}
        />
      </div>
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout?: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TemporalDataFlushingModal);