import { combineReducers } from "redux";
import {
  RECEIVE_ACTIVATE_ALARM,
  RECEIVE_ALARM_DETAILS,
  RECEIVE_ALARM_GROUP_DETAILS,
  RECEIVE_ALARM_GROUPS,
  RECEIVE_ALARM_TEMPLATE_DETAILS,
  RECEIVE_ALARM_TEMPLATES,
  RECEIVE_ALARMS,
  RECEIVE_DEACTIVATE_ALARM,
  RECEIVE_LIZARD_BOOTSTRAP,
  RECEIVE_NEW_ALARM,
  RECEIVE_ORGANISATIONS,
  RECEIVE_REMOVE_ALARM,
  REQUEST_ALARM_DETAILS,
  REQUEST_ALARM_GROUP_DETAILS,
  REQUEST_ALARM_GROUPS,
  REQUEST_ALARM_TEMPLATE_DETAILS,
  REQUEST_ALARM_TEMPLATES,
  REQUEST_ALARMS,
  REQUEST_LIZARD_BOOTSTRAP,
  REQUEST_NEW_ALARM,
  REQUEST_ORGANISATIONS,
  REQUEST_REMOVE_ALARM,
  SELECT_ORGANISATION
} from "./actions";

function alarms(
  state = {
    alarm: {},
    alarms: [],
    group: {},
    groups: [],
    isFetching: false,
    template: {},
    templates: []
  },
  action
) {
  switch (action.type) {
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

const rootReducer = combineReducers({
  alarms,
  bootstrap
});

export default rootReducer;
