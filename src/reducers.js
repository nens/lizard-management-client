import { combineReducers } from "redux";
import {
  DISMISS_NOTIFICATION,
  RECEIVE_ACTIVATE_ALARM,
  RECEIVE_ALARM_DETAILS,
  RECEIVE_ALARM_GROUP_DETAILS,
  RECEIVE_ALARM_GROUPS,
  RECEIVE_ALARM_TEMPLATE_DETAILS,
  RECEIVE_ALARM_TEMPLATES,
  RECEIVE_ALARMS,
  RECEIVE_CONTACTS,
  RECEIVE_DEACTIVATE_ALARM,
  RECEIVE_LIZARD_BOOTSTRAP,
  RECEIVE_NEW_ALARM,
  RECEIVE_NEW_GROUP,
  RECEIVE_NEW_TEMPLATE,
  RECEIVE_ORGANISATIONS,
  RECEIVE_REMOVE_ALARM,
  RECEIVE_REMOVE_GROUP,
  REQUEST_ALARM_DETAILS,
  REQUEST_ALARM_GROUP_DETAILS,
  REQUEST_ALARM_GROUPS,
  REQUEST_ALARM_TEMPLATE_DETAILS,
  REQUEST_ALARM_TEMPLATES,
  REQUEST_ALARMS,
  REQUEST_CONTACTS,
  REQUEST_LIZARD_BOOTSTRAP,
  REQUEST_NEW_ALARM,
  REQUEST_NEW_GROUP,
  REQUEST_NEW_TEMPLATE,
  REQUEST_ORGANISATIONS,
  REQUEST_REMOVE_ALARM,
  SELECT_ORGANISATION,
  SHOW_NOTIFICATION,
  UPDATE_GROUP_BY_ID,
  RECEIVE_PAGINATED_ALARMS,
  REQUEST_PAGINATED_ALARMS,
  REQUEST_PAGINATED_CONTACTGROUPS,
  RECEIVE_PAGINATED_CONTACTGROUPS,
  REQUEST_PAGINATED_TEMPLATES,
  RECEIVE_PAGINATED_TEMPLATES,
  REQUEST_PAGINATED_CONTACTS,
  RECEIVE_PAGINATED_CONTACTS
} from "./actions";

