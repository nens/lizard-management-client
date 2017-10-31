// import find from "lodash.find";

// Actiontypes
export const DISMISS_NOTIFICATION = "DISMISS_NOTIFICATION";
export const RECEIVE_ACTIVATE_ALARM = "RECEIVE_ACTIVATE_ALARM";
export const RECEIVE_ALARM_DETAILS = "RECEIVE_ALARM_DETAILS";
export const RECEIVE_ALARM_GROUP_DETAILS = "RECEIVE_ALARM_GROUP_DETAILS";
export const RECEIVE_ALARM_GROUPS = "RECEIVE_ALARM_GROUPS";
export const RECEIVE_ALARM_TEMPLATE_DETAILS = "RECEIVE_ALARM_TEMPLATE_DETAILS";
export const RECEIVE_ALARM_TEMPLATES = "RECEIVE_ALARM_TEMPLATES";
export const RECEIVE_ALARMS = "RECEIVE_ALARMS";
export const RECEIVE_CONTACTS = "RECEIVE_CONTACTS";
export const RECEIVE_DEACTIVATE_ALARM = "RECEIVE_DEACTIVATE_ALARM";
export const RECEIVE_LIZARD_BOOTSTRAP = "RECEIVE_LIZARD_BOOTSTRAP";
export const RECEIVE_NEW_ALARM = "RECEIVE_NEW_ALARM";
export const RECEIVE_NEW_GROUP = "RECEIVE_NEW_GPOUP";
export const RECEIVE_NEW_TEMPLATE = "RECEIVE_NEW_TEMPLATE";
export const RECEIVE_ORGANISATIONS = "RECEIVE_ORGANISATIONS";
export const RECEIVE_REMOVE_ALARM = "RECEIVE_REMOVE_ALARM";
export const RECEIVE_REMOVE_GROUP = "RECEIVE_REMOVE_GROUP";
export const REQUEST_ACTIVATE_ALARM = "REQUEST_ACTIVATE_ALARM";
export const REQUEST_ALARM_DETAILS = "REQUEST_ALARM_DETAILS";
export const REQUEST_ALARM_GROUP_DETAILS = "REQUEST_ALARM_GROUP_DETAILS";
export const REQUEST_ALARM_GROUPS = "REQUEST_ALARM_GROUPS";
export const REQUEST_ALARM_TEMPLATE_DETAILS = "REQUEST_ALARM_TEMPLATE_DETAILS";
export const REQUEST_ALARM_TEMPLATES = "REQUEST_ALARM_TEMPLATES";
export const REQUEST_ALARMS = "REQUEST_ALARMS";
export const REQUEST_CONTACTS = "REQUEST_CONTACTS";
export const REQUEST_DEACTIVATE_ALARM = "REQUEST_DEACTIVATE_ALARM";
export const REQUEST_LIZARD_BOOTSTRAP = "REQUEST_LIZARD_BOOTSTRAP";
export const REQUEST_NEW_ALARM = "REQUEST_NEW_ALARM";
export const REQUEST_NEW_GROUP = "REQUEST_NEW_GROUP";
export const REQUEST_NEW_TEMPLATE = "REQUEST_NEW_TEMPLATE";
export const REQUEST_ORGANISATIONS = "REQUEST_ORGANISATIONS";
export const REQUEST_REMOVE_ALARM = "REQUEST_REMOVE_ALARM";
export const SELECT_ORGANISATION = "SELECT_ORGANISATION";
export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";

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

function requestNotificationDetails() {
  return {
    type: REQUEST_ALARM_DETAILS
  };
}

