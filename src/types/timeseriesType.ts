interface Timeseries {
  uuid: string,
  name: string,
  parameter: string,
  unit: string,
  reference_frame: string,
  observation_type: {
    code: string,
    parameter: string,
    unit: string,
    reference_frame: string
  }
}

export type TimeseriesFromTimeseriesEndpoint = Timeseries & {
  location: {
    uuid: string,
    url: string,
    code: string,
    name: string
  }
}

export type TimeseriesFromAssetEndpoint = Timeseries & {
  location: string
}

export const getTimeseriesLabel = (ts: Timeseries) => {
  if (ts.observation_type && ts.observation_type.parameter) {
    if (ts.observation_type.unit) {
      return `${ts.name} - ${ts.observation_type.parameter} (${ts.observation_type.unit})`;
    } else {
      return `${ts.name} - ${ts.observation_type.parameter}`;
    };
  } else if (ts.parameter) {
    if (ts.unit) {
      return `${ts.name} - ${ts.parameter} (${ts.unit})`;
    } else {
      return `${ts.name} - ${ts.parameter}`;
    };
  } else {
    return ts.name;
  };
}