import React from 'react';
import Modal from '../../../components/Modal';

interface MyProps {
  name: string,
  uuids: string[],
  closeDialogAction: () => void,
}

const DeleteLocationNotAllowed = (props: MyProps) => {
  const {
    name,
    uuids,
    closeDialogAction,
  } = props;

  return (
    <Modal
      title={"Not allowed"}
      closeDialogAction={closeDialogAction}
    >
      <p>You are trying to delete the <b>{name}</b> location but this location still has dependent time series.</p>
      <p>Please handle dependent time series first by either:</p>
      <ul>
        <li>Connecting them to another location</li>
        <li>Deleting them</li>
      </ul>
      <p><b>Dependent time series:</b></p>
      {uuids.length > 0 ? (
        <ol
          style={{
            overflowY: "auto",
            maxHeight: 210,
          }}
        >
          {uuids.map(uuid => {
            const url = `/management#/data_management/timeseries/timeseries/${uuid}`;
            return (
              <li key={uuid}><a target="_blank" rel="noopener noreferrer" href={url}>{url}</a></li>
            );
          })}
        </ol>
      ) : null}
    </Modal>
  )
}

export default DeleteLocationNotAllowed;