function receiveNotificationDetails(data) {
  return {
    type: RECEIVE_ALARM_DETAILS,
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

// function requestOrganisations() {
//   return {
//     type: REQUEST_ORGANISATIONS
//   };
// }

function receiveOrganisations(data) {
  return {
    type: RECEIVE_ORGANISATIONS,
    data
  };
}

function requestAlarmGroups() {
  return {
    type: REQUEST_ALARM_GROUPS
  };
}

function receiveAlarmGroups(data) {
  return {
    type: RECEIVE_ALARM_GROUPS,
    data
  };
}

function requestNewGroup() {
  return {
    type: REQUEST_NEW_GROUP
  };
}

function receiveNewGroup(data) {
  return {
    type: RECEIVE_NEW_GROUP,
    data
  };
}

function requestAlarmGroupDetails() {
  return {
    type: REQUEST_ALARM_GROUP_DETAILS
  };
}

function receiveAlarmGroupDetails(data) {
  return {
    type: RECEIVE_ALARM_GROUP_DETAILS,
    data
  };
}

function requestContacts() {
  return {
    type: REQUEST_CONTACTS,
  };
}

function receiveContacts(data) {
  return {
    type: RECEIVE_CONTACTS,
    data
  };
}

function receiveRemoveGroup(id) {
  return {
    type: RECEIVE_REMOVE_GROUP,
    id
  };
}

function requestAlarmTemplateDetails() {
  return {
    type: REQUEST_ALARM_TEMPLATE_DETAILS
  };
}

function receiveAlarmTemplateDetails(data) {
  return {
    type: RECEIVE_ALARM_TEMPLATE_DETAILS,
    data
  };
}

function requestNewTemplate() {
  return {
    type: REQUEST_NEW_TEMPLATE,
  }
}

function receiveNewTemplate(data) {
  return {
    type: RECEIVE_NEW_TEMPLATE,
    data
  };
}


function requestAlarmTemplates() {
  return {
    type: REQUEST_ALARM_TEMPLATES
  };
}

function receiveAlarmTemplates(data) {
  return {
    type: RECEIVE_ALARM_TEMPLATES,
    data
  };
}

function receiveActivateAlarm(data) {
  return {
    type: RECEIVE_ACTIVATE_ALARM,
    data
  };
}
function receiveDeActivateAlarm(data) {
  return {
    type: RECEIVE_DEACTIVATE_ALARM,
    data
  };
}

// Exported functions
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

export function fetchAlarms() {
  return (dispatch, getState) => {
    dispatch(requestAlarms());
    fetch("/api/v3/rasteralarms/?page_size=100000")
      .then(response => response.json())
      .then(data => dispatch(receiveAlarms(data)));
  };
}

export function fetchAlarmGroups() {
  return (dispatch, getState) => {
    dispatch(requestAlarmGroups());
    fetch("/api/v3/contactgroups/?page_size=100000")
      .then(response => response.json())
      .then(data => data.results)
      .then(data => dispatch(receiveAlarmGroups(data)));
  };
}

export function fetchAlarmGroupDetailsById(id) {
  return (dispatch, getState) => {
    dispatch(requestAlarmGroupDetails());
    fetch(`/api/v3/contactgroups/${id}/`)
      .then(response => response.json())
      .then(data => dispatch(receiveAlarmGroupDetails(data)));
  };
}

export function createGroup(data) {
  return (dispatch, getState) => {
    dispatch(requestNewGroup());
    fetch("/api/v3/contactgroups/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewGroup(data));
        dispatch(fetchAlarmGroups());
      });
  };
}

export function deleteGroupById(id) {
  return (dispatch, getState) => {
    fetch(`/api/v3/contactgroups/${id}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        dispatch(receiveRemoveGroup(id));
        // dispatch(fetchAlarmGroups());
        dispatch(addNotification(`Group removed`, 2000));
      }
    });
  }
}


export function deleteContactsById(ids) {
  return (dispatch, getState) => {
    // dispatch(requestDeleteContactsById());
    // dispatch(receiveDeleteContactsById(data));
  };
}

export function fetchAlarmTemplateDetailsById(id) {
  return (dispatch, getState) => {
    dispatch(requestAlarmTemplateDetails());
    fetch(`/api/v3/messages/${id}/`)
      .then(response => response.json())
      .then(data => dispatch(receiveAlarmTemplateDetails(data)));
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

export function activateAlarm(uuid) {
  return (dispatch, getState) => {
    fetch(`/api/v3/rasteralarms/${uuid}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: true
      })
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveActivateAlarm(data));
        dispatch(addNotification(`Alarm "${data.name}" activated`, 2000));
      });
  };
}

export function deActivateAlarm(uuid) {
  return (dispatch, getState) => {
    fetch(`/api/v3/rasteralarms/${uuid}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: false
      })
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveDeActivateAlarm(data));
        dispatch(addNotification(`Alarm "${data.name}" deactivated`, 2000));
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
        dispatch(addNotification(`Alarm removed`, 2000));
      }
    });
  };
}

export function fetchAlarmTemplates() {
  return (dispatch, getState) => {
    dispatch(requestAlarmTemplates());
    fetch("/api/v3/messages/?page_size=100000")
      .then(response => response.json())
      .then(data => data.results)
      .then(data => {
        dispatch(receiveAlarmTemplates(data));
      });
  };
}

export function fetchNotificationDetailsById(id) {
  return (dispatch, getState) => {
    dispatch(requestNotificationDetails());
    fetch(`/api/v3/rasteralarms/${id}/`)
      .then(response => response.json())
      .then(data => dispatch(receiveNotificationDetails(data)));
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

export function fetchOrganisations() {
  return (dispatch, getState) => {
    fetch("/api/v3/organisations/?page_size=100000")
      .then(response => response.json())
      .then(data => data.results)
      .then(data => {
        dispatch(receiveOrganisations(data));
      });
  };
}

export function fetchContacts() {
  return (dispatch, getState) => {
    dispatch(requestContacts());
    fetch("/api/v3/contacts/?page_size=100000")
      .then(response => response.json())
      .then(data => data.results)
      .then(data => {
        dispatch(receiveContacts(data));
      });
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



export function createTemplate(data) {
  return (dispatch, getState) => {
    dispatch(requestNewTemplate());
    fetch("/api/v3/messages/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewTemplate(data));
        dispatch(fetchAlarmTemplates());
      });
  };
}
