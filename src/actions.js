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

function receiveOrganisations(data) {
  return {
    type: RECEIVE_ORGANISATIONS,
    data
  };
}

export function fetchOrganisations() {
  return (dispatch, getState) => {
    const state = getState();

    const organisations = state.organisations.available;
    const organisation = state.organisations.selected;

    if (organisations.length > 0) {
      // If we already have the organisations, skip this
      return Promise.resolve();
    }

    dispatch({ type: REQUEST_ORGANISATIONS });

    const url = "/api/v3/organisations/?page_size=100000";
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
  return (dispatch, getState) => {
    const state = getState();

    const observationTypes = state.observationTypes.available;

    if (observationTypes.length > 0) {
      // If we already have the observationTypes, skip this
      return Promise.resolve();
    }

    dispatch({ type: REQUEST_OBSERVATION_TYPES });

    const url = "/api/v3/observationtypes/?page_size=100000";
    const opts = { credentials: "same-origin" };

    fetch(url, opts)
      .then(responseObj => {
        console.log("[!] responseObj =", responseObj);
        if (!responseObj.ok) {
          dispatch({
            type: RECEIVE_OBSERVATION_TYPES_ERROR,
            errorMessage: `HTTP error ${responseObj.status} while fetching Observation Types: ${responseObj.statusText}`
          });
          console.error("[P] error retrieving observation types=", responseObj);
        } else {
          return responseObj.json();
        }
      })
      .then(responseData => {
        const data = responseData.results;
        console.log("[P] observation types data=", data);
        dispatch({ type: RECEIVE_OBSERVATION_TYPES_SUCCESS, data });
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
