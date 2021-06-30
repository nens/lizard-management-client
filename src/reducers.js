import { combineReducers } from "redux";
// Todo: add type defenitions to redux. Check threedi-livesite for examples. Next line imports redux thunk types
// import thunk, { ThunkDispatch, ThunkAction } from 'redux-thunk';
import {
  REQUEST_LIZARD_BOOTSTRAP,
  RECEIVE_LIZARD_BOOTSTRAP,
  REQUEST_ORGANISATIONS,
  RECEIVE_ORGANISATIONS,
  SELECT_ORGANISATION,
  REQUEST_USAGE,
  SET_USAGE,
  SHOW_NOTIFICATION,
  DISMISS_NOTIFICATION,
  UPDATE_VIEWPORT_DIMENSIONS,
  UPDATE_ALARM_TYPE,
  REQUEST_DATASETS,
  RECEIVE_DATASETS_SUCCESS,
  RECEIVE_DATASETS_ERROR,
  UPDATE_RASTER_SOURCE_UUID,
  REMOVE_RASTER_SOURCE_UUID,
  ADD_FILES_TO_QUEUE,
  REMOVE_FILE_FROM_QUEUE,
  UPDATE_FILE_STATUS,
  ADD_TASK_UUID_TO_FILE,
  UPDATE_TASK_STATUS,
  UPDATE_LOCATION,
  REMOVE_LOCATION
} from "./actions";

function bootstrap(
  state = {
    bootstrap: {},
    isFetching: true
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
    availableForRasterSharedWith: [],
    selected: null,
  },
  action
) {
  // if there is already a selected organisation then this organisation must not have the unique_id field.
  // if it has the unique_id field then empty the selected organisation
  if (state.selected && state.selected.unique_id !== undefined) {
    state.selected = null;
  }

  switch (action.type) {
    case REQUEST_ORGANISATIONS:
      return { ...state, isFetching: true };
    case RECEIVE_ORGANISATIONS:
    {
      return {
        ...state,
        available: action.available,
        availableForRasterSharedWith: action.all,
        isFetching: false,
        timesFetched: state.timesFetched + 1
      };
    }
    case SELECT_ORGANISATION:
      const selectedOrganisation = action.organisation;
      return { ...state, selected: selectedOrganisation };
    default:
      return state;
  }
}

function usage (
  state = {
    raster_count: 0,
    raster_total_size: 0,
    scenario_count: 0,
    scenario_total_size: 0,
    timeseries_count: 0,
    timeseries_total_size: 0,
    isFetching: false,
    timesFetched: 0,
  },
  action
) {
switch (action.type) {
  case REQUEST_USAGE:
    return {...state, isFetching: true}
  case SET_USAGE:
    return {...action.usage, isFetching: false, timesFetched: state.timesFetched + 1}
  default:
      return state;
  } 
}

