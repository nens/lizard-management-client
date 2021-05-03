import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { SubmitButton } from '../../../form/SubmitButton';
import { addNotification } from '../../../actions';
import { DataRetrievalState } from '../../../types/retrievingDataTypes';
import ModalBackground from '../../../components/ModalBackground';
import Pagination from '../../../components/Pagination';
import formStyles from '../../../styles/Forms.module.css';
import buttonStyles from '../../../styles/Buttons.module.css';
import MDSpinner from 'react-md-spinner';

interface MyProps {
  currentMonitoringNetworkUuid: string | null,
  handleClose: () => void
}

interface APIResponse {
  previous: string | null,
  next: string | null,
  results: any[],
  dataRetrievalState: DataRetrievalState
}

function TimeseriesModal (props: MyProps & DispatchProps) {
  const { currentMonitoringNetworkUuid } = props;

  const [timeseriesApiResponse, setTimeseriesApiResponse] = useState<APIResponse>({
    previous: null,
    next: null,
    results: [],
    dataRetrievalState: 'NEVER_DID_RETRIEVE'
  });

  const [itemsPerPage, setItemsPerPage] = useState<string>("10");
  const [currentUrl, setCurrentUrl] = useState<string | null>(`/api/v4/monitoringnetworks/${currentMonitoringNetworkUuid}/timeseries/`);

  const fetchWithUrl = (url: string | null) => {
    if (!url) return;
    setTimeseriesApiResponse({
      previous: null,
      next: null,
      results: [],
      dataRetrievalState: 'RETRIEVING'
    })
    return (
      fetch(url, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      ).then(
        parsedResponse => setTimeseriesApiResponse({
          previous: parsedResponse.previous ? parsedResponse.previous.split("lizard.net")[1] : null,
          next: parsedResponse.next ? parsedResponse.next.split("lizard.net")[1] : null,
          results: parsedResponse.results,
          dataRetrievalState: 'RETRIEVED'
        })
      ).catch(e => {
        console.error(e);
        setTimeseriesApiResponse({
          previous: null,
          next: null,
          results: [],
          dataRetrievalState: {status:"ERROR", errorMesssage: e, url: url}
        });
      })
    );
  };

  useEffect(() => {
    fetchWithUrl(currentUrl);
  }, [currentUrl]);

  // POST requests to update selected monitoring network with the selected timeseries
  const handleSubmit = () => {
    // fetch(`/api/v4/monitoringnetworks/${currentMonitoringNetworkUuid}/timeseries/`, {
    //   credentials: "same-origin",
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(selectedTimeseries)
    // }).then(res => {
    //     if (res.status === 204) {
    //       props.addNotification('Success! Time-series added to monitoring network', 2000);
    //       props.handleClose();
    //     } else {
    //       props.addNotification('An error occurred! Please try again!', 2000);
    //       console.error('Error adding time-series to monitoring network: ', res);
    //     }
    //   }).catch(console.error);
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
          <ul>
            {timeseriesApiResponse.dataRetrievalState === 'NEVER_DID_RETRIEVE' ? (
              <div />
            ) : null}
            {timeseriesApiResponse.dataRetrievalState === 'RETRIEVING' ? (
              <MDSpinner />
            ) : null}
            {timeseriesApiResponse.dataRetrievalState === 'RETRIEVED' ? timeseriesApiResponse.results.map(ts => (
              <li key={ts.uuid}>{ts.name}</li>
            )) : null}
          </ul>
          <Pagination
            page1Url={`/api/v4/monitoringnetworks/${currentMonitoringNetworkUuid}/timeseries/`}
            previousUrl={timeseriesApiResponse.previous}
            nextUrl={timeseriesApiResponse.next}
            itemsPerPage={itemsPerPage}
            reloadFromUrl={url => setCurrentUrl(url)}
            setItemsPerPage={setItemsPerPage}
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
            readOnly={!timeseriesApiResponse || timeseriesApiResponse.results.length === 0}
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