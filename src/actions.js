// MARK: Bootstrap

import {getLocalStorage} from "./utils/localStorageUtils";

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
        if (data && data.user && data.user.authenticated === true) {
          // User ID is not included in the bootstrap response
          // We need to find the User ID in order to fetch the available organisations
          fetch(`/api/v4/users/?username=${data.user.username}`, {
            credentials: "same-origin"
          }).then(
            response => response.json()
          ).then(parsedRes => {
            const userList = parsedRes.results;
            const currentUserId = userList[0].id;
            const bootstrapData = {
              ...data,
              user: {
                ...data.user,
                id: currentUserId
              }
            };
            dispatch(receiveLizardBootstrap(bootstrapData));
          })
        } else {
          const nextUrl = window.location.href;
          window.location.href = `${data.sso.login}&next=${nextUrl}`;
        }
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

export function fetchOrganisations() {
  return async (dispatch, getState) => {
    dispatch({ type: REQUEST_ORGANISATIONS });

    // Get User ID from the Redux store and selected organisation from local storage
    const userId = getState().bootstrap.bootstrap.user.id;
    const selectedOrganisationLocalStorage = getLocalStorage("lizard-management-current-organisation", null);

    // URL to fetch the list of available organisations with user roles
    const availableOrganisationsUrl = `/api/v4/users/${userId}/organisations/?page_size=100000`;

    // URL to fetch all organisations
    const organisationsUrl = `/api/v4/organisations/?page_size=100000`;

    const allOrganisationsParsedRes = await fetch(organisationsUrl, {
      credentials: "same-origin"
    }).then(
      res => res.json()
    );

    const availableOrganisationsParsedRes = await fetch(availableOrganisationsUrl, {
      credentials: "same-origin"
    }).then(
      res => res.json()
    );

    const allOrganisations = allOrganisationsParsedRes.results.map(org => ({
      ...org,
      uuid: org.uuid.replace(/-/g, "")
    }));

    // All user roles are accepted in the management page
    const availableOrganisations = availableOrganisationsParsedRes.results.map(org => ({
      ...org,
      uuid: org.uuid.replace(/-/g, "")
    }));

    // Dispatch action to update Redux store
    dispatch({
      type: RECEIVE_ORGANISATIONS,
      all: allOrganisations,
      available: availableOrganisations
    });

    if (
      !selectedOrganisationLocalStorage ||
      availableOrganisations.map(orga=>orga.uuid).indexOf(selectedOrganisationLocalStorage.uuid) === -1
    ) {
      const selectedOrganisation = availableOrganisations[0];
      dispatch(selectOrganisation(selectedOrganisation, true));
    } else {
      dispatch(selectOrganisation(selectedOrganisationLocalStorage, false));
    };
  };
}

