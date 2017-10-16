import { combineReducers } from "redux";
import {
  REQUEST_ALARMS,
  RECEIVE_ALARMS,
  REQUEST_NEW_ALARM,
  RECEIVE_NEW_ALARM,
  REQUEST_REMOVE_ALARM,
  RECEIVE_REMOVE_ALARM,
  REQUEST_ALARM_GROUPS,
  RECEIVE_ALARM_GROUPS,
  REQUEST_ALARM_GROUP_DETAILS,
  RECEIVE_ALARM_GROUP_DETAILS,
  REQUEST_LIZARD_BOOTSTRAP,
  RECEIVE_LIZARD_BOOTSTRAP,
  REQUEST_ORGANISATIONS,
  RECEIVE_ORGANISATIONS,
  SELECT_ORGANISATION
} from "./actions";

function alarms(
  state = {
    alarms: [],
    groups: [],
    group: {},
    isFetching: false
  },
  action
) {
  switch (action.type) {
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
    default:
      return state;
  }
}

function bootstrap(
  state = {
    bootstrap: {},
    isFetching: false,
    organisations: [],
    organisation: JSON.parse(localStorage.getItem("lizard-management-current-organisation")) || null
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
