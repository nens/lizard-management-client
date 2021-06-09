import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RasterSourceFromAPI } from '../../api/rasters';
import { addNotification } from './../../actions';
import { ModalDeleteContent } from './../../components/ModalDeleteContent';
import Modal from './../../components/Modal';

interface MyProps {
  row: RasterSourceFromAPI,
  displayContent: any[],
  handleClose: () => void,
}

function DataFlushingModal (props: MyProps & DispatchProps) {
  const { row, displayContent } = props;

  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const fetchWithOptions = () => {
    setBusyDeleting(true);
    fetch(`/api/v4/rastersources/${row.uuid}/data/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(res => {
      setBusyDeleting(false);
      if (res.status === 204) {
        props.handleClose();
        props.addNotification('Raster source data flushed successfully!', 2000);
      } else if (res.status === 403) {
        props.handleClose();
        props.addNotification('Permission denied! You do not have permission to flush data of this raster source.', 2000);
      } else {
        console.error('Error flushing data from the raster source: ', res);
        props.addNotification('An error occurred! Please try again!', 2000);
      }
    }).catch(console.error);
  };

  return (
    <Modal
      title={'Are you sure?'}
      buttonConfirmName={'Flush data'}
      onClickButtonConfirm={fetchWithOptions}
      cancelAction={props.handleClose}
      disableButtons={busyDeleting}
    >
      <p>All data of the following raster source will be flushed:</p>
      {ModalDeleteContent([row], busyDeleting, displayContent)}
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout?: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(DataFlushingModal);