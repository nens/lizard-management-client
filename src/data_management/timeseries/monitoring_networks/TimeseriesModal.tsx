import React, { useEffect, useState } from 'react';
import MDSpinner from 'react-md-spinner';
import { connect } from 'react-redux';
import { Scrollbars } from "react-custom-scrollbars";
import { SubmitButton } from '../../../form/SubmitButton';
import { addNotification } from '../../../actions';
import { DataRetrievalState } from '../../../types/retrievingDataTypes';
import ModalBackground from '../../../components/ModalBackground';
import Pagination from '../../../components/Pagination';
import TableSearchBox from '../../../components/TableSearchBox';
import TableSearchToggle from '../../../components/TableSearchToggle';
import { TableSearchToggleHelpText } from '../../../components/TableSearchToggleHelpText';
import { Value } from '../../../form/SelectDropdown';
import styles from './TimeseriesModal.module.css';
import formStyles from '../../../styles/Forms.module.css';
import buttonStyles from '../../../styles/Buttons.module.css';
import tableStyles from '../../../components/Table.module.css';

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

  // Filter options for timeseries list
  const filterOptions = [
    {value: 'name__startswith=', label: 'Name *'},
    {value: 'location__name__startswith=', label: 'Location name *'},
    {value: 'location__code__startswith=', label: 'Location code *'},
  ];

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
  const [selectedFilterOption, setSelectedFilterOption] = useState<Value>(filterOptions[0]);

  useEffect(() => {
    const params = [`page_size=${itemsPerPage}`];
    if (searchInput) params.push(`${selectedFilterOption.value}${searchInput}`);
    const urlQuery = params.join('&');
    if (params.length > 0) setCurrentUrl(baseUrl + `?${urlQuery}`);
  }, [baseUrl, itemsPerPage, searchInput, selectedFilterOption]);

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
          props.addNotification(`${timeseriesToDelete.length} time series removed successfully from monitoring network`, 2000);
          props.handleClose();
        } else {
          props.addNotification('An error occurred! Please try again!', 2000);
          console.error('Error removing time series from monitoring network: ', res);
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
              <h3>Manage time series</h3>
              <div className={styles.TimeseriesFilter}>
                <TableSearchBox
                  placeholder={'Search'}
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onClear={() => setSearchInput('')}
                />
                <TableSearchToggle
                  options={filterOptions}
                  value={selectedFilterOption}
                  valueChanged={value => value && setSelectedFilterOption(value)}
                />
                <TableSearchToggleHelpText
                  filterOption={selectedFilterOption}
                />
              </div>
              <Scrollbars
                autoHide
                style={{
                  height: 420,
                  margin: 10,
                  marginTop: 30,
                }}
              >
                <ul className={styles.TimeseriesList}>
                  {timeseriesApiResponse.results.map(ts => (
                    <li
                      className={styles.TimeseriesRow}
                      key={ts.uuid}
                    >
                      <span
                        style={{
                          textDecoration: timeseriesToDelete.includes(ts.uuid) ? 'line-through' : undefined,
                          marginRight: 10
                        }}
                      >
                        {ts.location.name} - {ts.name}
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
              </Scrollbars>
              <span
                style={{
                  visibility: timeseriesToDelete.length ? 'visible' : 'hidden'
                }}
              >
                <em><b>{timeseriesToDelete.length} time series selected for deletion</b></em>
              </span>
              <div className={tableStyles.TableSpinner}>
                {dataRetrievalState === "NEVER_DID_RETRIEVE" || dataRetrievalState === "RETRIEVING" ? (
                  <MDSpinner size={96} />
                ) : dataRetrievalState === "RETRIEVED" && timeseriesApiResponse.results.length === 0 ? (
                  <span>No data found with current filter</span>
                ) : null}
              </div>
            </div>
            <Pagination
              toPage1={() => setCurrentUrl(baseUrl + `?page_size=${itemsPerPage}`)}
              toNext={timeseriesApiResponse.next ? () => setCurrentUrl(timeseriesApiResponse.next) : undefined}
              toPrevious={timeseriesApiResponse.previous ? () => setCurrentUrl(timeseriesApiResponse.previous) : undefined}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
          <div>
            <h3>Add time series</h3>
            <p>To add time series to a monitoring network, please visit the time series management page. There you can search for the time series that you want to add.</p>
            <p>When you are done adding new time series, please refresh this page to review your changes.</p>
            <button
              className={buttonStyles.NewButton}
              onClick={() => window.open(timeseriesTableUrl, "_blank")}
            >
              Go to Time Series Management
            </button>
          </div>
        </div>
        <div className={`${formStyles.ButtonContainer} ${formStyles.FixedButtonContainer}`}>
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
