// Actiontypes
export const RECEIVE_ALARMS = "RECEIVE_ALARMS";
export const REQUEST_ALARMS = "REQUEST_ALARMS";
export const REQUEST_NEW_ALARM = "REQUEST_NEW_ALARM";
export const RECEIVE_NEW_ALARM = "RECEIVE_NEW_ALARM";
export const REQUEST_REMOVE_ALARM = "REQUEST_REMOVE_ALARM";
export const RECEIVE_REMOVE_ALARM = "RECEIVE_REMOVE_ALARM";

export const REQUEST_DEACTIVATE_ALARM = "REQUEST_DEACTIVATE_ALARM";
export const RECEIVE_DEACTIVATE_ALARM = "RECEIVE_DEACTIVATE_ALARM";
export const REQUEST_ACTIVATE_ALARM = "REQUEST_ACTIVATE_ALARM";
export const RECEIVE_ACTIVATE_ALARM = "RECEIVE_ACTIVATE_ALARM";

export const REQUEST_LIZARD_BOOTSTRAP = "REQUEST_LIZARD_BOOTSTRAP";
export const RECEIVE_LIZARD_BOOTSTRAP = "RECEIVE_LIZARD_BOOTSTRAP";

// Actions
function requestAlarms() {
  return {
    type: REQUEST_ALARMS
  };
}

function receiveAlarms(data) {
  return {
    type: RECEIVE_ALARMS,
    data
  };
}

function requestNewAlarm() {
  return {
    type: REQUEST_NEW_ALARM
  };
}

function receiveNewAlarm(data) {
  return {
    type: RECEIVE_NEW_ALARM,
    data
  };
}

function requestRemoveAlarm() {
  return {
    type: REQUEST_REMOVE_ALARM
  };
}

function receiveRemoveAlarm(uuid) {
  return {
    type: RECEIVE_REMOVE_ALARM,
    uuid
  };
}

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

// Exported functions
export function fetchAlarms() {
  return (dispatch, getState) => {
    dispatch(requestAlarms());
    fetch("/api/v3/rasteralarms/?page_size=100000")
      .then(response => response.json())
      .then(data => dispatch(receiveAlarms(data)));
  };
}

export function createAlarm(data) {
  return (dispatch, getState) => {
    dispatch(requestNewAlarm());
    fetch("/api/v3/rasteralarms/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewAlarm(data));
        dispatch(fetchAlarms());
      });
  };
}

export function removeAlarm(uuid) {
  return (dispatch, getState) => {
    dispatch(requestRemoveAlarm());
    fetch(`/api/v3/rasteralarms/${uuid}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        dispatch(receiveRemoveAlarm(uuid));
        dispatch(fetchAlarms());
      }
    });
  };
}

export function fetchLizardBootstrap() {
  return (dispatch, getState) => {
    dispatch(requestLizardBootstrap());
    fetch("/bootstrap/lizard/")
      .then(response => response.json())
      .then(data => {
        dispatch(receiveLizardBootstrap(data));
      });
  };
}