export function selectOrganisation(organisation, mustAddNotification) {
  return (dispatch) => {
    localStorage.setItem(
      "lizard-management-current-organisation",
      JSON.stringify(organisation)
    );
    if (mustAddNotification) {
      dispatch(
        addNotification(
          `Organisation "${(organisation && organisation.name) || "none"}" selected`,
          2000
        )
      );
    }
    
    if (organisation && organisation.uuid) {
      dispatch({
        type: REQUEST_USAGE,
      });
      const url = `/api/v4/organisations/${organisation.uuid}/usage/`;
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

    dispatch({
      type: SELECT_ORGANISATION,
      organisation
    });
  }
}

// MARK: Observation types
export const REQUEST_OBSERVATION_TYPES = "REQUEST_OBSERVATION_TYPES";
export const RECEIVE_OBSERVATION_TYPES_SUCCESS =
  "RECEIVE_OBSERVATION_TYPES_SUCCESS";
export const RECEIVE_OBSERVATION_TYPES_ERROR =
  "RECEIVE_OBSERVATION_TYPES_ERROR";

export function fetchObservationTypes() {
  return dispatch => {
    dispatch({ type: REQUEST_OBSERVATION_TYPES });

    const url = "/api/v4/observationtypes/?page_size=100000";
    const opts = { credentials: "same-origin" };

    fetch(url, opts)
      .then(responseObj => {
        if (!responseObj.ok) {
          const errorMessage = `HTTP error ${responseObj.status} while fetching Observation Types: ${responseObj.statusText}`;
          dispatch({
            type: RECEIVE_OBSERVATION_TYPES_ERROR,
            errorMessage
          });
          console.error(
            "[E] error retrieving observation types=",
            errorMessage,
            responseObj
          );
          return Promise.reject(errorMessage);
        } else {
          return responseObj.json();
        }
      })
      .then(responseData => {
        const data = responseData.results;
        dispatch({ type: RECEIVE_OBSERVATION_TYPES_SUCCESS, data });
      });
  };
}

// MARK: Supplier IDs
export const REQUEST_SUPPLIER_IDS = "REQUEST_SUPPLIER_IDS";
export const RECEIVE_SUPPLIER_IDS_SUCCESS = "RECEIVE_SUPPLIER_IDS_SUCCESS";
export const RECEIVE_SUPPLIER_IDS_ERROR = "RECEIVE_SUPPLIER_IDS_ERROR";

// TODO only show users that have supplier role for the organisation
// at the moment roles cannot be queried from the api, thus it cannot be known by client which users have supllier role
export function fetchSupplierIds() {
  return (dispatch, getState) => {
    const state = getState();
    const selectOrganisation = state.organisations.selected;
    if (!selectOrganisation) {
      console.error(
        "[E] Cannot fetch supplier ids if no organisation is selected",
        selectOrganisation,
        state.organisations
      );
    }
    const url = `/api/v4/organisations/${selectOrganisation.uuid}/users/?role=supplier`;
    const opts = { credentials: "same-origin" };

    dispatch({ type: REQUEST_SUPPLIER_IDS });

    fetch(url, opts)
      .then(responseObj => {
        if (!responseObj.ok) {
          const errorMessage = `HTTP error ${responseObj.status} while fetching Supplier Ids: ${responseObj.statusText}`;
          dispatch({ type: RECEIVE_SUPPLIER_IDS_ERROR, errorMessage });
          console.error("[E]", errorMessage, responseObj);
          return Promise.reject(errorMessage);
        } else {
          return responseObj.json();
        }
      })
      .then(responseData => {
        const data = responseData;
        dispatch({ type: RECEIVE_SUPPLIER_IDS_SUCCESS, data });
      });
  };
}

// MARK: ColorMaps
export const REQUEST_COLORMAPS = "REQUEST_COLORMAPS";
export const RECEIVE_COLORMAPS_SUCCESS = "RECEIVE_COLORMAPS_SUCCESS";
export const RECEIVE_COLORMAPS_ERROR = "RECEIVE_COLORMAPS_ERROR";

// TODO only show users that have supplier role for the organisation
// at the moment roles cannot be queried from the api, thus it cannot be known by client which users have supllier role
export function fetchColorMaps() {
  return dispatch => {
    const url = "/api/v3/colormaps/?format=json&page_size=100000";
    const opts = { credentials: "same-origin" };

    dispatch({ type: REQUEST_COLORMAPS });

    fetch(url, opts)
      .then(responseObj => {
        if (!responseObj.ok) {
          const errorMessage = `HTTP error ${responseObj.status} while fetching ColorMaps: ${responseObj.statusText}`;
          console.error(errorMessage, responseObj);
          dispatch({ type: RECEIVE_COLORMAPS_ERROR, errorMessage });
          return Promise.reject(errorMessage);
        } else {
          return responseObj.json();
        }
      })
      .then(responseData => {
        const data = responseData.results;
        dispatch({ type: RECEIVE_COLORMAPS_SUCCESS, data });
      });
  };
}

// MARK: Viewport
export const UPDATE_VIEWPORT_DIMENSIONS = "UPDATE_VIEWPORT_DIMENSIONS";

export function updateViewportDimensions(width, height) {
  return {
    type: UPDATE_VIEWPORT_DIMENSIONS,
    width,
    height
  };
}

// MARK: Alarm Type update with Raster or Timeseries
export const UPDATE_ALARM_TYPE = "UPDATE_ALARM_TYPE";

export function updateAlarmType(alarmType) {
  return {
    type: UPDATE_ALARM_TYPE,
    alarmType
  };
}

// MARK: Datasets
export const REQUEST_DATASETS = "REQUEST_DATASETS";
export const RECEIVE_DATASETS_SUCCESS = "RECEIVE_DATASETS_SUCCESS";
export const RECEIVE_DATASETS_ERROR = "RECEIVE_DATASETS_ERROR";

export function fetchDatasets() {
  return dispatch => {
    const url = `/api/v4/datasets/`;
    const opts = { credentials: "same-origin" };

    dispatch({ type: REQUEST_DATASETS });

    fetch(url, opts)
      .then(responseObj => {
        if (!responseObj.ok) {
          const errorMessage = `HTTP error ${responseObj.status} while fetching Datasets: ${responseObj.statusText}`;
          dispatch({ type: RECEIVE_DATASETS_ERROR, errorMessage });
          console.error("[E]", errorMessage, responseObj);
          return Promise.reject(errorMessage);
        } else {
          return responseObj.json();
        }
      })
      .then(responseData => {
        const data = responseData.results;
        dispatch({ type: RECEIVE_DATASETS_SUCCESS, data });
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