// MARK: Bootstrap
import { recursiveFetchFunction } from "./api/hooks";
import { getLocalStorage } from "./utils/localStorageUtils";
import { getSelectedOrganisation } from "./reducers";
import { Thunk } from ".";
import { OrganisationWithRoles } from "./types/organisationType";

export const RECEIVE_LIZARD_BOOTSTRAP = "RECEIVE_LIZARD_BOOTSTRAP";
export const REQUEST_LIZARD_BOOTSTRAP = "REQUEST_LIZARD_BOOTSTRAP";

export const fetchLizardBootstrap = (): Thunk => (dispatch) => {
  dispatch({
    type: REQUEST_LIZARD_BOOTSTRAP
  });

  fetch("/bootstrap/lizard/", {
    credentials: "same-origin"
  })
  .then(response => response.json())
  .then(data => {
      dispatch({
        type: RECEIVE_LIZARD_BOOTSTRAP,
        data
      });
  });
}

// MARK: Notifications
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";

export function dismissNotification(idx: number) {
  return {
    type: DISMISS_NOTIFICATION,
    idx
  };
}

export const addNotification = (message: string | number | JSX.Element, timeout?: number): Thunk => (dispatch, getState) => {
  if (timeout) {
    const idx = getState().notifications.notifications.length;
    setTimeout(() => {
      dispatch(dismissNotification(idx));
    }, timeout);
  }
  dispatch({
    type: SHOW_NOTIFICATION,
    message
  });
};

// MARK: Organisations
export const RECEIVE_ORGANISATIONS = "RECEIVE_ORGANISATIONS";
export const REQUEST_ORGANISATIONS = "REQUEST_ORGANISATIONS";
export const SELECT_ORGANISATION = "SELECT_ORGANISATION";
export const REQUEST_USAGE = "REQUEST_USAGE";
export const SET_USAGE = "SET_USAGE";
export const REQUEST_CONTRACTS = "REQUEST_CONTRACTS";
export const SET_CONTRACTS = "SET_CONTRACTS";

export const fetchOrganisations = (): Thunk => async (dispatch, getState) => {
  dispatch({ type: REQUEST_ORGANISATIONS });

  // Get User ID from the Redux store and selected organisation from local storage
  const userId = getState().bootstrap.bootstrap.user.id;
  const selectedOrganisationLocalStorage = getLocalStorage("lizard-management-current-organisation", null);

  // Fetch the list of available organisations with user roles by user ID
  const availableOrganisationsUrl = `/api/v4/users/${userId}/organisations/`;
  const availableOrganisations = await recursiveFetchFunction(availableOrganisationsUrl, {}, []);

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
    const selectedOrganisation = availableOrganisations.find(org => org.uuid === selectedOrganisationLocalStorage.uuid);
    dispatch(selectOrganisation(selectedOrganisation || selectedOrganisationLocalStorage));
  };

  // request contracts
  dispatch({
    type: REQUEST_CONTRACTS,
  });
  const contracts = await recursiveFetchFunction('/api/v4/contracts/', {}, []);
  dispatch({
    type: SET_CONTRACTS,
    contracts: contracts,
  });
}

export const requestUsage = (): Thunk => (dispatch, getState) => {
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
}

export const selectOrganisation = (organisation: OrganisationWithRoles): Thunk => (dispatch) => {
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

// MARK: Raster source uuid
export const UPDATE_RASTER_SOURCE_UUID = "UPDATE_RASTER_SOURCE_UUID";
export const REMOVE_RASTER_SOURCE_UUID = "REMOVE_RASTER_SOURCE_UUID";

export function updateRasterSourceUUID(uuid: string) {
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

export function updateLocation(location: any) {
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

export function addFilesToQueue(files: File[]) {
  return {
    type: ADD_FILES_TO_QUEUE,
    files
  };
}

export function updateFileStatus(file: File, status: string) {
  return {
    type: UPDATE_FILE_STATUS,
    file,
    status
  };
}

export function addTaskUuidToFile(file: File, uuid: string) {
  return {
    type: ADD_TASK_UUID_TO_FILE,
    file,
    uuid
  };
}

export function updateTaskStatus(uuid: string, status: number) {
  return {
    type: UPDATE_TASK_STATUS,
    uuid,
    status
  };
}

export function removeFileFromQueue(file: File) {
  return {
    type: REMOVE_FILE_FROM_QUEUE,
    file
  };
}

export const SET_OPEN_CLOSE_UPLOADQUEUE_MODAL = "SET_OPEN_CLOSE_UPLOADQUEUE_MODAL";

export function openCloseUploadQueueModal(isOpen: boolean) {
  return {
    type: SET_OPEN_CLOSE_UPLOADQUEUE_MODAL,
    isOpen
  };
}