// import find from "lodash.find";

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

// MARK: Alarm templates
export const RECEIVE_ALARM_TEMPLATE_DETAILS = "RECEIVE_ALARM_TEMPLATE_DETAILS";
export const RECEIVE_ALARM_TEMPLATES = "RECEIVE_ALARM_TEMPLATES";
export const RECEIVE_NEW_TEMPLATE = "RECEIVE_NEW_TEMPLATE";
export const REQUEST_ALARM_TEMPLATE_DETAILS = "REQUEST_ALARM_TEMPLATE_DETAILS";
export const REQUEST_ALARM_TEMPLATES = "REQUEST_ALARM_TEMPLATES";
export const REQUEST_NEW_TEMPLATE = "REQUEST_NEW_TEMPLATE";
export const RECEIVE_PAGINATED_TEMPLATES = "RECEIVE_PAGINATED_TEMPLATES";
export const REQUEST_PAGINATED_TEMPLATES = "REQUEST_PAGINATED_TEMPLATES";
export const RECEIVE_UPDATE_TEMPLATE = "RECEIVE_UPDATE_TEMPLATE";

function requestPaginatedTemplates() {
  return {
    type: REQUEST_PAGINATED_TEMPLATES
  };
}

function receivePaginatedTemplates(page, data) {
  return {
    type: RECEIVE_PAGINATED_TEMPLATES,
    page: Number(page),
    data
  };
}

export function fetchPaginatedTemplates(page = 1) {
  return (dispatch, getState) => {
    const organisationId = getState().bootstrap.organisation
      ? getState().bootstrap.organisation.unique_id
      : null;

    dispatch(requestPaginatedTemplates());
    fetch(
      `/api/v3/messages/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => dispatch(receivePaginatedTemplates(page, data)));
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
    type: REQUEST_NEW_TEMPLATE
  };
}

function receiveNewTemplate(data) {
  return {
    type: RECEIVE_NEW_TEMPLATE,
    data
  };
}

function receiveUpdateTemplate(data, id) {
  return {
    type: RECEIVE_UPDATE_TEMPLATE,
    data,
    id
  };
}

export function fetchAlarmTemplateDetailsById(id) {
  return (dispatch, getState) => {
    dispatch(requestAlarmTemplateDetails());
    fetch(`/api/v3/messages/${id}/`, {
      credentials: "same-origin"
    })
      .then(response => {
        if (response.status === 404) {
          window.location.href = "/management/alarms/templates/";
        }
        return response.json();
      })
      .then(data => dispatch(receiveAlarmTemplateDetails(data)));
  };
}


export function createTemplate(data) {
  return (dispatch, getState) => {
    dispatch(requestNewTemplate());
    fetch("/api/v3/messages/", {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewTemplate(data));
      });
  };
}

export function updateTemplate(data, id) {
  return (dispatch, getState) => {
    fetch(`/api/v3/messages/${id}/`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: data.subject,
        text: data.body
      })
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveUpdateTemplate(data, id));
        dispatch(addNotification(`Template "${data.name}" updated`, 2000));
      });
  };
}

export function removeAlarmById(id) {
  return (dispatch, getState) => {
    fetch(`/api/v3/messages/${id}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.status === 204) {
          dispatch(addNotification(`Template removed`, 2000));
          return Promise.resolve();
        } else {
          return Promise.error("500");
        }
      });
  };
}









// MARK: Alarms
export const RECEIVE_ACTIVATE_ALARM = "RECEIVE_ACTIVATE_ALARM";
export const RECEIVE_ALARM_DETAILS = "RECEIVE_ALARM_DETAILS";
export const RECEIVE_DEACTIVATE_ALARM = "RECEIVE_DEACTIVATE_ALARM";
export const RECEIVE_NEW_ALARM = "RECEIVE_NEW_ALARM";
export const RECEIVE_REMOVE_ALARM = "RECEIVE_REMOVE_ALARM";
export const REQUEST_ACTIVATE_ALARM = "REQUEST_ACTIVATE_ALARM";
export const REQUEST_ALARM_DETAILS = "REQUEST_ALARM_DETAILS";
export const REQUEST_DEACTIVATE_ALARM = "REQUEST_DEACTIVATE_ALARM";
export const REQUEST_NEW_ALARM = "REQUEST_NEW_ALARM";
export const REQUEST_REMOVE_ALARM = "REQUEST_REMOVE_ALARM";
export const REQUEST_PAGINATED_ALARMS = "REQUEST_PAGINATED_ALARMS";
export const RECEIVE_PAGINATED_ALARMS = "RECEIVE_PAGINATED_ALARMS";



function requestNotificationDetails() {
  return {
    type: REQUEST_ALARM_DETAILS
  };
}

