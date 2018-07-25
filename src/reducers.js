import { combineReducers } from "redux";
import {
  DISMISS_NOTIFICATION,
  RECEIVE_LIZARD_BOOTSTRAP,
  RECEIVE_ORGANISATIONS,
  REQUEST_LIZARD_BOOTSTRAP,
  REQUEST_ORGANISATIONS,
  SELECT_ORGANISATION,
  SHOW_NOTIFICATION,
  UPDATE_VIEWPORT_DIMENSIONS
} from "./actions";

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
      console.log("[A] REQUEST_LIZARD_BOOTSTRAP");
      return { ...state, isFetching: true };
    case RECEIVE_LIZARD_BOOTSTRAP:
      console.log("[A] RECEIVE_LIZARD_BOOTSTRAP");
      return { ...state, bootstrap: action.data, isFetching: false };
    // case REQUEST_ORGANISATIONS:
    //   return { ...state, isFetching: true };
    // case RECEIVE_ORGANISATIONS:
    //   return { ...state, organisations: action.data, isFetching: false };
    // case SELECT_ORGANISATION:
    //   return { ...state, organisation: action.organisation };
    default:
      return state;
  }
}

function organisations(
  state = {
    isFetching: false,
    available: [],
    selected: null
  },
  action
) {
  switch (action.type) {
    case REQUEST_ORGANISATIONS:
      console.log("[A] REQUEST_ORGANISATIONS");
      return { ...state, isFetching: true };
    case RECEIVE_ORGANISATIONS:
      console.log("[A] RECEIVE_ORGANISATIONS");
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

function viewport(
  state = {
    width: window.innerWidth,
    height: window.innerHeight
  },
  action
) {
  switch (action.type) {
    case UPDATE_VIEWPORT_DIMENSIONS:
      return {
        ...state,
        width: action.width,
        height: action.height
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  bootstrap,
  organisations,
  notifications,
  viewport
});

export default rootReducer;
