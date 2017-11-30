import { combineReducers } from "redux";
import {
  DISMISS_NOTIFICATION,
  RECEIVE_ACTIVATE_ALARM,
  RECEIVE_ALARM_DETAILS,
  RECEIVE_ALARM_GROUP_DETAILS,
  RECEIVE_ALARM_TEMPLATE_DETAILS,
  RECEIVE_ALARM_TEMPLATES,
  RECEIVE_CONTACTS,
  RECEIVE_DEACTIVATE_ALARM,
  RECEIVE_LIZARD_BOOTSTRAP,
  RECEIVE_NEW_ALARM,
  RECEIVE_NEW_GROUP,
  RECEIVE_NEW_TEMPLATE,
  RECEIVE_ORGANISATIONS,
  RECEIVE_PAGINATED_ALARMS,
  RECEIVE_PAGINATED_CONTACTGROUPS,
  RECEIVE_PAGINATED_CONTACTS,
  RECEIVE_PAGINATED_TEMPLATES,
  RECEIVE_REMOVE_ALARM,
  RECEIVE_REMOVE_GROUP,
  RECEIVE_UPDATE_TEMPLATE,
  REQUEST_ALARM_DETAILS,
  REQUEST_ALARM_GROUP_DETAILS,
  REQUEST_ALARM_TEMPLATE_DETAILS,
  REQUEST_ALARM_TEMPLATES,
  REQUEST_CONTACTS,
  REQUEST_LIZARD_BOOTSTRAP,
  REQUEST_NEW_ALARM,
  REQUEST_NEW_GROUP,
  REQUEST_NEW_TEMPLATE,
  REQUEST_ORGANISATIONS,
  REQUEST_PAGINATED_ALARMS,
  REQUEST_PAGINATED_CONTACTGROUPS,
  REQUEST_PAGINATED_CONTACTS,
  REQUEST_PAGINATED_TEMPLATES,
  REQUEST_REMOVE_ALARM,
  SELECT_ORGANISATION,
  SHOW_NOTIFICATION,
  UPDATE_GROUP_BY_ID
} from "./actions";

function alarms(
  state = {
    _alarms: {
      isFetching: false,
      total: null,
      currentPage: null,
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
    }
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
        _alarms: {
          ...state._alarms,
          alarms: state._alarms.alarms.filter(alarm => {
            if (alarm.uuid === action.data.uuid) {
              alarm.active = true;
            }
            return alarm;
          }),
          currentAlarm: { ...state._alarms.currentAlarm, active: true }
        }
      };
    case RECEIVE_DEACTIVATE_ALARM:
      return {
        ...state,
        _alarms: {
          ...state._alarms,
          alarms: state._alarms.alarms.filter(alarm => {
            if (alarm.uuid === action.data.uuid) {
              alarm.active = false;
            }
            return alarm;
          }),
          currentAlarm: { ...state._alarms.currentAlarm, active: false }
        }
      };
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
        _alarms: {
          ...state._alarms,
          isFetching: true
        }
      };
    case RECEIVE_ALARM_DETAILS:
      const currentAlarm = action.rasteralarm;
      currentAlarm.rasterdetail = action.rasterdetail;
      currentAlarm.timeseriesdetail = action.timeseriesdetail;
      return {
        ...state,
        _alarms: {
          ...state._alarms,
          isFetching: false,
          currentAlarm: currentAlarm
        },
        isFetching: false
      };
    case REQUEST_REMOVE_ALARM:
      return {
        ...state,
        _alarms: {
          ...state._alarms,
          isFetching: true
        }
      };
    case RECEIVE_REMOVE_ALARM:
      return {
        ...state,
        _alarms: {
          ...state._alarms,
          isFetching: false,
          alarms: state._alarms.alarms.filter(alarm => {
            if (alarm.uuid !== action.uuid) return alarm;
            return false;
          })
        }
      };
    case REQUEST_NEW_GROUP:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          isFetching: true
        }
      };
    case RECEIVE_NEW_GROUP:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          isFetching: false,
          currentContactGroup: action.data
        }
      };
    case RECEIVE_REMOVE_GROUP:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          isFetching: false,
          contactGroups: state._contactGroups.contactGroups.filter(group => {
            if (group.id === action.id) {
              return false;
            }
            return group;
          })
        }
      };
    case REQUEST_ALARM_GROUP_DETAILS:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          isFetching: true
        }
      };
    case RECEIVE_ALARM_GROUP_DETAILS:
      return {
        ...state,
        _contactGroups: {
          ...state._contactGroups,
          isFetching: false,
          currentContactGroup: action.data
        }
      };
    case REQUEST_ALARM_TEMPLATES:
      return { ...state, isFetching: true };
    case RECEIVE_ALARM_TEMPLATES:
      return { ...state, templates: action.data, isFetching: false };
    case REQUEST_ALARM_TEMPLATE_DETAILS:
      return {
        ...state,
        _templates: {
          ...state._templates,
          isFetching: true
        }
      };
    case RECEIVE_ALARM_TEMPLATE_DETAILS:
      return {
        ...state,
        _templates: {
          ...state._templates,
          isFetching: false,
          currentTemplate: action.data
        }
      };
    case RECEIVE_UPDATE_TEMPLATE:
      return {
        ...state,
        _templates: {
          ...state._templates,
          templates: state._templates.templates.filter(template => {
            if (Number(template.id) === Number(action.id)) {
              template.subject = action.data.subject;
              template.text = action.data.text;
              template.html = action.data.text;
            }
            return template;
          })
        }
      };
    case REQUEST_NEW_TEMPLATE:
      return {
        ...state,
        _templates: {
          ...state._templates,
          isFetching: true
        }
      };
    case RECEIVE_NEW_TEMPLATE:
      return {
        ...state,
        _templates: {
          ...state._templates,
          isFetching: false,
          templates: [...state._templates.templates, action.data]
        }
      };
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
