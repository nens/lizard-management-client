// MARK: Bootstrap
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
          dispatch(receiveLizardBootstrap(data));
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

export function addNotification(message, timeout = false) {
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

export function fetchOrganisations() {
  return (dispatch, getState) => {
    const state = getState();

    const organisation = state.organisations.selected;

    dispatch({ type: REQUEST_ORGANISATIONS });

    const url =
      "/api/v4/organisations/?role=supplier&role=manager&page_size=100000";
    const opts = { credentials: "same-origin" };

    fetch(url, opts)
      .then(responseObj => responseObj.json())
      .then(responseData => {
        const data = responseData.results;

        dispatch({ type: RECEIVE_ORGANISATIONS, data });

        if (!organisation) {
          // No organisation was chosen, select the first one, and let
          // the user know about this
          const firstOrganisation = data[0];

          dispatch(selectOrganisation(firstOrganisation));

          dispatch(
            addNotification(
              `Organisation "${firstOrganisation.name}" selected`,
              2000
            )
          );
        }
      });
  };
}

export function selectOrganisation(organisation) {
  localStorage.setItem(
    "lizard-management-current-organisation",
    JSON.stringify(organisation)
  );
  return {
    type: SELECT_ORGANISATION,
    organisation
  };
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

    const url = "/api/v3/observationtypes/?page_size=100000";
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
    const url = `/api/v4/organisations/${selectOrganisation.uuid}/users/`;
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
