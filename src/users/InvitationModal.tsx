import { connect } from 'react-redux';
import { AppDispatch } from '..';
import { addNotification } from '../actions';
import TableStateContainer from '../components/TableStateContainer';
import TableActionButtons from '../components/TableActionButtons';
import ModalBackground from '../components/ModalBackground';
import formStyles from '../styles/Forms.module.css';
import buttonStyles from '../styles/Buttons.module.css';
import tableStyles from "../components/Table.module.css";

interface MyProps {
  handleClose: () => void
}

function InvitationModal (props: MyProps & DispatchProps) {
  // DELETE requests to cancel a pending invitation
  const deleteAction = (
    row: any,
    triggerReloadWithCurrentPage: Function,
  ) => {
    if (!row) return;
    fetch(`/api/v4/invitations/${row.id}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    }).then(res => {
      if (res.status === 204) {
        props.addNotification('Success! Invitation cancelled', 2000);
        triggerReloadWithCurrentPage();
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
        const numberOfDaysCreated = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
        const numberOfDaysToBeCleanedUp = 15; // pending invitations which are 15 days old will be cleaned up from the Lizard store
        const numberOfDaysToBeExpired = (numberOfDaysToBeCleanedUp - numberOfDaysCreated) >= 0 ? (numberOfDaysToBeCleanedUp - numberOfDaysCreated) : 0;
        return (
          <span
            className={tableStyles.CellEllipsis}
          >
            {numberOfDaysToBeExpired} {numberOfDaysToBeExpired > 1 ? 'days' : 'day'}
          </span>
      )},
      orderingField: null
    },
    {
      titleRenderFunction: () => '', /* Actions */
      renderFunction: (row: any, tableData:any, setTableData:any, triggerReloadWithCurrentPage:any, triggerReloadWithBasePage:any) => {
        return (
            <TableActionButtons
              tableRow={row}
              tableData={tableData}
              setTableData={setTableData}
              triggerReloadWithCurrentPage={triggerReloadWithCurrentPage}
              triggerReloadWithBasePage={triggerReloadWithBasePage}
              actions={[
                {
                  displayValue: "Revoke",
                  actionFunction: (row: any, _updateTableRow: any, triggerReloadWithCurrentPage: any, _triggerReloadWithBasePage: any) => {
                    deleteAction(row, triggerReloadWithCurrentPage);
                  }
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
      style={{
        width: '50%'
      }}
    >
      <div
        style={{
          padding: '20px 40px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <TableStateContainer
          gridTemplateColumns={'60fr 30fr 10fr'}
          columnDefinitions={columnDefinitions}
          baseUrl={'/api/v4/invitations/?'}
          checkBoxActions={[]}
          filterOptions={[]}
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

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(InvitationModal);