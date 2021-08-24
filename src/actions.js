// MARK: Bootstrap
import { recursiveFetchFunction } from "./api/hooks";
import { getLocalStorage } from "./utils/localStorageUtils";
import { getSelectedOrganisation } from "./reducers";

export const RECEIVE_LIZARD_BOOTSTRAP = "RECEIVE_LIZARD_BOOTSTRAP";
export const REQUEST_LIZARD_BOOTSTRAP = "REQUEST_LIZARD_BOOTSTRAP";

function requestLizardBootstrap() {
  return {
    type: REQUEST_LIZARD_BOOTSTRAP
  };
}

function receiveLizardBootstrap(data) {
  return {
    type: RECEIVE_LIZARD_BOOTSTRAP,
    data
  };
}

export function fetchLizardBootstrap() {
  return (dispatch, getState) => {
    dispatch(requestLizardBootstrap());

    fetch("/bootstrap/lizard/", {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
          dispatch(receiveLizardBootstrap(data));
      });
  };
}

// MARK: Notifications
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";

function showNotification(message) {
  return {
    type: SHOW_NOTIFICATION,
    message
  };
}

export function dismissNotification(idx) {
  return {
    type: DISMISS_NOTIFICATION,
    idx
  };
}

export function addNotification(message, timeout) {
  return (dispatch, getState) => {
    if (timeout) {
      const idx = getState().notifications.notifications.length;
      setTimeout(() => {
        dispatch(dismissNotification(idx));
      }, timeout);
    }
    dispatch(showNotification(message));
  };
}

// MARK: Organisations
export const RECEIVE_ORGANISATIONS = "RECEIVE_ORGANISATIONS";
export const REQUEST_ORGANISATIONS = "REQUEST_ORGANISATIONS";
export const SELECT_ORGANISATION = "SELECT_ORGANISATION";
export const REQUEST_USAGE = "REQUEST_USAGE";
export const SET_USAGE = "SET_USAGE";
export const REQUEST_CONTRACTS = "REQUEST_CONTRACTS";
export const SET_CONTRACTS = "SET_CONTRACTS";

export function fetchOrganisations() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUEST_ORGANISATIONS });

    // Get User ID from the Redux store and selected organisation from local storage
    const userId = getState().bootstrap.bootstrap.user.id;
    const selectedOrganisationLocalStorage = getLocalStorage("lizard-management-current-organisation", null);

    // Fetch the list of available organisations with user roles by user ID
    const availableOrganisationsUrl = `/api/v4/users/${userId}/organisations/`;
    const availableOrganisations = await recursiveFetchFunction(availableOrganisationsUrl, []);

    // Dispatch action to update Redux store
    dispatch({
      type: RECEIVE_ORGANISATIONS,
      available: availableOrganisations
    });

    if (
      !selectedOrganisationLocalStorage ||
      availableOrganisations.map(orga=>orga.uuid).indexOf(selectedOrganisationLocalStorage.uuid) === -1
    ) {
      const selectedOrganisation = availableOrganisations[0];
      dispatch(selectOrganisation(selectedOrganisation));
    } else {
      dispatch(selectOrganisation(selectedOrganisationLocalStorage));
    };

    // request contracts
    const requestContracts = (url) => {
      dispatch({
        type: REQUEST_CONTRACTS,
      });
      fetch(url, {
          credentials: "same-origin"
      })
      .then(response => response.json())
      .then(data => {
          dispatch({
            type: SET_CONTRACTS,
            contracts: data,
          });
          if (data.next) {
            const relativeUrl = data.next.split('lizard.net')[1];
            requestContracts(relativeUrl);
          }
      });
    };
    requestContracts(`/api/v4/contracts`);
  };
}

export function requestUsage () {
  return (dispatch, getState) => {
    const selectedOrganisation = getSelectedOrganisation(getState());
    if (selectedOrganisation) {
      const selectedorganisationUuid = selectedOrganisation.uuid;
      dispatch({
        type: REQUEST_USAGE,
      });
      const url = `/api/v4/organisations/${selectedorganisationUuid}/usage/`;
      fetch(url, {
          credentials: "same-origin"
      })
      .then(response => response.json())
      .then(data => {
          dispatch({
            type: SET_USAGE,
            usage: data,
          });
      });
    }
    
  };
}

