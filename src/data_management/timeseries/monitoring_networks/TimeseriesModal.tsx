import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { SubmitButton } from '../../../form/SubmitButton';
import { addNotification } from '../../../actions';
import { DataRetrievalState } from '../../../types/retrievingDataTypes';
import ModalBackground from '../../../components/ModalBackground';
import Pagination from '../../../components/Pagination';
import styles from './TimeseriesModal.module.css';
import formStyles from '../../../styles/Forms.module.css';
import buttonStyles from '../../../styles/Buttons.module.css';
import tableStyles from '../../../components/Table.module.css';
import MDSpinner from 'react-md-spinner';
// import TableSearchToggle from '../../../components/TableSearchToggle';

interface MyProps {
  currentMonitoringNetworkUuid: string | null,
  handleClose: () => void
}

interface APIResponse {
  previous: string | null,
  next: string | null,
  results: any[]
}

function TimeseriesModal (props: MyProps & DispatchProps) {
  const { currentMonitoringNetworkUuid } = props;

  const baseUrl = `/api/v4/monitoringnetworks/${currentMonitoringNetworkUuid}/timeseries/`;
  const timeseriesTableUrl = '/management#/data_management/timeseries/timeseries';

  const [timeseriesApiResponse, setTimeseriesApiResponse] = useState<APIResponse>({
    previous: null,
    next: null,
    results: []
  });
  const [dataRetrievalState, setDataRetrievalState] = useState<DataRetrievalState>('NEVER_DID_RETRIEVE');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchInput, setSearchInput] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string | null>(baseUrl + `?page_size=${itemsPerPage}`);
  const [timeseriesToDelete, setTimeseriesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const params = [`page_size=${itemsPerPage}`];
    if (searchInput) params.push(`name__startswith=${searchInput}`);
    const urlQuery = params.join('&');
    if (params.length > 0) setCurrentUrl(baseUrl + `?${urlQuery}`);
  }, [baseUrl, itemsPerPage, searchInput]);

  const fetchWithUrl = (url: string | null) => {
    if (!url) return;
    setDataRetrievalState('RETRIEVING');
    return (
      fetch(url, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      ).then(
        parsedResponse => {
          setDataRetrievalState('RETRIEVED');
          setTimeseriesApiResponse({
            previous: parsedResponse.previous ? parsedResponse.previous.split("lizard.net")[1] : null,
            next: parsedResponse.next ? parsedResponse.next.split("lizard.net")[1] : null,
            results: parsedResponse.results
          });
        }
      ).catch(e => {
        console.error(e);
        setDataRetrievalState({status:"ERROR", errorMesssage: e, url: url});
      })
    );
  };

  useEffect(() => {
    fetchWithUrl(currentUrl);
  }, [currentUrl]);

  // POST requests to update selected monitoring network with the selected timeseries
  const handleSubmit = () => {
    if (timeseriesToDelete.length) {
      fetch(baseUrl, {
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeseriesToDelete)
      }).then(res => {
        if (res.status === 204) {
          props.addNotification(`${timeseriesToDelete.length} time-series removed successfully from monitoring network`, 2000);
          props.handleClose();
        } else {
          props.addNotification('An error occurred! Please try again!', 2000);
          console.error('Error removing time-series from monitoring network: ', res);
        }
      }).catch(console.error);
    } else {
      props.handleClose();
    };
  };

  return (
    <ModalBackground
      title={'Manage Time Series'}
      handleClose={props.handleClose}
      width={'80%'}
      height={'80%'}
    >
      <div className={styles.MainContainer}>
        <div className={styles.GridContainer}>
          <div className={styles.TimeseriesContainer}>
            <div>
              <h4>Manage time series</h4>
              <input
                className={styles.InputField}
                onChange={e => setSearchInput(e.target.value)}
              />
              {/* <TableSearchToggle
                options={[
                  {value: 'name__icontains=', label: 'Name'},
                ]}
                value={null}
                valueChanged={() => null}
              /> */}
              <ul className={styles.TimeseriesList}>
                {timeseriesApiResponse.results.map(ts => (
                  <li
                    className={styles.TimeseriesRow}
                    key={ts.uuid}
                  >
                    <span
                      style={{
                        textDecoration: timeseriesToDelete.includes(ts.uuid) ? 'line-through' : undefined
                      }}
                    >
                      {ts.name}
                    </span>
                    <button
                      className={buttonStyles.IconButton}
                      style={{
                        fontSize: 18,
                        color: timeseriesToDelete.includes(ts.uuid) ? '#2C3E50' : '#D50000',
                      }}
                      onClick={() => {
                        if (timeseriesToDelete.includes(ts.uuid)) {
                          setTimeseriesToDelete(timeseriesToDelete.filter(tsUuid => tsUuid !== ts.uuid));
                        } else {
                          setTimeseriesToDelete([...timeseriesToDelete, ts.uuid]);
                        };
                      }}
                    >
                      {timeseriesToDelete.includes(ts.uuid) ? (
                        <i className='fa fa-undo' title='Undo' />
                      ) : (
                        <i className='fa fa-trash' title='Delete'/>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              {timeseriesToDelete.length ? (
                <span>
                  <em><b>{timeseriesToDelete.length} time series selected for deletion.</b></em>
                </span>
              ) : null}
              <div className={tableStyles.TableSpinner}>
                {dataRetrievalState === "NEVER_DID_RETRIEVE" || dataRetrievalState === "RETRIEVING" ? (
                  <MDSpinner size={96} />
                ) : dataRetrievalState === "RETRIEVED" && timeseriesApiResponse.results.length === 0 ? (
                  <span>No data found with current filter</span>
                ) : null}
              </div>
            </div>
            <Pagination
              page1Url={baseUrl}
              previousUrl={timeseriesApiResponse.previous}
              nextUrl={timeseriesApiResponse.next}
              itemsPerPage={itemsPerPage}
              reloadFromUrl={setCurrentUrl}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
          <div>
            <h4>Add time series</h4>
            <p>To add time series to a monitoring network, please visit the time series management page. There you can search for the time series that you want to add.</p>
            <p>When you are done with adding new time series, please refresh this page to view you changes.</p>
            <button
              className={buttonStyles.NewButton}
              onClick={() => window.open(timeseriesTableUrl, "_blank")}
            >
              Go to Time-Series Management
            </button>
          </div>
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