function datasets(
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
    case REQUEST_DATASETS:
      return { ...state, isFetching: true };
    case RECEIVE_DATASETS_SUCCESS:
      return {
        ...state,
        available: action.data,
        isFetching: false,
        hasError: false,
        timesFetched: state.timesFetched + 1
      };
    case RECEIVE_DATASETS_ERROR:
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

function alarmType(state = "RASTERS", action) {
  switch (action.type) {
    case UPDATE_ALARM_TYPE:
      return action.alarmType;
    default:
      return state;
  }
}

function rasterSourceUUID(state = null, action) {
  switch (action.type) {
    case UPDATE_RASTER_SOURCE_UUID:
      return action.uuid;
    case REMOVE_RASTER_SOURCE_UUID:
      return null;
    default:
      return state;
  };
};

function location(state = null, action) {
  switch (action.type) {
    case UPDATE_LOCATION:
      return action.location;
    case REMOVE_LOCATION:
      return null;
    default:
      return state;
  };
};

function uploadFiles(state = null, action) {
  switch (action.type) {
    case ADD_FILES_TO_QUEUE:
      const files = action.files.map(file => {
        return {
          "name": file.name,
          "size": file.size,
          "uuid": null,
          "status": 'WAITING'
        };
      });
      const newState = state ? state.concat(files) : files;
      return newState;
    case UPDATE_FILE_STATUS:
      return state.map(f => {
        if (f.name === action.file.name && f.size === action.file.size) {
          return {
            ...f,
            "status": action.status
          };
        } else {
          return f;
        };
      });
    case ADD_TASK_UUID_TO_FILE:
      return state.map(f => {
        if (f.name === action.file.name && f.size === action.file.size) {
          return {
            ...f,
            "uuid": action.uuid
          };
        } else {
          return f;
        };
      })
    case UPDATE_TASK_STATUS:
      return state.map(f => {
        if (f.uuid === action.uuid) {
          // An async task to Lizard can have different statuses. However for the client side,
          // we divide them into 3 main statuses: "PROCESSING", "SUCCESS" and "FAILED"
          const status = (action.status === 'SUCCESS' || action.status === 'FAILED') ? action.status : 'PROCESSING';
          return {
            ...f,
            "status": status
          };
        } else {
          return f;
        };
      });
    case REMOVE_FILE_FROM_QUEUE:
      return state.filter(f => f.name !== action.file.name || f.size !== action.file.size);
    default:
      return state;
  };
};

// Selectors
export const getBootstrap = (state) => {
  return state.bootstrap;
};
export const getUserAuthenticated = (state) => {
  return !state.bootstrap.isFetching && state.bootstrap.bootstrap.user && state.bootstrap.bootstrap.user.authenticated;
};
export const getSsoLogin = (state) => {
  if (state.bootstrap.isFetching) {
    return "";
  } else if (!state.bootstrap.bootstrap.sso) {
    return ""
  } else {
    return state.bootstrap.bootstrap.sso.login;
  }
}
export const getSsoLogout = (state) => {
  if (state.bootstrap.isFetching) {
    return "";
  } else if (!state.bootstrap.bootstrap.sso) {
    return ""
  } else {
    return state.bootstrap.bootstrap.sso.logout;
  }
}

export const getUserFirstName = (state) => {
  if (state.bootstrap.isFetching) {
    return "";
  } else if (!state.bootstrap.bootstrap.user) {
    return ""
  } else {
    return state.bootstrap.bootstrap.user.first_name;
  }
}

export const getUsername = (state) => {
  return (state.bootstrap && state.bootstrap.bootstrap && state.bootstrap.bootstrap.user &&  state.bootstrap.bootstrap.user.username) || null;
};

export const getUserId = (state) => {
  return (state.bootstrap && state.bootstrap.bootstrap && state.bootstrap.bootstrap.user &&  state.bootstrap.bootstrap.user.id) || null;
};

export const getNotifications = (state) => {
  return state.notifications.notifications;
};

export const getOrganisations = (state) => {
  return state.organisations;
};
export const getScenarioTotalSize = (state) => {
  return state.usage.scenario_total_size;
};
export const getRasterTotalSize = (state) => {
  return state.usage.raster_total_size;
};
export const getSelectedOrganisation = (state) => {
  return state.organisations.selected;
};
export const getDatasets = (state) => {
  return state.datasets;
};
export const getRasterSourceUUID = (state) => {
  return state.rasterSourceUUID;
};
export const getLocation = (state) => {
  return state.location;
};

export const getUploadFiles = (state) => {
  return state.uploadFiles;
};
export const getFinsihedFiles = (state) => {
  return state.uploadFiles && state.uploadFiles.length > 0 && state.uploadFiles.filter(file => file.status === 'SUCCESS' || file.status === 'FAILED');
};

const rootReducer = combineReducers({
  bootstrap,
  organisations,
  usage,
  datasets,
  notifications,
  viewport,
  alarmType,
  rasterSourceUUID,
  location,
  uploadFiles
});

// Todo: add type defenitions to redux. Check threedi-livesite for examples. Next line defines AppDispatch for mapDispatchToProps
// export type AppDispatch = ThunkDispatch<AppState, undefined, AnyAction>;

export default rootReducer;
