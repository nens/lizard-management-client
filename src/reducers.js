import { combineReducers } from "redux";
import {
  REQUEST_LIZARD_BOOTSTRAP,
  RECEIVE_LIZARD_BOOTSTRAP,
  REQUEST_ORGANISATIONS,
  RECEIVE_ORGANISATIONS,
  SELECT_ORGANISATION,
  REQUEST_OBSERVATION_TYPES,
  RECEIVE_OBSERVATION_TYPES_SUCCESS,
  RECEIVE_OBSERVATION_TYPES_ERROR,
  REQUEST_SUPPLIER_IDS,
  RECEIVE_SUPPLIER_IDS_SUCCESS,
  RECEIVE_SUPPLIER_IDS_ERROR,
  REQUEST_COLORMAPS,
  RECEIVE_COLORMAPS_SUCCESS,
  RECEIVE_COLORMAPS_ERROR,
  SHOW_NOTIFICATION,
  DISMISS_NOTIFICATION,
  UPDATE_VIEWPORT_DIMENSIONS
} from "./actions";

function bootstrap(
  state = {
    bootstrap: {},
    isAuthenticated: null,
    isFetching: false
  },
  action
) {
  switch (action.type) {
    case REQUEST_LIZARD_BOOTSTRAP:
      console.log("[A] REQUEST_LIZARD_BOOTSTRAP");
      return { ...state, isFetching: true };
    case RECEIVE_LIZARD_BOOTSTRAP:
      console.log("[A] RECEIVE_LIZARD_BOOTSTRAP");
      return {
        ...state,
        bootstrap: action.data,
        isAuthenticated: action.data.user.authenticated,
        isFetching: false
      };
    default:
      return state;
  }
}

function organisations(
  state = {
    isFetching: false,
    available: [],
    selected:
      JSON.parse(
        localStorage.getItem("lizard-management-current-organisation")
      ) || null
  },
  action
) {
  switch (action.type) {
    case REQUEST_ORGANISATIONS:
      console.log("[A] REQUEST_ORGANISATIONS");
      return { ...state, isFetching: true };
    case RECEIVE_ORGANISATIONS:
      console.log("[A] RECEIVE_ORGANISATIONS", action);
      return { ...state, available: action.data, isFetching: false };
    case SELECT_ORGANISATION:
      console.log("[A] SELECT_ORGANISATION");
      return { ...state, selected: action.organisation };
    default:
      return state;
  }
}

function observationTypes(
  state = {
    isFetching: false,
    hasError: false,
    errorMessage: "",
    available: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_OBSERVATION_TYPES:
      console.log("[A] REQUEST_OBSERVATION_TYPES");
      return { ...state, isFetching: true };
    case RECEIVE_OBSERVATION_TYPES_SUCCESS:
      console.log("[A] RECEIVE_OBSERVATION_TYPES_SUCCESS; action =", action);
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false
      };
    case RECEIVE_OBSERVATION_TYPES_ERROR:
      console.log("[A] RECEIVE_OBSERVATION_TYPES_ERROR", action.errorMessage);
      return {
        ...state,
        available: [],
        isFetching: false,
        hasError: true,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

function supplierIds(
  state = {
    isFetching: false,
    hasError: false,
    errorMessage: "",
    available: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_SUPPLIER_IDS:
      console.log("[A] REQUEST_SUPPLIER_IDS");
      return { ...state, isFetching: true };
    case RECEIVE_SUPPLIER_IDS_SUCCESS:
      console.log("[A] RECEIVE_SUPPLIER_IDS_SUCCESS; action =", action);
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false
      };
    case RECEIVE_SUPPLIER_IDS_ERROR:
      console.log("[A] RECEIVE_SUPPLIER_IDS_ERROR", action.errorMessage);
      return {
        ...state,
        available: [],
        isFetching: false,
        hasError: true,
        errorMessage: action.errorMessage
      };
    default:
      return state;
  }
}

function colorMaps(
  state = {
    isFetching: false,
    hasError: false,
    errorMessage: "",
    available: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_COLORMAPS:
      console.log("[A] REQUEST_COLORMAPS");
      return { ...state, isFetching: true };
    case RECEIVE_COLORMAPS_SUCCESS:
      console.log("[A] RECEIVE_COLORMAPS_SUCCESS; action =", action);
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false
      };
    case RECEIVE_COLORMAPS_ERROR:
      console.log("[A] RECEIVE_COLORMAPS_ERROR", action.errorMessage);
      return {
        ...state,
        available: [],
        isFetching: false,
        hasError: true,
        errorMessage: action.errorMessage
      };
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
  observationTypes,
  supplierIds,
  colorMaps,
  notifications,
  viewport
});

export default rootReducer;
