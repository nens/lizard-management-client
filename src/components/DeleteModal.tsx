import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RequestOptions } from 'https';
import Modal from './Modal';
import { ModalDeleteContent } from './ModalDeleteContent';
import { addNotification } from '../actions';

interface MyProps {
  rows: any[],
  fetchFunction: (uuids: string[], fetchOptions: RequestOptions) => Promise<Response[]>,
  resetTable: Function | null,
  handleClose: () => void,
}

function DeleteModal (props: MyProps & DispatchProps) {
  const { rows } = props;

  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setBusyDeleting(true);
    const uuids = rows.map(row => row.uuid || row.id);
    const options = {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    };

    try {
      const results = await props.fetchFunction(uuids, options);
      if (results.every(res => res.status === 204)) {
        props.addNotification('Deleted successfully!', 2000);
        setBusyDeleting(false);
        props.handleClose();
        props.resetTable && props.resetTable();
      } else {
        props.addNotification('An error occurred! Please try again!', 2000);
        console.error('Error deleting items: ', results);
      };
    } catch (message_1) {
      return console.error(message_1);
    };
  }

  return (
    <Modal
      title={'Are you sure?'}
      buttonConfirmName={'Delete'}
      onClickButtonConfirm={handleDelete}
      cancelAction={props.handleClose}
      disableButtons={busyDeleting}
    >
      <p>Are you sure? You are deleting the following item(s):</p>
      {ModalDeleteContent(rows, busyDeleting, [{name: "name", width: 40}, {name: "uuid", width: 60}])}
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(DeleteModal);