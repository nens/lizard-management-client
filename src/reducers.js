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
      return { ...state, isFetching: true };
    case RECEIVE_LIZARD_BOOTSTRAP:
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
    timesFetched: 0,
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
      return { ...state, isFetching: true };
    case RECEIVE_ORGANISATIONS:
      return {
        ...state,
        available: action.data,
        isFetching: false,
        timesFetched: state.timesFetched + 1
      };
    case SELECT_ORGANISATION:
      return { ...state, selected: action.organisation };
    default:
      return state;
  }
}

function observationTypes(
  state = {
    isFetching: false,
    timesFetched: 0,
    hasError: false,
    errorMessage: "",
    available: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_OBSERVATION_TYPES:
      return { ...state, isFetching: true };
    case RECEIVE_OBSERVATION_TYPES_SUCCESS:
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false,
        timesFetched: state.timesFetched + 1
      };
    case RECEIVE_OBSERVATION_TYPES_ERROR:
      return {
        ...state,
        available: [],
        isFetching: false,
        hasError: true,
        errorMessage: action.errorMessage,
        timesFetched: state.timesFetched + 1
      };
    default:
      return state;
  }
}

function supplierIds(
  state = {
    isFetching: false,
    timesFetched: 0,
    hasError: false,
    errorMessage: "",
    available: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_SUPPLIER_IDS:
      return { ...state, isFetching: true };
    case RECEIVE_SUPPLIER_IDS_SUCCESS:
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false,
        timesFetched: state.timesFetched + 1
      };
    case RECEIVE_SUPPLIER_IDS_ERROR:
      return {
        ...state,
        available: [],
        isFetching: false,
        hasError: true,
        errorMessage: action.errorMessage,
        timesFetched: state.timesFetched + 1
      };
    default:
      return state;
  }
}

function colorMaps(
  state = {
    isFetching: false,
    timesFetched: 0,
    hasError: false,
    errorMessage: "",
    available: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_COLORMAPS:
      return { ...state, isFetching: true };
    case RECEIVE_COLORMAPS_SUCCESS:
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false,
        timesFetched: state.timesFetched + 1
      };
    case RECEIVE_COLORMAPS_ERROR:
      return {
        ...state,
        available: [],
        isFetching: false,
        hasError: true,
        errorMessage: action.errorMessage,
        timesFetched: state.timesFetched + 1
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