export function selectOrganisation(organisation) {
  return (dispatch) => {
    localStorage.setItem(
      "lizard-management-current-organisation",
      JSON.stringify(organisation)
    );
    dispatch({
      type: SELECT_ORGANISATION,
      organisation
    });
    dispatch(requestUsage());
  }
}

// MARK: Alarm Type update with Raster or Timeseries
export const UPDATE_ALARM_TYPE = "UPDATE_ALARM_TYPE";

export function updateAlarmType(alarmType) {
  return {
    type: UPDATE_ALARM_TYPE,
    alarmType
  };
}

// MARK: Layercollections
export const REQUEST_LAYERCOLLECTIONS = "REQUEST_LAYERCOLLECTIONS";
export const RECEIVE_LAYERCOLLECTIONS_SUCCESS = "RECEIVE_LAYERCOLLECTIONS_SUCCESS";
export const RECEIVE_LAYERCOLLECTIONS_ERROR = "RECEIVE_LAYERCOLLECTIONS_ERROR";

export function fetchLayercollections() {
  return dispatch => {
    const url = `/api/v4/layercollections/`;
    const opts = { credentials: "same-origin" };

    dispatch({ type: REQUEST_LAYERCOLLECTIONS });

    fetch(url, opts)
      .then(responseObj => {
        if (!responseObj.ok) {
          const errorMessage = `HTTP error ${responseObj.status} while fetching Layer collections: ${responseObj.statusText}`;
          dispatch({ type: RECEIVE_LAYERCOLLECTIONS_ERROR, errorMessage });
          console.error("[E]", errorMessage, responseObj);
          return Promise.reject(errorMessage);
        } else {
          return responseObj.json();
        }
      })
      .then(responseData => {
        const data = responseData.results;
        dispatch({ type: RECEIVE_LAYERCOLLECTIONS_SUCCESS, data });
      });
  };
}

// MARK: Raster source uuid
export const UPDATE_RASTER_SOURCE_UUID = "UPDATE_RASTER_SOURCE_UUID";
export const REMOVE_RASTER_SOURCE_UUID = "REMOVE_RASTER_SOURCE_UUID";

export function updateRasterSourceUUID(uuid) {
  return {
    type: UPDATE_RASTER_SOURCE_UUID,
    uuid
  };
}

export function removeRasterSourceUUID() {
  return {
    type: REMOVE_RASTER_SOURCE_UUID
  };
}

// MARK: Location uuid
export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const REMOVE_LOCATION = "REMOVE_LOCATION";

export function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    location
  };
}

export function removeLocation() {
  return {
    type: REMOVE_LOCATION
  };
}

// MARK: Uploads
export const ADD_FILES_TO_QUEUE = "ADD_FILES_TO_QUEUE";
export const ADD_TASK_UUID_TO_FILE = "ADD_TASK_UUID_TO_FILE"
export const UPDATE_TASK_STATUS = "UPDATE_TASK_STATUS";
export const UPDATE_FILE_STATUS = "UPDATE_FILE_STATUS";
export const REMOVE_FILE_FROM_QUEUE = "REMOVE_FILE";

export function addFilesToQueue(files) {
  return {
    type: ADD_FILES_TO_QUEUE,
    files
  };
}

export function updateFileStatus(file, status) {
  return {
    type: UPDATE_FILE_STATUS,
    file,
    status
  };
}

export function addTaskUuidToFile(file, uuid) {
  return {
    type: ADD_TASK_UUID_TO_FILE,
    file,
    uuid
  };
}

export function updateTaskStatus(uuid, status) {
  return {
    type: UPDATE_TASK_STATUS,
    uuid,
    status
  };
}

export function removeFileFromQueue(file) {
  return {
    type: REMOVE_FILE_FROM_QUEUE,
    file
  };
}

export const SET_OPEN_CLOSE_UPLOADQUEUE_MODAL = "SET_OPEN_CLOSE_UPLOADQUEUE_MODAL";

export function openCloseUploadQueueModal(isOpen) {
  return {
    type: SET_OPEN_CLOSE_UPLOADQUEUE_MODAL,
    isOpen
  };
}