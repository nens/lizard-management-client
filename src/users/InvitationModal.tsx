import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addNotification } from '../actions';
import { DataRetrievalState } from '../types/retrievingDataTypes';
import Table from '../components/Table';
import TableActionButtons from '../components/TableActionButtons';
import ModalBackground from '../components/ModalBackground';
import formStyles from '../styles/Forms.module.css';
import buttonStyles from '../styles/Buttons.module.css';
import tableStyles from "../components/Table.module.css";

interface MyProps {
  invitations: any[],
  setInvitations: (value: any[] | null) => void,
  handleClose: () => void
}

function InvitationModal (props: MyProps & DispatchProps) {
  const { invitations } = props;

  const [dataRetrievalState, setDataRetrievalState] = useState<DataRetrievalState>('RETRIEVED');

  // DELETE requests to cancel a pending invitation
  const deleteAction = (row: any) => {
    if (!row) return;
    setDataRetrievalState('RETRIEVING');
    fetch(`/api/v4/invitations/${row.id}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then(res => {
      setDataRetrievalState('RETRIEVED');
      if (res.status === 204) {
        props.addNotification('Success! Invitation cancelled', 2000);
        const newInvitationList = invitations.filter(invitation => invitation.id !== row.id);
        props.setInvitations(newInvitationList);
        if (newInvitationList.length === 0) props.handleClose(); // close the modal if there is no pending invitation left
      } else {
        props.addNotification('An error occurred! Please try again!', 2000);
        console.error('Error cancelling the following pending invitation: ', row, res);
      }
    }).catch(console.error);
  };

  const columnDefinitions = [
    {
      titleRenderFunction: () => 'Email',
      renderFunction: (row: any) => (
        <span
          className={tableStyles.CellEllipsis}
          title={row.email}
        >
          {row.email}
        </span>
      ),
      orderingField: null
    },
    {
      titleRenderFunction: () => 'Expires in',
      renderFunction: (row: any) => {
        const createdDate = new Date(row.created_at).getTime();
        const currentDate = new Date().getTime();
        const dateDifference = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
        const numberOfDateToBeCleanedUp = 15; // pending invitations which are 15 days old will be cleaned up from the Lizard store
        const expiresIn = (numberOfDateToBeCleanedUp - dateDifference) >= 0 ? (numberOfDateToBeCleanedUp - dateDifference) : 0;
        return (
          <span
            className={tableStyles.CellEllipsis}
          >
            {expiresIn} {expiresIn > 1 ? 'days' : 'day'}
          </span>
      )},
      orderingField: null
    },
    {
      titleRenderFunction: () => '', /* Actions */
      renderFunction: (row: any, tableData:any) => {
        return (
            <TableActionButtons
              tableRow={row}
              tableData={tableData}
              setTableData={() => null}
              triggerReloadWithCurrentPage={() => null}
              triggerReloadWithBasePage={() => null}
              actions={[
                {
                  displayValue: "Cancel",
                  actionFunction: (row: any) => deleteAction(row)
                },
              ]}
            />
        );
      },
      orderingField: null
    }
  ];

  return (
    <ModalBackground
      title={'Pending Invitations'}
      handleClose={props.handleClose}
      width={'50%'}
    >
      <div
        style={{
          padding: 40,
          paddingBottom: 20,
          height: '90%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <Table
          tableData={invitations}
          setTableData={() => null}
          gridTemplateColumns={'60fr 30fr 10fr'}
          columnDefinitions={columnDefinitions}
          dataRetrievalState={dataRetrievalState}
          triggerReloadWithCurrentPage={() => null}
          triggerReloadWithBasePage={()=> null}
          responsive
        />
        <div className={formStyles.ButtonContainer}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalBackground>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(InvitationModal);