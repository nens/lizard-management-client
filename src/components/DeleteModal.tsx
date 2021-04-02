import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RequestOptions } from 'https';
import Modal from './Modal';
import { ModalDeleteContent } from './ModalDeleteContent';
import { addNotification } from '../actions';

interface MyProps {
  rows: any[],
  displayContent: any[],
  fetchFunction: (uuids: string[], fetchOptions: RequestOptions) => Promise<Response[]>,
  resetTable: Function | null,
  handleClose: () => void,
}

function DeleteModal (props: MyProps & DispatchProps) {
  const { rows, displayContent } = props;

  const [busyDeleting, setBusyDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    setBusyDeleting(true);
    const uuids = rows.map(row =>
      row.uuid ||
      row.id ||
      row.prefix // for personalApiKeysTable
    );
    const options = {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    };

    try {
      const results = await props.fetchFunction(uuids, options);
      setBusyDeleting(false);
      if (results.every(res => res.status === 204)) {
        props.handleClose();
        props.resetTable && props.resetTable();
        props.addNotification('Deleted successfully!', 2000);
      } else {
        console.error('Error deleting items: ', results);
        props.addNotification('An error occurred! Please try again!', 2000);
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
      {ModalDeleteContent(rows, busyDeleting, displayContent)}
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(DeleteModal);