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
  REQUEST_CONTRACTS,
  SET_CONTRACTS,
  SHOW_NOTIFICATION,
  DISMISS_NOTIFICATION,
  UPDATE_ALARM_TYPE,
  UPDATE_RASTER_SOURCE_UUID,
  REMOVE_RASTER_SOURCE_UUID,
  ADD_FILES_TO_QUEUE,
  REMOVE_FILE_FROM_QUEUE,
  UPDATE_FILE_STATUS,
  ADD_TASK_UUID_TO_FILE,
  UPDATE_TASK_STATUS,
  UPDATE_LOCATION,
  REMOVE_LOCATION,
  SET_OPEN_CLOSE_UPLOADQUEUE_MODAL,
} from "./actions";

// todo type this reducer file
// import {
//   Contract
// } from "./types/contractType";

function bootstrap(
  state = {
    bootstrap: {},
    isFetching: false,
    startedFetch: false,
  },
  action
) {
  switch (action.type) {
    case REQUEST_LIZARD_BOOTSTRAP:
      return { ...state, isFetching: true, startedFetch: true, };
    case RECEIVE_LIZARD_BOOTSTRAP:
      return {
        ...state,
        bootstrap: action.data,
        isFetching: false,
        
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

function contracts (
  state = {
    contracts: [],
    isFetching: false,
    timesFetched: 0,
  },
  action
) {
switch (action.type) {
  case REQUEST_CONTRACTS:
    return {...state, isFetching: true}
  case SET_CONTRACTS:
    return {contracts: action.contracts, isFetching: false, timesFetched: state.timesFetched + 1}
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
          const status = (
            action.status === 'SUCCESS' ? 'SUCCESS' :
            (action.status === 'FAILURE' || action.status === 'REVOKED' || action.status === 'REJECTED' || action.status === 'IGNORED') ? 'FAILED' :
            'PROCESSING'
          );
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
function uploadQueueModalOpen(state = false, action) {
  switch (action.type) {
    case SET_OPEN_CLOSE_UPLOADQUEUE_MODAL:
      return action.isOpen;
    default:
      return state;
  }
}
  

// Selectors
export const getBootstrap = (state) => {
  return state.bootstrap;
};
export const getShouldFetchBootstrap = (state) => {
  return state.bootstrap.startedFetch === false;
};
export const getIsNotFinishedFetchingBootstrap = (state) => {
  return state.bootstrap.isFetching === true || state.bootstrap.startedFetch === false;
};
export const getUserAuthenticated = (state) => {
  return state.bootstrap.startedFetch === true && !state.bootstrap.isFetching &&  state.bootstrap.bootstrap.user && state.bootstrap.bootstrap.user.authenticated;
};
export const getSsoLogin = (state) => {
  if (state.bootstrap.isFetching || state.bootstrap.startedFetch === false) {
    return "";
  } else if (!state.bootstrap.bootstrap.sso) {
    return ""
  } else {
    return state.bootstrap.bootstrap.sso.login;
  }
}
export const getSsoLogout = (state) => {
  if (state.bootstrap.isFetching || state.bootstrap.startedFetch === false) {
    return "";
  } else if (!state.bootstrap.bootstrap.sso) {
    return ""
  } else {
    return state.bootstrap.bootstrap.sso.logout;
  }
}

export const getUserFirstName = (state) => {
  if (state.bootstrap.isFetching || state.bootstrap.startedFetch === false) {
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
export const getShouldFetchOrganisations = (state) => {
  return !state.organisations.isFetching && state.organisations.timesFetched < 1;
};
export const getSelectedOrganisation = (state) => {
  return state.organisations.selected;
};

export const getUsage = (state) => {
  if (!state.usage.isFetching && state.usage.timesFetched > 0) {
    return state.usage;
  }
  return null;
};

export const getScenarioTotalSize = (state) => {
  return state.usage.scenario_total_size;
};
export const getRasterTotalSize = (state) => {
  return state.usage.raster_total_size;
};
export const getTimeseriesTotalSize = (state) => {
  return state.usage.timeseries_total_size;
};

export const getIsItSureSelectedOrganisationHasNoContract = (state) => {
  const contract = getContractForSelectedOrganisation(state);
  if (
    state.contracts.isFetching === false &&
    state.contracts.timesFetched > 0 &&
    !contract
  ) {
    return true;
  } else {
    return false;
  }
}

export const getContractForSelectedOrganisation = (state) => {
  const selectedOrganisation = getSelectedOrganisation(state);
  const selectedOrganisationUuid = selectedOrganisation && selectedOrganisation.uuid;
  if (!selectedOrganisationUuid) {
    return null;
  }
  const selectedContract = state.contracts.contracts.find(contract=>{
    return contract.organisation.uuid === selectedOrganisationUuid;
  });
  return selectedContract || null;
}

export const getScenarioAvailableSizeDefinedByContract = (state) => {
  const currentContract = getContractForSelectedOrganisation(state);
  return (currentContract && currentContract.scenario_storage_capacity) || 0;
}
export const getRasterAvailableSizeDefinedByContract = (state) => {
  const currentContract = getContractForSelectedOrganisation(state);
  return (currentContract && currentContract.raster_storage_capacity) || 0;
}
export const getTimeseriesAvailableSizeDefinedByContract = (state) => {
  const currentContract = getContractForSelectedOrganisation(state);
  return (currentContract && currentContract.timeseries_storage_capacity) || 0;
}

export const getRasterSourceUUID = (state) => {
  return state.rasterSourceUUID;
};
export const getLocation = (state) => {
  return state.location;
};

export const getUploadFiles = (state) => {
  return state.uploadFiles;
};

export const  getFilesInProcess  = (state) => {
    return state.uploadFiles &&
      state.uploadFiles.length > 0 &&
      state.uploadFiles.filter(file => file.status !== 'SUCCESS' && file.status !== 'FAILED');
};

export const getFinsihedFiles = (state) => {
  return state.uploadFiles && state.uploadFiles.length > 0 && state.uploadFiles.filter(file => file.status === 'SUCCESS' || file.status === 'FAILED');
};

export const getShowUploadQueueModal = (state) => {
  return state.uploadQueueModalOpen;
}

const rootReducer = combineReducers({
  bootstrap,
  organisations,
  usage,
  contracts,
  notifications,
  alarmType,
  rasterSourceUUID,
  location,
  uploadFiles,
  uploadQueueModalOpen,
});

// Todo: add type defenitions to redux. Check threedi-livesite for examples. Next line defines AppDispatch for mapDispatchToProps
// export type AppDispatch = ThunkDispatch<AppState, undefined, AnyAction>;

export default rootReducer;