function receiveNotificationDetails(
  rasteralarm,
  rasterdetail,
  timeseriesdetail
) {
  return {
    type: RECEIVE_ALARM_DETAILS,
    rasteralarm,
    rasterdetail,
    timeseriesdetail
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

function requestPaginatedAlarms() {
  return {
    type: REQUEST_PAGINATED_ALARMS
  };
}

function receivePaginatedAlarms(page, data) {
  return {
    type: RECEIVE_PAGINATED_ALARMS,
    page: Number(page),
    data
  };
}

export function fetchPaginatedAlarms(page = 1) {
  return (dispatch, getState) => {
    const organisationId = getState().bootstrap.organisation
      ? getState().bootstrap.organisation.unique_id
      : null;

    dispatch(requestPaginatedAlarms());
    fetch(
      `/api/v3/rasteralarms/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => dispatch(receivePaginatedAlarms(page, data)));
  };
}

// export function fetchAlarms() {
//   return (dispatch, getState) => {
//     const organisationId = getState().bootstrap.organisation
//       ? getState().bootstrap.organisation.unique_id
//       : null;
//     if (!organisationId) {
//       return Promise.resolve();
//     }
//     dispatch(requestAlarms());
//     fetch(
//       `/api/v3/rasteralarms/?page_size=100000&organisation__unique_id=${organisationId}`,
//       {
//         credentials: "same-origin"
//       }
//     )
//       .then(response => response.json())
//       .then(data => dispatch(receiveAlarms(data)));
//   };
// }

export function createAlarm(data) {
  return (dispatch, getState) => {
    dispatch(requestNewAlarm());
    fetch("/api/v3/rasteralarms/", {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewAlarm(data));
      });
  };
}

export function activateAlarm(uuid) {
  return (dispatch, getState) => {
    fetch(`/api/v3/rasteralarms/${uuid}/`, {
      credentials: "same-origin",
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
      credentials: "same-origin",
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
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        dispatch(receiveRemoveAlarm(uuid));
        dispatch(addNotification(`Alarm removed`, 2000));
      }
    });
  };
}

async function fetchAlarmAndRasterDetails(rasterUuid) {
  const rasteralarm = await fetch(`/api/v3/rasteralarms/${rasterUuid}/`, {
    credentials: "same-origin"
  }).then(response => response.json());

  let rasterdetail = null;
  let timeseriesdetail = null;

  if (rasteralarm.intersection) {
    // MARK: Hack to get relative URL
    const parser = document.createElement("a");
    parser.href = rasteralarm.intersection.raster;
    rasterdetail = await fetch(parser.pathname, {
      credentials: "same-origin"
    }).then(response => response.json());
  }

  if (rasteralarm.intersection) {
    const markerPosition = rasteralarm.intersection.geometry.coordinates;
    timeseriesdetail = await fetch(
      `/api/v3/raster-aggregates/?agg=curve&geom=POINT+(${markerPosition[1]}+${markerPosition[0]})&rasters=${rasterdetail.uuid}&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2017-12-31T18:00:00&window=2635200000`,
      {
        credentials: "same-origin"
      }
    ).then(response => response.json());
  }

  return {
    rasteralarm,
    rasterdetail,
    timeseriesdetail
  };
}

export function fetchNotificationDetailsById(id) {
  return (dispatch, getState) => {
    dispatch(requestNotificationDetails());
    fetchAlarmAndRasterDetails(id).then(data => {
      dispatch(
        receiveNotificationDetails(
          data.rasteralarm,
          data.rasterdetail,
          data.timeseriesdetail
        )
      );
    });
  };
}

// MARK: Contacts
export const RECEIVE_CONTACTS = "RECEIVE_CONTACTS";
export const REQUEST_CONTACTS = "REQUEST_CONTACTS";
export const REQUEST_NEW_CONTACT = "REQUEST_NEW_CONTACT";
export const RECEIVE_NEW_CONTACT = "RECEIVE_NEW_CONTACT";
export const RECEIVE_PAGINATED_CONTACTS = "RECEIVE_PAGINATED_CONTACTS";
export const REQUEST_PAGINATED_CONTACTS = "REQUEST_PAGINATED_CONTACTS";

function requestNewContact() {
  return {
    type: REQUEST_NEW_CONTACT
  };
}

function receiveNewContact(data) {
  return {
    type: RECEIVE_NEW_CONTACT,
    data
  };
}

export function createContact(data) {
  return (dispatch, getState) => {
    dispatch(requestNewContact());
    fetch("/api/v3/contacts/", {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewContact(data));
        dispatch(fetchContacts());
      });
  };
}

function requestPaginatedContacts() {
  return {
    type: REQUEST_PAGINATED_CONTACTS
  };
}

function receivePaginatedContacts(page, data) {
  return {
    type: RECEIVE_PAGINATED_CONTACTS,
    page: Number(page),
    data
  };
}

export function fetchPaginatedContacts(page = 1) {
  return (dispatch, getState) => {
    const organisationId = getState().bootstrap.organisation
      ? getState().bootstrap.organisation.unique_id
      : null;

    dispatch(requestPaginatedContacts());
    fetch(
      `/api/v3/contacts/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => dispatch(receivePaginatedContacts(page, data)));
  };
}

function requestContacts() {
  return {
    type: REQUEST_CONTACTS
  };
}

function receiveContacts(data) {
  return {
    type: RECEIVE_CONTACTS,
    data
  };
}

export function deleteContactsById(ids) {
  return (dispatch, getState) => {
    // dispatch(requestDeleteContactsById());
    // dispatch(receiveDeleteContactsById(data));
  };
}

export function fetchContacts() {
  return (dispatch, getState) => {
    // if (getState().alarms.contacts.length > 0) {
    //   return false;
    // }
    const organisationId = getState().bootstrap.organisation.unique_id;

    dispatch(requestContacts());
    fetch(
      `/api/v3/contacts/?page_size=100000&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => data.results)
      .then(data => {
        dispatch(receiveContacts(data));
      });
  };
}

// MARK: ContactGroups
export const RECEIVE_ALARM_GROUP_DETAILS = "RECEIVE_ALARM_GROUP_DETAILS";
export const RECEIVE_NEW_GROUP = "RECEIVE_NEW_GPOUP";
export const RECEIVE_REMOVE_GROUP = "RECEIVE_REMOVE_GROUP";
export const REQUEST_ALARM_GROUP_DETAILS = "REQUEST_ALARM_GROUP_DETAILS";
export const REQUEST_NEW_GROUP = "REQUEST_NEW_GROUP";
export const UPDATE_GROUP_BY_ID = "UPDATE_GROUP_BY_ID";
export const REQUEST_PAGINATED_CONTACTGROUPS =
  "REQUEST_PAGINATED_CONTACTGROUPS";
export const RECEIVE_PAGINATED_CONTACTGROUPS =
  "RECEIVE_PAGINATED_CONTACTGROUPS";


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

function receiveRemoveGroup(id) {
  return {
    type: RECEIVE_REMOVE_GROUP,
    id
  };
}

function updateGroupById(group, id) {
  return {
    type: UPDATE_GROUP_BY_ID,
    group,
    id
  };
}

function requestPaginatedContactGroups() {
  return {
    type: REQUEST_PAGINATED_CONTACTGROUPS
  };
}

function receivePaginatedContactGroups(page, data) {
  return {
    type: RECEIVE_PAGINATED_CONTACTGROUPS,
    page: Number(page),
    data
  };
}

export function fetchPaginatedContactGroups(page = 1) {
  return (dispatch, getState) => {
    const organisationId = getState().bootstrap.organisation
      ? getState().bootstrap.organisation.unique_id
      : null;

    dispatch(requestPaginatedContactGroups());
    fetch(
      `/api/v3/contactgroups/?page=${page}&organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => dispatch(receivePaginatedContactGroups(page, data)));
  };
}

export function fetchAlarmGroupDetailsById(id) {
  return (dispatch, getState) => {
    dispatch(requestAlarmGroupDetails());
    fetch(`/api/v3/contactgroups/${id}/`, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => dispatch(receiveAlarmGroupDetails(data)));
  };
}

export function createGroup(data) {
  return (dispatch, getState) => {
    dispatch(requestNewGroup());
    fetch("/api/v3/contactgroups/", {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        dispatch(receiveNewGroup(data));
      });
  };
}

export function deleteGroupById(id) {
  return (dispatch, getState) => {
    fetch(`/api/v3/contactgroups/${id}/`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        dispatch(receiveRemoveGroup(id));
        dispatch(addNotification(`Group removed`, 2000));
      }
    });
  };
}

export function addContactToGroup(contact, groupId) {
  return (dispatch, getState) => {
    const currentGroup = getState().alarms._contactGroups.contactGroups.filter(
      group => group.id === groupId
    );
    const currentContacts = currentGroup[0].contacts;
    currentContacts.push(contact);

    fetch(`/api/v3/contactgroups/${groupId}/`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contacts: currentContacts.map(contact => contact.id)
      })
    })
      .then(response => response.json())
      .then(group => {
        dispatch(updateGroupById(group, groupId));
      });
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
    const organisations = getState().bootstrap.organisations;
    const organisation = getState().bootstrap.organisation;
    if (organisations.length > 0) {
      // If we already have the organisations, skip this
      return Promise.resolve();
    }
    fetch("/api/v3/organisations/?page_size=100000", {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => data.results)
      .then(data => {
        dispatch(receiveOrganisations(data));
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

// MARK: Misc
export function fetchAll() {
  return (dispatch, getState) => {
    dispatch(fetchContacts());
  };
}
