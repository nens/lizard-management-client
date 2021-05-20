import React, { useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import Modal from './Modal';
import { ModalDeleteContent } from './ModalDeleteContent';
import { addNotification } from '../actions';

interface MyProps {
  rows: any[],
  displayContent: any[],
  fetchFunction: (uuids: string[], fetchOptions: RequestInit) => Promise<Response[]>,
  handleClose: () => void,
  resetTable?: Function | null, // for Table to reload after deletion
  tableUrl?: string, // for Form to redirect backs to the Table after deletion of object
  text?: string,
}

function DeleteModal (props: MyProps & DispatchProps & RouteComponentProps) {
  const { rows, displayContent, tableUrl, text } = props;

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
      const results = await props.fetchFunction(uuids, options as RequestInit);
      setBusyDeleting(false);
      if (results.every(res => res.status === 204)) {
        props.handleClose();
        props.resetTable && props.resetTable();
        props.addNotification('Deleted successfully!', 2000);
        tableUrl && props.history.push(tableUrl);
      } else if (
        // Handle the case of 403 status when DELETE an user account
        // bulk action is not supported for this feature so there is always only 1 item in rows
        rows[0].username && rows[0].roles &&
        results[0].status === 403
      ) {
        props.handleClose();
        props.addNotification(`Permission denied! You do not have permission to deactivate ${rows[0].username}. S/he is still a member of other organisations.`, 6000);
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
      <p>{text ? text : "Are you sure? You are deleting the following item(s):"}</p>
      {ModalDeleteContent(rows, busyDeleting, displayContent)}
    </Modal>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(withRouter(DeleteModal));