function alarms(
  state = {
    _alarms: {
      isFetching: false,
      total: null,
      currentPage: 1, // id
      currentAlarm: null,
      alarms: []
    },
    _contactGroups: {
      isFetching: false,
      total: null,
      currentPage: 1, // id
      currentContactGroup: null,
      contactGroups: []
    },
    _contacts: {
      isFetching: false,
      total: null,
      currentPage: 1, // id
      currentContact: null,
      contacts: []
    },
    _templates: {
      isFetching: false,
      total: null,
      currentPage: 1, // id
      currentTemplate: null,
      templates: []
    },
    alarm: {},
    alarms: {
      results: []
    },
    contacts: [],
    group: {},
    groups: [],
    isFetching: false,
    template: {},
    templates: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_PAGINATED_ALARMS:
      return {
        ...state,
        _alarms: {
          ...state._alarms,
          isFetching: true
        }
      };
    case RECEIVE_PAGINATED_ALARMS:
      return {
        ...state,
        _alarms: {
          ...state._alarms,
          total: action.data.count,
          alarms: action.data.results,
          currentPage: action.page,
          isFetching: false
        }
      };

    case REQUEST_PAGINATED_CONTACTGROUPS:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          isFetching: true
        }
      };
    case RECEIVE_PAGINATED_CONTACTGROUPS:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          total: action.data.count,
          contactGroups: action.data.results,
          currentPage: action.page,
          isFetching: false
        }
      };

    case REQUEST_PAGINATED_TEMPLATES:
      return {
        ...state,
        _templates: {
          ...state._templates,
          isFetching: true
        }
      };
    case RECEIVE_PAGINATED_TEMPLATES:
      return {
        ...state,
        _templates: {
          ...state._templates,
          total: action.data.count,
          templates: action.data.results,
          currentPage: action.page,
          isFetching: false
        }
      };

    case REQUEST_PAGINATED_CONTACTS:
      return {
        ...state,
        _contacts: {
          ...state._contacts,
          isFetching: true
        }
      };
    case RECEIVE_PAGINATED_CONTACTS:
      return {
        ...state,
        _contacts: {
          ...state._contacts,
          total: action.data.count,
          contacts: action.data.results,
          currentPage: action.page,
          isFetching: false
        }
      };

    case REQUEST_CONTACTS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_CONTACTS:
      return {
        ...state,
        isFetching: false,
        contacts: action.data
      };
    case RECEIVE_ACTIVATE_ALARM:
      return {
        ...state,
        alarm: action.data,
        alarms: {
          ...state.alarms,
          results: state.alarms.results.filter(alarm => {
            if (alarm.uuid === action.data.uuid) {
              alarm.active = true;
            }
            return alarm;
          })
        }
      };
    case RECEIVE_DEACTIVATE_ALARM:
      return {
        ...state,
        alarm: action.data,
        alarms: {
          ...state.alarms,
          results: state.alarms.results.filter(alarm => {
            if (alarm.uuid === action.data.uuid) {
              alarm.active = false;
            }
            return alarm;
          })
        }
      };
    case REQUEST_ALARMS:
      return { ...state, isFetching: true };
    case RECEIVE_ALARMS:
      return { ...state, alarms: action.data, isFetching: false };
    case REQUEST_NEW_ALARM:
      return { ...state, isFetching: true };
    case RECEIVE_NEW_ALARM:
      return {
        ...state,
        isFetching: false
      };
    case REQUEST_ALARM_DETAILS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_ALARM_DETAILS:
      return { ...state, alarm: action.data, isFetching: false };
    case REQUEST_REMOVE_ALARM:
      return { ...state, isFetching: true };
    case RECEIVE_REMOVE_ALARM:
      return {
        ...state,
        alarms: state.alarms.results.filter(alarm => {
          if (alarm.uuid !== action.uuid) return alarm;
          return false;
        }),
        isFetching: false
      };
    case REQUEST_NEW_GROUP:
      return { ...state, isFetching: true };
    case RECEIVE_NEW_GROUP:
      return { ...state, isFetching: false };
    case RECEIVE_REMOVE_GROUP:
      return {
        ...state,
        isFetching: false,
        groups: state.groups.filter((group, i) => {
          if (group.id === action.id) {
            return false;
          }
          return group;
        })
      };
    case REQUEST_ALARM_GROUPS:
      return { ...state, isFetching: true };
    case RECEIVE_ALARM_GROUPS:
      return { ...state, groups: action.data, isFetching: false };
    case REQUEST_ALARM_GROUP_DETAILS:
      return { ...state, isFetching: true };
    case RECEIVE_ALARM_GROUP_DETAILS:
      return { ...state, group: action.data, isFetching: false };
    case REQUEST_ALARM_TEMPLATES:
      return { ...state, isFetching: true };
    case RECEIVE_ALARM_TEMPLATES:
      return { ...state, templates: action.data, isFetching: false };
    case REQUEST_ALARM_TEMPLATE_DETAILS:
      return { ...state, isFetching: true };
    case RECEIVE_ALARM_TEMPLATE_DETAILS:
      return { ...state, template: action.data, isFetching: false };
    case REQUEST_NEW_TEMPLATE:
      return { ...state, isFetching: true };
    case RECEIVE_NEW_TEMPLATE:
      return { ...state, isFetching: false };
    case UPDATE_GROUP_BY_ID:
      return { ...state };
    default:
      return state;
  }
}

function bootstrap(
  state = {
    bootstrap: {},
    isFetching: false,
    organisations: [],
    organisation:
      JSON.parse(
        localStorage.getItem("lizard-management-current-organisation")
      ) || null
  },
  action
) {
  switch (action.type) {
    case REQUEST_LIZARD_BOOTSTRAP:
      return { ...state, isFetching: true };
    case RECEIVE_LIZARD_BOOTSTRAP:
      return { ...state, bootstrap: action.data, isFetching: false };
    case REQUEST_ORGANISATIONS:
      return { ...state, isFetching: true };
    case RECEIVE_ORGANISATIONS:
      return { ...state, organisations: action.data, isFetching: false };
    case SELECT_ORGANISATION:
      return { ...state, organisation: action.organisation };
    default:
      return state;
  }
}

function notifications(
  state = {
    notifications: []
  },
  action
) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.message]
      };
    case DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications.slice(0, action.idx),
          ...state.notifications.slice(action.idx + 1)
        ]
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  alarms,
  bootstrap,
  notifications
});

export default rootReducer;
