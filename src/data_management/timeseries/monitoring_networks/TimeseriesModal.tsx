import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { SubmitButton } from '../../../form/SubmitButton';
import { getSelectedOrganisation } from '../../../reducers';
import { addNotification } from '../../../actions';
import { SlushBucket } from '../../../form/SlushBucket';
import { choicesT } from '../../../form/SlushBucket';
import ModalBackground from '../../../components/ModalBackground';
import formStyles from '../../../styles/Forms.module.css';
import buttonStyles from '../../../styles/Buttons.module.css';

interface MyProps {
  currentMonitoringNetworkUuid: string | null,
  handleClose: () => void
}

function TimeseriesModal (props: MyProps & DispatchProps) {
  const { currentMonitoringNetworkUuid } = props;

  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [availableTimeseries, setAvailableTimeseries] = useState<choicesT>([]);
  const [selectedTimeseries, setSelectedTimeseries] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/v4/monitoringnetworks/${currentMonitoringNetworkUuid}/timeseries/?page_size=10`, {
      credentials: 'same-origin'
    }).then(
      response => response.json()
    ).then(
      data => setSelectedTimeseries(data.results.map((timeseries: any) => timeseries.uuid))
    ).catch(
      console.error
    );
  }, [currentMonitoringNetworkUuid])

  // useEffect to load the list of available timeseries for the selected organisation
  useEffect(() => {
    fetch(`/api/v4/timeseries/?page_size=100000&organisation__uuid=${selectedOrganisation.uuid}`, {
      credentials: 'same-origin'
    }).then(
      response => response.json()
    ).then(
      data => setAvailableTimeseries(data.results.map((timeseries: any) => ({
        value: timeseries.uuid,
        display: timeseries.name || timeseries.code
      })))
    ).catch(
      console.error
    );
  }, [selectedOrganisation.uuid, currentMonitoringNetworkUuid]);

  // POST requests to update selected monitoring network with the selected timeseries
  const handleSubmit = () => {
    // if (!selectedMonitoringNetwork) return;

    // fetch(`/api/v4/monitoringnetworks/${selectedMonitoringNetwork.value}/timeseries/`, {
    //   credentials: "same-origin",
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(timeseries.map(ts => ts.uuid))
    // }).then(res => {
    //   if (res.status === 204) {
    //     props.addNotification('Success! Time-series added to monitoring network', 2000);
    //     props.handleClose();
    //     props.resetTable && props.resetTable();
    //   } else {
    //     props.addNotification('An error occurred! Please try again!', 2000);
    //     console.error('Error adding time-series to monitoring network: ', res);
    //   }
    // }).catch(console.error);

    fetch(`/api/v4/monitoringnetworks/${currentMonitoringNetworkUuid}/timeseries/`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedTimeseries)
    }).then(res => {
        if (res.status === 204) {
          props.addNotification('Success! Time-series added to monitoring network', 2000);
          props.handleClose();
        } else {
          props.addNotification('An error occurred! Please try again!', 2000);
          console.error('Error adding time-series to monitoring network: ', res);
        }
      }).catch(console.error);
  };

  return (
    <ModalBackground
      title={'Manage Time Series'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
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
        <div>
          <SlushBucket
            name={'timeseriesBucket'}
            title={'Manage Time Series'}
            value={selectedTimeseries}
            choices={availableTimeseries}
            validated
            valueChanged={(e: string[]) => setSelectedTimeseries(e)}
          />
        </div>
        <div className={formStyles.ButtonContainer}>
          <button
            className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
            onClick={props.handleClose}
          >
            Cancel
          </button>
          <SubmitButton
            onClick={handleSubmit}
            readOnly={selectedTimeseries.length === 0}
          />
        </div>
      </div>
    </ModalBackground>
  )
}

const mapDispatchToProps = (dispatch: any) => ({
  addNotification: (message: string | number, timeout: number) => dispatch(addNotification(message, timeout))
});
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(TimeseriesModal);