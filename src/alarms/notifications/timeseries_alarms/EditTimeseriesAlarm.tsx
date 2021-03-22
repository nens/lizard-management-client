import React, { useState, useEffect } from "react";
import { RouteComponentProps } from 'react-router';
import MDSpinner from "react-md-spinner";
import { getUuidFromUrl } from "../../../utils/getUuidFromUrl";
import { Timeseries } from "../../../types/timeseriesType";
import TimeseriesAlarmForm from "./TimeseriesAlarmForm";

interface RouteParams {
  uuid: string;
};

export const EditTimeseriesAlarm: React.FC<RouteComponentProps<RouteParams>> = (props) => {
  const [currentTimeseriesAlarm, setCurrentTimeseriesAlarm] = useState<Object | null>(null);
  const [timeseries, setTimeseries] = useState<Timeseries | null>(null);

  const { uuid } = props.match.params;
  useEffect(() => {
    (async () => {
      const timeseriesAlarm = await fetch(`/api/v4/timeseriesalarms/${uuid}/`, {
        credentials: "same-origin"
      }).then(
        response => response.json()
      );

      const timeseriesUrl = timeseriesAlarm.timeseries;
      const timeseriesUuid = getUuidFromUrl(timeseriesUrl);
      const timeseries = await fetch(`/api/v4/timeseries/${timeseriesUuid}/`, {
        credentials: 'same-origin'
      }).then(
        response => response.json()
      )

      setTimeseries(timeseries);
      setCurrentTimeseriesAlarm(timeseriesAlarm);
    })();
  }, [uuid]);

  if (currentTimeseriesAlarm && timeseries) {
    return (
      <TimeseriesAlarmForm
        currentTimeseriesAlarm={currentTimeseriesAlarm}
        timeseries={timeseries}
      />
    );
  }
  else {
    return (
      <div
        style={{
          position: "relative",
          top: 50,
          height: 300,
          bottom: 50,
          marginLeft: "50%"
        }}
      >
        <MDSpinner size={24} />
      </div>
    );
  }
};