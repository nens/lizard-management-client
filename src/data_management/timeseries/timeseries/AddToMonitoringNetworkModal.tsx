import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { SelectDropdown, Value } from '../../../form/SelectDropdown';
import { SubmitButton } from '../../../form/SubmitButton';
import { getSelectedOrganisation } from '../../../reducers';
import { addNotification } from '../../../actions';
import { convertToSelectObject } from '../../../utils/convertToSelectObject';
import ModalBackground from '../../../components/ModalBackground';
import formStyles from '../../../styles/Forms.module.css';
import buttonStyles from '../../../styles/Buttons.module.css';

interface MyProps {
  timeseries: any[],
  handleClose: () => void
}

function AddToMonitoringNetworkModal (props: MyProps & DispatchProps) {
  const { timeseries } = props;

  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const [availableMonitoringNetworks, setAvailableMonitoringNetworks] = useState<Value[] | null>(null);
  const [selectedMonitoringNetwork, setSelectedMonitoringNetwork] = useState<Value | null>(null);

  // useEffect to load the list of available monitoring networks for the selected organisation
  useEffect(() => {
    fetch(`/api/v4/monitoringnetworks/?page_size=1000&organisation__uuid=${selectedOrganisation.uuid}`, {
      credentials: 'same-origin'
    }).then(
      response => response.json()
    ).then(
      data => setAvailableMonitoringNetworks(data.results.map((network: any) => convertToSelectObject(network.uuid, network.name)))
    ).catch(
      console.error
    );
  }, [selectedOrganisation.uuid]);

  // POST requests to update selected monitoring network with the selected timeseries
  const handleSubmit = () => {
    if (!selectedMonitoringNetwork) return;

    fetch(`/api/v4/monitoringnetworks/${selectedMonitoringNetwork.value}/timeseries/`, {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(timeseries.map(ts => ts.uuid))
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
      title={'Add to Monitoring Network'}
      handleClose={props.handleClose}
      width={'50%'}
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
          <p>Adding time-series to a monitoring network will group them and they can be seen in the Lizard Catalogue.</p>
          <p>Which monitoring network would you like to add the selected time-series to?</p>
          <SelectDropdown
            title={'Monitoring networks'}
            name={'monitoringNetworks'}
            placeholder={'- Search and select -'}
            valueChanged={value => setSelectedMonitoringNetwork(value as Value)}
            options={availableMonitoringNetworks || []}
            validated
            isLoading={!availableMonitoringNetworks}
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
            readOnly={!selectedMonitoringNetwork}
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

export default connect(null, mapDispatchToProps)(AddToMonitoringNetworkModal);