import React from 'react';
import { connect } from 'react-redux';
import { addNotification } from '../actions';
import Table from '../components/Table';
import ModalBackground from '../components/ModalBackground';
import formStyles from '../styles/Forms.module.css';
import buttonStyles from '../styles/Buttons.module.css';
import tableStyles from "../components/Table.module.css";

interface MyProps {
  invitations: any[],
  handleClose: () => void
}

function InvitationModal (props: MyProps & DispatchProps) {
  const { invitations } = props;

  // POST requests to update selected monitoring network with the selected timeseries
  // const handleSubmit = () => {
  //   if (!selectedMonitoringNetwork) return;

  //   fetch(`/api/v4/monitoringnetworks/${selectedMonitoringNetwork.value}/timeseries/`, {
  //     credentials: "same-origin",
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(timeseries.map(ts => ts.uuid))
  //   }).then(res => {
  //     if (res.status === 204) {
  //       props.addNotification('Success! Time series added to monitoring network', 2000);
  //       props.handleClose();
  //       props.resetTable && props.resetTable();
  //     } else {
  //       props.addNotification('An error occurred! Please try again!', 2000);
  //       console.error('Error adding time series to monitoring network: ', res);
  //     }
  //   }).catch(console.error);
  // };

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
          columnDefinitions={[
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
              renderFunction: () => (
                <span>... </span>
              ),
              orderingField: null
            }
          ]}
          dataRetrievalState={'RETRIEVED'}
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